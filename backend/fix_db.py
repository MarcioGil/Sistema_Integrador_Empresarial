import sqlite3
import os

# Caminho do banco de dados
db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')

# Conectar ao banco
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Lista de colunas para adicionar
colunas = [
    ("tipo", "VARCHAR(10) DEFAULT 'comum'"),
    ("data_nascimento", "DATE NULL"),
    ("data_cadastro", "DATETIME NULL"),
]

for nome_coluna, tipo_coluna in colunas:
    try:
        cursor.execute(f"""
            ALTER TABLE usuarios_usuario 
            ADD COLUMN {nome_coluna} {tipo_coluna}
        """)
        print(f"✅ Coluna '{nome_coluna}' adicionada com sucesso!")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print(f"⚠️  Coluna '{nome_coluna}' já existe")
        else:
            print(f"❌ Erro ao adicionar '{nome_coluna}': {e}")

# Atualizar todos os usuários existentes para terem tipo='admin' ou 'comum'
cursor.execute("UPDATE usuarios_usuario SET tipo='admin' WHERE is_superuser=1")
cursor.execute("UPDATE usuarios_usuario SET tipo='comum' WHERE is_superuser=0")

conn.commit()
conn.close()

print("✅ Banco de dados corrigido!")
