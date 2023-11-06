from django.urls import include, path
from rest_framework import routers

from .views import QuestionViewSet, AnswerViewSet, LikeViewSet, UserRegistrationViewSet, UserLoginViewSet, UserLogoutViewSet

router = routers.DefaultRouter()
router.register(r'questions', QuestionViewSet)
router.register(r'answers', AnswerViewSet)
router.register(r'likes', LikeViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationViewSet.as_view()),
    path('login/', UserLoginViewSet.as_view()),
    path('logout/', UserLogoutViewSet.as_view()),
]
