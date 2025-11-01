from rest_framework import serializers
from .models import Fornecedor


class FornecedorSerializer(serializers.ModelSerializer):
    """Serializer para o model Fornecedor"""
    
    # Campos calculados
    razao_social = serializers.ReadOnlyField()
    ativo = serializers.ReadOnlyField()
    is_ativo = serializers.ReadOnlyField()
    
    # Display values
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    avaliacao_display = serializers.CharField(source='get_avaliacao_display', read_only=True)
    
    class Meta:
        model = Fornecedor
        fields = [
            'id',
            'nome',
            'razao_social',
            'nome_fantasia',
            'cnpj',
            'inscricao_estadual',
            'email',
            'telefone',
            'celular',
            'site',
            'contato_nome',
            'contato_cargo',
            'contato_telefone',
            'contato_email',
            'endereco',
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'estado',
            'cep',
            'banco',
            'agencia',
            'conta',
            'pix',
            'prazo_entrega_dias',
            'prazo_pagamento_dias',
            'status',
            'status_display',
            'ativo',
            'is_ativo',
            'avaliacao',
            'avaliacao_display',
            'observacoes',
            'data_cadastro',
            'data_atualizacao',
        ]
        read_only_fields = ['id', 'data_cadastro', 'data_atualizacao']
    
    def validate_cnpj(self, value):
        """Validação adicional para CNPJ"""
        apenas_numeros = ''.join(filter(str.isdigit, value))
        
        if len(apenas_numeros) != 14:
            raise serializers.ValidationError("CNPJ deve ter 14 dígitos")
        
        if len(set(apenas_numeros)) == 1:
            raise serializers.ValidationError("CNPJ inválido")
        
        return value
    
    def validate_avaliacao(self, value):
        """Validar avaliação entre 0 e 5"""
        if value < 0 or value > 5:
            raise serializers.ValidationError("A avaliação deve estar entre 0 e 5")
        return value


class FornecedorListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de fornecedores"""
    
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Fornecedor
        fields = [
            'id',
            'nome',
            'nome_fantasia',
            'cnpj',
            'email',
            'telefone',
            'status',
            'status_display',
            'avaliacao',
            'cidade',
            'estado',
            'data_cadastro',
        ]
