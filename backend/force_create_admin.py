import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

# SQLite não permite ALTER COLUMN, então vou fazer workaround
# Adicionar valores padrão para registros sem nome_completo
print("🔧 Corrigindo banco de dados...")

# Criar uma nova tabela temporária sem o constraint NOT NULL em nome_completo
# Mas SQLite é limitado, então vou apenas garantir que todos os registros tenham um valor

# Por enquanto, vou apenas garantir que possamos inserir o admin
# usando SQL direto com nome_completo preenchido

# Importar Django para gerar hash correto
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.hashers import make_password

password_hash = make_password('admin123')

# Deletar admin se existir
cursor.execute("DELETE FROM usuarios_usuario WHERE username='admin'")

# Inserir admin com TODOS os campos obrigatórios
cursor.execute("""
    INSERT INTO usuarios_usuario (
        password, username, first_name, last_name, email,
        is_superuser, is_staff, is_active, date_joined,
        nome_completo, status, tipo, data_cadastro, data_atualizacao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?, datetime('now'), datetime('now'))
""", (
    password_hash,
    'admin',
    'Admin',
    'Sistema',
    'admin@empresa.com',
    1,  # is_superuser
    1,  # is_staff
    1,  # is_active
    'Admin Sistema',  # nome_completo
    'ativo',  # status
    'admin'  # tipo
))

conn.commit()

# Verificar
cursor.execute("SELECT username, is_active, is_superuser FROM usuarios_usuario WHERE username='admin'")
result = cursor.fetchone()

if result:
    print("✅ Usuário admin criado com sucesso!")
    print(f"   Username: {result[0]}")
    print(f"   Active: {result[1]}")
    print(f"   Superuser: {result[2]}")
    print("\n🔑 Credenciais:")
    print("   Username: admin")
    print("   Password: admin123")
else:
    print("❌ Falha ao criar admin")

conn.close()
