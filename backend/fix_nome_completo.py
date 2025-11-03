import sqlite3
import os

# Caminho do banco de dados
db_path = os.path.join(os.path.dirname(__file__), 'db.sqlite3')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# SQLite não suporta ALTER COLUMN, então precisamos:
# 1. Criar nova tabela sem o constraint
# 2. Copiar dados
# 3. Dropar tabela antiga
# 4. Renomear nova tabela

# Simples: Apenas adicionar valores padrão para nome_completo
cursor.execute("UPDATE usuarios_usuario SET nome_completo = first_name || ' ' || last_name WHERE nome_completo IS NULL OR nome_completo = ''")

conn.commit()
conn.close()

print("✅ Banco corrigido - nome_completo atualizado")
