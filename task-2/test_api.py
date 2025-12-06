import requests
import json
import time

BASE_URL = "http://localhost:5000/api"

def test_submit():
    print("Testing Submission...")
    payload = {
        "rating": 5,
        "review": "This is a test review from the verification script. The service was excellent!"
    }
    try:
        res = requests.post(f"{BASE_URL}/submit", json=payload)
        if res.status_code == 200:
            print("Submission Successful!")
            print("AI Response:", res.json().get("aiResponse"))
            return True
        else:
            print(f"Submission Failed: {res.status_code} - {res.text}")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def test_get_submissions():
    print("\nTesting Admin Feed...")
    try:
        res = requests.get(f"{BASE_URL}/submissions")
        if res.status_code == 200:
            data = res.json()
            print(f"Retrieved {len(data)} submissions.")
            if len(data) > 0:
                print("Latest Submission Summary:", data[0].get("aiSummary"))
            return True
        else:
            print(f"Fetch Failed: {res.status_code} - {res.text}")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    # Wait for server to start
    print("Waiting for server...")
    time.sleep(2) 
    
    if test_submit():
        time.sleep(2)
        test_get_submissions()
