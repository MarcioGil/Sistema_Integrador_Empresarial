# Backend - Sistema Integrador Empresarial

API REST desenvolvida com Django e Django Rest Framework.

## 🚀 Início Rápido

### Pré-requisitos

- Python 3.11 ou superior
- pip
- virtualenv (opcional)

### Instalação

1. **Criar ambiente virtual:**
   ```powershell
   python -m venv venv
   ```

2. **Ativar o ambiente virtual:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

3. **Instalar dependências:**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Configurar variáveis de ambiente:**
   - Copie `.env.example` para `.env`
   - Ajuste as configurações conforme necessário

5. **Executar migrações:**
   ```powershell
   python manage.py migrate
   ```

6. **Criar superusuário:**
   ```powershell
   python manage.py createsuperuser
   ```

7. **Iniciar o servidor:**
   ```powershell
   python manage.py runserver
   ```

O servidor estará disponível em: http://127.0.0.1:8000/

## 📡 Endpoints da API

### Autenticação (JWT)

- **POST** `/api/token/` - Obter token de acesso
- **POST** `/api/token/refresh/` - Renovar token
- **POST** `/api/token/verify/` - Verificar token

### Módulos (em desenvolvimento)

- `/api/clientes/` - Gestão de clientes
- `/api/produtos/` - Gestão de produtos
- `/api/estoque/` - Controle de estoque
- `/api/vendas/` - Gestão de vendas
- `/api/financeiro/` - Controle financeiro
- `/api/fornecedores/` - Gestão de fornecedores
- `/api/usuarios/` - Gestão de usuários
- `/api/auditoria/` - Logs de auditoria

## 🗄️ Banco de Dados

### Desenvolvimento (SQLite)
O projeto está configurado para usar SQLite em desenvolvimento (padrão).

### Produção (PostgreSQL)
Para usar PostgreSQL:

1. Instale o psycopg2:
   ```powershell
   pip install psycopg2-binary
   ```
   
   **Nota:** No Windows, pode ser necessário instalar o [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

2. Configure a variável `DATABASE_URL` no `.env`:
   ```
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/sistema_integrador
   ```

## 🛠️ Comandos Úteis

### Criar nova app
```powershell
python manage.py startapp nome_app
```

### Criar migrações
```powershell
python manage.py makemigrations
```

### Aplicar migrações
```powershell
python manage.py migrate
```

### Acessar shell do Django
```powershell
python manage.py shell
```

### Coletar arquivos estáticos
```powershell
python manage.py collectstatic
```

### Executar testes
```powershell
pytest
```

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação.

### Obter Token
```bash
POST /api/token/
{
  "username": "seu_usuario",
  "password": "sua_senha"
}
```

Resposta:
```json
{
  "access": "seu_access_token",
  "refresh": "seu_refresh_token"
}
```

### Usar Token
Inclua o token no header das requisições:
```
Authorization: Bearer seu_access_token
```

## 📦 Estrutura do Projeto

```
backend/
│
├── config/              # Configurações do Django
│   ├── settings.py      # Configurações principais
│   ├── urls.py          # URLs principais
│   ├── asgi.py
│   └── wsgi.py
│
├── clientes/            # App de clientes
├── produtos/            # App de produtos
├── estoque/             # App de estoque
├── vendas/              # App de vendas
├── financeiro/          # App financeiro
├── fornecedores/        # App de fornecedores
├── usuarios/            # App de usuários
├── auditoria/           # App de auditoria
│
├── logs/                # Logs da aplicação
├── media/               # Arquivos de mídia (uploads)
├── staticfiles/         # Arquivos estáticos coletados
│
├── manage.py            # CLI do Django
├── requirements.txt     # Dependências Python
├── .env                 # Variáveis de ambiente (não versionado)
└── .env.example         # Exemplo de variáveis de ambiente
```

## 🐛 Debug

O Django Debug Toolbar está ativo em modo DEBUG.
Acesse: http://127.0.0.1:8000/__debug__/

## 📝 Logs

Os logs são salvos em `logs/django.log` e também exibidos no console.

## 🔧 Tecnologias

- **Django 5.0.7** - Framework web
- **Django Rest Framework 3.15** - API REST
- **SimpleJWT 5.3** - Autenticação JWT
- **Django CORS Headers** - CORS
- **Django Filter** - Filtros na API
- **Pillow** - Processamento de imagens
- **openpyxl** - Exportação Excel
- **pytest** - Testes

## 📚 Documentação

- [Django Documentation](https://docs.djangoproject.com/)
- [Django Rest Framework](https://www.django-rest-framework.org/)
- [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)

## 👨‍💻 Desenvolvimento

### Próximos Passos

1. ✅ Configuração do ambiente
2. ⏳ Criar models das entidades
3. ⏳ Criar serializers
4. ⏳ Criar views e viewsets
5. ⏳ Configurar rotas
6. ⏳ Implementar testes

---

**Desenvolvido por Marcio Gil** | 2025
