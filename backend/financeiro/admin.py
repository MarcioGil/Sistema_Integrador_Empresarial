from django.contrib import admin
from .models import Fatura, ContaReceber, ContaPagar


@admin.register(Fatura)
class FaturaAdmin(admin.ModelAdmin):
    list_display = ('numero_fatura', 'pedido', 'status', 'valor_total', 'data_emissao', 'data_vencimento')
    list_filter = ('status', 'data_emissao', 'data_vencimento')
    search_fields = ('numero_fatura', 'pedido__numero_pedido')
    readonly_fields = ('numero_fatura', 'valor_total', 'data_emissao', 'data_atualizacao', 'dias_vencimento')
    
    fieldsets = (
        ('Informações da Fatura', {
            'fields': ('numero_fatura', 'pedido', 'status')
        }),
        ('Valores', {
            'fields': ('valor_total',)
        }),
        ('Datas', {
            'fields': ('data_emissao', 'data_vencimento', 'data_pagamento', 'dias_vencimento', 'data_atualizacao')
        }),
        ('Observações', {
            'fields': ('observacoes',)
        }),
    )
    
    def dias_vencimento(self, obj):
        return obj.dias_vencimento
    dias_vencimento.short_description = 'Dias para Vencimento'


@admin.register(ContaReceber)
class ContaReceberAdmin(admin.ModelAdmin):
    list_display = ('descricao', 'cliente', 'valor', 'valor_recebido', 'status', 'data_vencimento', 'data_recebimento')
    list_filter = ('status', 'data_vencimento', 'data_recebimento')
    search_fields = ('descricao', 'cliente__nome_razao_social', 'numero_documento')
    readonly_fields = ('data_cadastro', 'data_atualizacao')
    
    fieldsets = (
        ('Informações da Conta', {
            'fields': ('descricao', 'cliente', 'fatura', 'numero_documento')
        }),
        ('Valores', {
            'fields': ('valor', 'valor_recebido', 'juros', 'multa', 'desconto')
        }),
        ('Status e Datas', {
            'fields': ('status', 'data_vencimento', 'data_recebimento')
        }),
        ('Forma de Pagamento', {
            'fields': ('forma_pagamento',)
        }),
        ('Observações', {
            'fields': ('observacoes', 'data_cadastro', 'data_atualizacao')
        }),
    )


@admin.register(ContaPagar)
class ContaPagarAdmin(admin.ModelAdmin):
    list_display = ('descricao', 'fornecedor', 'categoria', 'valor', 'valor_pago', 'status', 'data_vencimento', 'data_pagamento')
    list_filter = ('status', 'categoria', 'data_vencimento', 'data_pagamento')
    search_fields = ('descricao', 'fornecedor__razao_social', 'numero_documento')
    readonly_fields = ('data_cadastro', 'data_atualizacao')
    
    fieldsets = (
        ('Informações da Conta', {
            'fields': ('descricao', 'fornecedor', 'categoria', 'numero_documento')
        }),
        ('Valores', {
            'fields': ('valor', 'valor_pago', 'juros', 'multa', 'desconto')
        }),
        ('Status e Datas', {
            'fields': ('status', 'data_vencimento', 'data_pagamento')
        }),
        ('Forma de Pagamento', {
            'fields': ('forma_pagamento',)
        }),
        ('Observações', {
            'fields': ('observacoes', 'data_cadastro', 'data_atualizacao')
        }),
    )
