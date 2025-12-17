from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class AuthTestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"detail": "Autenticação bem-sucedida!", "user": str(request.user)})
