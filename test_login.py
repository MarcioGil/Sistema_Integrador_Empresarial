import requests
import json

url = "http://127.0.0.1:8000/api/token/"
data = {
    "username": "admin",
    "password": "admin123"
}

try:
    response = requests.post(url, json=data, headers={"Content-Type": "application/json"})
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code == 200:
        print("\n✅ Login funcionou!")
        tokens = response.json()
        print(f"Access Token: {tokens.get('access', 'N/A')[:50]}...")
        print(f"Refresh Token: {tokens.get('refresh', 'N/A')[:50]}...")
    else:
        print("\n❌ Erro no login!")
except Exception as e:
    print(f"❌ Erro: {e}")
