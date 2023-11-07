from django.db import models
from django.contrib.auth.models import User

from datetime import datetime


# Create your models here.
class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published', default=datetime.now)
    user = models.ForeignKey(User, related_name='questions', on_delete=models.CASCADE)

    # This is used to display the question text in the admin page
    def __str__(self):
        return self.question_text
    

class Answer(models.Model):
    answer_text = models.TextField()
    question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='answers', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.answer_text
    

class Like(models.Model):
    answer = models.ForeignKey(Answer, related_name='likes', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='likes', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

