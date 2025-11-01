from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from django.utils import timezone
from .models import Fatura, ContaReceber, ContaPagar
from .serializers import (
    FaturaSerializer,
    FaturaListSerializer,
    ContaReceberSerializer,
    ContaReceberListSerializer,
    ContaPagarSerializer,
    ContaPagarListSerializer
)


class FaturaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Fatura.
    """
    queryset = Fatura.objects.select_related('pedido__cliente').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['status', 'pedido']
    search_fields = ['numero_fatura', 'pedido__numero_pedido']
    ordering_fields = ['data_vencimento', 'valor_total']
    ordering = ['-data_emissao']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FaturaListSerializer
        return FaturaSerializer
    
    @action(detail=False, methods=['get'])
    def atrasadas(self, request):
        """Retorna faturas atrasadas"""
        faturas = self.queryset.filter(
            status__in=['pendente', 'parcial'],
            data_vencimento__lt=timezone.now().date()
        )
        serializer = self.get_serializer(faturas, many=True)
        return Response(serializer.data)


class ContaReceberViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Conta a Receber.
    """
    queryset = ContaReceber.objects.select_related('cliente', 'fatura').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['status', 'cliente', 'forma_pagamento']
    search_fields = ['descricao', 'numero_documento', 'cliente__nome_completo']
    ordering_fields = ['data_vencimento', 'valor']
    ordering = ['-data_cadastro']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ContaReceberListSerializer
        return ContaReceberSerializer
    
    @action(detail=True, methods=['post'])
    def receber(self, request, pk=None):
        """Marca conta como recebida"""
        conta = self.get_object()
        if conta.status == 'recebido':
            return Response(
                {'error': 'Conta já foi recebida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        valor_recebido = request.data.get('valor_recebido', conta.valor)
        conta.valor_recebido = valor_recebido
        conta.data_recebimento = timezone.now().date()
        conta.status = 'recebido'
        conta.save()
        
        serializer = self.get_serializer(conta)
        return Response(serializer.data)


class ContaPagarViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Conta a Pagar.
    """
    queryset = ContaPagar.objects.select_related('fornecedor').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['status', 'fornecedor', 'categoria', 'forma_pagamento']
    search_fields = ['descricao', 'numero_documento', 'fornecedor__nome']
    ordering_fields = ['data_vencimento', 'valor']
    ordering = ['-data_cadastro']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ContaPagarListSerializer
        return ContaPagarSerializer
    
    @action(detail=True, methods=['post'])
    def pagar(self, request, pk=None):
        """Marca conta como paga"""
        conta = self.get_object()
        if conta.status == 'pago':
            return Response(
                {'error': 'Conta já foi paga'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        valor_pago = request.data.get('valor_pago', conta.valor)
        conta.valor_pago = valor_pago
        conta.data_pagamento = timezone.now().date()
        conta.status = 'pago'
        conta.save()
        
        serializer = self.get_serializer(conta)
        return Response(serializer.data)
