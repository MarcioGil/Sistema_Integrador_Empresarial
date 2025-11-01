from django.db import models
from django.core.validators import RegexValidator


class Fornecedor(models.Model):
    """Model para cadastro de fornecedores"""
    
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
        ('bloqueado', 'Bloqueado'),
    ]
    
    # Dados principais
    nome = models.CharField('Nome/Razão Social', max_length=200)
    nome_fantasia = models.CharField('Nome Fantasia', max_length=200, blank=True, null=True)
    cnpj = models.CharField(
        'CNPJ',
        max_length=18,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$',
                message='CNPJ deve estar no formato 00.000.000/0000-00'
            )
        ]
    )
    inscricao_estadual = models.CharField('Inscrição Estadual', max_length=20, blank=True, null=True)
    
    # Contato
    email = models.EmailField('E-mail', max_length=255)
    telefone = models.CharField('Telefone', max_length=20)
    celular = models.CharField('Celular', max_length=20, blank=True, null=True)
    site = models.URLField('Site', blank=True, null=True)
    
    # Contato pessoa responsável
    contato_nome = models.CharField('Nome do Contato', max_length=200, blank=True, null=True)
    contato_cargo = models.CharField('Cargo do Contato', max_length=100, blank=True, null=True)
    contato_telefone = models.CharField('Telefone do Contato', max_length=20, blank=True, null=True)
    contato_email = models.EmailField('E-mail do Contato', blank=True, null=True)
    
    # Endereço
    endereco = models.CharField('Endereço', max_length=255)
    numero = models.CharField('Número', max_length=10)
    complemento = models.CharField('Complemento', max_length=100, blank=True, null=True)
    bairro = models.CharField('Bairro', max_length=100)
    cidade = models.CharField('Cidade', max_length=100)
    estado = models.CharField('Estado', max_length=2)
    cep = models.CharField(
        'CEP',
        max_length=9,
        validators=[
            RegexValidator(
                regex=r'^\d{5}-\d{3}$',
                message='CEP deve estar no formato 00000-000'
            )
        ]
    )
    
    # Dados bancários
    banco = models.CharField('Banco', max_length=100, blank=True, null=True)
    agencia = models.CharField('Agência', max_length=10, blank=True, null=True)
    conta = models.CharField('Conta', max_length=20, blank=True, null=True)
    pix = models.CharField('Chave PIX', max_length=200, blank=True, null=True)
    
    # Condições comerciais
    prazo_entrega_dias = models.IntegerField('Prazo de Entrega (dias)', default=0)
    prazo_pagamento_dias = models.IntegerField('Prazo de Pagamento (dias)', default=0)
    
    # Status e avaliação
    status = models.CharField('Status', max_length=10, choices=STATUS_CHOICES, default='ativo')
    avaliacao = models.IntegerField(
        'Avaliação (1-5)',
        default=0,
        choices=[(i, str(i)) for i in range(6)],
        help_text='0 = Não avaliado, 1 = Péssimo, 5 = Excelente'
    )
    
    # Informações adicionais
    observacoes = models.TextField('Observações', blank=True, null=True)
    data_cadastro = models.DateTimeField('Data de Cadastro', auto_now_add=True)
    data_atualizacao = models.DateTimeField('Data de Atualização', auto_now=True)
    
    class Meta:
        verbose_name = 'Fornecedor'
        verbose_name_plural = 'Fornecedores'
        ordering = ['nome']
        indexes = [
            models.Index(fields=['cnpj']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.nome} - {self.cnpj}"
    
    @property
    def razao_social(self):
        """Alias para nome (compatibilidade admin)"""
        return self.nome
    
    @property
    def ativo(self):
        """Retorna True se o fornecedor está ativo"""
        return self.status == 'ativo'
    
    @property
    def is_ativo(self):
        """Retorna True se o fornecedor está ativo"""
        return self.status == 'ativo'
    
    @property
    def nome_exibicao(self):
        """Retorna o nome fantasia se existir, senão o nome"""
        return self.nome_fantasia if self.nome_fantasia else self.nome
