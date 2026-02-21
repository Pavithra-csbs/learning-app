import requests
import json

BASE_URL = "http://127.0.0.1:5020"
email = "debug_test@example.com"

def test_auth():
    print(f"--- Testing Direct Login Flow for {email} ---")
    
    # 1. Login directly (verify-otp endpoint now handles both)
    login_data = {
        "email": email,
        "name": "Debug User",
        "standard": 10
    }
    print(f"DEBUG: Attempting login for {email}")
    try:
        response = requests.post(f"{BASE_URL}/auth/verify-otp", json=login_data)
        print(f"Login Response: {response.status_code}")
        print(response.json())
        
        if response.status_code == 200:
            print("SUCCESS: Login successful!")
            return True
        else:
            print(f"FAILURE: Login failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"Error during login: {e}")
        return False

if __name__ == "__main__":
    test_auth()
