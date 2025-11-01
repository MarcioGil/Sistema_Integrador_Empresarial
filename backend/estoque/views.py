from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Estoque, MovimentacaoEstoque
from .serializers import (
    EstoqueSerializer,
    MovimentacaoEstoqueSerializer,
    MovimentacaoEstoqueCreateSerializer
)


class EstoqueViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Estoque.
    """
    queryset = Estoque.objects.select_related('produto').all()
    serializer_class = EstoqueSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['produto']
    search_fields = ['produto__nome', 'produto__codigo_sku', 'localizacao']
    ordering_fields = ['quantidade_atual', 'data_atualizacao']
    ordering = ['produto__nome']
    
    @action(detail=False, methods=['get'])
    def necessita_reposicao(self, request):
        """Retorna produtos que precisam de reposição"""
        estoques = self.queryset.filter(
            quantidade_atual__lte=models.F('quantidade_minima')
        )
        serializer = self.get_serializer(estoques, many=True)
        return Response(serializer.data)


class MovimentacaoEstoqueViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações de Movimentação de Estoque.
    """
    queryset = MovimentacaoEstoque.objects.select_related(
        'produto', 'usuario'
    ).all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['produto', 'tipo_movimentacao', 'usuario']
    search_fields = ['produto__nome', 'observacao']
    ordering_fields = ['data_movimentacao']
    ordering = ['-data_movimentacao']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return MovimentacaoEstoqueCreateSerializer
        return MovimentacaoEstoqueSerializer
    
    def perform_create(self, serializer):
        """Adiciona o usuário logado automaticamente"""
        serializer.save(usuario=self.request.user)
