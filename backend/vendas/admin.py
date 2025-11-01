from django.contrib import admin
from .models import Pedido, ItemPedido


class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 1
    readonly_fields = ('valor_total',)
    fields = ('produto', 'quantidade', 'preco_unitario', 'desconto', 'valor_total')


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ('numero_pedido', 'cliente', 'status', 'valor_total', 'data_pedido', 'data_entrega_prevista')
    list_filter = ('status', 'data_pedido', 'data_entrega_prevista')
    search_fields = ('numero_pedido', 'cliente__nome_razao_social')
    readonly_fields = ('numero_pedido', 'subtotal', 'valor_frete', 'valor_desconto', 'valor_total', 'data_pedido', 'data_atualizacao')
    inlines = [ItemPedidoInline]
    
    fieldsets = (
        ('Informações do Pedido', {
            'fields': ('numero_pedido', 'cliente', 'status', 'vendedor')
        }),
        ('Datas', {
            'fields': ('data_pedido', 'data_entrega_prevista', 'data_entrega', 'data_atualizacao')
        }),
        ('Valores', {
            'fields': ('subtotal', 'valor_frete', 'valor_desconto', 'valor_total')
        }),
        ('Endereço de Entrega', {
            'fields': ('endereco_entrega_cep', 'endereco_entrega_logradouro', 'endereco_entrega_numero', 
                      'endereco_entrega_complemento', 'endereco_entrega_bairro', 'endereco_entrega_cidade', 
                      'endereco_entrega_estado')
        }),
        ('Observações', {
            'fields': ('observacoes',)
        }),
    )


@admin.register(ItemPedido)
class ItemPedidoAdmin(admin.ModelAdmin):
    list_display = ('pedido', 'produto', 'quantidade', 'preco_unitario', 'desconto', 'valor_total')
    list_filter = ('pedido__data_pedido',)
    search_fields = ('pedido__numero_pedido', 'produto__nome')
    readonly_fields = ('valor_total',)
