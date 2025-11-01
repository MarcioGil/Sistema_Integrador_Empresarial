from rest_framework import serializers
from .models import Estoque, MovimentacaoEstoque
from produtos.serializers import ProdutoListSerializer


class EstoqueSerializer(serializers.ModelSerializer):
    """Serializer para o model Estoque"""
    
    # Produto aninhado para leitura
    produto_detail = ProdutoListSerializer(source='produto', read_only=True)
    
    # Campos calculados
    quantidade = serializers.ReadOnlyField()
    data_atualizacao = serializers.ReadOnlyField()
    precisa_reposicao = serializers.ReadOnlyField()
    percentual_ocupacao = serializers.ReadOnlyField()
    status_estoque = serializers.ReadOnlyField()
    
    class Meta:
        model = Estoque
        fields = [
            'id',
            'produto',
            'produto_detail',
            'quantidade_atual',
            'quantidade',
            'quantidade_minima',
            'quantidade_maxima',
            'localizacao',
            'ultima_atualizacao',
            'data_atualizacao',
            'precisa_reposicao',
            'percentual_ocupacao',
            'status_estoque',
        ]
        read_only_fields = ['id', 'ultima_atualizacao']
    
    def validate(self, data):
        """Validações do estoque"""
        quantidade_minima = data.get('quantidade_minima', 0)
        quantidade_maxima = data.get('quantidade_maxima', 0)
        
        if quantidade_maxima > 0 and quantidade_minima > quantidade_maxima:
            raise serializers.ValidationError({
                'quantidade_minima': 'A quantidade mínima não pode ser maior que a máxima'
            })
        
        return data


class MovimentacaoEstoqueSerializer(serializers.ModelSerializer):
    """Serializer para o model MovimentacaoEstoque"""
    
    # Produto aninhado para leitura
    produto_detail = ProdutoListSerializer(source='produto', read_only=True)
    
    # Usuário para leitura
    usuario_nome = serializers.CharField(source='usuario.nome_completo', read_only=True)
    
    # Display values
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    motivo_display = serializers.CharField(source='get_motivo_display', read_only=True)
    
    class Meta:
        model = MovimentacaoEstoque
        fields = [
            'id',
            'produto',
            'produto_detail',
            'tipo',
            'tipo_display',
            'quantidade',
            'motivo',
            'motivo_display',
            'usuario',
            'usuario_nome',
            'data_movimentacao',
            'observacoes',
            'quantidade_anterior',
            'quantidade_posterior',
        ]
        read_only_fields = ['id', 'data_movimentacao', 'quantidade_anterior', 'quantidade_posterior']
    
    def validate_quantidade(self, value):
        """Validar quantidade positiva"""
        if value <= 0:
            raise serializers.ValidationError("A quantidade deve ser maior que zero")
        return value
    
    def validate(self, data):
        """Validações da movimentação"""
        # Validar que há estoque suficiente para saída
        if data.get('tipo') == 'saida':
            produto = data.get('produto')
            quantidade = data.get('quantidade', 0)
            
            try:
                estoque = Estoque.objects.get(produto=produto)
                if estoque.quantidade_atual < quantidade:
                    raise serializers.ValidationError({
                        'quantidade': f'Estoque insuficiente. Disponível: {estoque.quantidade_atual}'
                    })
            except Estoque.DoesNotExist:
                raise serializers.ValidationError({
                    'produto': 'Produto não possui estoque cadastrado'
                })
        
        return data


class MovimentacaoEstoqueCreateSerializer(serializers.ModelSerializer):
    """Serializer simplificado para criação de movimentações"""
    
    class Meta:
        model = MovimentacaoEstoque
        fields = [
            'produto',
            'tipo',
            'quantidade',
            'motivo',
            'usuario',
            'observacoes',
        ]
