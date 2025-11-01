from django.db import models
from django.contrib.auth.models import AbstractUser


class Departamento(models.Model):
    """Model para departamentos da empresa"""
    
    nome = models.CharField('Nome', max_length=100, unique=True)
    sigla = models.CharField('Sigla', max_length=10, unique=True)
    descricao = models.TextField('Descrição', blank=True, null=True)
    responsavel = models.ForeignKey(
        'Usuario',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='departamentos_responsavel',
        verbose_name='Responsável'
    )
    email = models.EmailField('E-mail', blank=True, null=True)
    ramal = models.CharField('Ramal', max_length=10, blank=True, null=True)
    ativo = models.BooleanField('Ativo', default=True)
    data_criacao = models.DateTimeField('Data de Criação', auto_now_add=True)
    data_modificacao = models.DateTimeField('Data de Modificação', auto_now=True)
    
    class Meta:
        verbose_name = 'Departamento'
        verbose_name_plural = 'Departamentos'
        ordering = ['nome']
    
    def __str__(self):
        return self.nome
    
    @property
    def data_cadastro(self):
        """Alias para data_criacao (compatibilidade admin)"""
        return self.data_criacao
    
    @property
    def data_atualizacao(self):
        """Alias para data_modificacao (compatibilidade admin)"""
        return self.data_modificacao


class Usuario(AbstractUser):
    """Model customizado de usuário estendendo AbstractUser"""
    
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
        ('ferias', 'Férias'),
        ('afastado', 'Afastado'),
    ]
    
    # Campos adicionais
    nome_completo = models.CharField('Nome Completo', max_length=200)
    cpf = models.CharField('CPF', max_length=14, unique=True, null=True, blank=True)
    telefone = models.CharField('Telefone', max_length=20, blank=True, null=True)
    celular = models.CharField('Celular', max_length=20, blank=True, null=True)
    
    # Profissional
    departamento = models.ForeignKey(
        Departamento,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='usuarios',
        verbose_name='Departamento'
    )
    cargo = models.CharField('Cargo', max_length=100, blank=True, null=True)
    data_admissao = models.DateField('Data de Admissão', null=True, blank=True)
    data_demissao = models.DateField('Data de Demissão', null=True, blank=True)
    salario = models.DecimalField(
        'Salário',
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    
    # Status
    status = models.CharField('Status', max_length=10, choices=STATUS_CHOICES, default='ativo')
    
    # Foto
    foto = models.ImageField(
        'Foto',
        upload_to='usuarios/%Y/%m/',
        null=True,
        blank=True
    )
    
    # Informações adicionais
    observacoes = models.TextField('Observações', blank=True, null=True)
    data_atualizacao = models.DateTimeField('Data de Atualização', auto_now=True)
    
    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering = ['nome_completo']
    
    def __str__(self):
        return f"{self.nome_completo} ({self.username})"
    
    @property
    def is_ativo_trabalho(self):
        """Verifica se o usuário está ativo para trabalhar"""
        return self.status == 'ativo' and self.is_active
    
    def save(self, *args, **kwargs):
        """Atualiza is_active baseado no status"""
        if self.status == 'inativo':
            self.is_active = False
        super().save(*args, **kwargs)
