# 🚀 Deploy Sistema Integrador - PythonAnywhere (100% GRATUITO)

## 📝 PASSO A PASSO SIMPLES

### 1️⃣ CRIAR CONTA (2 minutos)
1. Acesse: https://www.pythonanywhere.com/registration/register/beginner/
2. Preencha:
   - Username: escolha um (será seu subdomínio: `seuusername.pythonanywhere.com`)
   - Email: seu email
   - Password: crie uma senha
3. Clique **Register**
4. Confirme email (verifique spam)

### 2️⃣ FAZER UPLOAD DO CÓDIGO (5 minutos)
1. No PythonAnywhere, vá em **Files**
2. Clique em **Upload a file**
3. Comprima a pasta `backend` em ZIP:
   - No Windows: Clique direito na pasta `backend` → Enviar para → Pasta compactada
4. Faça upload do ZIP
5. No console do PythonAnywhere (aba **Consoles** → **Bash**):
```bash
unzip backend.zip
cd backend
```

### 3️⃣ INSTALAR DEPENDÊNCIAS (3 minutos)
No console Bash:
```bash
pip3.10 install --user -r requirements_pythonanywhere.txt
```

### 4️⃣ CRIAR BANCO E ADMIN (2 minutos)
```bash
python3.10 manage.py migrate
python3.10 manage.py shell < create_production_admin.py
```
✅ Admin criado: **admin** / **Admin@123!**

### 5️⃣ CONFIGURAR WEB APP (5 minutos)
1. Vá na aba **Web**
2. Clique **Add a new web app**
3. Escolha **Manual configuration** → **Python 3.10**
4. Configure:

**Code:**
- Source code: `/home/seuusername/backend`
- Working directory: `/home/seuusername/backend`

**WSGI configuration file:**
Clique no link do arquivo WSGI e substitua TODO o conteúdo por:
```python
import os
import sys

path = '/home/seuusername/backend'  # TROCAR 'seuusername'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

**Static files:**
- URL: `/static/`
- Directory: `/home/seuusername/backend/staticfiles`

5. Clique **Reload seuusername.pythonanywhere.com**

### 6️⃣ TESTAR BACKEND
Acesse: `https://seuusername.pythonanywhere.com/api/usuarios/login/`

Deve retornar: `{"detail":"Method \"GET\" not allowed."}`
✅ BACKEND FUNCIONANDO!

### 7️⃣ DEPLOY FRONTEND NO VERCEL (5 minutos)
1. Acesse: https://vercel.com/signup
2. Login com GitHub
3. Clique **Add New Project**
4. Importe: `MarcioGil/Sistema_Integrador_Empresarial`
5. Configure:
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - **Environment Variables** (IMPORTANTE):
     - Name: `VITE_API_URL`
     - Value: `https://seuusername.pythonanywhere.com/api` (TROCAR 'seuusername')
6. Clique **Deploy**

### 8️⃣ CONFIGURAR CORS NO BACKEND
1. No PythonAnywhere, aba **Files**
2. Abra: `backend/config/settings.py`
3. Procure `CORS_ALLOWED_ORIGINS` e adicione a URL do Vercel:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://seu-projeto.vercel.app',  # ADICIONAR URL DO VERCEL
]
```
4. Salve
5. Aba **Web** → **Reload**

### 9️⃣ TESTAR APLICAÇÃO COMPLETA
1. Acesse: `https://seu-projeto.vercel.app`
2. Login: **admin** / **Admin@123!**
3. Teste todas as páginas
4. Exporte PDFs

---

## 🎯 URLS FINAIS
- **Backend**: https://seuusername.pythonanywhere.com
- **Frontend**: https://seu-projeto.vercel.app
- **Admin**: admin / Admin@123!

## 📌 DICAS
- PythonAnywhere FREE tem limite de 100k hits/dia (suficiente para teste)
- Se não acessar por 3 meses, conta é desativada (só reativar)
- Vercel FREE é ilimitado

## 🆘 PROBLEMAS?
1. **500 Error**: Veja logs em **Web** → **Error log**
2. **CORS Error**: Verifique `CORS_ALLOWED_ORIGINS` no settings.py
3. **Static files não carregam**: Verifique `/static/` e `/staticfiles` no Web

✅ **TUDO GRATUITO E FUNCIONANDO!**
