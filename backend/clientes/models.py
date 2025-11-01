from django.db import models
from django.core.validators import RegexValidator


class Cliente(models.Model):
    """Model para cadastro de clientes (Pessoa Física ou Jurídica)"""
    
    TIPO_CHOICES = [
        ('PF', 'Pessoa Física'),
        ('PJ', 'Pessoa Jurídica'),
    ]
    
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
        ('inadimplente', 'Inadimplente'),
    ]
    
    # Dados principais
    nome_completo = models.CharField('Nome Completo', max_length=200)
    cpf_cnpj = models.CharField(
        'CPF/CNPJ',
        max_length=18,
        unique=True,
        validators=[
            RegexValidator(
                regex=r'^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$',
                message='CPF deve estar no formato 000.000.000-00 ou CNPJ 00.000.000/0000-00'
            )
        ]
    )
    email = models.EmailField('E-mail', max_length=255)
    telefone = models.CharField('Telefone', max_length=20)
    tipo = models.CharField('Tipo', max_length=2, choices=TIPO_CHOICES, default='PF')
    status = models.CharField('Status', max_length=15, choices=STATUS_CHOICES, default='ativo')
    
    # Endereço
    endereco = models.CharField('Endereço', max_length=255)
    numero = models.CharField('Número', max_length=10, blank=True, null=True)
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
    
    # Informações adicionais
    observacoes = models.TextField('Observações', blank=True, null=True)
    data_cadastro = models.DateTimeField('Data de Cadastro', auto_now_add=True)
    data_atualizacao = models.DateTimeField('Data de Atualização', auto_now=True)
    
    class Meta:
        verbose_name = 'Cliente'
        verbose_name_plural = 'Clientes'
        ordering = ['nome_completo']
        indexes = [
            models.Index(fields=['cpf_cnpj']),
            models.Index(fields=['status']),
            models.Index(fields=['data_cadastro']),
        ]
    
    def __str__(self):
        return f"{self.nome_completo} - {self.cpf_cnpj}"
    
    @property
    def nome_razao_social(self):
        """Alias para nome_completo (compatibilidade admin)"""
        return self.nome_completo
    
    @property
    def is_pessoa_fisica(self):
        """Retorna True se o cliente é Pessoa Física"""
        return self.tipo == 'PF'
    
    @property
    def is_ativo(self):
        """Retorna True se o cliente está ativo"""
        return self.status == 'ativo'
