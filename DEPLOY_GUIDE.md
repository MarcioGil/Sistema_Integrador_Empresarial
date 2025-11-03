# 🚀 Guia de Deploy - Sistema Integrador Empresarial

## 📋 Pré-requisitos
- Conta no GitHub (já tem o repo)
- Conta no Railway.app (gratuita)
- Conta no Vercel (gratuita)

---

## 🔧 PARTE 1: Deploy do Backend (Django) no Railway

### 1.1. Criar Conta no Railway
1. Acesse: https://railway.app/
2. Clique em **"Start a New Project"**
3. Faça login com GitHub

### 1.2. Criar Novo Projeto
1. No Railway, clique em **"New Project"**
2. Selecione **"Deploy from GitHub repo"**
3. Autorize o Railway a acessar seu GitHub
4. Selecione o repositório: `MarcioGil/Sistema_Integrador_Empresarial`
5. Railway vai detectar automaticamente que é um projeto Python/Django

### 1.3. Adicionar PostgreSQL
1. No projeto Railway, clique em **"+ New"**
2. Selecione **"Database" → "Add PostgreSQL"**
3. Railway vai criar automaticamente o banco e a variável `DATABASE_URL`

### 1.4. Configurar Variáveis de Ambiente
No Railway, vá em **Variables** e adicione:

```bash
# Django Settings
SECRET_KEY=sua-chave-secreta-super-segura-aqui-12345
DEBUG=False
ALLOWED_HOSTS=*.railway.app,*.up.railway.app
RAILWAY_ENVIRONMENT=production

# CORS (adicionar URL do Vercel depois)
CORS_ALLOWED_ORIGINS=https://seu-app.vercel.app

# CSRF Trusted Origins
CSRF_TRUSTED_ORIGINS=https://seu-app.vercel.app,https://*.railway.app

# JWT Tokens
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=10080
```

**⚠️ IMPORTANTE:** Anote a URL do backend Railway (ex: `https://sistema-integrador-production.up.railway.app`)

### 1.5. Deploy Automático
1. Railway vai fazer o deploy automaticamente
2. Aguarde o build completar (5-10 minutos)
3. Verifique os logs para confirmar que está rodando

### 1.6. Executar Migrations no Railway
No Railway Terminal:
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

### 1.7. Criar Admin User em Produção
Opção 1 - Via Railway Terminal:
```bash
python manage.py createsuperuser
# Username: admin
# Email: admin@sistema.com
# Password: Admin@123!
```

Opção 2 - Via Django Shell:
```bash
python manage.py shell
```
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

---

## 🎨 PARTE 2: Deploy do Frontend (React/Vite) no Vercel

### 2.1. Preparar Frontend

#### Criar arquivo `.env.production` na pasta `frontend`:
```bash
VITE_API_URL=https://sistema-integrador-production.up.railway.app
```

#### Atualizar `frontend/src/services/api.js`:
```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

### 2.2. Deploy no Vercel

#### Opção A: Via CLI (Recomendado)
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

#### Opção B: Via Dashboard
1. Acesse: https://vercel.com/
2. Clique em **"Add New" → "Project"**
3. Importe o repositório: `MarcioGil/Sistema_Integrador_Empresarial`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 2.3. Configurar Variáveis de Ambiente no Vercel
No Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL = https://sistema-integrador-production.up.railway.app
```

### 2.4. Fazer Redeploy
Após adicionar a variável, clique em **"Redeploy"** para aplicar as mudanças.

**⚠️ IMPORTANTE:** Anote a URL do frontend Vercel (ex: `https://sistema-integrador.vercel.app`)

---

## 🔗 PARTE 3: Conectar Backend e Frontend

### 3.1. Atualizar CORS no Railway
No Railway, adicione a URL do Vercel nas variáveis:

```bash
CORS_ALLOWED_ORIGINS=https://sistema-integrador.vercel.app,http://localhost:5173
CSRF_TRUSTED_ORIGINS=https://sistema-integrador.vercel.app,https://*.railway.app
```

### 3.2. Fazer Redeploy do Backend
No Railway, clique em **"Redeploy"** para aplicar as mudanças de CORS.

---

## ✅ PARTE 4: Testar Aplicação em Produção

### 4.1. Acessar Frontend
1. Abra: `https://sistema-integrador.vercel.app`
2. Faça login com: **admin** / **Admin@123!**

### 4.2. Checklist de Testes
- [ ] Login funciona
- [ ] Dashboard carrega com gráficos
- [ ] Página Clientes mostra dados mock
- [ ] Página Produtos mostra dados mock
- [ ] Página Estoque mostra dados mock
- [ ] Página Vendas mostra dados mock
- [ ] Página Financeiro mostra dados mock
- [ ] Exportar PDF funciona em todas as páginas
- [ ] Navegação entre páginas funciona
- [ ] Logout funciona

---

## 🎯 URLs Importantes

| Serviço | URL |
|---------|-----|
| **Frontend (Vercel)** | https://sistema-integrador.vercel.app |
| **Backend (Railway)** | https://sistema-integrador-production.up.railway.app |
| **API Docs (Swagger)** | https://sistema-integrador-production.up.railway.app/api/schema/swagger-ui/ |
| **Django Admin** | https://sistema-integrador-production.up.railway.app/admin/ |

---

## 🐛 Troubleshooting

### Erro de CORS
- Verifique se a URL do Vercel está em `CORS_ALLOWED_ORIGINS`
- Certifique-se de ter feito redeploy após adicionar a variável

### Backend não conecta ao banco
- Verifique se o PostgreSQL está rodando no Railway
- Confirme que `DATABASE_URL` está definida automaticamente

### Frontend não conecta ao backend
- Verifique se `VITE_API_URL` está correta no Vercel
- Teste a URL do backend diretamente no navegador

### 500 Internal Server Error
- Verifique os logs do Railway
- Confirme que migrations foram executadas
- Verifique se `SECRET_KEY` está definida

---

## 📱 Compartilhar Link

Após deploy bem-sucedido, compartilhe:
```
🚀 Sistema Integrador Empresarial
Frontend: https://sistema-integrador.vercel.app
Login: admin / Admin@123!
```

---

## 🎉 Pronto!

Seu sistema está online e pronto para a apresentação! 🚀
