from django.shortcuts import render
from .models import Post


def home(request):
    posts = Post.objects.all()
    return render(request, "blog/home.html", {"posts": posts})
- Post.objects.all() gets all posts from the database.
- The {"posts": posts} part sends them to the template.