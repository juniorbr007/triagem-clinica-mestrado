from django import forms
from .models import Triagem  # Certifique-se de importar o modelo Triagem

class TriagemForm(forms.ModelForm):
    class Meta:
        model = Triagem  # Modelo associado ao formulário
        fields = ['nome', 'idade', 'sintomas']  # Campos que estarão no formulário
