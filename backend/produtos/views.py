from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Categoria, Produto
from .serializers import (
    CategoriaSerializer,
    ProdutoSerializer,
    ProdutoListSerializer
)


class CategoriaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Categoria.
    """
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['ativa', 'categoria_pai']
    search_fields = ['nome', 'descricao']
    ordering_fields = ['nome', 'data_criacao']
    ordering = ['nome']


class ProdutoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Produto.
    """
    queryset = Produto.objects.select_related('categoria').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['categoria', 'ativo', 'unidade_medida']
    search_fields = ['nome', 'descricao', 'codigo_sku', 'codigo_barras']
    ordering_fields = ['nome', 'preco_venda', 'data_cadastro']
    ordering = ['nome']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProdutoListSerializer
        return ProdutoSerializer
