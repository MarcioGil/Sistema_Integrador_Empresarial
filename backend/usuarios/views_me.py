from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # Retorna informações básicas do usuário autenticado
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_superuser": user.is_superuser,
            "is_staff": user.is_staff,
            "tipo": getattr(user, 'tipo', None),
            "status": getattr(user, 'status', None),
        }, status=status.HTTP_200_OK)
