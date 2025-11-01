from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Usuario, Departamento
from .serializers import (
    UsuarioSerializer,
    UsuarioListSerializer,
    UsuarioCreateSerializer,
    DepartamentoSerializer
)


class DepartamentoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Departamento.
    """
    queryset = Departamento.objects.all()
    serializer_class = DepartamentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['ativo']
    search_fields = ['nome', 'sigla', 'responsavel']
    ordering_fields = ['nome', 'data_criacao']
    ordering = ['nome']


class UsuarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para operações CRUD de Usuario.
    """
    queryset = Usuario.objects.select_related('departamento').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['tipo', 'departamento', 'is_active', 'is_staff']
    search_fields = ['username', 'first_name', 'last_name', 'email', 'cpf']
    ordering_fields = ['username', 'data_cadastro', 'last_login']
    ordering = ['username']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioCreateSerializer
        elif self.action == 'list':
            return UsuarioListSerializer
        return UsuarioSerializer
    
    def get_permissions(self):
        """Apenas admins podem criar/deletar usuários"""
        if self.action in ['create', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        """Retorna dados do usuário logado"""
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def alterar_senha(self, request, pk=None):
        """Altera a senha do usuário"""
        usuario = self.get_object()
        
        # Apenas o próprio usuário ou admin pode alterar senha
        if usuario != request.user and not request.user.is_staff:
            return Response(
                {'error': 'Sem permissão'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        senha_nova = request.data.get('senha_nova')
        if not senha_nova:
            return Response(
                {'error': 'senha_nova é obrigatória'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        usuario.set_password(senha_nova)
        usuario.save()
        
        return Response({'status': 'Senha alterada com sucesso'})
