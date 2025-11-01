"""
Script para popular o banco de dados com dados de exemplo.
Execute: python manage.py shell < populate_db.py
Ou: python manage.py shell -c "exec(open('populate_db.py').read())"
"""

import os
import sys
import django
from datetime import datetime, timedelta, date
from decimal import Decimal
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from clientes.models import Cliente
from produtos.models import Categoria, Produto
from estoque.models import Estoque, MovimentacaoEstoque
from fornecedores.models import Fornecedor
from vendas.models import Pedido, ItemPedido
from financeiro.models import Fatura, ContaReceber, ContaPagar
from usuarios.models import Departamento

Usuario = get_user_model()

print("=" * 80)
print("POPULANDO BANCO DE DADOS COM DADOS DE EXEMPLO")
print("=" * 80)

# =============================================================================
# 1. DEPARTAMENTOS
# =============================================================================
print("\n[1/10] Criando Departamentos...")

departamentos_data = [
    {'nome': 'Vendas', 'sigla': 'VND', 'responsavel': 'Carlos Mendes', 'email': 'vendas@empresa.com', 'ramal': '2001'},
    {'nome': 'Compras', 'sigla': 'CMP', 'responsavel': 'Ana Paula', 'email': 'compras@empresa.com', 'ramal': '2002'},
    {'nome': 'Financeiro', 'sigla': 'FIN', 'responsavel': 'Roberto Silva', 'email': 'financeiro@empresa.com', 'ramal': '2003'},
    {'nome': 'Estoque', 'sigla': 'EST', 'responsavel': 'Mariana Costa', 'email': 'estoque@empresa.com', 'ramal': '2004'},
    {'nome': 'TI', 'sigla': 'TI', 'responsavel': 'João Santos', 'email': 'ti@empresa.com', 'ramal': '2005'},
]

departamentos = {}
for dep_data in departamentos_data:
    dep, created = Departamento.objects.get_or_create(
        sigla=dep_data['sigla'],
        defaults=dep_data
    )
    departamentos[dep_data['sigla']] = dep
    if created:
        print(f"  ✓ Criado: {dep.nome}")

# =============================================================================
# 2. USUÁRIOS
# =============================================================================
print("\n[2/10] Criando Usuários...")

# Admin já existe, vamos criar outros
usuarios_data = [
    {'username': 'vendedor1', 'email': 'vendedor1@empresa.com', 'first_name': 'Carlos', 'last_name': 'Mendes', 
     'tipo': 'vendedor', 'departamento': departamentos['VND'], 'cargo': 'Vendedor Sênior'},
    {'username': 'vendedor2', 'email': 'vendedor2@empresa.com', 'first_name': 'Juliana', 'last_name': 'Oliveira', 
     'tipo': 'vendedor', 'departamento': departamentos['VND'], 'cargo': 'Vendedora'},
    {'username': 'comprador', 'email': 'comprador@empresa.com', 'first_name': 'Ana', 'last_name': 'Paula', 
     'tipo': 'gerente', 'departamento': departamentos['CMP'], 'cargo': 'Gerente de Compras'},
    {'username': 'financeiro', 'email': 'financeiro@empresa.com', 'first_name': 'Roberto', 'last_name': 'Silva', 
     'tipo': 'gerente', 'departamento': departamentos['FIN'], 'cargo': 'Gerente Financeiro'},
    {'username': 'estoquista', 'email': 'estoquista@empresa.com', 'first_name': 'Mariana', 'last_name': 'Costa', 
     'tipo': 'funcionario', 'departamento': departamentos['EST'], 'cargo': 'Estoquista'},
]

usuarios = {}
for user_data in usuarios_data:
    user, created = Usuario.objects.get_or_create(
        username=user_data['username'],
        defaults={**user_data, 'password': 'senha123'}
    )
    if created:
        user.set_password('senha123')
        user.save()
        print(f"  ✓ Criado: {user.get_full_name()} ({user.username})")
    usuarios[user_data['username']] = user

# Pegar o admin
admin = Usuario.objects.get(username='admin')

# =============================================================================
# 3. CLIENTES
# =============================================================================
print("\n[3/10] Criando Clientes...")

clientes_data = [
    {'tipo': 'PF', 'nome_completo': 'João Silva Santos', 'cpf': '12345678901', 'email': 'joao@email.com', 
     'telefone': '(11) 98765-4321', 'cidade': 'São Paulo', 'estado': 'SP'},
    {'tipo': 'PF', 'nome_completo': 'Maria Oliveira Costa', 'cpf': '98765432109', 'email': 'maria@email.com', 
     'telefone': '(11) 97654-3210', 'cidade': 'São Paulo', 'estado': 'SP'},
    {'tipo': 'PJ', 'razao_social': 'Tech Solutions LTDA', 'cnpj': '12345678000190', 'email': 'contato@techsolutions.com', 
     'telefone': '(11) 3333-4444', 'cidade': 'São Paulo', 'estado': 'SP'},
    {'tipo': 'PJ', 'razao_social': 'Comercial ABC Ltda', 'cnpj': '98765432000100', 'email': 'contato@comercialabc.com', 
     'telefone': '(11) 4444-5555', 'cidade': 'Campinas', 'estado': 'SP'},
    {'tipo': 'PF', 'nome_completo': 'Pedro Almeida', 'cpf': '11122233344', 'email': 'pedro@email.com', 
     'telefone': '(21) 98888-7777', 'cidade': 'Rio de Janeiro', 'estado': 'RJ'},
]

clientes = []
for cli_data in clientes_data:
    identificador = cli_data.get('cpf') or cli_data.get('cnpj')
    filters = {'cpf': identificador} if cli_data['tipo'] == 'PF' else {'cnpj': identificador}
    
    cli, created = Cliente.objects.get_or_create(
        **filters,
        defaults=cli_data
    )
    clientes.append(cli)
    if created:
        nome = cli_data.get('nome_completo') or cli_data.get('razao_social')
        print(f"  ✓ Criado: {nome}")

# =============================================================================
# 4. CATEGORIAS DE PRODUTOS
# =============================================================================
print("\n[4/10] Criando Categorias...")

categorias_data = [
    {'nome': 'Eletrônicos', 'descricao': 'Produtos eletrônicos em geral'},
    {'nome': 'Informática', 'descricao': 'Computadores, notebooks e periféricos'},
    {'nome': 'Smartphones', 'descricao': 'Celulares e tablets'},
    {'nome': 'Acessórios', 'descricao': 'Acessórios diversos'},
    {'nome': 'Escritório', 'descricao': 'Material de escritório'},
]

categorias = []
for cat_data in categorias_data:
    cat, created = Categoria.objects.get_or_create(
        nome=cat_data['nome'],
        defaults=cat_data
    )
    categorias.append(cat)
    if created:
        print(f"  ✓ Criada: {cat.nome}")

# =============================================================================
# 5. PRODUTOS
# =============================================================================
print("\n[5/10] Criando Produtos...")

produtos_data = [
    {'categoria': categorias[1], 'nome': 'Notebook Dell Inspiron 15', 'codigo_barras': '7891234567890',
     'preco_custo': Decimal('2500.00'), 'preco_venda': Decimal('3500.00'), 'unidade_medida': 'UN'},
    {'categoria': categorias[1], 'nome': 'Mouse Logitech MX Master', 'codigo_barras': '7891234567891',
     'preco_custo': Decimal('150.00'), 'preco_venda': Decimal('250.00'), 'unidade_medida': 'UN'},
    {'categoria': categorias[1], 'nome': 'Teclado Mecânico Keychron K2', 'codigo_barras': '7891234567892',
     'preco_custo': Decimal('300.00'), 'preco_venda': Decimal('450.00'), 'unidade_medida': 'UN'},
    {'categoria': categorias[2], 'nome': 'iPhone 15 Pro 256GB', 'codigo_barras': '7891234567893',
     'preco_custo': Decimal('5000.00'), 'preco_venda': Decimal('7000.00'), 'unidade_medida': 'UN'},
    {'categoria': categorias[2], 'nome': 'Samsung Galaxy S24', 'codigo_barras': '7891234567894',
     'preco_custo': Decimal('3500.00'), 'preco_venda': Decimal('5000.00'), 'unidade_medida': 'UN'},
    {'categoria': categorias[3], 'nome': 'Fone de Ouvido Sony WH-1000XM5', 'codigo_barras': '7891234567895',
     'preco_custo': Decimal('800.00'), 'preco_venda': Decimal('1200.00'), 'unidade_medida': 'UN'},
    {'categoria': categorias[3], 'nome': 'Carregador Portátil Anker 20000mAh', 'codigo_barras': '7891234567896',
     'preco_custo': Decimal('120.00'), 'preco_venda': Decimal('200.00'), 'unidade_medida': 'UN'},
    {'categoria': categorias[4], 'nome': 'Caderno Executivo 200 Folhas', 'codigo_barras': '7891234567897',
     'preco_custo': Decimal('15.00'), 'preco_venda': Decimal('25.00'), 'unidade_medida': 'UN'},
]

produtos = []
for prod_data in produtos_data:
    prod, created = Produto.objects.get_or_create(
        codigo_barras=prod_data['codigo_barras'],
        defaults=prod_data
    )
    produtos.append(prod)
    if created:
        print(f"  ✓ Criado: {prod.nome}")

# =============================================================================
# 6. FORNECEDORES
# =============================================================================
print("\n[6/10] Criando Fornecedores...")

fornecedores_data = [
    {'nome': 'TechParts Distribuidora', 'razao_social': 'TechParts Comércio LTDA', 'cnpj': '98765432000100',
     'email': 'vendas@techparts.com', 'telefone': '(11) 4444-5555', 'categoria': 'tecnologia', 'avaliacao': 5},
    {'nome': 'InfoStore Atacado', 'razao_social': 'InfoStore Distribuição SA', 'cnpj': '11122233000144',
     'email': 'vendas@infostore.com', 'telefone': '(11) 3333-2222', 'categoria': 'tecnologia', 'avaliacao': 4},
    {'nome': 'Papelaria Central', 'razao_social': 'Central Papéis LTDA', 'cnpj': '44455566000177',
     'email': 'vendas@papcentral.com', 'telefone': '(11) 2222-1111', 'categoria': 'escritorio', 'avaliacao': 5},
]

fornecedores = []
for forn_data in fornecedores_data:
    forn, created = Fornecedor.objects.get_or_create(
        cnpj=forn_data['cnpj'],
        defaults=forn_data
    )
    fornecedores.append(forn)
    if created:
        print(f"  ✓ Criado: {forn.nome}")

# =============================================================================
# 7. ESTOQUE
# =============================================================================
print("\n[7/10] Criando Registros de Estoque...")

for produto in produtos:
    estoque, created = Estoque.objects.get_or_create(
        produto=produto,
        defaults={
            'quantidade_minima': 5,
            'quantidade_maxima': 100,
            'localizacao': f'Prateleira A-{produtos.index(produto) + 1:02d}'
        }
    )
    if created:
        print(f"  ✓ Estoque criado para: {produto.nome}")

# =============================================================================
# 8. MOVIMENTAÇÕES DE ESTOQUE (Entradas)
# =============================================================================
print("\n[8/10] Criando Movimentações de Estoque...")

# Adicionar estoque inicial
quantidades = [20, 50, 30, 10, 15, 25, 40, 100]
for i, produto in enumerate(produtos):
    mov = MovimentacaoEstoque.objects.create(
        produto=produto,
        tipo_movimentacao='entrada',
        quantidade=quantidades[i],
        usuario=usuarios['estoquista'],
        observacao='Estoque inicial'
    )
    print(f"  ✓ Entrada: {quantidades[i]} unidades de {produto.nome}")

# =============================================================================
# 9. PEDIDOS E VENDAS
# =============================================================================
print("\n[9/10] Criando Pedidos de Venda...")

# Pedido 1
pedido1 = Pedido.objects.create(
    cliente=clientes[0],
    vendedor=usuarios['vendedor1'],
    status='confirmado',
    forma_pagamento='cartao_credito',
    data_pedido=timezone.now() - timedelta(days=5),
    observacoes='Entregar no período da manhã'
)
ItemPedido.objects.create(pedido=pedido1, produto=produtos[0], quantidade=1, preco_unitario=produtos[0].preco_venda)
ItemPedido.objects.create(pedido=pedido1, produto=produtos[1], quantidade=2, preco_unitario=produtos[1].preco_venda)
pedido1.calcular_totais()
print(f"  ✓ Pedido #{pedido1.numero_pedido} - R$ {pedido1.valor_total}")

# Pedido 2
pedido2 = Pedido.objects.create(
    cliente=clientes[2],
    vendedor=usuarios['vendedor1'],
    status='em_separacao',
    forma_pagamento='boleto',
    data_pedido=timezone.now() - timedelta(days=3),
)
ItemPedido.objects.create(pedido=pedido2, produto=produtos[3], quantidade=2, preco_unitario=produtos[3].preco_venda)
ItemPedido.objects.create(pedido=pedido2, produto=produtos[5], quantidade=2, preco_unitario=produtos[5].preco_venda)
pedido2.calcular_totais()
print(f"  ✓ Pedido #{pedido2.numero_pedido} - R$ {pedido2.valor_total}")

# Pedido 3
pedido3 = Pedido.objects.create(
    cliente=clientes[1],
    vendedor=usuarios['vendedor2'],
    status='pendente',
    forma_pagamento='pix',
    data_pedido=timezone.now() - timedelta(days=1),
)
ItemPedido.objects.create(pedido=pedido3, produto=produtos[4], quantidade=1, preco_unitario=produtos[4].preco_venda)
pedido3.calcular_totais()
print(f"  ✓ Pedido #{pedido3.numero_pedido} - R$ {pedido3.valor_total}")

# =============================================================================
# 10. FINANCEIRO
# =============================================================================
print("\n[10/10] Criando Registros Financeiros...")

# Faturas dos pedidos
fatura1 = Fatura.objects.create(
    pedido=pedido1,
    valor_total=pedido1.valor_total,
    data_vencimento=date.today() + timedelta(days=30),
    status='pago',
    valor_pago=pedido1.valor_total
)
print(f"  ✓ Fatura {fatura1.numero_fatura} - Pedido #{pedido1.numero_pedido}")

fatura2 = Fatura.objects.create(
    pedido=pedido2,
    valor_total=pedido2.valor_total,
    data_vencimento=date.today() + timedelta(days=15),
    status='pendente'
)
print(f"  ✓ Fatura {fatura2.numero_fatura} - Pedido #{pedido2.numero_pedido}")

# Contas a Receber
ContaReceber.objects.create(
    descricao='Venda à vista - Cliente João Silva',
    cliente=clientes[0],
    fatura=fatura1,
    valor=fatura1.valor_total,
    valor_recebido=fatura1.valor_total,
    data_vencimento=date.today() - timedelta(days=5),
    data_recebimento=date.today() - timedelta(days=5),
    forma_pagamento='cartao_credito',
    status='recebido'
)
print(f"  ✓ Conta a Receber - Cliente {clientes[0].nome_razao_social}")

ContaReceber.objects.create(
    descricao='Venda a prazo - Tech Solutions',
    cliente=clientes[2],
    fatura=fatura2,
    valor=fatura2.valor_total,
    data_vencimento=date.today() + timedelta(days=15),
    forma_pagamento='boleto',
    status='pendente'
)
print(f"  ✓ Conta a Receber - Cliente {clientes[2].nome_razao_social}")

# Contas a Pagar
ContaPagar.objects.create(
    descricao='Compra de equipamentos - TechParts',
    fornecedor=fornecedores[0],
    valor=Decimal('15000.00'),
    data_vencimento=date.today() + timedelta(days=20),
    categoria='compras',
    forma_pagamento='transferencia',
    status='pendente'
)
print(f"  ✓ Conta a Pagar - Fornecedor {fornecedores[0].nome}")

ContaPagar.objects.create(
    descricao='Material de escritório',
    fornecedor=fornecedores[2],
    valor=Decimal('500.00'),
    valor_pago=Decimal('500.00'),
    data_vencimento=date.today() - timedelta(days=2),
    data_pagamento=date.today() - timedelta(days=2),
    categoria='operacional',
    forma_pagamento='dinheiro',
    status='pago'
)
print(f"  ✓ Conta a Pagar - Fornecedor {fornecedores[2].nome}")

print("\n" + "=" * 80)
print("✅ BANCO DE DADOS POPULADO COM SUCESSO!")
print("=" * 80)
print("\n📊 RESUMO:")
print(f"  - {Departamento.objects.count()} Departamentos")
print(f"  - {Usuario.objects.count()} Usuários")
print(f"  - {Cliente.objects.count()} Clientes")
print(f"  - {Categoria.objects.count()} Categorias")
print(f"  - {Produto.objects.count()} Produtos")
print(f"  - {Fornecedor.objects.count()} Fornecedores")
print(f"  - {Estoque.objects.count()} Registros de Estoque")
print(f"  - {MovimentacaoEstoque.objects.count()} Movimentações")
print(f"  - {Pedido.objects.count()} Pedidos")
print(f"  - {ItemPedido.objects.count()} Itens de Pedido")
print(f"  - {Fatura.objects.count()} Faturas")
print(f"  - {ContaReceber.objects.count()} Contas a Receber")
print(f"  - {ContaPagar.objects.count()} Contas a Pagar")
print("\n🔐 CREDENCIAIS DE TESTE:")
print("  Admin:      username=admin      password=admin123")
print("  Vendedor:   username=vendedor1  password=senha123")
print("  Financeiro: username=financeiro password=senha123")
print("=" * 80)
