import sqlite3
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.hashers import make_password

# Caminho do banco de dados
db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Criar senha hash
password_hash = make_password('admin123')

# Inserir admin diretamente
try:
    cursor.execute("""
        INSERT INTO usuarios_usuario (
            password, username, first_name, last_name, email, 
            is_superuser, is_staff, is_active, date_joined,
            nome_completo, status, tipo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?)
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
    print("✅ Usuário admin criado com sucesso!")
    print("   Username: admin")
    print("   Password: admin123")
    
except sqlite3.IntegrityError:
    print("⚠️  Usuário admin já existe. Resetando senha...")
    cursor.execute("""
        UPDATE usuarios_usuario 
        SET password = ?, is_active = 1, is_superuser = 1, is_staff = 1
        WHERE username = 'admin'
    """, (password_hash,))
    conn.commit()
    print("✅ Senha do admin resetada para: admin123")

conn.close()
