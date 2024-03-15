from django.shortcuts import render
from django.http import HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import redirect
import requests
from django.conf import settings
# Create your views here.

API_ENDPOINT = "https://discord.com/api/v10"

auth_url_discord = "https://discord.com/api/oauth2/authorize?client_id=1093461191705239562&redirect_uri=http%3A%2F%2Flocalhost%3A8002%2Foauth2%2Flogin%2Fredirect&response_type=code&scope=identify"


def home(request:HttpRequest)-> JsonResponse:
    return JsonResponse({'message':'Hello World'})


def discord_login(request:HttpRequest):
    return redirect(auth_url_discord)

def discord_login_redirect(request:HttpRequest):
    code = request.GET.get('code')
    print(code);
    return JsonResponse({"user": exchange_code_for_token(code)})


def exchange_code_for_token(code):
    data = {
        "client_id": settings.DISCORD_CLIENT_ID,
        "CLIENT_SECRET": settings.DISCORD_CLIENT_SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.BACKEND_DOMAIN + "/oauth2/login/redirect",
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post("https://discord.com/api/oauth2/token", data=data, headers=headers)
    print(response)
    credentials = response.json()
    access_token = credentials['access_token']
    print(access_token)
    response = requests.get('https://discord.com/api/v10/users/@me', headers={'Authorization': f'Bearer {access_token}'})
    user_data = response.json()
    response.raise_for_status()
    print(user_data)
    return user_data