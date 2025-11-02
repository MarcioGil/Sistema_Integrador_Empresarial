"""
Script para popular o banco de dados com dados realistas para demonstrações.

Uso:
    python populate_db.py

Gera aproximadamente 100+ registros para demonstração.

Desenvolvido por: Márcio Gil - DIO Campus Expert Turma 14
"""

import os
import sys
import django
from decimal import Decimal
from datetime import timedelta
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.utils import timezone
from clientes.models import Cliente
from fornecedores.models import Fornecedor
from produtos.models import Categoria, Produto
from estoque.models import Estoque, MovimentacaoEstoque
from vendas.models import Pedido, ItemPedido
from financeiro.models import ContaReceber, ContaPagar

Usuario = get_user_model()

# Dados de exemplo
NOMES_PF = [
    "João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa", "Carlos Souza",
    "Juliana Ferreira", "Roberto Lima", "Fernanda Alves", "Ricardo Pereira", "Camila Rocha",
    "Lucas Martins", "Patricia Ribeiro", "André Carvalho", "Mariana Dias", "Felipe Gomes",
    "Beatriz Mendes", "Gustavo Barbosa", "Larissa Cardoso", "Bruno Nascimento", "Gabriela Monteiro"
]

EMPRESAS_PJ = [
    "Tech Solutions Ltda", "Comércio Global EIRELI", "Indústria Brasil SA",
    "Serviços Premium ME", "Distribuidora Nacional", "Construtora Moderna",
    "Alimentos Qualidade", "Transportadora Rápida", "Consultoria Expert",
    "Informática & Cia"
]

FORNECEDORES = [
    "Fornecedor ABC Ltda", "Distribuidora XYZ", "Importadora Global",
    "Atacado Nacional", "Indústria Componentes", "Suprimentos Tech",
    "Matéria Prima Brasil", "Distribuição Express", "Atacadão Premium",
    "Fornecedor Master"
]

CATEGORIAS = [
    ("Eletrônicos", "Produtos eletrônicos e acessórios"),
    ("Informática", "Hardware, software e periféricos"),
    ("Escritório", "Material de escritório e papelaria"),
    ("Móveis", "Móveis corporativos e residenciais"),
    ("Ferramentas", "Ferramentas manuais e elétricas"),
    ("Alimentos", "Produtos alimentícios diversos"),
    ("Limpeza", "Produtos de limpeza e higiene"),
    ("Vestuário", "Roupas e acessórios"),
]

PRODUTOS_EXEMPLOS = {
    "Eletrônicos": [
        ("Notebook Dell Inspiron 15", "Intel i5, 8GB RAM, 256GB SSD", 2800, 3500),
        ("Mouse Logitech MX Master", "Mouse wireless ergonômico", 250, 380),
        ("Teclado Mecânico Redragon", "RGB, Switch Blue", 180, 280),
        ("Monitor LG 24\" Full HD", "IPS, 75Hz", 650, 890),
        ("Webcam Logitech C920", "Full HD 1080p", 320, 480),
    ],
    "Informática": [
        ("SSD Kingston 480GB", "Leitura 500MB/s", 220, 340),
        ("Memória RAM 8GB DDR4", "2666MHz", 140, 210),
        ("HD Externo 1TB", "USB 3.0", 280, 390),
        ("Cabo HDMI 2.0 Premium", "2 metros, 4K", 25, 45),
        ("Hub USB 3.0 4 Portas", "Com alimentação", 45, 75),
    ],
    "Escritório": [
        ("Resma Papel A4", "500 folhas, 75g", 18, 28),
        ("Caneta Esferográfica Caixa", "50 unidades, azul", 35, 55),
        ("Grampeador Profissional", "Capacidade 50 folhas", 28, 48),
        ("Agenda 2025", "Capa dura, 365 dias", 32, 52),
        ("Organizador de Mesa", "6 compartimentos", 42, 68),
    ],
    "Móveis": [
        ("Cadeira Office Ergonômica", "Ajuste de altura e lombar", 580, 890),
        ("Mesa Escritório 120x60cm", "MDF, cor preta", 420, 650),
        ("Estante Organizadora", "5 prateleiras, branca", 280, 450),
        ("Armário 2 Portas", "1,80m altura", 520, 780),
    ],
    "Ferramentas": [
        ("Furadeira Elétrica Black&Decker", "500W, 10mm", 180, 280),
        ("Jogo de Chaves Philips", "6 peças", 38, 62),
        ("Trena 5 metros", "Trava automática", 22, 38),
        ("Martelo Profissional", "Cabo de fibra", 28, 48),
    ],
    "Alimentos": [
        ("Café Torrado e Moído 500g", "Torrado médio", 18, 28),
        ("Açúcar Refinado 1kg", "Embalagem lacrada", 3.5, 5.8),
        ("Biscoito Cream Cracker", "400g", 4.2, 7.5),
    ],
    "Limpeza": [
        ("Detergente Neutro", "500ml", 2.8, 4.5),
        ("Desinfetante Lavanda", "2 litros", 8.5, 13.9),
        ("Papel Toalha Folha Dupla", "2 rolos", 6.8, 11.2),
    ],
    "Vestuário": [
        ("Camiseta Básica Algodão", "100% algodão, diversas cores", 25, 45),
        ("Calça Jeans Masculina", "Azul escuro", 68, 110),
    ],
}

def gerar_cpf():
    """Gera CPF válido aleatório"""
    def calcula_digito(digs):
        s = 0
        peso = len(digs) + 1
        for i in range(len(digs)):
            s += int(digs[i]) * peso
            peso -= 1
        r = 11 - (s % 11)
        return '0' if r > 9 else str(r)
    
    cpf = [random.randint(0, 9) for _ in range(9)]
    cpf.append(int(calcula_digito(cpf)))
    cpf.append(int(calcula_digito(cpf)))
    return ''.join(map(str, cpf))

def gerar_cnpj():
    """Gera CNPJ válido aleatório"""
    def calcula_digito(digs, pesos):
        s = sum(int(d) * p for d, p in zip(digs, pesos))
        r = s % 11
        return '0' if r < 2 else str(11 - r)
    
    cnpj = [random.randint(0, 9) for _ in range(8)] + [0, 0, 0, 1]
    pesos1 = [5,4,3,2,9,8,7,6,5,4,3,2]
    cnpj.append(int(calcula_digito(cnpj, pesos1)))
    pesos2 = [6,5,4,3,2,9,8,7,6,5,4,3,2]
    cnpj.append(int(calcula_digito(cnpj, pesos2)))
    return ''.join(map(str, cnpj))

def criar_usuario_admin():
    """Cria usuário admin se não existir"""
    print("📌 Criando/Verificando usuário admin...")
    
    if not Usuario.objects.filter(username='admin').exists():
        admin = Usuario.objects.create_superuser(
            username='admin',
            email='admin@sistema.com',
            password='admin123',
            nome_completo='Administrador do Sistema'
        )
        print(f"✅ Usuário admin criado: {admin.username}")
    else:
        admin = Usuario.objects.get(username='admin')
        print(f"✅ Usuário admin já existe: {admin.username}")
    
    return admin

def criar_clientes():
    """Cria clientes PF e PJ"""
    print("\n📋 Criando clientes...")
    clientes = []
    
    # Clientes Pessoa Física
    for nome in NOMES_PF:
        cliente = Cliente.objects.create(
            nome=nome,
            tipo='PF',
            cpf_cnpj=gerar_cpf(),
            email=f"{nome.lower().replace(' ', '.')}@email.com",
            telefone=f"(11) 9{random.randint(1000, 9999)}-{random.randint(1000, 9999)}",
            endereco=f"Rua {random.choice(['das Flores', 'da Paz', 'Principal', 'do Comércio'])} {random.randint(10, 999)}",
            cidade="São Paulo",
            estado="SP",
            cep=f"{random.randint(10000, 99999)}-{random.randint(100, 999)}",
            ativo=True
        )
        clientes.append(cliente)
    
    # Clientes Pessoa Jurídica
    for empresa in EMPRESAS_PJ:
        cliente = Cliente.objects.create(
            nome=empresa,
            tipo='PJ',
            cpf_cnpj=gerar_cnpj(),
            email=f"contato@{empresa.lower().replace(' ', '').replace('&', '')[:15]}.com",
            telefone=f"(11) {random.randint(3000, 3999)}-{random.randint(1000, 9999)}",
            endereco=f"Av. {random.choice(['Paulista', 'Faria Lima', 'Berrini', 'Industrial'])} {random.randint(100, 9999)}",
            cidade=random.choice(["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba"]),
            estado=random.choice(["SP", "RJ", "MG", "PR"]),
            cep=f"{random.randint(10000, 99999)}-{random.randint(100, 999)}",
            ativo=True
        )
        clientes.append(cliente)
    
    print(f"✅ {len(clientes)} clientes criados ({len(NOMES_PF)} PF, {len(EMPRESAS_PJ)} PJ)")
    return clientes

def criar_fornecedores():
    """Cria fornecedores"""
    print("\n🏭 Criando fornecedores...")
    fornecedores = []
    
    for empresa in FORNECEDORES:
        fornecedor = Fornecedor.objects.create(
            nome=empresa,
            cnpj=gerar_cnpj(),
            email=f"vendas@{empresa.lower().replace(' ', '')[:15]}.com",
            telefone=f"(11) {random.randint(2000, 2999)}-{random.randint(1000, 9999)}",
            endereco=f"Rua Industrial {random.randint(100, 999)}",
            cidade=random.choice(["São Paulo", "Guarulhos", "Santo André"]),
            estado="SP",
            cep=f"{random.randint(10000, 99999)}-{random.randint(100, 999)}",
            ativo=True
        )
        fornecedores.append(fornecedor)
    
    print(f"✅ {len(fornecedores)} fornecedores criados")
    return fornecedores

def criar_categorias_e_produtos():
    """Cria categorias e produtos"""
    print("\n📦 Criando categorias e produtos...")
    
    categorias = []
    for nome, desc in CATEGORIAS:
        cat, created = Categoria.objects.get_or_create(
            nome=nome,
            defaults={'descricao': desc}
        )
        categorias.append(cat)
    
    print(f"✅ {len(categorias)} categorias criadas")
    
    produtos = []
    contador = 1
    
    for categoria in categorias:
        if categoria.nome in PRODUTOS_EXEMPLOS:
            for nome, desc, custo, venda in PRODUTOS_EXEMPLOS[categoria.nome]:
                produto = Produto.objects.create(
                    codigo=f"PROD{contador:04d}",
                    nome=nome,
                    descricao=desc,
                    categoria=categoria,
                    preco_custo=Decimal(str(custo)),
                    preco_venda=Decimal(str(venda)),
                    estoque_minimo=random.randint(5, 20),
                    unidade_medida=random.choice(['UN', 'CX', 'KG']),
                    ativo=True
                )
                produtos.append(produto)
                contador += 1
    
    print(f"✅ {len(produtos)} produtos criados")
    return produtos

def criar_estoques_e_movimentacoes(produtos, usuario):
    """Cria registros de estoque e movimentações"""
    print("\n📊 Criando estoques e movimentações...")
    
    for produto in produtos:
        # Criar registro de estoque
        quantidade_inicial = random.randint(50, 200)
        estoque = Estoque.objects.create(
            produto=produto,
            quantidade_atual=quantidade_inicial
        )
        
        # Criar movimentação de entrada inicial
        MovimentacaoEstoque.objects.create(
            estoque=estoque,
            tipo_movimentacao='entrada',
            quantidade=quantidade_inicial,
            motivo="Estoque inicial - população do sistema",
            usuario=usuario
        )
        
        # Criar algumas movimentações aleatórias
        num_movimentacoes = random.randint(2, 5)
        for _ in range(num_movimentacoes):
            tipo = random.choice(['entrada', 'saida'])
            qtd = random.randint(5, 30)
            
            if tipo == 'saida' and estoque.quantidade_atual < qtd:
                qtd = estoque.quantidade_atual
            
            if qtd > 0:
                MovimentacaoEstoque.objects.create(
                    estoque=estoque,
                    tipo_movimentacao=tipo,
                    quantidade=qtd,
                    motivo=random.choice([
                        "Venda", "Compra", "Ajuste de inventário",
                        "Devolução", "Transferência", "Correção"
                    ]),
                    usuario=usuario,
                    data_movimentacao=timezone.now() - timedelta(days=random.randint(1, 60))
                )
                
                if tipo == 'entrada':
                    estoque.quantidade_atual += qtd
                else:
                    estoque.quantidade_atual -= qtd
                estoque.save()
    
    print(f"✅ Estoques e movimentações criados para {len(produtos)} produtos")

def criar_pedidos(clientes, produtos, usuario):
    """Cria pedidos com itens"""
    print("\n🛒 Criando pedidos...")
    
    pedidos = []
    for i in range(25):
        cliente = random.choice(clientes)
        status = random.choice(['pendente', 'processando', 'finalizado', 'cancelado'])
        
        pedido = Pedido.objects.create(
            cliente=cliente,
            status=status,
            data_pedido=timezone.now() - timedelta(days=random.randint(0, 90))
        )
        
        # Adicionar itens ao pedido
        num_itens = random.randint(1, 5)
        produtos_pedido = random.sample(produtos, min(num_itens, len(produtos)))
        
        for produto in produtos_pedido:
            quantidade = random.randint(1, 10)
            ItemPedido.objects.create(
                pedido=pedido,
                produto=produto,
                quantidade=quantidade,
                preco_unitario=produto.preco_venda
            )
        
        pedidos.append(pedido)
    
    print(f"✅ {len(pedidos)} pedidos criados")
    return pedidos

def criar_contas_financeiras(clientes, fornecedores):
    """Cria contas a receber e a pagar"""
    print("\n💰 Criando contas financeiras...")
    
    # Contas a Receber
    contas_receber = []
    for i in range(30):
        cliente = random.choice(clientes)
        valor = Decimal(random.uniform(100, 5000)).quantize(Decimal('0.01'))
        dias_venc = random.randint(-30, 60)
        data_venc = timezone.now().date() + timedelta(days=dias_venc)
        
        status = 'pendente'
        data_pag = None
        
        if dias_venc < -5:
            status = 'pago'
            data_pag = data_venc + timedelta(days=random.randint(0, 5))
        
        conta = ContaReceber.objects.create(
            cliente=cliente,
            descricao=f"Venda #{i+1000} - {cliente.nome}",
            valor=valor,
            data_vencimento=data_venc,
            status=status,
            data_pagamento=data_pag,
            valor_pago=valor if status == 'pago' else None,
            forma_pagamento=random.choice(['dinheiro', 'pix', 'cartao_credito']) if status == 'pago' else None
        )
        contas_receber.append(conta)
    
    # Contas a Pagar
    contas_pagar = []
    for i in range(20):
        fornecedor = random.choice(fornecedores)
        valor = Decimal(random.uniform(200, 8000)).quantize(Decimal('0.01'))
        dias_venc = random.randint(-20, 45)
        data_venc = timezone.now().date() + timedelta(days=dias_venc)
        
        status = 'pendente'
        data_pag = None
        
        if dias_venc < -3:
            status = 'pago'
            data_pag = data_venc + timedelta(days=random.randint(0, 3))
        
        conta = ContaPagar.objects.create(
            fornecedor=fornecedor,
            descricao=f"Compra de {fornecedor.nome}",
            valor=valor,
            data_vencimento=data_venc,
            status=status,
            data_pagamento=data_pag,
            valor_pago=valor if status == 'pago' else None,
            forma_pagamento=random.choice(['transferencia', 'boleto', 'pix']) if status == 'pago' else None
        )
        contas_pagar.append(conta)
    
    print(f"✅ {len(contas_receber)} contas a receber e {len(contas_pagar)} contas a pagar criadas")

def main():
    """Função principal"""
    print("="*70)
    print("🚀 POPULAÇÃO DO BANCO DE DADOS - SISTEMA INTEGRADOR EMPRESARIAL")
    print("="*70)
    print("\n⚠️  ATENÇÃO: Este script irá criar dados de exemplo no banco.")
    print("Execute apenas em ambiente de desenvolvimento ou demonstração!\n")
    
    resposta = input("Deseja continuar? (s/N): ").strip().lower()
    if resposta != 's':
        print("❌ Operação cancelada.")
        return
    
    try:
        # Criar usuário admin
        usuario = criar_usuario_admin()
        
        # Criar clientes
        clientes = criar_clientes()
        
        # Criar fornecedores
        fornecedores = criar_fornecedores()
        
        # Criar categorias e produtos
        produtos = criar_categorias_e_produtos()
        
        # Criar estoques e movimentações
        criar_estoques_e_movimentacoes(produtos, usuario)
        
        # Criar pedidos
        criar_pedidos(clientes, produtos, usuario)
        
        # Criar contas financeiras
        criar_contas_financeiras(clientes, fornecedores)
        
        print("\n" + "="*70)
        print("✅ POPULAÇÃO CONCLUÍDA COM SUCESSO!")
        print("="*70)
        print("\n📊 Resumo:")
        print(f"   • {Cliente.objects.count()} clientes")
        print(f"   • {Fornecedor.objects.count()} fornecedores")
        print(f"   • {Categoria.objects.count()} categorias")
        print(f"   • {Produto.objects.count()} produtos")
        print(f"   • {Estoque.objects.count()} registros de estoque")
        print(f"   • {MovimentacaoEstoque.objects.count()} movimentações")
        print(f"   • {Pedido.objects.count()} pedidos")
        print(f"   • {ItemPedido.objects.count()} itens de pedido")
        print(f"   • {ContaReceber.objects.count()} contas a receber")
        print(f"   • {ContaPagar.objects.count()} contas a pagar")
        print("\n🔐 Credenciais de acesso:")
        print("   Usuário: admin")
        print("   Senha: admin123")
        print("\n🌐 Acesse: http://localhost:8000/admin")
        print("          http://localhost:5173 (Frontend)\n")
        
    except Exception as e:
        print(f"\n❌ Erro durante a população: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
