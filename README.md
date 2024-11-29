# Sistema Especialista de Triagem Clínica

## Descrição

Este projeto visa o desenvolvimento de um **sistema especialista interpretável para triagem clínica**, com o objetivo de otimizar o atendimento no Sistema Único de Saúde (SUS). O sistema foi projetado para ajudar médicos generalistas a realizar encaminhamentos mais precisos com base em sintomas reportados pelos pacientes.

A solução foi desenvolvida utilizando **Angular** para o frontend, **Django** para o backend, **TensorFlow.js** para análise de dados e integração com o **Firebase** para autenticação e armazenamento.

## Funcionalidades

- **Triagem Clínica**: O sistema coleta informações do paciente por meio de um formulário baseado em questionários.
- **Análise de Sintomas**: Utiliza um modelo de aprendizado de máquina para analisar os sintomas e fornecer um diagnóstico.
- **Interface de Usuário**: Interface simples e responsiva, projetada em Angular, permitindo interação fácil e eficiente.
- **Autenticação e Armazenamento**: Firebase é utilizado para autenticação e armazenamento seguro de dados.

## Tecnologias Utilizadas

- **Frontend**: Angular 15
- **Backend**: Django 4.x (Python)
- **Modelos de Machine Learning**: TensorFlow.js
- **Banco de Dados**: Firebase Firestore
- **Autenticação**: Firebase Authentication
- **Hospedagem**: Firebase Hosting

## Fluxo de Dados

1. **Entrada de Dados**: O paciente preenche um formulário com seus sintomas através da interface em Angular.
2. **Processamento**: O backend em Django recebe os dados, processa-os e retorna uma resposta ao frontend.
3. **Análise de Sintomas**: O TensorFlow.js é utilizado para realizar a análise dos sintomas e gerar uma possível classificação do caso clínico.
4. **Armazenamento e Autenticação**: Os dados são armazenados no Firebase e os usuários se autenticam utilizando o Firebase Authentication.

## Imagens do Sistema

![Descrição da imagem](https://drive.google.com/uc?id=12duO4kv7c9WQp1OIMLARdODdIQgkUpnU)

## Instruções para Execução

### 1. Clonando o Repositório

Para clonar o repositório, use o comando:

```bash
git clone https://github.com/SEU_USUARIO/triagem-clinica.git
```

### 2. Configuração do Frontend (Angular)
```bash
cd frontend
npm install
```

**Para rodar o frontend localmente, use:**
```bash
ng serve
```
O frontend estará disponível em http://localhost:4200.

### 3. Configuração do Backend (Django)
No diretório do backend, instale as dependências:

``` bash
cd backend
pip install -r requirements.txt
```

## Como Contribuir
Fork o repositório.
Crie uma branch para sua funcionalidade (git checkout -b feature/nome-da-funcionalidade).
Faça o commit das suas mudanças (git commit -am 'Adiciona nova funcionalidade').
Envie para o repositório remoto (git push origin feature/nome-da-funcionalidade).
Abra um pull request.


## Licença
Este projeto é licenciado sob a MIT License - veja o arquivo LICENSE para mais detalhes.
