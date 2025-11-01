from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Categoria(models.Model):
    """Model para categorização de produtos"""
    
    nome = models.CharField('Nome', max_length=100, unique=True)
    descricao = models.TextField('Descrição', blank=True, null=True)
    categoria_pai = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subcategorias',
        verbose_name='Categoria Pai'
    )
    ativo = models.BooleanField('Ativo', default=True)
    data_cadastro = models.DateTimeField('Data de Cadastro', auto_now_add=True)
    data_atualizacao = models.DateTimeField('Data de Atualização', auto_now=True)
    
    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['nome']
    
    def __str__(self):
        if self.categoria_pai:
            return f"{self.categoria_pai.nome} > {self.nome}"
        return self.nome
    
    @property
    def ativa(self):
        """Alias para ativo (compatibilidade admin)"""
        return self.ativo
    
    @property
    def caminho_completo(self):
        """Retorna o caminho completo da categoria"""
        if self.categoria_pai:
            return f"{self.categoria_pai.caminho_completo} > {self.nome}"
        return self.nome


class Produto(models.Model):
    """Model para cadastro de produtos"""
    
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
        ('descontinuado', 'Descontinuado'),
    ]
    
    UNIDADE_CHOICES = [
        ('UN', 'Unidade'),
        ('KG', 'Quilograma'),
        ('MT', 'Metro'),
        ('LT', 'Litro'),
        ('CX', 'Caixa'),
        ('PC', 'Peça'),
    ]
    
    # Identificação
    codigo = models.CharField('Código', max_length=50, unique=True)
    nome = models.CharField('Nome', max_length=200)
    descricao = models.TextField('Descrição', blank=True, null=True)
    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name='produtos',
        verbose_name='Categoria'
    )
    
    # Precificação
    preco_custo = models.DecimalField(
        'Preço de Custo',
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    preco_venda = models.DecimalField(
        'Preço de Venda',
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))]
    )
    margem_lucro = models.DecimalField(
        'Margem de Lucro (%)',
        max_digits=5,
        decimal_places=2,
        default=0,
        blank=True
    )
    
    # Características físicas
    unidade_medida = models.CharField(
        'Unidade de Medida',
        max_length=2,
        choices=UNIDADE_CHOICES,
        default='UN'
    )
    peso = models.DecimalField(
        'Peso (kg)',
        max_digits=8,
        decimal_places=3,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.001'))]
    )
    altura = models.DecimalField(
        'Altura (cm)',
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True
    )
    largura = models.DecimalField(
        'Largura (cm)',
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True
    )
    profundidade = models.DecimalField(
        'Profundidade (cm)',
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # Imagem
    imagem = models.ImageField(
        'Imagem',
        upload_to='produtos/%Y/%m/',
        null=True,
        blank=True
    )
    
    # Status e datas
    status = models.CharField('Status', max_length=15, choices=STATUS_CHOICES, default='ativo')
    data_cadastro = models.DateTimeField('Data de Cadastro', auto_now_add=True)
    data_atualizacao = models.DateTimeField('Data de Atualização', auto_now=True)
    
    class Meta:
        verbose_name = 'Produto'
        verbose_name_plural = 'Produtos'
        ordering = ['nome']
        indexes = [
            models.Index(fields=['codigo']),
            models.Index(fields=['status']),
            models.Index(fields=['categoria']),
        ]
    
    def __str__(self):
        return f"{self.codigo} - {self.nome}"
    
    def save(self, *args, **kwargs):
        """Calcula a margem de lucro automaticamente"""
        if self.preco_custo and self.preco_venda:
            self.margem_lucro = ((self.preco_venda - self.preco_custo) / self.preco_custo) * 100
        super().save(*args, **kwargs)
    
    @property
    def codigo_sku(self):
        """Alias para codigo (compatibilidade admin)"""
        return self.codigo
    
    @property
    def ativo(self):
        """Retorna True se o produto está ativo"""
        return self.status == 'ativo'
    
    @property
    def is_ativo(self):
        """Retorna True se o produto está ativo"""
        return self.status == 'ativo'
    
    @property
    def lucro_unitario(self):
        """Retorna o lucro por unidade"""
        return self.preco_venda - self.preco_custo
