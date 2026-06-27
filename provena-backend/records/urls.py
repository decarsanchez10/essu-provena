from django.urls import path
from . import views

urlpatterns = [
    path('', views.upload_record, name='upload_record'),
    path('check/<str:document_hash>/', views.check_hash, name='check_hash'),
    path('<str:record_id>/generate-link/', views.generate_link, name='generate_link'),
    path('verify/<uuid:token>/', views.verify_link, name='verify_link'),
    path('download/<uuid:token>/', views.download_file, name='download_file'),
    path('preview/<uuid:token>/', views.preview_file, name='preview_file'),
    path('send-email/', views.send_email_notification, name='send_email'),
    path('lookup/', views.hash_lookup, name='hash_lookup'),
]
