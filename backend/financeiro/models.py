from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal
from clientes.models import Cliente
from fornecedores.models import Fornecedor
from vendas.models import Pedido


class Fatura(models.Model):
    """Model para faturas geradas a partir de pedidos"""
    
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('pago', 'Pago'),
        ('atrasado', 'Atrasado'),
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
    numero_fatura = models.CharField('Número da Fatura', max_length=20, unique=True)
    pedido = models.OneToOneField(
        Pedido,
        on_delete=models.PROTECT,
        related_name='fatura',
        verbose_name='Pedido'
    )
    
    # Datas
    data_emissao = models.DateField('Data de Emissão', auto_now_add=True)
    data_vencimento = models.DateField('Data de Vencimento')
    data_pagamento = models.DateField('Data de Pagamento', null=True, blank=True)
    
    # Valores
    valor_total = models.DecimalField(
        'Valor Total',
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    valor_pago = models.DecimalField(
        'Valor Pago',
        max_digits=10,
        decimal_places=2,
        default=0,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    
    # Status e pagamento
    status = models.CharField('Status', max_length=10, choices=STATUS_CHOICES, default='pendente')
    forma_pagamento = models.CharField(
        'Forma de Pagamento',
        max_length=20,
        choices=FORMA_PAGAMENTO_CHOICES
    )
    
    # Observações
    observacoes = models.TextField('Observações', blank=True, null=True)
    data_atualizacao = models.DateTimeField('Data de Atualização', auto_now=True)
    
    class Meta:
        verbose_name = 'Fatura'
        verbose_name_plural = 'Faturas'
        ordering = ['-data_emissao']
        indexes = [
            models.Index(fields=['numero_fatura']),
            models.Index(fields=['status']),
            models.Index(fields=['data_vencimento']),
        ]
    
    def __str__(self):
        return f"Fatura {self.numero_fatura} - {self.pedido.cliente.nome_completo}"
    
    def save(self, *args, **kwargs):
        """Gera número da fatura automaticamente se não existir"""
        if not self.numero_fatura:
            from django.utils import timezone
            data = timezone.now()
            ultima_fatura = Fatura.objects.filter(
                data_emissao__year=data.year,
                data_emissao__month=data.month
            ).count()
            self.numero_fatura = f"FAT{data.year}{data.month:02d}{ultima_fatura + 1:05d}"
        
        # Atualiza status baseado no pagamento
        if self.valor_pago >= self.valor_total:
            self.status = 'pago'
        elif self.data_vencimento < timezone.now().date() and self.status == 'pendente':
            self.status = 'atrasado'
        
        super().save(*args, **kwargs)
    
    @property
    def dias_vencimento(self):
        """Retorna quantos dias faltam para o vencimento (negativo se atrasado)"""
        from django.utils import timezone
        delta = self.data_vencimento - timezone.now().date()
        return delta.days
    
    @property
    def is_atrasado(self):
        """Verifica se a fatura está atrasada"""
        from django.utils import timezone
        return self.data_vencimento < timezone.now().date() and self.status != 'pago'


class ContaReceber(models.Model):
    """Model para contas a receber (pode ser vinculada a uma fatura ou não)"""
    
    STATUS_CHOICES = [
        ('aberto', 'Aberto'),
        ('recebido', 'Recebido'),
        ('atrasado', 'Atrasado'),
        ('cancelado', 'Cancelado'),
    ]
    
    fatura = models.ForeignKey(
        Fatura,
        on_delete=models.CASCADE,
        related_name='contas_receber',
        verbose_name='Fatura',
        null=True,
        blank=True
    )
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        related_name='contas_receber',
        verbose_name='Cliente'
    )
    descricao = models.CharField('Descrição', max_length=255)
    valor = models.DecimalField(
        'Valor',
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    valor_recebido = models.DecimalField(
        'Valor Recebido',
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    juros = models.DecimalField(
        'Juros',
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    multa = models.DecimalField(
        'Multa',
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    desconto = models.DecimalField(
        'Desconto',
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    forma_pagamento = models.CharField(
        'Forma de Pagamento',
        max_length=50,
        blank=True,
        null=True
    )
    numero_documento = models.CharField(
        'Número do Documento',
        max_length=100,
        blank=True,
        null=True
    )
    data_vencimento = models.DateField('Data de Vencimento')
    data_recebimento = models.DateField('Data de Recebimento', null=True, blank=True)
    status = models.CharField('Status', max_length=10, choices=STATUS_CHOICES, default='aberto')
    observacoes = models.TextField('Observações', blank=True, null=True)
    data_cadastro = models.DateTimeField('Data de Cadastro', auto_now_add=True)
    data_atualizacao = models.DateTimeField('Data de Atualização', auto_now=True)
    
    class Meta:
        verbose_name = 'Conta a Receber'
        verbose_name_plural = 'Contas a Receber'
        ordering = ['data_vencimento']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['data_vencimento']),
            models.Index(fields=['cliente']),
        ]
    
    def __str__(self):
        return f"{self.descricao} - R$ {self.valor} - {self.cliente.nome_completo}"
    
    @property
    def is_atrasado(self):
        """Verifica se a conta está atrasada"""
        from django.utils import timezone
        return self.data_vencimento < timezone.now().date() and self.status == 'aberto'


class ContaPagar(models.Model):
    """Model para contas a pagar"""
    
    STATUS_CHOICES = [
        ('aberto', 'Aberto'),
        ('pago', 'Pago'),
        ('atrasado', 'Atrasado'),
        ('cancelado', 'Cancelado'),
    ]
    
    CATEGORIA_CHOICES = [
        ('fornecedor', 'Fornecedor'),
        ('salario', 'Salário'),
        ('aluguel', 'Aluguel'),
        ('energia', 'Energia Elétrica'),
        ('agua', 'Água'),
        ('internet', 'Internet/Telefone'),
        ('impostos', 'Impostos'),
        ('manutencao', 'Manutenção'),
        ('marketing', 'Marketing'),
        ('outros', 'Outros'),
    ]
    
    fornecedor = models.ForeignKey(
        Fornecedor,
        on_delete=models.PROTECT,
        related_name='contas_pagar',
        verbose_name='Fornecedor',
        null=True,
        blank=True
    )
    descricao = models.CharField('Descrição', max_length=255)
    valor = models.DecimalField(
        'Valor',
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    valor_pago = models.DecimalField(
        'Valor Pago',
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    juros = models.DecimalField(
        'Juros',
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    multa = models.DecimalField(
        'Multa',
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    desconto = models.DecimalField(
        'Desconto',
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00')
    )
    forma_pagamento = models.CharField(
        'Forma de Pagamento',
        max_length=50,
        blank=True,
        null=True
    )
    numero_documento = models.CharField(
        'Número do Documento',
        max_length=100,
        blank=True,
        null=True
    )
    data_vencimento = models.DateField('Data de Vencimento')
    data_pagamento = models.DateField('Data de Pagamento', null=True, blank=True)
    status = models.CharField('Status', max_length=10, choices=STATUS_CHOICES, default='aberto')
    categoria = models.CharField('Categoria', max_length=20, choices=CATEGORIA_CHOICES, default='outros')
    observacoes = models.TextField('Observações', blank=True, null=True)
    data_cadastro = models.DateTimeField('Data de Cadastro', auto_now_add=True)
    data_atualizacao = models.DateTimeField('Data de Atualização', auto_now=True)
    
    class Meta:
        verbose_name = 'Conta a Pagar'
        verbose_name_plural = 'Contas a Pagar'
        ordering = ['data_vencimento']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['data_vencimento']),
            models.Index(fields=['fornecedor']),
            models.Index(fields=['categoria']),
        ]
    
    def __str__(self):
        fornecedor_nome = self.fornecedor.nome if self.fornecedor else 'Sem fornecedor'
        return f"{self.descricao} - R$ {self.valor} - {fornecedor_nome}"
    
    @property
    def is_atrasado(self):
        """Verifica se a conta está atrasada"""
        from django.utils import timezone
        return self.data_vencimento < timezone.now().date() and self.status == 'aberto'
