import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

# Verificar se admin existe
cursor.execute('SELECT username, is_active, is_superuser FROM usuarios_usuario')
users = cursor.fetchall()

print("📋 Usuários no banco:")
for user in users:
    print(f"   - {user[0]} (active: {user[1]}, superuser: {user[2]})")

conn.close()
