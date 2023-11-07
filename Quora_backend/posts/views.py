from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token

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
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]

    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.auth.key).user
        request.data['user_id'] = user
        Question.objects.create(question_text=request.data['question_text'], user=request.data['user_id'])
        return Response({'message': 'Question posted successfully'}, status=200)


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]

    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.auth.key).user
        if Answer.objects.filter(question=request.data['question'], user=user).exists():
            return Response({'message': 'You have already answered this question'}, status=400)
        else:
            request.data['user_id'] = user
            question = Question.objects.get(id=request.data['question'])
            Answer.objects.create(answer_text=request.data['answer_text'], question=question, user=request.data['user_id'])
            return Response({'message': 'Answer posted successfully'}, status=200)
        
    
    @action(methods=['GET'], detail=False)
    def get_answers_by_question(self, request):
        question_id = request.query_params['question_id']
        answers = Answer.objects.filter(question=question_id)
        serializer = AnswerSerializer(answers, many=True)
        return Response(serializer.data, status=200)
    
    @action(methods=['GET'], detail=False)
    def check_answered(self, request):
        user = Token.objects.get(key=request.auth.key).user
        question_id = request.query_params['question_id']
        if Answer.objects.filter(question=question_id, user=user).exists():
            return Response({'answered': True}, status=200)
        else:
            return Response({'answered': False}, status=200)
    


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, BasicAuthentication, TokenAuthentication]

    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.auth.key).user
        if Like.objects.filter(answer=request.data['answer'], user=user).exists():
            return Response({'message': 'You have already liked this answer'}, status=400)
        else:
            request.data['user_id'] = user
            answer = Answer.objects.get(id=request.data['answer'])
            Like.objects.create(answer=answer, user=request.data['user_id'])
            return Response({'message': 'Like successful'}, status=201)
    
    @action(methods=['GET'], detail=False)
    def check_like(self, request):
        user = Token.objects.get(key=request.auth.key).user
        answer_id = request.query_params['answer_id']
        if Like.objects.filter(answer=answer_id, user=user).exists():
            return Response({'liked': True}, status=200)
        else:
            return Response({'liked': False}, status=200)
        
    @action(methods=['GET'], detail=False)
    def count(self, request):
        answer_id = request.query_params['answer_id']
        likes = Like.objects.filter(answer=answer_id).count()
        return Response({'likes': likes}, status=200)

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
    permission_classes = [AllowAny]
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
            print(serializer.errors)
            return Response(serializer.errors, status=400)
        

# class UserLoginViewSet(APIView):
#     queryset = User.objects.all()

#     def post(self, request, *args, **kwargs):
#         print(request.data)
        
#         user = authenticate(username=request.data['username'], password=request.data['password'])
#         print(user)
#         if user is not None:
#             login(request, user)
#             return Response({'message': 'Login successful'}, status=200)
#         else:
#             return Response({'message': 'Invalid credentials'}, status=400)
        

class UserLogoutViewSet(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    def get(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=200)
