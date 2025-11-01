from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Fornecedor
from .serializers import FornecedorSerializer, FornecedorListSerializer


class FornecedorViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Fornecedor.
    """
    queryset = Fornecedor.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['ativo', 'categoria', 'cidade', 'estado']
    search_fields = ['nome', 'razao_social', 'cnpj', 'email', 'telefone']
    ordering_fields = ['nome', 'avaliacao', 'data_cadastro']
    ordering = ['nome']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FornecedorListSerializer
        return FornecedorSerializer
