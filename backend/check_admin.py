import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from usuarios.models import Usuario

try:
    admin = Usuario.objects.get(username='admin')
    print(f"✅ Usuário encontrado: {admin.username}")
    print(f"   Email: {admin.email}")
    print(f"   Ativo: {admin.is_active}")
    print(f"   Superuser: {admin.is_superuser}")
    print(f"   Senha 'admin123' válida: {admin.check_password('admin123')}")
    
    # Resetar senha se necessário
    if not admin.check_password('admin123'):
        print("\n⚠️  Senha incorreta! Resetando para 'admin123'...")
        admin.set_password('admin123')
        admin.save()
        print("✅ Senha resetada com sucesso!")
    
except Usuario.DoesNotExist:
    print("❌ Usuário 'admin' não existe! Criando...")
    admin = Usuario.objects.create_superuser(
        username='admin',
        email='admin@empresa.com',
        password='admin123'
    )
    print("✅ Usuário admin criado com sucesso!")
