from django.contrib import admin
from .models import Fornecedor


@admin.register(Fornecedor)
class FornecedorAdmin(admin.ModelAdmin):
    list_display = ('razao_social', 'nome_fantasia', 'cnpj', 'email', 'telefone', 'ativo', 'data_cadastro')
    list_filter = ('status', 'data_cadastro')
    search_fields = ('nome', 'nome_fantasia', 'cnpj', 'email', 'telefone')
    readonly_fields = ('data_cadastro', 'data_atualizacao')
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('razao_social', 'nome_fantasia', 'cnpj', 'inscricao_estadual', 'inscricao_municipal')
        }),
        ('Contato', {
            'fields': ('email', 'telefone', 'celular', 'website', 'contato_principal')
        }),
        ('Endereço', {
            'fields': ('cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'estado')
        }),
        ('Informações Bancárias', {
            'fields': ('banco', 'agencia', 'conta', 'tipo_conta')
        }),
        ('Comercial', {
            'fields': ('prazo_entrega', 'condicoes_pagamento', 'ativo', 'observacoes')
        }),
        ('Datas', {
            'fields': ('data_cadastro', 'data_atualizacao')
        }),
    )
