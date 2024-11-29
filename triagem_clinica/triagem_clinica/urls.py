"""
URL configuration for triagem_clinica project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# Em triagem_clinica/triagem_clinica/urls.py
from django.contrib import admin
from django.urls import path, include
from api import views  # Certifique-se de importar 'views' corretamente

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Incluindo as URLs da API
    path('', views.home, name='home'),  # Página inicial
    path('triagem/', views.triagem_view, name='triagem_form'),
]
