from django.urls import path
from . import views
from . import auth

urlpatterns = [
    # Auth endpoints
    path('auth/register/', auth.register, name='register'),
    path('auth/login/', auth.login, name='login'),
    path('auth/logout/', auth.logout, name='logout'),
    
    # Public key endpoints
    path('public-keys/', views.list_public_keys, name='list_public_keys'),
    path('register-public-key/', views.register_public_key, name='register_public_key'),
    path('get-public-key/', views.get_public_key, name='get_public_key'),
    path('delete-public-key/', views.delete_public_key, name='delete_public_key'),
]
