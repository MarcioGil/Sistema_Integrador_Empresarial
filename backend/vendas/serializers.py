from rest_framework import serializers
from .models import Pedido, ItemPedido
from clientes.serializers import ClienteListSerializer
from produtos.serializers import ProdutoListSerializer


class ItemPedidoSerializer(serializers.ModelSerializer):
    """Serializer para o model ItemPedido"""
    
    # Produto aninhado para leitura
    produto_detail = ProdutoListSerializer(source='produto', read_only=True)
    
    class Meta:
        model = ItemPedido
        fields = [
            'id',
            'produto',
            'produto_detail',
            'quantidade',
            'preco_unitario',
            'desconto',
            'valor_total',
        ]
        read_only_fields = ['id', 'valor_total']
    
    def validate_quantidade(self, value):
        """Validar quantidade positiva"""
        if value <= 0:
            raise serializers.ValidationError("A quantidade deve ser maior que zero")
        return value


class PedidoSerializer(serializers.ModelSerializer):
    """Serializer para o model Pedido"""
    
    # Cliente aninhado para leitura
    cliente_detail = ClienteListSerializer(source='cliente', read_only=True)
    
    # Vendedor para leitura
    vendedor_nome = serializers.CharField(source='vendedor.nome_completo', read_only=True)
    
    # Itens do pedido (nested)
    itens = ItemPedidoSerializer(many=True, read_only=True)
    
    # Campos calculados
    subtotal = serializers.ReadOnlyField()
    quantidade_itens = serializers.ReadOnlyField()
    
    # Display values
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    forma_pagamento_display = serializers.CharField(source='get_forma_pagamento_display', read_only=True)
    
    class Meta:
        model = Pedido
        fields = [
            'id',
            'numero_pedido',
            'cliente',
            'cliente_detail',
            'vendedor',
            'vendedor_nome',
            'data_pedido',
            'data_entrega_prevista',
            'data_entrega_realizada',
            'status',
            'status_display',
            'valor_subtotal',
            'subtotal',
            'valor_desconto',
            'valor_frete',
            'valor_total',
            'forma_pagamento',
            'forma_pagamento_display',
            'observacoes',
            'data_atualizacao',
            'itens',
            'quantidade_itens',
        ]
        read_only_fields = [
            'id',
            'numero_pedido',
            'data_pedido',
            'valor_subtotal',
            'valor_total',
            'data_atualizacao',
        ]
    
    def validate(self, data):
        """Validações do pedido"""
        # Validar que data de entrega prevista é futura
        from django.utils import timezone
        data_entrega = data.get('data_entrega_prevista')
        
        if data_entrega and data_entrega < timezone.now().date():
            raise serializers.ValidationError({
                'data_entrega_prevista': 'A data de entrega deve ser futura'
            })
        
        return data


class PedidoCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de pedido com itens"""
    
    itens = ItemPedidoSerializer(many=True)
    
    class Meta:
        model = Pedido
        fields = [
            'cliente',
            'vendedor',
            'data_entrega_prevista',
            'valor_desconto',
            'valor_frete',
            'forma_pagamento',
            'observacoes',
            'itens',
        ]
    
    def create(self, validated_data):
        """Criar pedido com itens"""
        itens_data = validated_data.pop('itens')
        pedido = Pedido.objects.create(**validated_data)
        
        for item_data in itens_data:
            ItemPedido.objects.create(pedido=pedido, **item_data)
        
        # Recalcular totais
        pedido.calcular_totais()
        
        return pedido


class PedidoListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de pedidos"""
    
    cliente_nome = serializers.CharField(source='cliente.nome_completo', read_only=True)
    vendedor_nome = serializers.CharField(source='vendedor.nome_completo', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Pedido
        fields = [
            'id',
            'numero_pedido',
            'cliente',
            'cliente_nome',
            'vendedor',
            'vendedor_nome',
            'data_pedido',
            'status',
            'status_display',
            'valor_total',
        ]
