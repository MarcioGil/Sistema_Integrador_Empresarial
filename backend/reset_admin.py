import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from usuarios.models import Usuario

try:
    user = Usuario.objects.get(username='admin')
    user.set_password('admin123')
    user.save()
    print('Senha do usuário admin atualizada para: admin123')
except Usuario.DoesNotExist:
    user = Usuario.objects.create_superuser(
        username='admin',
        email='admin@example.com',
        password='admin123',
        first_name='Admin',
        last_name='Sistema'
    )
    print('Superusuário admin criado com senha: admin123')
