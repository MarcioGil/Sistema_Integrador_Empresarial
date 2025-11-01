from django.contrib import admin
from .models import LogAuditoria


@admin.register(LogAuditoria)
class LogAuditoriaAdmin(admin.ModelAdmin):
    list_display = ('usuario', 'acao', 'tabela', 'registro_id', 'ip_address', 'data_hora')
    list_filter = ('acao', 'tabela', 'data_hora')
    search_fields = ('usuario__username', 'usuario__nome_completo', 'tabela', 'registro_id', 'ip_address')
    readonly_fields = ('usuario', 'acao', 'tabela', 'registro_id', 'dados_anteriores', 'dados_novos', 
                      'ip_address', 'user_agent', 'data_hora')
    
    def has_add_permission(self, request):
        # Logs de auditoria não devem ser criados manualmente
        return False
    
    def has_change_permission(self, request, obj=None):
        # Logs de auditoria não devem ser editados
        return False
    
    def has_delete_permission(self, request, obj=None):
        # Logs de auditoria não devem ser deletados
        return False
