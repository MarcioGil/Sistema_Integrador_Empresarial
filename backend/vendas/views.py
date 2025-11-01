from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Pedido, ItemPedido
from .serializers import (
    PedidoSerializer,
    PedidoCreateSerializer,
    PedidoListSerializer,
    ItemPedidoSerializer
)


class PedidoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Pedido.
    """
    queryset = Pedido.objects.select_related(
        'cliente', 'vendedor'
    ).prefetch_related('itens__produto').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['status', 'cliente', 'vendedor', 'forma_pagamento']
    search_fields = ['numero_pedido', 'cliente__nome_completo', 'observacoes']
    ordering_fields = ['data_pedido', 'valor_total', 'status']
    ordering = ['-data_pedido']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PedidoCreateSerializer
        elif self.action == 'list':
            return PedidoListSerializer
        return PedidoSerializer
    
    def perform_create(self, serializer):
        """Adiciona o vendedor automaticamente se não informado"""
        if 'vendedor' not in serializer.validated_data:
            serializer.save(vendedor=self.request.user)
        else:
            serializer.save()
    
    @action(detail=True, methods=['post'])
    def confirmar(self, request, pk=None):
        """Confirma o pedido"""
        pedido = self.get_object()
        if pedido.status != 'pendente':
            return Response(
                {'error': 'Apenas pedidos pendentes podem ser confirmados'},
                status=status.HTTP_400_BAD_REQUEST
            )
        pedido.status = 'confirmado'
        pedido.save()
        return Response({'status': 'Pedido confirmado'})
    
    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):
        """Cancela o pedido"""
        pedido = self.get_object()
        if pedido.status in ['entregue', 'cancelado']:
            return Response(
                {'error': 'Pedido não pode ser cancelado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        pedido.status = 'cancelado'
        pedido.save()
        return Response({'status': 'Pedido cancelado'})


class ItemPedidoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet read-only para ItemPedido (gerenciado via Pedido).
    """
    queryset = ItemPedido.objects.select_related('pedido', 'produto').all()
    serializer_class = ItemPedidoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    
    filterset_fields = ['pedido', 'produto']
    search_fields = ['produto__nome']
