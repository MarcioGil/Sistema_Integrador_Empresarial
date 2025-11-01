from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario, Departamento


@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'responsavel', 'ativo', 'data_cadastro')
    list_filter = ('ativo', 'data_criacao')
    search_fields = ('nome', 'descricao', 'responsavel__nome_completo')
    readonly_fields = ('data_criacao', 'data_modificacao')


@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    list_display = ('username', 'nome_completo', 'email', 'departamento', 'cargo', 'status', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'status', 'departamento')
    search_fields = ('username', 'nome_completo', 'email', 'cpf')
    readonly_fields = ('date_joined', 'last_login')
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Informações Pessoais', {'fields': ('nome_completo', 'first_name', 'last_name', 'email', 'cpf', 'telefone', 'foto')}),
        ('Informações Profissionais', {'fields': ('departamento', 'cargo', 'data_admissao', 'salario', 'status')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'nome_completo', 'password1', 'password2'),
        }),
    )
