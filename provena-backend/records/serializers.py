from rest_framework import serializers
from .models import NotarizationRecord, TemporaryLink, FileAccessToken

class NotarizationRecordSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()

    class Meta:
        model = NotarizationRecord
        fields = ['record_id', 'document_hash', 'txid', 'signature', 'public_key', 'created_at', 'file_url', 'file_name']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_file_name(self, obj):
        if obj.file:
            import os
            return os.path.basename(obj.file.name)
        return None
