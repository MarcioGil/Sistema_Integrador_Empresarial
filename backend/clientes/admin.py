from django.contrib import admin
from .models import Cliente


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('nome_razao_social', 'tipo', 'cpf_cnpj', 'email', 'telefone', 'status', 'data_cadastro')
    list_filter = ('tipo', 'status', 'data_cadastro')
    search_fields = ('nome_razao_social', 'cpf_cnpj', 'email', 'telefone')
    readonly_fields = ('data_cadastro', 'data_atualizacao')
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('tipo', 'nome_razao_social', 'cpf_cnpj', 'inscricao_estadual')
        }),
        ('Contato', {
            'fields': ('email', 'telefone', 'celular', 'website')
        }),
        ('Endereço', {
            'fields': ('cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado')
        }),
        ('Informações Comerciais', {
            'fields': ('limite_credito', 'status', 'observacoes')
        }),
        ('Datas', {
            'fields': ('data_cadastro', 'data_atualizacao')
        }),
    )
