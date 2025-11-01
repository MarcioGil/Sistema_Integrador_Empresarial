from rest_framework import serializers
from .models import Fatura, ContaReceber, ContaPagar
from vendas.serializers import PedidoListSerializer
from clientes.serializers import ClienteListSerializer
from fornecedores.serializers import FornecedorListSerializer


class FaturaSerializer(serializers.ModelSerializer):
    """Serializer para o model Fatura"""
    
    # Pedido aninhado para leitura
    pedido_detail = PedidoListSerializer(source='pedido', read_only=True)
    
    # Campos calculados
    dias_vencimento = serializers.ReadOnlyField()
    is_atrasado = serializers.ReadOnlyField()
    
    # Display values
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Fatura
        fields = [
            'id',
            'numero_fatura',
            'pedido',
            'pedido_detail',
            'valor_total',
            'valor_pago',
            'data_emissao',
            'data_vencimento',
            'data_pagamento',
            'status',
            'status_display',
            'observacoes',
            'data_atualizacao',
            'dias_vencimento',
            'is_atrasado',
        ]
        read_only_fields = [
            'id',
            'numero_fatura',
            'valor_total',
            'data_emissao',
            'data_atualizacao',
        ]
    
    def validate(self, data):
        """Validações da fatura"""
        # Validar que valor pago não é maior que valor total
        valor_pago = data.get('valor_pago', 0)
        
        if self.instance:
            valor_total = self.instance.valor_total
            if valor_pago > valor_total:
                raise serializers.ValidationError({
                    'valor_pago': f'O valor pago não pode ser maior que o valor total ({valor_total})'
                })
        
        return data


class ContaReceberSerializer(serializers.ModelSerializer):
    """Serializer para o model ContaReceber"""
    
    # Relacionamentos aninhados para leitura
    cliente_detail = ClienteListSerializer(source='cliente', read_only=True)
    fatura_numero = serializers.CharField(source='fatura.numero_fatura', read_only=True)
    
    # Campos calculados
    is_atrasado = serializers.ReadOnlyField()
    
    # Display values
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ContaReceber
        fields = [
            'id',
            'descricao',
            'cliente',
            'cliente_detail',
            'fatura',
            'fatura_numero',
            'numero_documento',
            'valor',
            'valor_recebido',
            'juros',
            'multa',
            'desconto',
            'data_vencimento',
            'data_recebimento',
            'forma_pagamento',
            'status',
            'status_display',
            'observacoes',
            'data_cadastro',
            'data_atualizacao',
            'is_atrasado',
        ]
        read_only_fields = ['id', 'data_cadastro', 'data_atualizacao']
    
    def validate(self, data):
        """Validações da conta a receber"""
        # Validar que valor recebido não é maior que valor total
        valor = data.get('valor')
        valor_recebido = data.get('valor_recebido', 0)
        
        if self.instance:
            valor = valor or self.instance.valor
        
        if valor and valor_recebido > valor:
            raise serializers.ValidationError({
                'valor_recebido': f'O valor recebido não pode ser maior que o valor da conta ({valor})'
            })
        
        return data


class ContaPagarSerializer(serializers.ModelSerializer):
    """Serializer para o model ContaPagar"""
    
    # Fornecedor aninhado para leitura
    fornecedor_detail = FornecedorListSerializer(source='fornecedor', read_only=True)
    
    # Campos calculados
    is_atrasado = serializers.ReadOnlyField()
    
    # Display values
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    categoria_display = serializers.CharField(source='get_categoria_display', read_only=True)
    
    class Meta:
        model = ContaPagar
        fields = [
            'id',
            'descricao',
            'fornecedor',
            'fornecedor_detail',
            'numero_documento',
            'valor',
            'valor_pago',
            'juros',
            'multa',
            'desconto',
            'data_vencimento',
            'data_pagamento',
            'forma_pagamento',
            'status',
            'status_display',
            'categoria',
            'categoria_display',
            'observacoes',
            'data_cadastro',
            'data_atualizacao',
            'is_atrasado',
        ]
        read_only_fields = ['id', 'data_cadastro', 'data_atualizacao']
    
    def validate(self, data):
        """Validações da conta a pagar"""
        # Validar que valor pago não é maior que valor total
        valor = data.get('valor')
        valor_pago = data.get('valor_pago', 0)
        
        if self.instance:
            valor = valor or self.instance.valor
        
        if valor and valor_pago > valor:
            raise serializers.ValidationError({
                'valor_pago': f'O valor pago não pode ser maior que o valor da conta ({valor})'
            })
        
        return data


class FaturaListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de faturas"""
    
    pedido_numero = serializers.CharField(source='pedido.numero_pedido', read_only=True)
    cliente_nome = serializers.CharField(source='pedido.cliente.nome_completo', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Fatura
        fields = [
            'id',
            'numero_fatura',
            'pedido_numero',
            'cliente_nome',
            'valor_total',
            'valor_pago',
            'data_vencimento',
            'status',
            'status_display',
        ]


class ContaReceberListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de contas a receber"""
    
    cliente_nome = serializers.CharField(source='cliente.nome_completo', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = ContaReceber
        fields = [
            'id',
            'descricao',
            'cliente_nome',
            'valor',
            'valor_recebido',
            'data_vencimento',
            'status',
            'status_display',
        ]


class ContaPagarListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de contas a pagar"""
    
    fornecedor_nome = serializers.CharField(source='fornecedor.nome', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    categoria_display = serializers.CharField(source='get_categoria_display', read_only=True)
    
    class Meta:
        model = ContaPagar
        fields = [
            'id',
            'descricao',
            'fornecedor_nome',
            'valor',
            'valor_pago',
            'data_vencimento',
            'categoria',
            'categoria_display',
            'status',
            'status_display',
        ]
