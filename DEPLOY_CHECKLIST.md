# ✅ Checklist de Deploy - Sistema Integrador Empresarial

## 📦 FASE 1: Deploy Backend (Railway) - 15 minutos

### 1️⃣ Criar Projeto no Railway
- [ ] Acessar https://railway.app/ e fazer login com GitHub
- [ ] Clicar em "New Project" → "Deploy from GitHub repo"
- [ ] Selecionar repositório: `MarcioGil/Sistema_Integrador_Empresarial`
- [ ] Aguardar Railway detectar o projeto Django

### 2️⃣ Adicionar PostgreSQL
- [ ] No projeto Railway, clicar "+ New"
- [ ] Selecionar "Database" → "Add PostgreSQL"
- [ ] Aguardar criação do banco (Railway cria `DATABASE_URL` automaticamente)

### 3️⃣ Configurar Variáveis de Ambiente
No Railway, ir em **Variables** e adicionar:

```
SECRET_KEY = django-insecure-MUDE-ESTA-CHAVE-POR-ALGO-SUPER-SEGURO-123456789
DEBUG = False
ALLOWED_HOSTS = *.railway.app,*.up.railway.app
RAILWAY_ENVIRONMENT = production
CORS_ALLOWED_ORIGINS = http://localhost:5173
CSRF_TRUSTED_ORIGINS = https://*.railway.app
JWT_ACCESS_TOKEN_LIFETIME = 60
JWT_REFRESH_TOKEN_LIFETIME = 10080
```

- [ ] Variáveis adicionadas
- [ ] **ANOTAR URL DO BACKEND:** _________________________________

### 4️⃣ Aguardar Deploy
- [ ] Verificar logs no Railway (5-10 min)
- [ ] Confirmar que está rodando (status verde)

### 5️⃣ Executar Migrations
No Railway Terminal (ou CLI):
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```
- [ ] Migrations executadas
- [ ] Static files coletados

### 6️⃣ Criar Admin User
```bash
python manage.py shell
```
Depois cole:
```python
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
User = get_user_model()
User.objects.create(
    username='admin',
    password=make_password('Admin@123!'),
    email='admin@sistema.com',
    first_name='Admin',
    last_name='Sistema',
    is_superuser=True,
    is_staff=True,
    is_active=True,
    tipo='admin',
    status='ativo',
    cargo='Administrador'
)
```
- [ ] Admin criado com sucesso

---

## 🎨 FASE 2: Deploy Frontend (Vercel) - 10 minutos

### 1️⃣ Instalar Vercel CLI (se ainda não tem)
```bash
npm install -g vercel
vercel login
```
- [ ] Vercel CLI instalado
- [ ] Login feito

### 2️⃣ Deploy Frontend
```bash
cd frontend
vercel --prod
```

Configurações durante o deploy:
- **Set up and deploy?** → Yes
- **Which scope?** → Sua conta pessoal
- **Link to existing project?** → No
- **Project name?** → sistema-integrador (ou outro nome)
- **Directory?** → ./
- **Override settings?** → No

- [ ] Deploy iniciado
- [ ] **ANOTAR URL DO FRONTEND:** _________________________________

### 3️⃣ Configurar Variável de Ambiente no Vercel
No Dashboard do Vercel:
1. Ir no seu projeto
2. Settings → Environment Variables
3. Adicionar:
```
Name: VITE_API_URL
Value: https://sistema-integrador-production.up.railway.app
Environment: Production
```
- [ ] Variável adicionada

### 4️⃣ Redeploy Frontend
- [ ] Clicar em "Redeploy" no Vercel Dashboard
- [ ] Aguardar build (2-3 min)

---

## 🔗 FASE 3: Conectar Backend + Frontend - 5 minutos

### 1️⃣ Atualizar CORS no Railway
No Railway, ir em **Variables** e ATUALIZAR:

```
CORS_ALLOWED_ORIGINS = https://sistema-integrador.vercel.app,http://localhost:5173
CSRF_TRUSTED_ORIGINS = https://sistema-integrador.vercel.app,https://*.railway.app
```

**⚠️ IMPORTANTE:** Use a URL real do Vercel (a que você anotou acima)

- [ ] CORS atualizado com URL do Vercel

### 2️⃣ Redeploy Backend
- [ ] Clicar em "Redeploy" no Railway
- [ ] Aguardar (2-3 min)

---

## 🧪 FASE 4: Testes em Produção - 5 minutos

### Acessar Sistema
- [ ] Abrir URL do Vercel no navegador
- [ ] Fazer login: **admin** / **Admin@123!**

### Testar Funcionalidades
- [ ] ✅ Login funcionou
- [ ] ✅ Dashboard carregou com 3 gráficos
- [ ] ✅ Página Clientes mostra 5 clientes mock
- [ ] ✅ Página Produtos mostra produtos mock
- [ ] ✅ Página Estoque mostra 15 itens
- [ ] ✅ Página Vendas mostra 12 pedidos
- [ ] ✅ Página Financeiro mostra contas
- [ ] ✅ Exportar PDF funciona no Dashboard
- [ ] ✅ Navegação entre páginas funciona
- [ ] ✅ Logout funciona

---

## 🎉 CONCLUÍDO!

### 📱 URLs para Compartilhar:

**Frontend:** _______________________________________________

**Backend:** _______________________________________________

**Login:** admin / Admin@123!

---

## 🐛 Problemas Comuns

### ❌ Erro 500 no Backend
- Verificar logs no Railway
- Confirmar que migrations foram executadas
- Verificar `SECRET_KEY` está definida

### ❌ Frontend não conecta
- Verificar `VITE_API_URL` no Vercel
- Testar URL do backend diretamente
- Verificar CORS no Railway

### ❌ Erro de CORS
- Confirmar URL do Vercel em `CORS_ALLOWED_ORIGINS`
- Fazer redeploy do backend após mudar

---

## ⏱️ Tempo Total Estimado: 35 minutos

✅ **Status do Deploy:** _______________

🚀 **Pronto para apresentação!**
