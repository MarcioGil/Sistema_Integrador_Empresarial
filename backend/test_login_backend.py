import requests

url = "http://localhost:8000/api/token/"
data = {"username": "admin", "password": "admin123"}

try:
    response = requests.post(url, json=data)
    print("Status:", response.status_code)
    print("Resposta:", response.text)
except Exception as e:
    print("Erro ao conectar:", e)
