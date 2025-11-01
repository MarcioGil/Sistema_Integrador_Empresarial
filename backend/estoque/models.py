from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from produtos.models import Produto

User = get_user_model()


class Estoque(models.Model):
    """Model para controle de estoque de produtos"""
    
    produto = models.OneToOneField(
        Produto,
        on_delete=models.CASCADE,
        related_name='estoque',
        verbose_name='Produto'
    )
    quantidade_atual = models.IntegerField(
        'Quantidade Atual',
        default=0,
        validators=[MinValueValidator(0)]
    )
    quantidade_minima = models.IntegerField(
        'Quantidade Mínima',
        default=0,
        validators=[MinValueValidator(0)],
        help_text='Quantidade mínima para alerta de reposição'
    )
    quantidade_maxima = models.IntegerField(
        'Quantidade Máxima',
        default=0,
        validators=[MinValueValidator(0)],
        help_text='Capacidade máxima de armazenamento'
    )
    localizacao = models.CharField(
        'Localização',
        max_length=100,
        blank=True,
        null=True,
        help_text='Ex: Prateleira A3, Galpão 2, etc.'
    )
    ultima_atualizacao = models.DateTimeField('Última Atualização', auto_now=True)
    
    class Meta:
        verbose_name = 'Estoque'
        verbose_name_plural = 'Estoques'
        ordering = ['produto__nome']
    
    def __str__(self):
        return f"Estoque: {self.produto.nome} - Qtd: {self.quantidade_atual}"
    
    @property
    def quantidade(self):
        """Alias para quantidade_atual (compatibilidade admin)"""
        return self.quantidade_atual
    
    @property
    def data_atualizacao(self):
        """Alias para ultima_atualizacao (compatibilidade admin)"""
        return self.ultima_atualizacao
    
    @property
    def precisa_reposicao(self):
        """Verifica se o estoque está abaixo do mínimo"""
        return self.quantidade_atual <= self.quantidade_minima
    
    @property
    def percentual_ocupacao(self):
        """Calcula o percentual de ocupação do estoque"""
        if self.quantidade_maxima > 0:
            return (self.quantidade_atual / self.quantidade_maxima) * 100
        return 0
    
    @property
    def status_estoque(self):
        """Retorna o status do estoque"""
        if self.quantidade_atual == 0:
            return 'Sem estoque'
        elif self.precisa_reposicao:
            return 'Estoque baixo'
        elif self.quantidade_maxima > 0 and self.quantidade_atual >= self.quantidade_maxima:
            return 'Estoque cheio'
        return 'Normal'


class MovimentacaoEstoque(models.Model):
    """Model para registro de movimentações de estoque"""
    
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('saida', 'Saída'),
    ]
    
    MOTIVO_CHOICES = [
        ('compra', 'Compra'),
        ('venda', 'Venda'),
        ('devolucao', 'Devolução'),
        ('ajuste', 'Ajuste de Inventário'),
        ('perda', 'Perda/Avaria'),
        ('transferencia', 'Transferência'),
    ]
    
    produto = models.ForeignKey(
        Produto,
        on_delete=models.PROTECT,
        related_name='movimentacoes',
        verbose_name='Produto'
    )
    tipo = models.CharField('Tipo', max_length=10, choices=TIPO_CHOICES)
    quantidade = models.IntegerField(
        'Quantidade',
        validators=[MinValueValidator(1)]
    )
    motivo = models.CharField('Motivo', max_length=20, choices=MOTIVO_CHOICES)
    usuario = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='movimentacoes_estoque',
        verbose_name='Usuário'
    )
    data_movimentacao = models.DateTimeField('Data de Movimentação', auto_now_add=True)
    observacoes = models.TextField('Observações', blank=True, null=True)
    
    # Campos para rastreabilidade
    quantidade_anterior = models.IntegerField('Quantidade Anterior', default=0)
    quantidade_posterior = models.IntegerField('Quantidade Posterior', default=0)
    
    class Meta:
        verbose_name = 'Movimentação de Estoque'
        verbose_name_plural = 'Movimentações de Estoque'
        ordering = ['-data_movimentacao']
        indexes = [
            models.Index(fields=['produto', '-data_movimentacao']),
            models.Index(fields=['tipo']),
            models.Index(fields=['motivo']),
        ]
    
    def __str__(self):
        return f"{self.get_tipo_display()} - {self.produto.nome} - Qtd: {self.quantidade}"
    
    def save(self, *args, **kwargs):
        """Atualiza o estoque automaticamente ao salvar a movimentação"""
        estoque, created = Estoque.objects.get_or_create(produto=self.produto)
        
        # Registra quantidade anterior
        self.quantidade_anterior = estoque.quantidade_atual
        
        # Atualiza estoque
        if self.tipo == 'entrada':
            estoque.quantidade_atual += self.quantidade
        else:  # saída
            estoque.quantidade_atual -= self.quantidade
            if estoque.quantidade_atual < 0:
                raise ValueError('Quantidade em estoque insuficiente!')
        
        # Registra quantidade posterior
        self.quantidade_posterior = estoque.quantidade_atual
        
        estoque.save()
        super().save(*args, **kwargs)
