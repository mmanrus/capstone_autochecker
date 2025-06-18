from autochecker.models.custom_user_model import CustomUser
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
     full_name = serializers.SerializerMethodField()
     class Meta:
          model = CustomUser
          exclude = ['is_staff', 'is_superuser', 'last_login', 'is_active', 'date_joined', 'groups', 'user_permissions']
          extra_kwargs = {'password': {'write_only': True}}
     
     def create(self, validated_data):
          user = CustomUser.objects.create_user(**validated_data)
          return user
     
     def get_full_name(self, obj):
          return obj.get_full_name()