"""
Script para criar usuário admin em produção (Railway).
Execute via Railway CLI ou Django Shell em produção.
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

User = get_user_model()

def create_production_admin():
    """Cria usuário admin para produção"""
    
    # Deletar admin existente se houver
    User.objects.filter(username='admin').delete()
    print("🗑️  Admin anterior removido (se existia)")
    
    # Criar novo admin
    admin = User.objects.create(
        username='admin',
        password=make_password('Admin@123!'),
        email='admin@sistema.com',
        first_name='Admin',
        last_name='Sistema',
        is_superuser=True,
        is_staff=True,
        is_active=True,
        tipo='admin',
        status='ativo',
        cargo='Administrador do Sistema'
    )
    
    print("✅ Usuário admin criado com sucesso!")
    print(f"   Username: {admin.username}")
    print(f"   Email: {admin.email}")
    print(f"   Password: Admin@123!")
    print(f"   Superuser: {admin.is_superuser}")
    print(f"   ID: {admin.id}")
    print("\n🎯 Agora você pode fazer login com:")
    print("   Username: admin")
    print("   Password: Admin@123!")

if __name__ == '__main__':
    create_production_admin()
