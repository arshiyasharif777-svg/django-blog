from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from .forms import PostForm
from .models import Post


def home(request):
    posts = Post.objects.all()
    return render(request, "blog/home.html", {"posts": posts})


@login_required
def post_detail(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    return render(request, "blog/post_detail.html", {"post": post})


def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("home")
    else:
        form = UserCreationForm()
    return render(request, "blog/signup.html", {"form": form})


@login_required
def create_post(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect("post_detail", post_id=post.id)
    else:
        form = PostForm()
    return render(request, "blog/post_form.html", {"form": form})
