from django.core.mail import send_mail
from datetime import datetime
import pytz
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def _format_timestamp(dt_str: str) -> str:
    """Convert ISO8601 UTC string to Manila timezone formatted string."""
    utc = pytz.utc
    manila = pytz.timezone('Asia/Manila')
    # Parse the ISO string; ensure it ends with Z or offset
    dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
    # If naive, set as UTC
    if dt.tzinfo is None:
        dt = utc.localize(dt)
    # Convert to Manila
    return dt.astimezone(manila).strftime('%B %d, %Y, %I:%M %p')

def send_notarization_email(to_email, record):
    """Send a notarization confirmation email with record details."""
    subject = f'Provena - Document Notarization Confirmed'
    
    filename = record.file.name.split('/')[-1] if record.file else 'Unknown File'
    formatted_time = _format_timestamp(str(record.created_at))

    context = {
        'document_hash': record.document_hash,
        'txid': record.txid,
        'record_id': record.record_id,
        'signature': record.signature,
        'public_key': record.public_key,
        'created_at': formatted_time,
        'filename': filename,
        'explorer_url': f'https://bchexplorer.info/tx/{record.txid}',
    }
    
    html_message = render_to_string('records/notarization_email.html', context)
    plain_message = strip_tags(html_message)
    
    send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[to_email],
        html_message=html_message,
        fail_silently=False,
    )
