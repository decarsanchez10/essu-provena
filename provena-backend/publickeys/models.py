from django.db import models

class UserPublicKey(models.Model):
    public_key = models.TextField(unique=True)
    label      = models.CharField(max_length=80, blank=True, default='')
    signature  = models.TextField(blank=True, default='')
    message    = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.public_key[:32] + '...'