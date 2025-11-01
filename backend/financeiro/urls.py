from rest_framework.routers import DefaultRouter
from .views import FaturaViewSet, ContaReceberViewSet, ContaPagarViewSet

router = DefaultRouter()
router.register(r'faturas', FaturaViewSet, basename='fatura')
router.register(r'contas-receber', ContaReceberViewSet, basename='conta-receber')
router.register(r'contas-pagar', ContaPagarViewSet, basename='conta-pagar')

urlpatterns = router.urls
