from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import Cliente
from .serializers import ClienteSerializer, ClienteListSerializer


class ClienteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Cliente.
    
    Endpoints:
    - GET /api/clientes/ - Lista todos os clientes
    - POST /api/clientes/ - Cria um novo cliente
    - GET /api/clientes/{id}/ - Retorna um cliente específico
    - PUT /api/clientes/{id}/ - Atualiza um cliente
    - PATCH /api/clientes/{id}/ - Atualiza parcialmente um cliente
    - DELETE /api/clientes/{id}/ - Remove um cliente
    """
    queryset = Cliente.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Filtros
    filterset_fields = ['tipo', 'ativo', 'cidade', 'estado']
    
    # Busca
    search_fields = ['nome_completo', 'razao_social', 'cpf', 'cnpj', 'email', 'telefone']
    
    # Ordenação
    ordering_fields = ['nome_completo', 'razao_social', 'data_cadastro']
    ordering = ['-data_cadastro']
    
    def get_serializer_class(self):
        """Retorna serializer apropriado baseado na action"""
        if self.action == 'list':
            return ClienteListSerializer
        return ClienteSerializer
