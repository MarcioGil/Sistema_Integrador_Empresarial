from django.contrib import admin
from .models import Categoria, Produto


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'categoria_pai', 'ativa', 'data_cadastro')
    list_filter = ('ativo', 'data_cadastro')
    search_fields = ('nome', 'descricao')
    readonly_fields = ('data_cadastro', 'data_atualizacao')


@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'codigo_sku', 'categoria', 'preco_venda', 'margem_lucro', 'unidade_medida', 'ativo', 'data_cadastro')
    list_filter = ('categoria', 'status', 'unidade_medida', 'data_cadastro')
    search_fields = ('nome', 'codigo', 'descricao')
    readonly_fields = ('margem_lucro', 'data_cadastro', 'data_atualizacao')
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('nome', 'codigo_sku', 'codigo_barras', 'categoria', 'descricao')
        }),
        ('Precificação', {
            'fields': ('preco_custo', 'preco_venda', 'margem_lucro')
        }),
        ('Medidas e Peso', {
            'fields': ('unidade_medida', 'peso', 'altura', 'largura', 'comprimento')
        }),
        ('Imagem', {
            'fields': ('imagem',)
        }),
        ('Status', {
            'fields': ('ativo', 'data_cadastro', 'data_atualizacao')
        }),
    )
