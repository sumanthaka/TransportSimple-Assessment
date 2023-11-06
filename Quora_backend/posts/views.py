from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Question, Answer, Like
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from .serializers import (
    QuestionSerializer, 
    AnswerSerializer, 
    LikeSerializer, 
    UserRegistrationSerializer, 
    UserLoginSerializer
)


# Create your views here.
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if Answer.objects.filter(question=request.data['question'], user=request.data['user']).exists():
            return Response({'message': 'You have already answered this question'}, status=400)
        else:
            return super().create(request, *args, **kwargs)


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if Like.objects.filter(answer=request.data['answer'], user=request.data['user']).exists():
            return Response({'message': 'You have already liked this answer'}, status=400)
        else:
            return super().create(request, *args, **kwargs)


# class UserRegistrationViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserRegistrationSerializer

#     def create(self, request, *args, **kwargs):
#         if User.objects.filter(username=request.data['username']).exists():
#             return Response({'message': 'Username already exists'}, status=400)
#         elif User.objects.filter(email=request.data['email']).exists():
#             return Response({'message': 'Email already exists'}, status=400)
#         elif request.data['password'] != request.data['confirm_password']:
#             return Response({'message': 'Passwords do not match'}, status=400)
#         else:
#             return super().create(request, *args, **kwargs)

class UserRegistrationViewSet(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            if User.objects.filter(username=request.data['username']).exists():
                return Response({'message': 'Username already exists'}, status=400)
            elif User.objects.filter(email=request.data['email']).exists():
                return Response({'message': 'Email already exists'}, status=400)
            elif request.data['password'] != request.data['confirm_password']:
                return Response({'message': 'Passwords do not match'}, status=400)
            else:
                data = serializer.data
                User.objects.create_user(username=data['username'], email=data['email'], password=data['password'])
                return Response({'message': 'User created successfully'}, status=201)
        else:
            return Response(serializer.errors, status=400)
        

class UserLoginViewSet(APIView):
    queryset = User.objects.all()
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful'}, status=200)
        else:
            return Response({'message': 'Invalid credentials'}, status=400)
        

class UserLogoutViewSet(APIView):
    def get(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=200)
