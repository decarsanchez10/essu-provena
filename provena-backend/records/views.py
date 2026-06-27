import datetime
import requests as http_requests
import pytz
from django.utils import timezone
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import FileResponse, HttpResponseNotFound
from django.views.decorators.clickjacking import xframe_options_exempt
from .models import NotarizationRecord, TemporaryLink, FileAccessToken
from .serializers import NotarizationRecordSerializer
from .email import send_notarization_email


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def upload_record(request):
    document_hash = request.data.get('document_hash')
    txid = request.data.get('txid')
    signature = request.data.get('signature', '')
    public_key = request.data.get('public_key', '')
    email = request.data.get('email', '')
    file_obj = request.FILES.get('file')

    if not document_hash or not txid:
        return Response({'error': 'document_hash and txid are required'}, status=status.HTTP_400_BAD_REQUEST)

    record = NotarizationRecord(
        document_hash=document_hash,
        txid=txid,
        signature=signature,
        public_key=public_key,
        file=file_obj
    )
    record.save()

    if email:
        try:
            send_notarization_email(email, record)
        except Exception as e:
            import logging
            logging.getLogger(__name__).error(f'Failed to send email to {email}: {e}')

    serializer = NotarizationRecordSerializer(record)
    data = serializer.data
    data['email_sent'] = bool(email)
    return Response(data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def generate_link(request, record_id):
    record = get_object_or_404(NotarizationRecord, record_id=record_id)
    
    expires_at = timezone.now() + datetime.timedelta(hours=24)
    file_token = FileAccessToken.objects.create(record=record, expires_at=expires_at)
    
    return Response({'token': str(file_token.token), 'expires_at': file_token.expires_at})

@api_view(['GET'])
def verify_link(request, token):
    token_obj = get_object_or_404(FileAccessToken, token=token)
    if token_obj.is_used:
        return Response({'error': 'This link has already been used.'}, status=status.HTTP_410_GONE)
    if timezone.now() > token_obj.expires_at:
        return Response({'error': 'This link has expired.'}, status=status.HTTP_410_GONE)
    
    token_obj.is_used = True
    token_obj.save()
    
    record = token_obj.record
    data = NotarizationRecordSerializer(record).data
    if record.file:
        download_token = FileAccessToken.objects.create(record=record, expires_at=timezone.now() + datetime.timedelta(hours=24))
        preview_token = FileAccessToken.objects.create(record=record, expires_at=timezone.now() + datetime.timedelta(hours=24))
        from django.urls import reverse
        download_url = request.build_absolute_uri(reverse('download_file', args=[download_token.token]))
        preview_url = request.build_absolute_uri(reverse('preview_file', args=[preview_token.token]))
        data['file_url'] = download_url
        data['preview_url'] = preview_url
    else:
        data['file_url'] = None
        
    return Response(data)

@api_view(['GET'])
def check_hash(request, document_hash):
    record = NotarizationRecord.objects.filter(document_hash=document_hash).first()
    if record:
        return Response({'exists': True, 'txid': record.txid})
    return Response({'exists': False})

from django.http import FileResponse, HttpResponseNotFound
from django.views.decorators.clickjacking import xframe_options_exempt

@api_view(['GET'])
def download_file(request, token):
    token_obj = get_object_or_404(FileAccessToken, token=token)
    if token_obj.is_used or timezone.now() > token_obj.expires_at:
        return HttpResponseNotFound('Invalid or expired download link.')
    # Mark as used
    token_obj.is_used = True
    token_obj.save()
    file_path = token_obj.record.file.path
    return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=token_obj.record.file.name.split('/')[-1])

@api_view(['GET'])
@xframe_options_exempt
def preview_file(request, token):
    token_obj = get_object_or_404(FileAccessToken, token=token)
    if timezone.now() > token_obj.expires_at:
        return HttpResponseNotFound('Expired preview link.')
    file_path = token_obj.record.file.path
    return FileResponse(open(file_path, 'rb'), as_attachment=False, filename=token_obj.record.file.name.split('/')[-1])

@api_view(['POST'])
def send_email_notification(request):
    email = request.data.get('email')
    txid = request.data.get('txid')
    document_hash = request.data.get('document_hash')
    
    if not email:
        return Response({'error': 'email is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Try to find existing record
    record = None
    if txid:
        record = NotarizationRecord.objects.filter(txid=txid).first()
    if not record and document_hash:
        record = NotarizationRecord.objects.filter(document_hash=document_hash).first()
    
    if record:
        try:
            send_notarization_email(email, record)
            return Response({'success': True, 'message': f'Email sent to {email}'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        # No record found, send a basic email with provided data
        from django.core.mail import send_mail
        from django.conf import settings
        subject = 'Provena - Document Notarization Confirmed'
        message = f'Your document has been notarized on the Bitcoin Cash blockchain.\n\n'
        if document_hash:
            message += f'Document Hash: {document_hash}\n'
        if txid:
            message += f'Transaction ID: {txid}\n'
            message += f'View on Explorer: https://bchexplorer.info/tx/{txid}\n'
        try:
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email], fail_silently=False)
            return Response({'success': True, 'message': f'Email sent to {email}'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def hash_lookup(request):
    document_hash = request.GET.get('hash', '').strip().lower()
    if not document_hash:
        return Response({'error': 'hash parameter is required'}, status=status.HTTP_400_BAD_REQUEST)

    record = NotarizationRecord.objects.filter(document_hash=document_hash).first()
    if not record:
        return Response({'found': False}, status=status.HTTP_404_NOT_FOUND)

    tx_id      = record.txid
    tx_url     = f'https://bchexplorer.info/tx/{tx_id}'
    block_date = None
    block_height = None

    try:
        manila_tz  = pytz.timezone('Asia/Manila')
        created_at = record.created_at
        if created_at.tzinfo is None:
            created_at = pytz.utc.localize(created_at)
        manila_dt  = created_at.astimezone(manila_tz)
        block_date = manila_dt.strftime('%B %d, %Y, %I:%M %p')
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(f'Date formatting failed: {e}')

    try:
        resp = http_requests.get(
            f'https://bchexplorer.info/api/tx/{tx_id}',
            timeout=8
        )
        if resp.ok:
            tx_data      = resp.json()
            block_height = (
                tx_data.get('blockheight') or
                tx_data.get('block_height') or
                tx_data.get('height') or
                tx_data.get('block') or
                None
            )
            import logging
            logging.getLogger(__name__).info(f'BCH explorer keys: {list(tx_data.keys())}')
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(f'BCH explorer fetch failed for block_height: {e}')

    return Response({
        'found':        True,
        'tx_id':        tx_id,
        'tx_url':       tx_url,
        'block_date':   block_date   or '—',
        'block_height': block_height or '—',
    })
    