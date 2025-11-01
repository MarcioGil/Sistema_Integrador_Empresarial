from django.contrib import admin
from .models import Estoque, MovimentacaoEstoque


@admin.register(Estoque)
class EstoqueAdmin(admin.ModelAdmin):
    list_display = ('produto', 'quantidade', 'quantidade_minima', 'quantidade_maxima', 'precisa_reposicao', 'status_estoque', 'localizacao')
    list_filter = ('localizacao', 'ultima_atualizacao')
    search_fields = ('produto__nome', 'produto__codigo', 'localizacao')
    readonly_fields = ('ultima_atualizacao',)
    
    def precisa_reposicao(self, obj):
        return obj.precisa_reposicao
    precisa_reposicao.boolean = True
    precisa_reposicao.short_description = 'Precisa Reposição'
    
    def status_estoque(self, obj):
        return obj.status_estoque
    status_estoque.short_description = 'Status'


@admin.register(MovimentacaoEstoque)
class MovimentacaoEstoqueAdmin(admin.ModelAdmin):
    list_display = ('produto', 'tipo', 'quantidade', 'motivo', 'usuario', 'data_movimentacao')
    list_filter = ('tipo', 'motivo', 'data_movimentacao')
    search_fields = ('produto__nome', 'produto__codigo_sku', 'observacoes')
    readonly_fields = ('quantidade_anterior', 'quantidade_posterior', 'data_movimentacao')
    
    fieldsets = (
        ('Movimentação', {
            'fields': ('produto', 'tipo', 'quantidade', 'motivo', 'usuario')
        }),
        ('Quantidades', {
            'fields': ('quantidade_anterior', 'quantidade_posterior')
        }),
        ('Detalhes', {
            'fields': ('observacoes', 'data_movimentacao')
        }),
    )
