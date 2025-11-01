from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Usuario, Departamento


class DepartamentoSerializer(serializers.ModelSerializer):
    """Serializer para o model Departamento"""
    
    # Campos calculados
    quantidade_funcionarios = serializers.ReadOnlyField()
    
    # Display values
    ativo_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Departamento
        fields = [
            'id',
            'nome',
            'sigla',
            'descricao',
            'responsavel',
            'email',
            'ramal',
            'ativo',
            'ativo_display',
            'data_criacao',
            'data_modificacao',
            'quantidade_funcionarios',
        ]
        read_only_fields = ['id', 'data_criacao', 'data_modificacao']
    
    def get_ativo_display(self, obj):
        return "Ativo" if obj.ativo else "Inativo"
    
    def validate_sigla(self, value):
        """Validar sigla do departamento"""
        if len(value) < 2:
            raise serializers.ValidationError("A sigla deve ter no mínimo 2 caracteres")
        
        # Converter para maiúsculas
        return value.upper()


class UsuarioSerializer(serializers.ModelSerializer):
    """Serializer para o model Usuario"""
    
    # Departamento aninhado para leitura
    departamento_detail = DepartamentoSerializer(source='departamento', read_only=True)
    
    # Campo de senha (write-only)
    password = serializers.CharField(write_only=True, required=False, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=False)
    
    # Campos calculados
    nome_completo = serializers.ReadOnlyField()
    
    # Display values
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    
    class Meta:
        model = Usuario
        fields = [
            'id',
            'username',
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
            'nome_completo',
            'cpf',
            'telefone',
            'celular',
            'data_nascimento',
            'data_admissao',
            'departamento',
            'departamento_detail',
            'cargo',
            'tipo',
            'tipo_display',
            'is_active',
            'is_staff',
            'is_superuser',
            'foto',
            'data_cadastro',
            'data_atualizacao',
            'last_login',
        ]
        read_only_fields = [
            'id',
            'data_cadastro',
            'data_atualizacao',
            'last_login',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
        }
    
    def validate_cpf(self, value):
        """Validar CPF"""
        if value:
            # Remover caracteres não numéricos
            cpf_numeros = ''.join(filter(str.isdigit, value))
            
            if len(cpf_numeros) != 11:
                raise serializers.ValidationError("CPF deve conter 11 dígitos")
            
            # Verificar se não é uma sequência de números iguais
            if len(set(cpf_numeros)) == 1:
                raise serializers.ValidationError("CPF inválido")
        
        return value
    
    def validate(self, data):
        """Validações cruzadas"""
        # Validar confirmação de senha
        if 'password' in data or 'password_confirm' in data:
            password = data.get('password')
            password_confirm = data.get('password_confirm')
            
            if password != password_confirm:
                raise serializers.ValidationError({
                    'password_confirm': 'As senhas não coincidem'
                })
        
        # Remover password_confirm dos dados (não é campo do model)
        data.pop('password_confirm', None)
        
        return data
    
    def create(self, validated_data):
        """Criar usuário com senha criptografada"""
        password = validated_data.pop('password', None)
        user = Usuario(**validated_data)
        
        if password:
            user.set_password(password)
        
        user.save()
        return user
    
    def update(self, instance, validated_data):
        """Atualizar usuário"""
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class UsuarioListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de usuários"""
    
    nome_completo = serializers.ReadOnlyField()
    departamento_nome = serializers.CharField(source='departamento.nome', read_only=True)
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    
    class Meta:
        model = Usuario
        fields = [
            'id',
            'username',
            'nome_completo',
            'email',
            'departamento_nome',
            'cargo',
            'tipo',
            'tipo_display',
            'is_active',
        ]


class UsuarioCreateSerializer(serializers.ModelSerializer):
    """Serializer para criação de usuários (simplificado)"""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Usuario
        fields = [
            'username',
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
            'cpf',
            'telefone',
            'celular',
            'departamento',
            'cargo',
            'tipo',
        ]
    
    def validate(self, data):
        """Validar senhas"""
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'As senhas não coincidem'
            })
        
        data.pop('password_confirm')
        return data
    
    def create(self, validated_data):
        """Criar usuário"""
        password = validated_data.pop('password')
        user = Usuario.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
