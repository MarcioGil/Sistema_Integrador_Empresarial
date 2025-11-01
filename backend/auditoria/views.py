from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import LogAuditoria
from .serializers import LogAuditoriaSerializer, LogAuditoriaListSerializer


class LogAuditoriaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet read-only para consulta de Logs de Auditoria.
    Apenas administradores podem visualizar logs.
    """
    queryset = LogAuditoria.objects.select_related('usuario').all()
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['acao', 'modelo', 'usuario']
    search_fields = ['objeto_repr', 'modelo']
    ordering_fields = ['timestamp']
    ordering = ['-timestamp']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return LogAuditoriaListSerializer
        return LogAuditoriaSerializer
