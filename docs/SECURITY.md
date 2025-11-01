# 🔒 Guia de Segurança - Sistema Integrador Empresarial

**Versão:** 1.0.0  
**Última Atualização:** 01/11/2025  
**Autor:** Márcio Gil

---

## 📑 Índice

- [1. Visão Geral de Segurança](#1-visão-geral-de-segurança)
- [2. Autenticação JWT](#2-autenticação-jwt)
- [3. Autorização e Permissões](#3-autorização-e-permissões)
- [4. Proteção de Dados](#4-proteção-de-dados)
- [5. Proteção contra Ataques](#5-proteção-contra-ataques)
- [6. Segurança do Django](#6-segurança-do-django)
- [7. Boas Práticas](#7-boas-práticas)
- [8. Auditoria e Logs](#8-auditoria-e-logs)
- [9. Checklist de Deploy](#9-checklist-de-deploy)
- [10. Resposta a Incidentes](#10-resposta-a-incidentes)

---

## 1. Visão Geral de Segurança

### 1.1 Modelo de Segurança

O sistema implementa **defesa em profundidade** com múltiplas camadas:

```
┌──────────────────────────────────────────┐
│  Camada 7: Monitoramento & Auditoria     │  ← Detecção de anomalias
├──────────────────────────────────────────┤
│  Camada 6: Rate Limiting                 │  ← Proteção contra DDoS
├──────────────────────────────────────────┤
│  Camada 5: Validação de Dados            │  ← Sanitização de input
├──────────────────────────────────────────┤
│  Camada 4: Autorização (Permissões)      │  ← Controle de acesso
├──────────────────────────────────────────┤
│  Camada 3: Autenticação (JWT)            │  ← Identidade do usuário
├──────────────────────────────────────────┤
│  Camada 2: CORS & CSRF                   │  ← Proteção cross-origin
├──────────────────────────────────────────┤
│  Camada 1: HTTPS/TLS                     │  ← Criptografia em trânsito
└──────────────────────────────────────────┘
```

### 1.2 Princípios de Segurança

#### 1.2.1 Least Privilege (Privilégio Mínimo)
- Usuários recebem apenas permissões necessárias
- Operadores não podem deletar dados críticos
- Vendedores não acessam financeiro completo

#### 1.2.2 Defense in Depth (Defesa em Profundidade)
- Múltiplas camadas de segurança
- Falha de uma camada não compromete o sistema
- Validações no frontend E backend

#### 1.2.3 Fail Securely (Falhar com Segurança)
- Erros não expõem informações sensíveis
- Logs detalhados internos, mensagens genéricas ao usuário
- Exceções tratadas adequadamente

#### 1.2.4 Zero Trust
- Toda requisição é validada
- Token JWT verificado em cada chamada
- Não há confiança implícita

---

## 2. Autenticação JWT

### 2.1 Como Funciona

```python
# 1. Usuário envia credenciais
POST /api/token/
{
  "username": "user",
  "password": "pass"
}

# 2. Backend valida no banco
user = Usuario.objects.get(username="user")
if user.check_password("pass"):
    # Gera tokens

# 3. Token JWT estrutura
{
  "header": {
    "alg": "HS256",      # Algoritmo
    "typ": "JWT"          # Tipo
  },
  "payload": {
    "user_id": 5,
    "username": "user",
    "exp": 1635724800,   # Expiração
    "iat": 1635721200,   # Emissão
    "jti": "abc123"      # Token ID único
  },
  "signature": "HMAC_SHA256(header + payload, SECRET_KEY)"
}
```

### 2.2 Configuração JWT

```python
# backend/config/settings.py

from datetime import timedelta

SIMPLE_JWT = {
    # Tempo de vida dos tokens
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    
    # Rotação de tokens
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    
    # Atualização de last_login
    'UPDATE_LAST_LOGIN': True,
    
    # Algoritmo e chave
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,  # ⚠️ NUNCA commitar no git!
    
    # Claims personalizados
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    # Headers
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    
    # Tokens
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}
```

### 2.3 Segurança do SECRET_KEY

**❌ ERRADO:**
```python
# settings.py commitado no git
SECRET_KEY = 'django-insecure-key-123456'
```

**✅ CORRETO:**
```python
# settings.py
import os
from decouple import config  # pip install python-decouple

SECRET_KEY = config('SECRET_KEY')

# .env (NÃO commitar no git!)
SECRET_KEY=r4nd0m_g3n3r4t3d_k3y_w1th_50+_ch4r4ct3rs
```

**Gerar SECRET_KEY segura:**
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

### 2.4 Token Blacklist

Quando usuário faz logout ou token é renovado:

```python
from rest_framework_simplejwt.tokens import RefreshToken

# Adicionar token ao blacklist
token = RefreshToken(refresh_token_string)
token.blacklist()

# Token não pode mais ser usado
# Requisições com ele retornam 401 Unauthorized
```

### 2.5 Proteções JWT

| Ameaça | Proteção | Como Funciona |
|--------|----------|---------------|
| **Token Theft** | Curta validade (60 min) | Limita janela de exploração |
| **Token Replay** | JTI (JWT ID) único | Cada token é único |
| **Token Tampering** | HMAC assinatura | Qualquer alteração invalida token |
| **Brute Force** | SECRET_KEY forte | 50+ caracteres aleatórios |
| **Token Leakage** | HTTPOnly cookies (futuro) | JavaScript não acessa token |

---

## 3. Autorização e Permissões

### 3.1 Níveis de Acesso

```python
# backend/usuarios/models.py

class Usuario(AbstractUser):
    TIPOS_USUARIO = [
        ('admin', 'Administrador'),       # Acesso total
        ('gerente', 'Gerente'),           # Acesso gerencial
        ('vendedor', 'Vendedor'),         # Vendas e clientes
        ('operador', 'Operador'),         # Apenas leitura
    ]
    tipo = models.CharField(max_length=20, choices=TIPOS_USUARIO)
```

### 3.2 Matriz de Permissões Completa

| Recurso | Método | Admin | Gerente | Vendedor | Operador |
|---------|--------|-------|---------|----------|----------|
| **Clientes** | | | | | |
| GET (listar) | GET | ✅ | ✅ | ✅ | ✅ |
| GET (detalhe) | GET | ✅ | ✅ | ✅ | ✅ |
| POST (criar) | POST | ✅ | ✅ | ✅ | ❌ |
| PUT/PATCH | PUT/PATCH | ✅ | ✅ | ✅ | ❌ |
| DELETE | DELETE | ✅ | ✅ | ❌ | ❌ |
| **Produtos** | | | | | |
| GET (listar) | GET | ✅ | ✅ | ✅ | ✅ |
| POST/PUT/PATCH | POST/PUT/PATCH | ✅ | ✅ | ❌ | ❌ |
| DELETE | DELETE | ✅ | ✅ | ❌ | ❌ |
| **Pedidos** | | | | | |
| GET (listar) | GET | ✅ | ✅ | ✅ | ✅ |
| POST (criar) | POST | ✅ | ✅ | ✅ | ❌ |
| /confirmar/ | POST | ✅ | ✅ | ✅ | ❌ |
| /cancelar/ | POST | ✅ | ✅ | ❌ | ❌ |
| **Financeiro** | | | | | |
| GET contas | GET | ✅ | ✅ | ❌ | ❌ |
| /receber/ | POST | ✅ | ✅ | ❌ | ❌ |
| /pagar/ | POST | ✅ | ✅ | ❌ | ❌ |
| **Usuários** | | | | | |
| GET (listar) | GET | ✅ | ✅ | ❌ | ❌ |
| POST (criar) | POST | ✅ | ❌ | ❌ | ❌ |
| /me/ | GET | ✅ | ✅ | ✅ | ✅ |
| /alterar_senha/ | POST | 🔒 | 🔒 | 🔒 | 🔒 |
| **Auditoria** | | | | | |
| GET logs | GET | ✅ | ❌ | ❌ | ❌ |

**Legenda:**
- ✅ = Permitido
- ❌ = Negado
- 🔒 = Permitido apenas para próprio usuário ou admin

### 3.3 Implementação de Permissões

#### 3.3.1 Permissões DRF Padrão

```python
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class ClienteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]  # Todos autenticados
    
class UsuarioViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]  # Apenas admin
```

#### 3.3.2 Permissões Customizadas

```python
from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permite leitura para todos autenticados.
    Escrita apenas para admin.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:  # GET, HEAD, OPTIONS
            return request.user.is_authenticated
        return request.user.is_staff  # Admin

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permite acesso apenas ao dono do recurso ou admin.
    """
    def has_object_permission(self, request, view, obj):
        # Admin sempre pode
        if request.user.is_staff:
            return True
        
        # Verifica se é o dono
        return obj.usuario == request.user

# Uso:
class PedidoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
```

#### 3.3.3 Permissões por Action

```python
class PedidoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    
    def get_permissions(self):
        """
        Permissões diferentes por action.
        """
        if self.action == 'cancelar':
            # Apenas admin/gerente podem cancelar
            return [IsAdminUser()]
        elif self.action == 'create':
            # Apenas vendedores+ podem criar
            return [IsAuthenticated(), CanCreatePedido()]
        return super().get_permissions()
```

### 3.4 Object-Level Permissions

```python
class PedidoViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        """
        Filtra pedidos baseado no usuário.
        """
        user = self.request.user
        
        if user.is_staff:
            # Admin vê todos
            return Pedido.objects.all()
        elif user.tipo == 'gerente':
            # Gerente vê do departamento
            return Pedido.objects.filter(
                vendedor__departamento=user.departamento
            )
        elif user.tipo == 'vendedor':
            # Vendedor vê apenas seus
            return Pedido.objects.filter(vendedor=user)
        else:
            # Operador não vê nada
            return Pedido.objects.none()
```

---

## 4. Proteção de Dados

### 4.1 Criptografia de Senhas

```python
# Django usa PBKDF2 com SHA256 por padrão

PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',      # Padrão (600k iterações)
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.Argon2PasswordHasher',      # ⭐ Recomendado (mais seguro)
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
]

# Exemplo de hash gerado:
# pbkdf2_sha256$600000$abc123xyz$longHashedPasswordHere==

# Verificação:
user.check_password('senha123')  # True/False
```

**Para usar Argon2 (mais seguro):**
```bash
pip install argon2-cffi

# settings.py
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',  # Primeiro = padrão
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
]
```

### 4.2 Validação de Senhas

```python
# settings.py

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
        # Senha não pode ser similar ao username/email
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,  # Mínimo 8 caracteres
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
        # Previne senhas comuns (password123, qwerty, etc)
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
        # Senha não pode ser apenas números
    },
]
```

**Validação Customizada:**
```python
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
import re

class ComplexityValidator:
    """
    Valida complexidade da senha:
    - Ao menos 1 maiúscula
    - Ao menos 1 minúscula
    - Ao menos 1 número
    - Ao menos 1 caractere especial
    """
    def validate(self, password, user=None):
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("A senha deve conter ao menos uma letra maiúscula."),
                code='password_no_upper',
            )
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("A senha deve conter ao menos uma letra minúscula."),
                code='password_no_lower',
            )
        if not re.search(r'\d', password):
            raise ValidationError(
                _("A senha deve conter ao menos um número."),
                code='password_no_number',
            )
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise ValidationError(
                _("A senha deve conter ao menos um caractere especial."),
                code='password_no_special',
            )
    
    def get_help_text(self):
        return _(
            "Sua senha deve conter maiúsculas, minúsculas, números e caracteres especiais."
        )

# Adicionar em settings.py
AUTH_PASSWORD_VALIDATORS = [
    # ... outros validators
    {
        'NAME': 'path.to.ComplexityValidator',
    },
]
```

### 4.3 Dados Sensíveis

#### 4.3.1 CPF/CNPJ - NÃO Criptografar

```python
# CPF/CNPJ são usados em queries, filtros e validações
# Devem ficar em texto plano no banco

class Cliente(models.Model):
    cpf_cnpj = models.CharField(max_length=14, unique=True)  # Texto plano
    
    # Método para exibir mascarado
    @property
    def cpf_cnpj_mascarado(self):
        if self.tipo_pessoa == 'PF':
            # 123.456.789-01
            return f"{self.cpf_cnpj[:3]}.{self.cpf_cnpj[3:6]}.{self.cpf_cnpj[6:9]}-{self.cpf_cnpj[9:]}"
        else:
            # 12.345.678/0001-90
            return f"{self.cpf_cnpj[:2]}.{self.cpf_cnpj[2:5]}.{self.cpf_cnpj[5:8]}/{self.cpf_cnpj[8:12]}-{self.cpf_cnpj[12:]}"
```

#### 4.3.2 Dados Bancários - Criptografar (Futuro)

```python
from django_cryptography.fields import encrypt

class Fornecedor(models.Model):
    # Dados públicos
    razao_social = models.CharField(max_length=200)
    cnpj = models.CharField(max_length=14)
    
    # Dados sensíveis criptografados
    banco = encrypt(models.CharField(max_length=3))
    agencia = encrypt(models.CharField(max_length=10))
    conta = encrypt(models.CharField(max_length=20))
    
    # Criptografia automática no save()
    # Descriptografia automática no acesso

# Install: pip install django-cryptography
```

### 4.4 Mascaramento de Dados em Logs

```python
import logging
import re

class SensitiveDataFilter(logging.Filter):
    """
    Remove dados sensíveis dos logs.
    """
    def filter(self, record):
        # Mascara CPF (123.456.789-01 → ***.***.***-**)
        record.msg = re.sub(
            r'\d{3}\.\d{3}\.\d{3}-\d{2}',
            '***.***.***-**',
            str(record.msg)
        )
        
        # Mascara CNPJ
        record.msg = re.sub(
            r'\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}',
            '**.***.***/****-**',
            str(record.msg)
        )
        
        # Mascara senhas em JSON
        record.msg = re.sub(
            r'"password"\s*:\s*"[^"]*"',
            '"password": "***"',
            str(record.msg)
        )
        
        return True

# Configurar em settings.py
LOGGING = {
    'version': 1,
    'filters': {
        'sensitive_data': {
            '()': 'path.to.SensitiveDataFilter',
        }
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/app.log',
            'filters': ['sensitive_data'],  # ← Aplicar filtro
        },
    },
}
```

---

## 5. Proteção contra Ataques

### 5.1 SQL Injection

**❌ VULNERÁVEL:**
```python
# NUNCA faça isso!
query = f"SELECT * FROM clientes WHERE cpf = '{user_input}'"
Cliente.objects.raw(query)

# Ataque: user_input = "' OR '1'='1"
# Query: SELECT * FROM clientes WHERE cpf = '' OR '1'='1'
# Retorna TODOS os clientes!
```

**✅ SEGURO:**
```python
# Django ORM é seguro por padrão
Cliente.objects.filter(cpf_cnpj=user_input)

# Ou usando raw com parâmetros
Cliente.objects.raw(
    "SELECT * FROM clientes WHERE cpf_cnpj = %s",
    [user_input]  # Parametrizado
)
```

### 5.2 XSS (Cross-Site Scripting)

**❌ VULNERÁVEL:**
```python
# Template sem escape
{{ cliente.nome|safe }}  # ← Perigoso!

# Se nome = "<script>alert('XSS')</script>"
# Executa JavaScript no browser!
```

**✅ SEGURO:**
```python
# Django escapa automaticamente
{{ cliente.nome }}  # Seguro

# Output: &lt;script&gt;alert('XSS')&lt;/script&gt;
# Browser renderiza como texto, não executa

# JSON response do DRF também é seguro
# JSON.parse() não executa código
```

### 5.3 CSRF (Cross-Site Request Forgery)

**Para APIs REST com JWT:**
```python
# settings.py

# JWT não usa cookies de sessão = não precisa CSRF
# Mas CSRF deve estar habilitado para Django Admin

MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',  # ← Manter
]

# DRF automaticamente desabilita CSRF para API
# (autenticação via header, não cookie)
```

**Para views que usam sessões:**
```python
from django.views.decorators.csrf import csrf_protect

@csrf_protect
def view_com_formulario(request):
    # CSRF token obrigatório
    pass
```

### 5.4 Clickjacking

```python
# settings.py

# Previne que site seja carregado em <iframe>
X_FRAME_OPTIONS = 'DENY'  # Nunca permite iframe
# ou
X_FRAME_OPTIONS = 'SAMEORIGIN'  # Apenas no mesmo domínio
```

### 5.5 XSS via Content-Type

```python
# settings.py

SECURE_CONTENT_TYPE_NOSNIFF = True

# Previne browser de "adivinhar" content-type
# Força usar o Content-Type declarado no header
```

### 5.6 Man-in-the-Middle (MITM)

```python
# settings.py - PRODUÇÃO

# Força HTTPS em todas requisições
SECURE_SSL_REDIRECT = True

# Cookies apenas via HTTPS
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# HSTS - HTTP Strict Transport Security
SECURE_HSTS_SECONDS = 31536000  # 1 ano
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

### 5.7 DDoS e Rate Limiting

**Instalar:**
```bash
pip install django-ratelimit
```

**Configurar:**
```python
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='100/h', method='POST')
def login_view(request):
    # Máximo 100 tentativas de login por hora por IP
    pass

@ratelimit(key='user', rate='1000/h')
def api_endpoint(request):
    # 1000 requisições/hora por usuário autenticado
    pass
```

### 5.8 Brute Force em Login

```python
# Instalar: pip install django-axes

INSTALLED_APPS = [
    'axes',  # Deve vir ANTES de django.contrib.admin
]

MIDDLEWARE = [
    'axes.middleware.AxesMiddleware',  # Depois de AuthenticationMiddleware
]

AUTHENTICATION_BACKENDS = [
    'axes.backends.AxesBackend',  # Deve vir PRIMEIRO
    'django.contrib.auth.backends.ModelBackend',
]

# Configuração Axes
AXES_FAILURE_LIMIT = 5  # Bloqueia após 5 tentativas
AXES_COOLOFF_TIME = 1  # Bloqueia por 1 hora
AXES_LOCK_OUT_BY_USER_OR_IP = True
```

---

## 6. Segurança do Django

### 6.1 Settings para Produção

```python
# ❌ settings.py em DEV
DEBUG = True
ALLOWED_HOSTS = []
SECRET_KEY = 'insecure-key'

# ✅ settings.py em PRODUÇÃO
DEBUG = False
ALLOWED_HOSTS = ['api.seudominio.com', 'www.seudominio.com']
SECRET_KEY = config('SECRET_KEY')  # De variável de ambiente

# Segurança HTTPS
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# HSTS
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

### 6.2 Variáveis de Ambiente

**❌ NÃO fazer:**
```python
# settings.py commitado no git
SECRET_KEY = 'minha-chave-secreta'
DATABASE_PASSWORD = 'senha123'
```

**✅ FAZER:**
```python
# settings.py
from decouple import config

SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT', default=5432, cast=int),
    }
}

# .env (NÃO commitar!)
SECRET_KEY=your-secret-key-here
DEBUG=False
DB_NAME=erp_db
DB_USER=erp_user
DB_PASSWORD=strong_password
DB_HOST=localhost
DB_PORT=5432

# .gitignore
.env
*.env
```

### 6.3 Django Security Checklist

```bash
# Rodar checklist de segurança do Django
python manage.py check --deploy

# Output:
# ?: (security.W001) You do not have 'django.middleware.security.SecurityMiddleware'...
# ?: (security.W004) You have not set a value for the SECURE_HSTS_SECONDS setting...
# ?: (security.W008) Your SECURE_SSL_REDIRECT setting is not set to True...
```

---

## 7. Boas Práticas

### 7.1 Princípios OWASP Top 10

| # | Ameaça | Proteção no Projeto |
|---|--------|---------------------|
| 1 | **Broken Access Control** | ✅ Permissões granulares DRF |
| 2 | **Cryptographic Failures** | ✅ HTTPS, JWT assinado, senhas hasheadas |
| 3 | **Injection** | ✅ Django ORM parametrizado |
| 4 | **Insecure Design** | ✅ Arquitetura em camadas, validações |
| 5 | **Security Misconfiguration** | ⚠️ CHECK com `--deploy` |
| 6 | **Vulnerable Components** | ⚠️ `pip list --outdated` |
| 7 | **Identification Failures** | ✅ JWT, senhas fortes, MFA (futuro) |
| 8 | **Software Data Integrity** | ✅ Auditoria completa |
| 9 | **Security Logging Failures** | ✅ Logs estruturados, auditoria |
| 10 | **Server-Side Request Forgery** | ✅ Validação de URLs (se integrar APIs) |

### 7.2 Desenvolvimento Seguro

#### 7.2.1 Code Review Checklist

```markdown
## Security Checklist

- [ ] Senhas nunca em texto plano
- [ ] Queries sempre via ORM (ou parametrizadas)
- [ ] Validação de input em serializers
- [ ] Permissões checadas em ViewSets
- [ ] Dados sensíveis não em logs
- [ ] SECRET_KEY não commitada
- [ ] Debug=False em produção
- [ ] HTTPS habilitado
- [ ] CORS configurado corretamente
- [ ] Rate limiting em endpoints críticos
```

#### 7.2.2 Git Hooks

```bash
# .git/hooks/pre-commit

#!/bin/bash
# Previne commit de secrets

if git diff --cached | grep -E '(SECRET_KEY|PASSWORD|API_KEY).*=.*["\']'; then
    echo "❌ ERRO: Possível secret commitado!"
    echo "Remova secrets antes de commitar."
    exit 1
fi

if git diff --cached | grep -E 'DEBUG\s*=\s*True'; then
    echo "⚠️  WARNING: DEBUG=True detectado"
    read -p "Tem certeza? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Rodar testes
python manage.py test
if [ $? -ne 0 ]; then
    echo "❌ ERRO: Testes falharam"
    exit 1
fi

exit 0
```

### 7.3 Monitoramento de Vulnerabilidades

```bash
# 1. Safety - Checa vulnerabilidades em dependências
pip install safety
safety check

# 2. Bandit - Analisa código Python por vulnerabilidades
pip install bandit
bandit -r backend/

# 3. Django Security Check
python manage.py check --deploy

# 4. OWASP Dependency Check
# https://owasp.org/www-project-dependency-check/
```

---

## 8. Auditoria e Logs

### 8.1 Sistema de Auditoria

O projeto implementa auditoria completa:

```python
# backend/auditoria/models.py

class LogAuditoria(models.Model):
    """
    Registra todas operações críticas.
    """
    ACTIONS = [
        ('CREATE', 'Criação'),
        ('UPDATE', 'Atualização'),
        ('DELETE', 'Deleção'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
    ]
    
    model_name = models.CharField(max_length=100)  # Ex: "Produto"
    object_id = models.CharField(max_length=100)   # ID do objeto
    action = models.CharField(max_length=10, choices=ACTIONS)
    user = models.ForeignKey(Usuario, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    changes = models.JSONField(default=dict)  # Antes/depois
```

### 8.2 O que Auditar

```python
# Operações críticas SEMPRE auditadas:

✅ CREATE/UPDATE/DELETE de:
   - Clientes
   - Produtos
   - Pedidos
   - Contas financeiras
   - Usuários

✅ Operações de negócio:
   - Confirmar/cancelar pedido
   - Receber/pagar conta
   - Movimentações de estoque

✅ Autenticação:
   - Login (sucesso/falha)
   - Logout
   - Tentativas de acesso negadas
   - Alteração de senha
```

### 8.3 Estrutura de Logs

```python
# settings.py

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'json': {
            '()': 'pythonjsonlogger.jsonlogger.JsonFormatter',
            'format': '%(asctime)s %(name)s %(levelname)s %(message)s'
        }
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': 'logs/app.log',
            'maxBytes': 1024 * 1024 * 15,  # 15MB
            'backupCount': 10,
            'formatter': 'verbose',
        },
        'security': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': 'logs/security.log',
            'formatter': 'json',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
        'django.security': {
            'handlers': ['security'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
}
```

---

## 9. Checklist de Deploy

### 9.1 Pré-Deploy

```markdown
## Checklist de Segurança para Deploy

### Configurações
- [ ] DEBUG = False
- [ ] SECRET_KEY em variável de ambiente
- [ ] ALLOWED_HOSTS configurado
- [ ] CORS_ALLOWED_ORIGINS restrito
- [ ] Database passwords em variáveis de ambiente

### HTTPS
- [ ] Certificado SSL instalado
- [ ] SECURE_SSL_REDIRECT = True
- [ ] SECURE_HSTS_SECONDS configurado
- [ ] Cookies com Secure flag

### Dependências
- [ ] requirements.txt atualizado
- [ ] Vulnerabilidades checadas (safety check)
- [ ] Versões de produção (não dev)

### Database
- [ ] Backup configurado
- [ ] Migrations aplicadas
- [ ] Credenciais seguras
- [ ] Conexões SSL (se remoto)

### Monitoramento
- [ ] Logs configurados
- [ ] Sentry ou similar para erros
- [ ] Alertas configurados
- [ ] Uptime monitoring

### Testes
- [ ] Testes passando
- [ ] Coverage > 80% (futuro)
- [ ] Testes de segurança rodados
- [ ] Pen test realizado (opcional)
```

### 9.2 Pós-Deploy

```bash
# 1. Verificar deploy
python manage.py check --deploy

# 2. Testar autenticação
curl -X POST https://api.seudominio.com/api/token/ \
  -d '{"username":"admin","password":"pass"}'

# 3. Verificar HTTPS
curl -I https://api.seudominio.com

# 4. Checar headers de segurança
curl -I https://api.seudominio.com | grep -E '(Strict-Transport|X-Frame|X-Content)'

# 5. Monitorar logs
tail -f logs/security.log
```

---

## 10. Resposta a Incidentes

### 10.1 Detecção de Incidente

**Sinais de alerta:**
- ⚠️ Múltiplas tentativas de login falhadas
- ⚠️ Acessos de IPs desconhecidos
- ⚠️ Queries incomuns nos logs
- ⚠️ Spike anormal de requisições
- ⚠️ Alertas do Sentry/monitoring

### 10.2 Procedimento de Resposta

```markdown
## Procedimento de Incidente de Segurança

### 1. Contenção Imediata (0-15 min)
- [ ] Identificar tipo de ataque
- [ ] Bloquear IP suspeito (firewall)
- [ ] Desativar conta comprometida
- [ ] Isolar sistema se necessário

### 2. Investigação (15-60 min)
- [ ] Revisar logs de auditoria
- [ ] Identificar ponto de entrada
- [ ] Mapear extensão do dano
- [ ] Documentar evidências

### 3. Erradicação (1-4 horas)
- [ ] Remover backdoors
- [ ] Aplicar patches
- [ ] Atualizar credenciais
- [ ] Fortalecer defesas

### 4. Recuperação (4-24 horas)
- [ ] Restaurar de backup (se necessário)
- [ ] Verificar integridade dos dados
- [ ] Monitorar sistema
- [ ] Comunicar stakeholders

### 5. Pós-Incidente (1-7 dias)
- [ ] Relatório completo
- [ ] Lessons learned
- [ ] Melhorias de segurança
- [ ] Treinamento da equipe
```

### 10.3 Contatos de Emergência

```python
# Configurar em .env

SECURITY_TEAM_EMAIL=security@empresa.com.br
SECURITY_SLACK_WEBHOOK=https://hooks.slack.com/...
SENTRY_DSN=https://...@sentry.io/...
```

### 10.4 Revogar Todos JWT Tokens

```python
# Script de emergência para invalidar todos tokens

from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

# Blacklist all outstanding tokens
OutstandingToken.objects.all().delete()

print("✅ Todos tokens JWT foram invalidados")
print("Todos usuários precisarão fazer login novamente")
```

---

## 📚 Recursos Adicionais

### Documentação
- [Django Security](https://docs.djangoproject.com/en/5.0/topics/security/)
- [DRF Authentication](https://www.django-rest-framework.org/api-guide/authentication/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

### Tools
- [Safety](https://pyup.io/safety/) - Vulnerability scanner
- [Bandit](https://bandit.readthedocs.io/) - Security linter
- [OWASP ZAP](https://www.zaproxy.org/) - Penetration testing

### Treinamento
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [PortSwigger Academy](https://portswigger.net/web-security) - Free training

---

<div align="center">

**🔒 Segurança é Prioridade Máxima**

*"Segurança não é um produto, é um processo."*  
— Bruce Schneier

*Documentado por Márcio Gil - DIO Campus Expert Turma 14*

</div>
