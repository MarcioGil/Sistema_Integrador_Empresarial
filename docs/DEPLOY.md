# 🚀 Guia de Deploy - Sistema Integrador Empresarial

Este guia detalha o processo completo de deploy do sistema em produção usando **Railway** (backend) e **Vercel** (frontend).

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Deploy Backend (Railway)](#deploy-backend-railway)
- [Deploy Frontend (Vercel)](#deploy-frontend-vercel)
- [Configuração Pós-Deploy](#configuração-pós-deploy)
- [Checklist Final](#checklist-final)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Pré-requisitos

- [x] Conta no [GitHub](https://github.com) (repositório público ou privado)
- [x] Conta no [Railway](https://railway.app) (gratuito: $5/mês de crédito)
- [x] Conta no [Vercel](https://vercel.com) (gratuito: ilimitado para hobby)
- [x] Git instalado e repositório atualizado

```bash
git push origin main  # Certifique-se que tudo está no GitHub
```

---

## 🐳 Deploy Backend (Railway)

### Passo 1: Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Click em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Conecte sua conta GitHub e selecione o repositório `Sistema_Integrador_Empresarial`
5. Railway detectará automaticamente o projeto Django

### Passo 2: Adicionar PostgreSQL

1. No dashboard do projeto, click em **"+ New"**
2. Selecione **"Database"** → **"Add PostgreSQL"**
3. Railway criará um banco PostgreSQL e injetará `DATABASE_URL` automaticamente
4. ✅ Não precisa configurar nada! O `settings.py` já detecta `DATABASE_URL`

### Passo 3: Configurar Variáveis de Ambiente

No painel do seu serviço backend, vá em **"Variables"** e adicione:

```bash
# Obrigatórias
SECRET_KEY=<gere-uma-chave-aleatoria-64-caracteres>
DEBUG=False
ALLOWED_HOSTS=.railway.app,.up.railway.app

# CORS (adicionar URL do Vercel após deploy frontend)
CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app

# CSRF
CSRF_TRUSTED_ORIGINS=https://seu-frontend.vercel.app,https://seu-backend.up.railway.app

# Opcional: Railway injeta automaticamente
# DATABASE_URL=postgresql://postgres:...  (já existe)
# PORT=8000  (já existe)
```

#### 🔐 Como gerar SECRET_KEY segura:

```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Passo 4: Configurar Root Directory

Railway precisa saber onde está o backend:

1. Vá em **"Settings"** do serviço
2. Em **"Root Directory"**, defina: `backend`
3. Em **"Start Command"**, confirme: `gunicorn config.wsgi --bind 0.0.0.0:$PORT`

### Passo 5: Deploy Automático

1. Railway fará deploy automaticamente após configurar
2. Aguarde o build terminar (2-3 minutos)
3. Railway executará:
   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py popular_db  # ✅ Popula com dados demo!
   gunicorn config.wsgi
   ```

### Passo 6: Obter URL do Backend

1. No dashboard, vá em **"Settings"** → **"Networking"**
2. Click em **"Generate Domain"**
3. Copie a URL (exemplo: `https://sistema-integrador-production-abcd.up.railway.app`)
4. **Salve essa URL!** Você precisará dela para o frontend

### Passo 7: Criar Superusuário (Admin)

Railway executou `popular_db` automaticamente, então já existe:

- **Username:** `admin`
- **Password:** `admin123`

Para criar outro admin via CLI:

```bash
# No dashboard Railway, abra o terminal do serviço
railway run python manage.py createsuperuser
```

---

## ⚡ Deploy Frontend (Vercel)

### Passo 1: Criar Projeto no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Click em **"Add New..." → "Project"**
3. Importe o repositório `Sistema_Integrador_Empresarial`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Passo 2: Configurar Variável de Ambiente

Na seção **"Environment Variables"**, adicione:

```bash
VITE_API_URL=https://seu-backend.up.railway.app/api
```

⚠️ **Importante:** Use a URL do Railway obtida no Passo 6 do backend!

### Passo 3: Deploy

1. Click em **"Deploy"**
2. Vercel fará build e deploy (1-2 minutos)
3. Após concluir, Vercel gerará uma URL (exemplo: `https://sistema-integrador.vercel.app`)

---

## ⚙️ Configuração Pós-Deploy

### 1. Atualizar CORS no Backend (Railway)

Volte ao Railway e atualize as variáveis de ambiente:

```bash
CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://seu-frontend.vercel.app,https://seu-backend.up.railway.app
```

Railway fará redeploy automático.

### 2. Testar Login

1. Acesse `https://seu-frontend.vercel.app`
2. Faça login:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Verifique que os dados foram populados:
   - Dashboard mostra estatísticas
   - Clientes: 10 registros
   - Produtos: 20 registros
   - Estoque: 20 registros

### 3. Acessar Admin Django

1. Acesse `https://seu-backend.up.railway.app/admin/`
2. Login: `admin` / `admin123`
3. Explore os modelos e dados

---

## ✅ Checklist Final

### Backend (Railway)

- [ ] PostgreSQL addon conectado
- [ ] `DATABASE_URL` presente nas variáveis
- [ ] `SECRET_KEY` gerada e configurada (64 caracteres)
- [ ] `DEBUG=False`
- [ ] `ALLOWED_HOSTS` inclui `.railway.app`
- [ ] `CORS_ALLOWED_ORIGINS` inclui URL do Vercel
- [ ] Build concluído sem erros
- [ ] Migrations executadas (`python manage.py migrate`)
- [ ] Dados populados (`python manage.py popular_db`)
- [ ] `/admin/` acessível e funcional
- [ ] `/api/docs/` (Swagger) acessível

### Frontend (Vercel)

- [ ] `VITE_API_URL` aponta para Railway
- [ ] Build concluído sem erros
- [ ] Login funciona (admin/admin123)
- [ ] Dashboard carrega dados reais
- [ ] Módulos Clientes, Produtos, Estoque funcionam
- [ ] Requisições API retornam dados (Network DevTools)

### Segurança

- [ ] `DEBUG=False` em produção
- [ ] `SECRET_KEY` única e segura
- [ ] CORS configurado (apenas frontend permitido)
- [ ] CSRF tokens funcionando
- [ ] HTTPS ativo (Railway e Vercel fornecem SSL grátis)

---

## 🔍 Troubleshooting

### Erro: "CORS policy blocked"

**Solução:**
```bash
# No Railway, atualize:
CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app
```

### Erro: "Database connection failed"

**Solução:**
1. Verifique se PostgreSQL addon está ativo no Railway
2. Confirme que `DATABASE_URL` existe nas variáveis
3. Restart do serviço: Dashboard → Restart

### Erro: "Static files not loading (404)"

**Solução:**
```bash
# No Railway terminal:
python manage.py collectstatic --noinput
```

### Erro: "Module not found" no build

**Solução:**
```bash
# Verifique requirements.txt inclui:
gunicorn==22.0.0
whitenoise==6.7.0
psycopg2-binary==2.9.9
dj-database-url==2.1.0
```

### Frontend não conecta com backend

**Solução:**
1. Verifique `VITE_API_URL` no Vercel (deve incluir `/api`)
2. Teste a URL diretamente: `https://seu-backend.up.railway.app/api/docs/`
3. Verifique CORS no Railway

### Erro: "Invalid Password" no login

**Solução:**
```bash
# No Railway terminal:
python manage.py shell -c "from usuarios.models import Usuario; u=Usuario.objects.get(username='admin'); u.set_password('admin123'); u.save(); print('✅ Senha resetada!')"
```

---

## 📊 Monitoramento

### Railway (Backend)

- **Logs:** Dashboard → Service → Logs (realtime)
- **Metrics:** CPU, RAM, Network usage
- **Database:** PostgreSQL addon → Metrics

### Vercel (Frontend)

- **Analytics:** Dashboard → Analytics (pageviews, performance)
- **Logs:** Dashboard → Deployments → View Logs
- **Speed Insights:** Lighthouse scores automáticos

---

## 🔄 Atualizações Futuras

### Deploy Automático

Ambos Railway e Vercel fazem **deploy automático** ao fazer push:

```bash
git add .
git commit -m "feat: Nova funcionalidade"
git push origin main
```

Railway e Vercel detectam mudanças e fazem redeploy automaticamente!

### Rollback

**Railway:**
```bash
# Dashboard → Deployments → Click no deployment antigo → Rollback
```

**Vercel:**
```bash
# Dashboard → Deployments → Click no deployment antigo → Promote to Production
```

---

## 📞 Suporte

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Django Deployment:** https://docs.djangoproject.com/en/5.0/howto/deployment/

---

## 🎉 Deploy Completo!

Seu Sistema Integrador Empresarial está no ar! 🚀

**URLs de exemplo:**
- Backend: `https://sistema-integrador-production.up.railway.app`
- Frontend: `https://sistema-integrador.vercel.app`
- Admin: `https://sistema-integrador-production.up.railway.app/admin/`
- API Docs: `https://sistema-integrador-production.up.railway.app/api/docs/`

**Credenciais padrão:**
- Username: `admin`
- Password: `admin123`

⚠️ **Importante:** Altere as credenciais em produção!

---

**Desenvolvido com 💙 Django + React**
