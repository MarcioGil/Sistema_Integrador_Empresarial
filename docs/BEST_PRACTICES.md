# 💎 Padrões de Código e Best Practices

**Sistema Integrador Empresarial**  
**Versão:** 1.0.0  
**Última Atualização:** 01/11/2025  
**Autor:** Márcio Gil

---

## 📑 Índice

- [1. Python Style Guide](#1-python-style-guide)
- [2. Django Best Practices](#2-django-best-practices)
- [3. DRF Best Practices](#3-drf-best-practices)
- [4. Padrões de Projeto](#4-padrões-de-projeto)
- [5. Estrutura de Código](#5-estrutura-de-código)
- [6. Naming Conventions](#6-naming-conventions)
- [7. Documentação de Código](#7-documentação-de-código)
- [8. Testing Patterns](#8-testing-patterns)
- [9. Git Workflow](#9-git-workflow)
- [10. Code Review](#10-code-review)

---

## 1. Python Style Guide

### 1.1 PEP 8 Compliance

O projeto segue rigorosamente **PEP 8** - Style Guide for Python Code.

```python
# ✅ BOM - PEP 8 compliant

class ClienteSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Cliente."""
    
    categoria_detail = CategoriaSerializer(source='categoria', read_only=True)
    
    class Meta:
        model = Cliente
        fields = ['id', 'nome', 'email', 'ativo']
    
    def validate_cpf(self, value):
        """Valida formato do CPF."""
        if len(value) != 11:
            raise ValidationError("CPF deve ter 11 dígitos")
        return value


# ❌ RUIM - Violações de PEP 8

class clienteSerializer(serializers.ModelSerializer):  # Nome de classe deve ser CamelCase
    CategoriaDetail=CategoriaSerializer(source='categoria',read_only=True)  # Sem espaços
    
    class Meta:
        model=Cliente  # Espaços ao redor do =
        fields=['id','nome','email','ativo']  # Espaços após vírgulas
    
    def validate_cpf(self,value):  # Espaços após vírgulas
        if len(value)!=11:  # Espaços ao redor de operadores
            raise ValidationError("CPF deve ter 11 dígitos")
        return value
```

### 1.2 Regras de Formatação

#### Indentação
```python
# ✅ 4 espaços (não tabs)
def minha_funcao():
    if condicao:
        fazer_algo()
    else:
        fazer_outra_coisa()

# ❌ Tabs ou 2 espaços
def minha_funcao():
  if condicao:
	fazer_algo()
```

#### Comprimento de Linha
```python
# ✅ Máximo 79 caracteres
resultado = funcao_com_nome_longo(
    parametro1=valor1,
    parametro2=valor2,
    parametro3=valor3
)

# ❌ Linha muito longa
resultado = funcao_com_nome_longo(parametro1=valor1, parametro2=valor2, parametro3=valor3, parametro4=valor4)
```

#### Imports
```python
# ✅ Ordem correta
# 1. Standard library
import os
import sys
from datetime import datetime

# 2. Third-party
import django
from rest_framework import serializers

# 3. Local
from clientes.models import Cliente
from produtos.serializers import ProdutoSerializer

# ❌ Imports desorganizados
from clientes.models import Cliente
import os
from rest_framework import serializers
import sys
```

### 1.3 Type Hints (Python 3.10+)

```python
from typing import List, Dict, Optional, Union
from decimal import Decimal

# ✅ Com type hints
def calcular_total(
    preco: Decimal,
    quantidade: int,
    desconto: Optional[Decimal] = None
) -> Decimal:
    """
    Calcula o total com desconto opcional.
    
    Args:
        preco: Preço unitário do produto
        quantidade: Quantidade de itens
        desconto: Desconto em reais (opcional)
    
    Returns:
        Total calculado com desconto aplicado
    """
    total = preco * quantidade
    if desconto:
        total -= desconto
    return total


# ✅ Type hints em classes
class Pedido:
    def __init__(
        self,
        cliente_id: int,
        itens: List[Dict[str, Union[int, Decimal]]]
    ) -> None:
        self.cliente_id = cliente_id
        self.itens = itens
    
    def get_total(self) -> Decimal:
        return sum(item['preco'] * item['quantidade'] for item in self.itens)
```

### 1.4 Linters e Formatters

```bash
# Instalar ferramentas
pip install black flake8 isort mypy

# Black - Auto-formatter (PEP 8)
black backend/

# Flake8 - Linter
flake8 backend/ --max-line-length=100

# isort - Organiza imports
isort backend/

# mypy - Type checker
mypy backend/
```

**pyproject.toml:**
```toml
[tool.black]
line-length = 100
target-version = ['py310']
include = '\.pyi?$'

[tool.isort]
profile = "black"
line_length = 100

[tool.mypy]
python_version = "3.10"
warn_return_any = true
warn_unused_configs = true
```

---

## 2. Django Best Practices

### 2.1 Models

#### Fat Models, Thin Views
```python
# ✅ Lógica de negócio no model
class Pedido(models.Model):
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    desconto = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    frete = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    def calcular_totais(self) -> None:
        """Calcula subtotal, desconto e total do pedido."""
        self.subtotal = sum(item.subtotal for item in self.itens.all())
        self.total = self.subtotal - self.desconto + self.frete
        self.save()
    
    def pode_ser_cancelado(self) -> bool:
        """Verifica se pedido pode ser cancelado."""
        return self.status in ['pendente', 'confirmado']

# View apenas coordena
class PedidoViewSet(viewsets.ModelViewSet):
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        pedido = self.get_object()
        if not pedido.pode_ser_cancelado():
            return Response(
                {'error': 'Pedido não pode ser cancelado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        pedido.status = 'cancelado'
        pedido.save()
        return Response({'status': 'cancelado'})


# ❌ Lógica de negócio na view
class PedidoViewSet(viewsets.ModelViewSet):
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        pedido = self.get_object()
        # ❌ Lógica aqui deveria estar no model
        if pedido.status not in ['pendente', 'confirmado']:
            return Response({'error': 'Não pode cancelar'})
        pedido.status = 'cancelado'
        pedido.save()
        return Response({'status': 'cancelado'})
```

#### Properties vs Methods
```python
class Produto(models.Model):
    preco_custo = models.DecimalField(max_digits=10, decimal_places=2)
    preco_venda = models.DecimalField(max_digits=10, decimal_places=2)
    estoque_atual = models.IntegerField()
    
    # ✅ Property - Campo calculado (sem side effects)
    @property
    def margem_lucro(self) -> float:
        """Margem de lucro percentual."""
        if self.preco_custo == 0:
            return 0
        return ((self.preco_venda - self.preco_custo) / self.preco_custo) * 100
    
    @property
    def em_estoque(self) -> bool:
        """Produto tem estoque disponível."""
        return self.estoque_atual > 0
    
    # ✅ Method - Ação (com side effects)
    def adicionar_estoque(self, quantidade: int) -> None:
        """Adiciona quantidade ao estoque."""
        self.estoque_atual += quantidade
        self.save()
    
    def remover_estoque(self, quantidade: int) -> None:
        """Remove quantidade do estoque."""
        if quantidade > self.estoque_atual:
            raise ValueError("Estoque insuficiente")
        self.estoque_atual -= quantidade
        self.save()
```

#### Meta Options
```python
class Cliente(models.Model):
    nome = models.CharField(max_length=200)
    cpf_cnpj = models.CharField(max_length=14, unique=True)
    data_cadastro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # Ordenação padrão
        ordering = ['-data_cadastro', 'nome']
        
        # Nome no admin
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
        
        # Nome da tabela no banco
        db_table = 'clientes'
        
        # Índices de performance
        indexes = [
            models.Index(fields=['cpf_cnpj']),
            models.Index(fields=['nome', 'ativo']),
        ]
        
        # Constraints
        constraints = [
            models.CheckConstraint(
                check=models.Q(cpf_cnpj__isnull=False),
                name='cpf_cnpj_required'
            )
        ]
    
    def __str__(self) -> str:
        """Representação em string."""
        return f"{self.nome} ({self.cpf_cnpj})"
```

### 2.2 Querysets

#### N+1 Problem - SEMPRE evitar
```python
# ❌ RUIM - N+1 queries
pedidos = Pedido.objects.all()  # 1 query
for pedido in pedidos:
    print(pedido.cliente.nome)  # N queries (1 por pedido)
    for item in pedido.itens.all():  # N * M queries
        print(item.produto.nome)

# ✅ BOM - 1 query otimizada
pedidos = Pedido.objects.select_related('cliente').prefetch_related(
    'itens__produto'
)
for pedido in pedidos:
    print(pedido.cliente.nome)  # Sem query extra
    for item in pedido.itens.all():
        print(item.produto.nome)  # Sem query extra
```

#### Select vs Prefetch
```python
# select_related() - Para ForeignKey (JOIN)
produtos = Produto.objects.select_related('categoria')  # INNER JOIN

# prefetch_related() - Para ManyToMany e reverse FK (IN query)
pedidos = Pedido.objects.prefetch_related('itens')  # WHERE id IN (...)

# Combinação
pedidos = Pedido.objects.select_related(
    'cliente', 'vendedor'
).prefetch_related(
    'itens__produto'
)
```

#### Query Optimization
```python
# ✅ Only - Busca apenas campos necessários
clientes = Cliente.objects.only('id', 'nome', 'email')

# ✅ Defer - Adia campos pesados
produtos = Produto.objects.defer('descricao_completa', 'imagem')

# ✅ Values - Dicionário ao invés de objetos
clientes_dict = Cliente.objects.values('id', 'nome', 'email')

# ✅ Exists - Mais rápido que count() para checar existência
tem_clientes = Cliente.objects.filter(ativo=True).exists()

# ❌ EVITAR - count() desnecessário
if Cliente.objects.filter(ativo=True).count() > 0:  # Lento
    pass

# ✅ USAR exists()
if Cliente.objects.filter(ativo=True).exists():  # Rápido
    pass
```

### 2.3 Migrations

```python
# ✅ Sempre revisar migrations antes de aplicar
python manage.py makemigrations --dry-run --verbosity 3

# ✅ Migrations com nomes descritivos
python manage.py makemigrations --name add_status_field_to_pedido

# ✅ Rollback seguro
python manage.py migrate produtos 0003  # Volta para migration 0003

# ❌ NUNCA editar migrations já aplicadas em produção
# ❌ NUNCA deletar migrations já commitadas
```

---

## 3. DRF Best Practices

### 3.1 Serializers

#### Validation Layers
```python
class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'
    
    # 1. Field-level validation
    def validate_preco_venda(self, value):
        """Valida campo individual."""
        if value < 0:
            raise serializers.ValidationError("Preço não pode ser negativo")
        return value
    
    # 2. Object-level validation
    def validate(self, data):
        """Valida múltiplos campos."""
        if data['preco_venda'] <= data['preco_custo']:
            raise serializers.ValidationError(
                "Preço de venda deve ser maior que preço de custo"
            )
        return data
    
    # 3. Model validation (no model.clean())
    def create(self, validated_data):
        produto = Produto(**validated_data)
        produto.full_clean()  # ← Valida no model
        produto.save()
        return produto
```

#### Read vs Write Serializers
```python
# ✅ Serializers diferentes para leitura e escrita

# Read - Com nested relationships
class PedidoSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    vendedor = UsuarioSerializer(read_only=True)
    itens = ItemPedidoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pedido
        fields = '__all__'

# Write - IDs simples
class PedidoCreateSerializer(serializers.ModelSerializer):
    cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all())
    itens = ItemPedidoSerializer(many=True)
    
    class Meta:
        model = Pedido
        fields = ['cliente', 'forma_pagamento', 'itens', 'observacao']
    
    @transaction.atomic
    def create(self, validated_data):
        itens_data = validated_data.pop('itens')
        pedido = Pedido.objects.create(**validated_data)
        
        for item_data in itens_data:
            ItemPedido.objects.create(pedido=pedido, **item_data)
        
        pedido.calcular_totais()
        return pedido

# ViewSet escolhe qual usar
class PedidoViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return PedidoCreateSerializer
        return PedidoSerializer
```

### 3.2 ViewSets

#### Generic ViewSets
```python
from rest_framework import viewsets, mixins

# ✅ Read-only ViewSet
class LogAuditoriaViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    """ViewSet apenas para leitura."""
    queryset = LogAuditoria.objects.all()
    serializer_class = LogAuditoriaSerializer
    permission_classes = [IsAdminUser]

# ✅ ViewSet sem DELETE
class ClienteViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """ViewSet sem deleção física."""
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
```

#### Custom Actions
```python
class PedidoViewSet(viewsets.ModelViewSet):
    
    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        """
        Confirma um pedido.
        
        URL: POST /api/pedidos/{id}/confirmar/
        """
        pedido = self.get_object()
        pedido.status = 'confirmado'
        pedido.data_confirmacao = timezone.now()
        pedido.save()
        
        serializer = self.get_serializer(pedido)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def atrasados(self, request):
        """
        Lista pedidos atrasados.
        
        URL: GET /api/pedidos/atrasados/
        """
        hoje = timezone.now().date()
        queryset = self.get_queryset().filter(
            status='confirmado',
            data_entrega_prevista__lt=hoje
        )
        
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)
```

### 3.3 Permissions

```python
# ✅ Permissões reutilizáveis
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Permite edição apenas ao dono."""
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.usuario == request.user

class IsAdminOrGerente(permissions.BasePermission):
    """Apenas admin ou gerente."""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.is_staff or
            request.user.tipo == 'gerente'
        )

# Uso
class PedidoViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
```

---

## 4. Padrões de Projeto

### 4.1 Design Patterns Usados

#### Repository Pattern (Django ORM)
```python
# Manager customizado = Repository
class AtivoManager(models.Manager):
    """Manager para buscar apenas registros ativos."""
    def get_queryset(self):
        return super().get_queryset().filter(ativo=True)

class Produto(models.Model):
    nome = models.CharField(max_length=200)
    ativo = models.BooleanField(default=True)
    
    # Manager padrão
    objects = models.Manager()
    
    # Manager customizado
    ativos = AtivoManager()

# Uso
todos_produtos = Produto.objects.all()  # Todos
produtos_ativos = Produto.ativos.all()  # Apenas ativos
```

#### Factory Pattern
```python
class SerializerFactory:
    """Factory de serializers."""
    
    @staticmethod
    def get_serializer(model_name: str, action: str):
        """Retorna serializer apropriado."""
        serializers_map = {
            ('produto', 'list'): ProdutoListSerializer,
            ('produto', 'detail'): ProdutoDetailSerializer,
            ('produto', 'create'): ProdutoCreateSerializer,
            ('cliente', 'list'): ClienteListSerializer,
            ('cliente', 'detail'): ClienteDetailSerializer,
        }
        key = (model_name.lower(), action)
        return serializers_map.get(key, None)
```

#### Strategy Pattern (DRF Filters)
```python
# Diferentes estratégias de filtro
class ProdutoViewSet(viewsets.ModelViewSet):
    filter_backends = [
        DjangoFilterBackend,  # Strategy: Filtros exatos
        SearchFilter,          # Strategy: Busca full-text
        OrderingFilter         # Strategy: Ordenação
    ]
```

### 4.2 SOLID Principles

#### Single Responsibility
```python
# ✅ Cada classe uma responsabilidade
class ClienteValidator:
    """Apenas valida clientes."""
    @staticmethod
    def validate_cpf(cpf: str) -> bool:
        # Validação CPF
        pass

class ClienteRepository:
    """Apenas acessa dados de clientes."""
    @staticmethod
    def get_by_cpf(cpf: str) -> Cliente:
        return Cliente.objects.get(cpf_cnpj=cpf)

class ClienteService:
    """Coordena operações de negócio."""
    def __init__(self):
        self.validator = ClienteValidator()
        self.repository = ClienteRepository()
    
    def criar_cliente(self, data: dict) -> Cliente:
        if not self.validator.validate_cpf(data['cpf']):
            raise ValueError("CPF inválido")
        return self.repository.create(data)
```

#### Open/Closed
```python
# ✅ Aberto para extensão, fechado para modificação
class BaseNotification(ABC):
    @abstractmethod
    def send(self, message: str) -> None:
        pass

class EmailNotification(BaseNotification):
    def send(self, message: str) -> None:
        # Envia email
        pass

class SMSNotification(BaseNotification):
    def send(self, message: str) -> None:
        # Envia SMS
        pass

# Adicionar novo tipo sem modificar código existente
class PushNotification(BaseNotification):
    def send(self, message: str) -> None:
        # Envia push
        pass
```

---

## 5. Estrutura de Código

### 5.1 Organização de Apps

```
backend/
├── config/              # Configurações globais
│   ├── settings/
│   │   ├── base.py     # Settings compartilhados
│   │   ├── dev.py      # Settings de desenvolvimento
│   │   └── prod.py     # Settings de produção
│   ├── urls.py
│   └── wsgi.py
│
├── clientes/            # App de domínio
│   ├── __init__.py
│   ├── models.py        # Models
│   ├── serializers.py   # Serializers DRF
│   ├── views.py         # ViewSets
│   ├── urls.py          # URLs do app
│   ├── admin.py         # Admin customizado
│   ├── tests/           # Testes
│   │   ├── test_models.py
│   │   ├── test_serializers.py
│   │   └── test_views.py
│   ├── permissions.py   # Permissões customizadas
│   ├── filters.py       # Filtros customizados
│   └── migrations/
│
└── core/                # Shared utilities
    ├── models.py        # Abstract models
    ├── mixins.py        # Mixins reutilizáveis
    ├── validators.py    # Validadores comuns
    └── utils.py         # Funções auxiliares
```

### 5.2 Imports Organization

```python
"""
Módulo de serializers para clientes.

Este módulo contém os serializers para o modelo Cliente,
incluindo validações de CPF/CNPJ e lógica de negócio.
"""

# Standard library
import re
from decimal import Decimal
from typing import Dict, Any

# Third-party
from django.db import transaction
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

# Local
from clientes.models import Cliente
from clientes.validators import validate_cpf, validate_cnpj
from core.mixins import TimestampedSerializerMixin
```

---

## 6. Naming Conventions

### 6.1 Nomenclatura Python

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| **Classes** | PascalCase | `ClienteSerializer` |
| **Funções** | snake_case | `validate_cpf()` |
| **Variáveis** | snake_case | `preco_total` |
| **Constantes** | UPPER_SNAKE_CASE | `MAX_ITEMS_PER_PAGE` |
| **Privado** | _prefixo | `_internal_method()` |
| **Mágico** | __prefixo_sufixo__ | `__init__()` |

### 6.2 Nomenclatura Django

```python
# Models - Singular
class Cliente(models.Model):  # ✅ Singular
    pass

class Clientes(models.Model):  # ❌ Plural
    pass

# Managers - Plural descritivo
class Produto(models.Model):
    objects = models.Manager()       # Padrão
    ativos = AtivoManager()          # ✅ Descritivo
    em_estoque = EmEstoqueManager()

# Related names - Plural
class Pedido(models.Model):
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        related_name='pedidos'  # ✅ cliente.pedidos
    )
```

### 6.3 Nomenclatura DRF

```python
# Serializers
class ClienteSerializer          # Completo
class ClienteListSerializer      # Para listagem
class ClienteDetailSerializer    # Para detalhe
class ClienteCreateSerializer    # Para criação

# ViewSets
class ClienteViewSet             # ModelViewSet completo
class ClienteReadOnlyViewSet     # Apenas leitura

# Permissions
class IsOwnerOrReadOnly          # Descritivo
class IsAdminOrGerente

# Filters
class ProdutoFilter              # Django-filter
```

---

## 7. Documentação de Código

### 7.1 Docstrings

```python
def calcular_total(
    preco: Decimal,
    quantidade: int,
    desconto: Optional[Decimal] = None
) -> Decimal:
    """
    Calcula o total de um item com desconto opcional.
    
    Args:
        preco: Preço unitário do produto em reais.
        quantidade: Quantidade de itens (deve ser positivo).
        desconto: Desconto em reais a ser aplicado (opcional).
    
    Returns:
        Total calculado após aplicar desconto.
    
    Raises:
        ValueError: Se quantidade for negativa.
        TypeError: Se preço não for Decimal.
    
    Examples:
        >>> calcular_total(Decimal('10.00'), 2)
        Decimal('20.00')
        
        >>> calcular_total(Decimal('10.00'), 2, Decimal('5.00'))
        Decimal('15.00')
    
    Note:
        Esta função não aplica impostos. Use calcular_total_com_impostos()
        para incluir tributos.
    """
    if quantidade < 0:
        raise ValueError("Quantidade não pode ser negativa")
    
    total = preco * quantidade
    if desconto:
        total -= desconto
    return total
```

### 7.2 Comments

```python
# ✅ Comentários explicam "por quê", não "o quê"

# Usar select_related para evitar N+1 problem
produtos = Produto.objects.select_related('categoria')

# Fallback para API externa em caso de timeout
try:
    response = api.get_data(timeout=5)
except Timeout:
    response = cache.get('last_known_data')

# ❌ Comentários óbvios
# Define variável x como 10
x = 10

# Loop pelos produtos
for produto in produtos:
    pass
```

### 7.3 TODOs e FIXMEs

```python
# TODO: Implementar cache Redis para esta query
# FIXME: Bug quando quantidade = 0 (divisão por zero)
# HACK: Solução temporária até refatorar
# OPTIMIZE: Esta query está lenta, adicionar índice
# NOTE: Comportamento esperado pela API externa
```

---

## 8. Testing Patterns

### 8.1 Estrutura de Testes

```python
# tests/test_models.py
from django.test import TestCase
from decimal import Decimal

class ProdutoModelTest(TestCase):
    """Testes para o model Produto."""
    
    @classmethod
    def setUpTestData(cls):
        """Setup executado uma vez para todos testes da classe."""
        cls.categoria = Categoria.objects.create(nome="Eletrônicos")
    
    def setUp(self):
        """Setup executado antes de cada teste."""
        self.produto = Produto.objects.create(
            nome="Notebook",
            categoria=self.categoria,
            preco_custo=Decimal('2000.00'),
            preco_venda=Decimal('3000.00')
        )
    
    def test_margem_lucro_calculo(self):
        """Testa cálculo da margem de lucro."""
        self.assertEqual(self.produto.margem_lucro, 50.0)
    
    def test_str_representation(self):
        """Testa representação em string."""
        self.assertEqual(str(self.produto), "Notebook")
    
    def tearDown(self):
        """Cleanup após cada teste."""
        pass
```

### 8.2 Naming de Testes

```python
# ✅ Nomes descritivos
def test_create_cliente_with_valid_cpf_succeeds()
def test_create_cliente_with_invalid_cpf_raises_error()
def test_pedido_total_calculation_with_discount()
def test_user_cannot_delete_pedido_after_confirmation()

# ❌ Nomes genéricos
def test1()
def test_cliente()
def test_error()
```

---

## 9. Git Workflow

### 9.1 Commit Messages

```bash
# ✅ Formato: tipo(escopo): descrição

feat(clientes): adiciona validação de CPF no serializer
fix(pedidos): corrige cálculo de total com desconto
docs(readme): atualiza instruções de instalação
style(produtos): formata código com black
refactor(auth): simplifica lógica de permissões
test(vendas): adiciona testes para cancelamento de pedido
chore(deps): atualiza django para 5.0.7

# Corpo da mensagem (opcional)
feat(clientes): adiciona validação de CPF no serializer

- Implementa algoritmo de validação de CPF
- Adiciona testes unitários
- Atualiza documentação da API

Closes #42
```

### 9.2 Branch Strategy

```bash
# main - Produção estável
# develop - Desenvolvimento
# feature/* - Novas funcionalidades
# bugfix/* - Correções
# hotfix/* - Correções urgentes em produção

git checkout -b feature/adicionar-filtro-estoque
git checkout -b bugfix/corrigir-calculo-total
git checkout -b hotfix/security-vulnerability
```

---

## 10. Code Review

### 10.1 Checklist

```markdown
## Code Review Checklist

### Funcionalidade
- [ ] Código faz o que deveria fazer
- [ ] Edge cases considerados
- [ ] Erros tratados adequadamente

### Qualidade
- [ ] Segue PEP 8
- [ ] Nomes descritivos
- [ ] Funções pequenas e focadas
- [ ] Sem código duplicado (DRY)
- [ ] Complexidade aceitável

### Performance
- [ ] Queries otimizadas (sem N+1)
- [ ] Índices de banco apropriados
- [ ] Caching considerado (se necessário)

### Segurança
- [ ] Input validado
- [ ] Permissões checadas
- [ ] Dados sensíveis protegidos
- [ ] SQL injection prevenido

### Testes
- [ ] Testes unitários adicionados
- [ ] Casos de sucesso testados
- [ ] Casos de erro testados
- [ ] Coverage mantido/aumentado

### Documentação
- [ ] Docstrings atualizadas
- [ ] README atualizado (se necessário)
- [ ] API docs atualizadas (se necessário)
- [ ] Comentários adequados
```

---

<div align="center">

**💎 Código Limpo, Manutenível e Profissional**

*"Qualquer tolo pode escrever código que um computador entenda. Bons programadores escrevem código que humanos entendam."*  
— Martin Fowler

*Documentado por Márcio Gil - DIO Campus Expert Turma 14*

</div>
