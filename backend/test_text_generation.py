"""
Test script for RAG-based text generation
"""
import requests
import json

# First, login to get a token
login_url = "http://localhost:5020/auth/verify-otp"
login_data = {
    "email": "jsumitha07@gmail.com",
    "name": "Sumitha",
    "standard": 8
}

print("🔐 Logging in...")
response = requests.post(login_url, json=login_data)
if response.status_code == 200:
    token = response.json().get('token')
    print(f"✅ Login successful! Token: {token[:30]}...")
else:
    print(f"❌ Login failed: {response.text}")
    exit(1)

# Test text generation
text_gen_url = "http://localhost:5020/api/generate-text"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

# Test with different topics
test_topics = [
    {"subject": "Science", "topic": "Photosynthesis"},
    {"subject": "Math", "topic": "Algebra"},
]

for test_data in test_topics:
    print(f"\n📚 Generating text for: {test_data['subject']} - {test_data['topic']}")
    print("=" * 60)
    
    response = requests.post(text_gen_url, headers=headers, json=test_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Status: {result.get('status')}")
        print(f"📖 Topic: {result.get('topic')}")
        print(f"📚 Subject: {result.get('subject')}")
        print(f"🎓 Class: {result.get('standard')}")
        print(f"\n📝 Generated Content:\n")
        print(result.get('content', 'No content'))
        print(f"\n📌 Source: {result.get('source')}")
    else:
        print(f"❌ Generation failed: {response.text}")
    
    print("=" * 60)

print("\n🎉 Test completed!")
