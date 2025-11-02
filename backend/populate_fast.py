#!/usr/bin/env python
"""População rápida do banco de dados."""

# Este arquivo deve ser executado como: python manage.py shell < populate_fast.py

from clientes.models import Cliente
from fornecedores.models import Fornecedor
from produtos.models import Categoria, Produto
from estoque.models import Estoque
from django.contrib.auth.models import User
from decimal import Decimal
import random

print('=== POPULANDO BANCO ===\n')

# Admin
user, created = User.objects.get_or_create(
    username='admin',
    defaults={'is_staff': True, 'is_superuser': True}
)
if created:
    user.set_password('admin123')
    user.save()
print(f'✅ Admin: {user.username}')

# Clientes
clientes_data = [
    ('João Silva', '12345678901', 'joao@email.com', 'PF'),
    ('Tech Solutions Ltda', '12345678000190', 'contato@tech.com', 'PJ'),
    ('Maria Oliveira', '98765432109', 'maria@email.com', 'PF'),
    ('Comercial ABC', '98765432000199', 'abc@comercial.com', 'PJ'),
    ('Carlos Santos', '11122233344', 'carlos@email.com', 'PF'),
    ('Indústria XYZ', '11122233000144', 'xyz@industria.com', 'PJ'),
    ('Ana Costa', '55566677788', 'ana@email.com', 'PF'),
    ('Distribuidora 123', '55566677000188', 'dist@123.com', 'PJ'),
    ('Pedro Almeida', '99988877766', 'pedro@email.com', 'PF'),
    ('Serviços Plus', '99988877000166', 'plus@servicos.com', 'PJ'),
]

for nome, cpf_cnpj, email, tipo in clientes_data:
    Cliente.objects.create(
        nome_completo=nome,
        cpf_cnpj=cpf_cnpj,
        email=email,
        telefone='11999999999',
        tipo=tipo,
        status='ativo',
        cep='01310100'
    )
print(f'✅ {Cliente.objects.count()} clientes criados')

# Fornecedores
fornecedores_data = [
    'Fornecedor Alpha Ltda',
    'Distribuidora Beta',
    'Indústria Gamma',
    'Comercial Delta',
    'Atacado Omega',
]

for razao in fornecedores_data:
    Fornecedor.objects.create(
        razao_social=razao,
        cnpj='12345678000190',
        email=f'{razao.lower().replace(" ", "")}@email.com',
        telefone='11888888888',
        status='ativo'
    )
print(f'✅ {Fornecedor.objects.count()} fornecedores criados')

# Categorias
categorias_data = [
    ('Eletrônicos', 'Produtos eletrônicos e tecnologia'),
    ('Alimentos', 'Produtos alimentícios'),
    ('Vestuário', 'Roupas e acessórios'),
    ('Casa e Decoração', 'Itens para o lar'),
    ('Esportes', 'Artigos esportivos'),
]

categorias = []
for nome, desc in categorias_data:
    cat = Categoria.objects.create(nome=nome, descricao=desc)
    categorias.append(cat)
print(f'✅ {Categoria.objects.count()} categorias criadas')

# Produtos
produtos_data = [
    ('Notebook Dell 15"', Decimal('2500.00'), Decimal('3500.00')),
    ('Mouse Logitech', Decimal('50.00'), Decimal('80.00')),
    ('Teclado Mecânico', Decimal('200.00'), Decimal('350.00')),
    ('Monitor LG 24"', Decimal('600.00'), Decimal('900.00')),
    ('Arroz 5kg', Decimal('15.00'), Decimal('25.00')),
    ('Feijão 1kg', Decimal('6.00'), Decimal('10.00')),
    ('Óleo de Soja 900ml', Decimal('4.50'), Decimal('7.50')),
    ('Açúcar 1kg', Decimal('3.00'), Decimal('5.00')),
    ('Camiseta Básica', Decimal('20.00'), Decimal('40.00')),
    ('Calça Jeans', Decimal('80.00'), Decimal('150.00')),
    ('Tênis Nike', Decimal('200.00'), Decimal('350.00')),
    ('Jaqueta de Couro', Decimal('300.00'), Decimal('500.00')),
    ('Sofá 3 Lugares', Decimal('800.00'), Decimal('1400.00')),
    ('Mesa de Jantar', Decimal('400.00'), Decimal('700.00')),
    ('Cadeira Escritório', Decimal('250.00'), Decimal('450.00')),
    ('Luminária LED', Decimal('50.00'), Decimal('90.00')),
    ('Bola de Futebol', Decimal('30.00'), Decimal('60.00')),
    ('Raquete de Tênis', Decimal('150.00'), Decimal('280.00')),
    ('Bicicleta MTB', Decimal('1200.00'), Decimal('2000.00')),
    ('Esteira Ergométrica', Decimal('1500.00'), Decimal('2500.00')),
]

fornecedor_padrao = Fornecedor.objects.first()

for idx, (nome, custo, venda) in enumerate(produtos_data, 1):
    categoria = categorias[(idx - 1) // 4]  # Distribui entre categorias
    Produto.objects.create(
        codigo=f'P{str(idx).zfill(5)}',
        nome=nome,
        descricao=f'Descrição detalhada do produto {nome}',
        preco_custo=custo,
        preco_venda=venda,
        categoria=categoria,
        fornecedor=fornecedor_padrao
    )
print(f'✅ {Produto.objects.count()} produtos criados')

# Estoque
for produto in Produto.objects.all():
    qtd = random.randint(5, 100)
    Estoque.objects.create(
        produto=produto,
        quantidade_atual=qtd,
        quantidade_minima=10
    )
print(f'✅ {Estoque.objects.count()} estoques criados')

print('\n✅ POPULAÇÃO COMPLETA!')
print(f'\n📊 Resumo:')
print(f'   - {User.objects.filter(is_superuser=True).count()} admin')
print(f'   - {Cliente.objects.count()} clientes')
print(f'   - {Fornecedor.objects.count()} fornecedores')
print(f'   - {Categoria.objects.count()} categorias')
print(f'   - {Produto.objects.count()} produtos')
print(f'   - {Estoque.objects.count()} registros de estoque')
