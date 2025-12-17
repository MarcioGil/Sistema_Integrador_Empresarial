# Guia de Deploy v2.0 - Sistema Integrador

Este guia cobre o processo de deploy para **Vercel** (Frontend) e **Railway/Render** (Backend).

## 1. Backend (Django)

### Pré-requisitos
- Conta no [Railway](https://railway.app/) ou [Render](https://render.com/).
- GitHub conectado.

### Arquivos de Configuração (Já criados)
- `Procfile`: Define o comando de inicialização (`gunicorn`).
- `runtime.txt`: Define a versão do Python.
- `requirements.txt`: Dependências.

### Passo a Passo (Railway)
1. Crie um **New Project** > **Deploy from GitHub repo**.
2. Selecione o repositório `Sistema_Integrador_Empresarial`.
3. Adicione um serviço de Banco de Dados (PostgreSQL) se desejar persistência real, ou use SQLite (arquivos serão resetados a cada deploy).
4. Configure as **Variables**:
   - `SECRET_KEY`: (Gere uma chave aleatória)
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `*` (ou o domínio do frontend)
   - `CORS_ALLOWED_ORIGINS`: `https://seu-frontend.vercel.app`
5. O deploy deve iniciar automaticamente.
6. **Importante (Primeiro Acesso)**:
   - Vá na aba **Shell** ou **Console** do seu projeto no Railway/Render.
   - Execute o comando para popular o banco (e criar o admin): 
     `python populate_db.py`
   - Ou crie apenas o superusuário manualmente:
     `python manage.py createsuperuser`

## 2. Frontend (React + Vite)

### Pré-requisitos
- Conta no [Vercel](https://vercel.com/).

### Arquivos de Configuração (Já criados)
- `vercel.json`: Regras de rewrite para SPA (Single Page Application).

### Passo a Passo (Vercel)
1. Clique em **Add New...** > **Project**.
2. Importe o repositório `Sistema_Integrador_Empresarial`.
3. Em **Root Directory**, clique em Edit e selecione `frontend`.
4. O Vercel detectará automaticamente o Vite.
5. Em **Environment Variables**, adicione:
   - `VITE_API_URL`: A URL do seu backend no Railway (ex: `https://sistema-integrador.up.railway.app/api`)
6. Clique em **Deploy**.

## 3. Verificação
- Acesse o link do Vercel.
- Tente fazer login (usuário `admin` criado no backend).
- Se houver erro de conexão, verifique se o `VITE_API_URL` não tem barra no final (ou ajuste conforme necessário).

## 4. Captura de Imagens
Após o deploy, navegue por todas as telas (Dashboard, Clientes, Vendas) para tirar os screenshots reais para a documentação.
