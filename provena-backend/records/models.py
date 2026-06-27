import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta
class NotarizationRecord(models.Model):
    record_id = models.CharField(max_length=64, primary_key=True, editable=False)
    document_hash = models.CharField(max_length=64)
    txid = models.CharField(max_length=64)
    signature = models.TextField(blank=True, default='')
    public_key = models.TextField(blank=True, default='')
    file = models.FileField(upload_to='notarized_files/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.record_id:
            base_id = f"{self.document_hash[:6]}-{self.txid[:6]}"
            unique_id = base_id
            nonce = 1
            while NotarizationRecord.objects.filter(record_id=unique_id).exists():
                unique_id = f"{base_id}-{nonce}"
                nonce += 1
            self.record_id = unique_id
        super().save(*args, **kwargs)

    def __str__(self):
        return self.record_id

class TemporaryLink(models.Model):
    token = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    record = models.ForeignKey(NotarizationRecord, on_delete=models.CASCADE, related_name='temp_links')
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.token)
def default_file_token_expiration():
    return timezone.now() + timedelta(minutes=5)

class FileAccessToken(models.Model):
    """Token granting temporary (5‑minute) download access to a notarized file."""
    record = models.ForeignKey(NotarizationRecord, on_delete=models.CASCADE, related_name='file_tokens')
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    expires_at = models.DateTimeField(default=default_file_token_expiration)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.token)
