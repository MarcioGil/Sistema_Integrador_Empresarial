from rest_framework.routers import DefaultRouter
from .views import UsuarioViewSet, DepartamentoViewSet

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'departamentos', DepartamentoViewSet, basename='departamento')

urlpatterns = router.urls
