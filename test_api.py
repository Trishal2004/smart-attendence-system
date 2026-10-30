import requests

baseUrl = "http://localhost:8081/api"
loginRes = requests.post(f"{baseUrl}/auth/login", json={"email": "myfac2@demo.com", "password": "password"})
if loginRes.status_code == 200:
    data = loginRes.json()
    token = data.get("token")
    fac_id = data.get("id")
    res = requests.get(f"{baseUrl}/faculty/{fac_id}/courses", headers={"Authorization": f"Bearer {token}"})
    print("Courses status:", res.status_code)
    print("Courses text:", res.text)
else:
    print(loginRes.text)
