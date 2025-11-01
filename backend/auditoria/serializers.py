from rest_framework import serializers
from .models import LogAuditoria
from usuarios.serializers import UsuarioListSerializer


class LogAuditoriaSerializer(serializers.ModelSerializer):
    """Serializer para o model LogAuditoria (read-only)"""
    
    # Usuario aninhado para leitura
    usuario_detail = UsuarioListSerializer(source='usuario', read_only=True)
    
    # Display values
    acao_display = serializers.CharField(source='get_acao_display', read_only=True)
    modelo_display = serializers.SerializerMethodField()
    
    class Meta:
        model = LogAuditoria
        fields = [
            'id',
            'usuario',
            'usuario_detail',
            'acao',
            'acao_display',
            'modelo',
            'modelo_display',
            'objeto_id',
            'objeto_repr',
            'dados_anteriores',
            'dados_novos',
            'ip_address',
            'user_agent',
            'timestamp',
        ]
        read_only_fields = '__all__'  # Todos os campos são read-only
    
    def get_modelo_display(self, obj):
        """Retornar nome amigável do modelo"""
        if obj.modelo:
            return obj.modelo.split('.')[-1].capitalize()
        return None


class LogAuditoriaListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de logs"""
    
    usuario_nome = serializers.CharField(source='usuario.nome_completo', read_only=True)
    acao_display = serializers.CharField(source='get_acao_display', read_only=True)
    modelo_display = serializers.SerializerMethodField()
    
    class Meta:
        model = LogAuditoria
        fields = [
            'id',
            'usuario_nome',
            'acao',
            'acao_display',
            'modelo',
            'modelo_display',
            'objeto_repr',
            'timestamp',
        ]
        read_only_fields = '__all__'
    
    def get_modelo_display(self, obj):
        """Retornar nome amigável do modelo"""
        if obj.modelo:
            return obj.modelo.split('.')[-1].capitalize()
        return None
