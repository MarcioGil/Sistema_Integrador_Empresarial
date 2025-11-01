from rest_framework.routers import DefaultRouter
from .views import PedidoViewSet, ItemPedidoViewSet

router = DefaultRouter()
router.register(r'pedidos', PedidoViewSet, basename='pedido')
router.register(r'itens-pedido', ItemPedidoViewSet, basename='item-pedido')

urlpatterns = router.urls
