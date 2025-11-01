from rest_framework import serializers
from .models import Categoria, Produto


class CategoriaSerializer(serializers.ModelSerializer):
    """Serializer para o model Categoria"""
    
    # Campos calculados
    caminho_completo = serializers.ReadOnlyField()
    ativa = serializers.ReadOnlyField()
    
    # Subcategorias aninhadas (opcional)
    subcategorias = serializers.SerializerMethodField()
    
    class Meta:
        model = Categoria
        fields = [
            'id',
            'nome',
            'descricao',
            'categoria_pai',
            'ativo',
            'ativa',
            'caminho_completo',
            'data_cadastro',
            'data_atualizacao',
            'subcategorias',
        ]
        read_only_fields = ['id', 'data_cadastro', 'data_atualizacao']
    
    def get_subcategorias(self, obj):
        """Retorna subcategorias da categoria"""
        if hasattr(obj, 'subcategorias'):
            subcats = obj.subcategorias.filter(ativo=True)
            return CategoriaListSerializer(subcats, many=True).data
        return []


class CategoriaListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de categorias"""
    
    categoria_pai_nome = serializers.CharField(source='categoria_pai.nome', read_only=True)
    
    class Meta:
        model = Categoria
        fields = ['id', 'nome', 'categoria_pai', 'categoria_pai_nome', 'ativo']


class ProdutoSerializer(serializers.ModelSerializer):
    """Serializer para o model Produto"""
    
    # Categoria aninhada para leitura
    categoria_detail = CategoriaListSerializer(source='categoria', read_only=True)
    
    # Campos calculados
    codigo_sku = serializers.ReadOnlyField()
    ativo = serializers.ReadOnlyField()
    lucro_unitario = serializers.ReadOnlyField()
    
    # Display values
    unidade_medida_display = serializers.CharField(source='get_unidade_medida_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Produto
        fields = [
            'id',
            'codigo',
            'codigo_sku',
            'nome',
            'descricao',
            'categoria',
            'categoria_detail',
            'preco_custo',
            'preco_venda',
            'margem_lucro',
            'lucro_unitario',
            'unidade_medida',
            'unidade_medida_display',
            'peso',
            'altura',
            'largura',
            'profundidade',
            'imagem',
            'status',
            'status_display',
            'ativo',
            'data_cadastro',
            'data_atualizacao',
        ]
        read_only_fields = ['id', 'margem_lucro', 'data_cadastro', 'data_atualizacao']
    
    def validate(self, data):
        """Validações do produto"""
        # Validar que preço de venda é maior que preço de custo
        preco_custo = data.get('preco_custo', None)
        preco_venda = data.get('preco_venda', None)
        
        if preco_custo and preco_venda:
            if preco_venda <= preco_custo:
                raise serializers.ValidationError({
                    'preco_venda': 'O preço de venda deve ser maior que o preço de custo'
                })
        
        return data


class ProdutoListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de produtos"""
    
    categoria_nome = serializers.CharField(source='categoria.nome', read_only=True)
    
    class Meta:
        model = Produto
        fields = [
            'id',
            'codigo',
            'nome',
            'categoria',
            'categoria_nome',
            'preco_venda',
            'margem_lucro',
            'unidade_medida',
            'status',
            'imagem',
        ]
