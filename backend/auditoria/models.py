from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class LogAuditoria(models.Model):
    """Model para registrar logs de auditoria do sistema"""
    
    ACAO_CHOICES = [
        ('criar', 'Criar'),
        ('editar', 'Editar'),
        ('excluir', 'Excluir'),
        ('visualizar', 'Visualizar'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('exportar', 'Exportar'),
        ('importar', 'Importar'),
    ]
    
    usuario = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='logs_auditoria',
        verbose_name='Usuário'
    )
    acao = models.CharField('Ação', max_length=15, choices=ACAO_CHOICES)
    tabela = models.CharField('Tabela', max_length=100)
    registro_id = models.IntegerField('ID do Registro', null=True, blank=True)
    
    # Dados JSON para armazenar o estado anterior e novo
    dados_anteriores = models.JSONField('Dados Anteriores', null=True, blank=True)
    dados_novos = models.JSONField('Dados Novos', null=True, blank=True)
    
    # Informações técnicas
    ip_address = models.GenericIPAddressField('Endereço IP', null=True, blank=True)
    user_agent = models.TextField('User Agent', blank=True, null=True)
    
    # Data e hora
    data_hora = models.DateTimeField('Data e Hora', auto_now_add=True)
    
    class Meta:
        verbose_name = 'Log de Auditoria'
        verbose_name_plural = 'Logs de Auditoria'
        ordering = ['-data_hora']
        indexes = [
            models.Index(fields=['usuario', '-data_hora']),
            models.Index(fields=['tabela', '-data_hora']),
            models.Index(fields=['acao']),
            models.Index(fields=['-data_hora']),
        ]
    
    def __str__(self):
        usuario_nome = self.usuario.username if self.usuario else 'Sistema'
        return f"{usuario_nome} - {self.get_acao_display()} - {self.tabela} - {self.data_hora.strftime('%d/%m/%Y %H:%M')}"
    
    @classmethod
    def registrar(cls, usuario, acao, tabela, registro_id=None, dados_anteriores=None, dados_novos=None, ip_address=None, user_agent=None):
        """Método helper para registrar logs de auditoria"""
        return cls.objects.create(
            usuario=usuario,
            acao=acao,
            tabela=tabela,
            registro_id=registro_id,
            dados_anteriores=dados_anteriores,
            dados_novos=dados_novos,
            ip_address=ip_address,
            user_agent=user_agent
        )
