from rest_framework import serializers
from .models import Cliente


class ClienteSerializer(serializers.ModelSerializer):
    """Serializer para o model Cliente"""
    
    # Campos read-only calculados
    nome_razao_social = serializers.ReadOnlyField()
    is_pessoa_fisica = serializers.ReadOnlyField()
    is_ativo = serializers.ReadOnlyField()
    
    class Meta:
        model = Cliente
        fields = [
            'id',
            'nome_completo',
            'nome_razao_social',
            'cpf_cnpj',
            'email',
            'telefone',
            'celular',
            'website',
            'tipo',
            'status',
            'endereco',
            'numero',
            'complemento',
            'bairro',
            'cidade',
            'estado',
            'cep',
            'inscricao_estadual',
            'limite_credito',
            'observacoes',
            'data_cadastro',
            'data_atualizacao',
            'is_pessoa_fisica',
            'is_ativo',
        ]
        read_only_fields = ['id', 'data_cadastro', 'data_atualizacao']
    
    def validate_cpf_cnpj(self, value):
        """Validação adicional para CPF/CNPJ"""
        # Remove caracteres especiais para validação
        apenas_numeros = ''.join(filter(str.isdigit, value))
        
        if len(apenas_numeros) == 11:  # CPF
            if len(set(apenas_numeros)) == 1:
                raise serializers.ValidationError("CPF inválido")
        elif len(apenas_numeros) == 14:  # CNPJ
            if len(set(apenas_numeros)) == 1:
                raise serializers.ValidationError("CNPJ inválido")
        else:
            raise serializers.ValidationError("CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos")
        
        return value
    
    def validate(self, data):
        """Validação geral do serializer"""
        # Validar que o tipo corresponde ao CPF/CNPJ
        if 'cpf_cnpj' in data and 'tipo' in data:
            apenas_numeros = ''.join(filter(str.isdigit, data['cpf_cnpj']))
            
            if data['tipo'] == 'PF' and len(apenas_numeros) != 11:
                raise serializers.ValidationError({
                    'cpf_cnpj': 'Para Pessoa Física, informe um CPF válido'
                })
            elif data['tipo'] == 'PJ' and len(apenas_numeros) != 14:
                raise serializers.ValidationError({
                    'cpf_cnpj': 'Para Pessoa Jurídica, informe um CNPJ válido'
                })
        
        return data


class ClienteListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de clientes"""
    
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Cliente
        fields = [
            'id',
            'nome_completo',
            'cpf_cnpj',
            'email',
            'telefone',
            'tipo',
            'tipo_display',
            'status',
            'status_display',
            'cidade',
            'estado',
            'data_cadastro',
        ]
