# 🗄️ Configuração de Banco de Dados

O sistema está configurado para usar **SQLite** em desenvolvimento e **PostgreSQL** em produção automaticamente.

---

## 📋 Índice

- [Desenvolvimento (SQLite)](#desenvolvimento-sqlite)
- [Produção (PostgreSQL)](#produção-postgresql)
- [Docker PostgreSQL Local](#docker-postgresql-local)
- [Migrações](#migrações)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Desenvolvimento (SQLite)

Por padrão, o sistema usa SQLite em desenvolvimento. **Nenhuma configuração adicional é necessária!**

### Como funciona

Se a variável `DATABASE_URL` **não estiver definida** no `.env`, o sistema usa SQLite:

```python
# .env (ou deixe DATABASE_URL vazio)
DEBUG=True
# DATABASE_URL=  # Comentado ou vazio = SQLite
```

### Vantagens SQLite (Dev)
✅ Zero configuração  
✅ Banco em arquivo único (`db.sqlite3`)  
✅ Ideal para desenvolvimento local  
✅ Portável (copie o arquivo = copia o banco)  

### Limitações SQLite
⚠️ Não recomendado para produção  
⚠️ Sem suporte real a concorrência  
⚠️ Não escala para multiusuário  

---

## 🚀 Produção (PostgreSQL)

Para produção, o sistema detecta automaticamente a variável `DATABASE_URL` e usa PostgreSQL.

### Configuração

1. **Instale as dependências de produção:**

```bash
pip install psycopg2-binary dj-database-url
```

2. **Configure a variável `DATABASE_URL` no `.env`:**

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_banco
```

### Formato DATABASE_URL

```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Exemplos:**

```bash
# Localhost
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/sistema_integrador

# Railway
DATABASE_URL=postgresql://postgres:senha@containers-us-west-123.railway.app:5432/railway

# Render
DATABASE_URL=postgresql://user:pass@dpg-abc123.oregon-postgres.render.com/dbname

# Heroku (automático)
DATABASE_URL=postgres://user:pass@ec2-xxx.compute-1.amazonaws.com:5432/dbname
```

### Vantagens PostgreSQL (Prod)
✅ Robusto e escalável  
✅ Suporte a concorrência real  
✅ Transações ACID completas  
✅ Usado por 99% dos serviços em nuvem  
✅ Suporte a JSON, arrays, full-text search  

---

## 🐳 Docker PostgreSQL Local

Para testar PostgreSQL localmente sem instalar, use Docker:

### 1. Criar container PostgreSQL

```bash
docker run --name postgres-integrador \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=admin123 \
  -e POSTGRES_DB=sistema_integrador \
  -p 5432:5432 \
  -d postgres:16-alpine
```

### 2. Configurar .env

```env
DATABASE_URL=postgresql://postgres:admin123@localhost:5432/sistema_integrador
```

### 3. Rodar migrações

```bash
python manage.py migrate
python manage.py createsuperuser
```

### Comandos úteis Docker

```bash
# Parar container
docker stop postgres-integrador

# Iniciar container
docker start postgres-integrador

# Ver logs
docker logs postgres-integrador

# Acessar PostgreSQL CLI
docker exec -it postgres-integrador psql -U postgres -d sistema_integrador

# Remover container
docker rm -f postgres-integrador
```

---

## 🔄 Migrações

### Criar migrações

```bash
python manage.py makemigrations
```

### Aplicar migrações

```bash
python manage.py migrate
```

### Verificar status

```bash
python manage.py showmigrations
```

### Resetar banco (CUIDADO!)

**SQLite:**
```bash
rm db.sqlite3
python manage.py migrate
```

**PostgreSQL:**
```sql
-- No psql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

```bash
# Depois rodar migrations
python manage.py migrate
```

---

## 🛠️ Troubleshooting

### Erro: "psycopg2 not installed"

**Solução:**
```bash
pip install psycopg2-binary
```

### Erro: "FATAL: password authentication failed"

**Causa:** Credenciais incorretas no `DATABASE_URL`

**Solução:** Verifique usuário, senha e nome do banco:
```bash
# Teste a conexão
psql "postgresql://usuario:senha@host:5432/banco"
```

### Erro: "could not connect to server"

**Causa:** PostgreSQL não está rodando ou host incorreto

**Solução:**
```bash
# Verificar se PostgreSQL está ativo
# Windows (XAMPP/pgAdmin)
services.msc  # Procurar PostgreSQL

# Linux/Mac
sudo systemctl status postgresql

# Docker
docker ps | grep postgres
```

### Erro: "relation does not exist"

**Causa:** Migrações não foram aplicadas

**Solução:**
```bash
python manage.py migrate
```

### Erro: "OperationalError: database is locked" (SQLite)

**Causa:** Múltiplos processos acessando SQLite simultaneamente

**Solução:** Use PostgreSQL para ambientes multiusuário

---

## 📊 Comparação: SQLite vs PostgreSQL

| Característica | SQLite (Dev) | PostgreSQL (Prod) |
|----------------|--------------|-------------------|
| **Configuração** | Zero | Requer servidor |
| **Performance** | Boa (single-user) | Excelente (multi-user) |
| **Concorrência** | Limitada | Alta |
| **Tamanho máximo** | ~140 TB (teórico) | Ilimitado |
| **Recursos avançados** | Básicos | Completos |
| **Backup** | Copiar arquivo | Dump/Restore |
| **Uso recomendado** | Desenvolvimento | Produção |

---

## 🌐 Deploy em Produção

### Railway

1. Criar projeto no [Railway](https://railway.app)
2. Adicionar PostgreSQL Database
3. Railway cria `DATABASE_URL` automaticamente
4. Deploy: `railway up` ou conectar ao GitHub

### Render

1. Criar PostgreSQL Database no [Render](https://render.com)
2. Copiar "Internal Database URL"
3. Adicionar como variável de ambiente no Web Service
4. Deploy automático via GitHub

### Heroku

1. Adicionar addon PostgreSQL: `heroku addons:create heroku-postgresql:mini`
2. `DATABASE_URL` é criada automaticamente
3. Deploy: `git push heroku main`

---

## ✅ Checklist Produção

Antes de fazer deploy em produção:

- [ ] `DATABASE_URL` configurada
- [ ] `DEBUG=False` no `.env`
- [ ] `SECRET_KEY` único e forte
- [ ] `ALLOWED_HOSTS` configurado
- [ ] Migrations aplicadas: `python manage.py migrate`
- [ ] Superuser criado: `python manage.py createsuperuser`
- [ ] Static files coletados: `python manage.py collectstatic`
- [ ] Backup configurado (snapshots PostgreSQL)

---

## 📚 Recursos

- [Django Database Settings](https://docs.djangoproject.com/en/5.0/ref/settings/#databases)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [dj-database-url](https://github.com/jazzband/dj-database-url)
- [Railway PostgreSQL](https://docs.railway.app/databases/postgresql)
- [Render PostgreSQL](https://render.com/docs/databases)

---

**Desenvolvido por Márcio Gil - DIO Campus Expert Turma 14**
