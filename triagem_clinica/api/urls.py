from django.urls import path
from . import views  # Importando corretamente as views

urlpatterns = [
     path('triagem/', views.triagem_view, name='triagem_form'),
]
