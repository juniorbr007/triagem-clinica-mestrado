from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .forms import TriagemForm

# Função de view para a página inicial
def home(request):
    return HttpResponse("Bem-vindo à triagem clínica!")

# Função de view para o endpoint da triagem
def triagem(request):
    return JsonResponse({'message': 'Endpoint triagem funcionando!'})

# Função de view para o formulário de triagem
def triagem_view(request):
    if request.method == 'POST':
        form = TriagemForm(request.POST)  # Recebe os dados enviados pelo formulário
        if form.is_valid():
            form.save()  # Salva os dados no banco de dados
            return HttpResponse("Triagem realizada com sucesso!")
    else:
        form = TriagemForm()  # Cria um formulário vazio para GET

    return render(request, 'api/triagem_form.html', {'form': form})
