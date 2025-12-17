

from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, DepartamentoViewSet
from .views_auth_test import AuthTestView
from .views_me import MeView


router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'departamentos', DepartamentoViewSet, basename='departamento')

urlpatterns = router.urls
from django.urls import path
urlpatterns += [
    path('auth-test/', AuthTestView.as_view(), name='auth-test'),
    path('me/', MeView.as_view(), name='me'),
]
