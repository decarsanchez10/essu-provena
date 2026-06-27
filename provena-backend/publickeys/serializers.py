from rest_framework import serializers
from .models import UserPublicKey


class UserPublicKeySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPublicKey
        fields = ['id', 'public_key', 'label', 'signature', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_public_key(self, value):
        value = value.strip()
        if len(value) < 20:
            raise serializers.ValidationError("Public key is too short.")
        return value

    def validate_signature(self, value):
        value = value.strip()
        return value

    def validate_message(self, value):
        value = value.strip()
        return value