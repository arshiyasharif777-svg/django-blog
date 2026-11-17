from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse


class SignUpTests(TestCase):
    def valid_data(self):
        return {
            "username": "sara",
            "email": "sara@example.com",
            "first_name": "Sara",
            "last_name": "Ahmadi",
            "password1": "Str0ng-pass-123",
            "password2": "Str0ng-pass-123",
        }

    def test_signup_page_shows_new_fields(self):
        response = self.client.get(reverse("signup"))
        self.assertContains(response, 'name="email"')
        self.assertContains(response, 'name="first_name"')
        self.assertContains(response, 'name="last_name"')

    def test_signup_saves_email_and_names(self):
        response = self.client.post(reverse("signup"), self.valid_data())
        self.assertRedirects(response, reverse("home"))
        user = User.objects.get(username="sara")
        self.assertEqual(user.email, "sara@example.com")
        self.assertEqual(user.first_name, "Sara")
        self.assertEqual(user.last_name, "Ahmadi")

    def test_signup_requires_email(self):
        data = self.valid_data()
        data["email"] = ""
        response = self.client.post(reverse("signup"), data)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.filter(username="sara").exists())
