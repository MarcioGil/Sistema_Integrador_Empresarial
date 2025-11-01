from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from decimal import Decimal
from clientes.models import Cliente
from produtos.models import Produto

User = get_user_model()


class Pedido(models.Model):
    """Model para pedidos de venda"""
    
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('confirmado', 'Confirmado'),
        ('em_separacao', 'Em Separação'),
        ('enviado', 'Enviado'),
        ('entregue', 'Entregue'),
        ('cancelado', 'Cancelado'),
    ]
    
    FORMA_PAGAMENTO_CHOICES = [
        ('dinheiro', 'Dinheiro'),
        ('cartao_credito', 'Cartão de Crédito'),
        ('cartao_debito', 'Cartão de Débito'),
        ('pix', 'PIX'),
        ('boleto', 'Boleto'),
        ('transferencia', 'Transferência Bancária'),
    ]
    
    # Identificação
    numero_pedido = models.CharField('Número do Pedido', max_length=20, unique=True)
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        related_name='pedidos',
        verbose_name='Cliente'
    )
    vendedor = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='pedidos_vendidos',
        verbose_name='Vendedor'
    )
    
    # Datas
    data_pedido = models.DateTimeField('Data do Pedido', auto_now_add=True)
    data_entrega_prevista = models.DateField('Data de Entrega Prevista', null=True, blank=True)
    data_entrega_realizada = models.DateField('Data de Entrega Realizada', null=True, blank=True)
    
    # Status
    status = models.CharField('Status', max_length=15, choices=STATUS_CHOICES, default='pendente')
    
    # Valores
    valor_subtotal = models.DecimalField(
        'Valor Subtotal',
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    valor_desconto = models.DecimalField(
        'Valor do Desconto',
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    valor_frete = models.DecimalField(
        'Valor do Frete',
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    valor_total = models.DecimalField(
        'Valor Total',
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    
    # Pagamento
    forma_pagamento = models.CharField(
        'Forma de Pagamento',
        max_length=20,
        choices=FORMA_PAGAMENTO_CHOICES
    )
    
    # Observações
    observacoes = models.TextField('Observações', blank=True, null=True)
    data_atualizacao = models.DateTimeField('Data de Atualização', auto_now=True)
    
    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-data_pedido']
        indexes = [
            models.Index(fields=['numero_pedido']),
            models.Index(fields=['cliente', '-data_pedido']),
            models.Index(fields=['status']),
            models.Index(fields=['-data_pedido']),
        ]
    
    def __str__(self):
        return f"Pedido {self.numero_pedido} - {self.cliente.nome_completo}"
    
    def save(self, *args, **kwargs):
        """Gera número do pedido automaticamente se não existir"""
        if not self.numero_pedido:
            from django.utils import timezone
            data = timezone.now()
            ultimo_pedido = Pedido.objects.filter(
                data_pedido__year=data.year,
                data_pedido__month=data.month
            ).count()
            self.numero_pedido = f"{data.year}{data.month:02d}{ultimo_pedido + 1:05d}"
        
        # Calcula o valor total
        self.valor_total = self.valor_subtotal - self.valor_desconto + self.valor_frete
        
        super().save(*args, **kwargs)
    
    def calcular_totais(self):
        """Calcula os totais do pedido baseado nos itens"""
        itens = self.itens.all()
        self.valor_subtotal = sum(item.valor_total for item in itens)
        self.valor_total = self.valor_subtotal - self.valor_desconto + self.valor_frete
        self.save()
    
    @property
    def subtotal(self):
        """Alias para valor_subtotal (compatibilidade admin)"""
        return self.valor_subtotal
    
    @property
    def quantidade_itens(self):
        """Retorna a quantidade total de itens no pedido"""
        return self.itens.aggregate(total=models.Sum('quantidade'))['total'] or 0


class ItemPedido(models.Model):
    """Model para itens de um pedido"""
    
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name='itens',
        verbose_name='Pedido'
    )
    produto = models.ForeignKey(
        Produto,
        on_delete=models.PROTECT,
        related_name='itens_pedido',
        verbose_name='Produto'
    )
    quantidade = models.IntegerField(
        'Quantidade',
        validators=[MinValueValidator(1)]
    )
    preco_unitario = models.DecimalField(
        'Preço Unitário',
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    desconto = models.DecimalField(
        'Desconto',
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    valor_total = models.DecimalField(
        'Valor Total',
        max_digits=10,
        decimal_places=2,
        default=0
    )
    
    class Meta:
        verbose_name = 'Item do Pedido'
        verbose_name_plural = 'Itens do Pedido'
        ordering = ['id']
    
    def __str__(self):
        return f"{self.produto.nome} - Qtd: {self.quantidade}"
    
    def save(self, *args, **kwargs):
        """Calcula o valor total do item"""
        self.valor_total = (self.preco_unitario * self.quantidade) - self.desconto
        super().save(*args, **kwargs)
        
        # Atualiza os totais do pedido
        self.pedido.calcular_totais()
