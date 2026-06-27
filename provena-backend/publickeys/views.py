from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UserPublicKey
from .serializers import UserPublicKeySerializer


def clean_text(value):
    return str(value or '').strip()


@api_view(['POST'])
def register_public_key(request):
    public_key = clean_text(
        request.data.get('public_key')
        or request.data.get('publicKey')
    )

    if not public_key:
        return Response({'error': 'public_key is required.'}, status=status.HTTP_400_BAD_REQUEST)

    label = clean_text(request.data.get('label'))
    if not label:
        return Response({'error': 'label is required.'}, status=status.HTTP_400_BAD_REQUEST)

    existing = UserPublicKey.objects.filter(public_key=public_key).first()
    if existing:
        return Response({'error': 'This public key is already registered.'}, status=status.HTTP_400_BAD_REQUEST)

    record = UserPublicKey.objects.create(
        public_key=public_key,
        label=label[:80],
        signature=clean_text(request.data.get('signature')),
        message=clean_text(request.data.get('message')),
    )

    return Response(UserPublicKeySerializer(record).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def list_public_keys(request):
    records = UserPublicKey.objects.order_by('-created_at')
    return Response(UserPublicKeySerializer(records, many=True).data)


@api_view(['GET'])
def get_public_key(request):
    public_key = clean_text(request.query_params.get('public_key'))

    if not public_key:
        return Response(
            {'error': 'public_key query param is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    record = UserPublicKey.objects.filter(public_key=public_key).first()
    if not record:
        return Response(
            {'error': 'Public key not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    return Response(UserPublicKeySerializer(record).data)


@api_view(['DELETE'])
def delete_public_key(request):
    public_key = clean_text(
        request.data.get('public_key')
        or request.data.get('publicKey')
    )

    if not public_key:
        return Response(
            {'error': 'public_key is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    record = UserPublicKey.objects.filter(public_key=public_key).first()
    if not record:
        return Response(
            {'error': 'Public key not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    record.delete()
    return Response({'message': 'Public key deleted successfully.'}, status=status.HTTP_200_OK)
