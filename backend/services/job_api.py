import os
import requests
from dotenv import load_dotenv

load_dotenv()
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")


BASE_URL = "https://jsearch.p.rapidapi.com"
HEADERS = {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}

def search_jobs(query="", location="", page=1):
    """Search for jobs using JSearch API"""
    try:
        print(f"Searching jobs with: query={query}, location={location}, page={page}")
        response = requests.get(
            f"{BASE_URL}/search",
            headers=HEADERS,
            params={
                "query": query if query else "developer",
                "location": location,
                "page": page,
                "num_pages": 1
            }
        )
        
        if response.status_code != 200:
            print(f"API error: {response.text}")
            return []
            
        data = response.json()
        print(f"Found {len(data.get('data', []))} jobs")
        return data.get("data", [])
    except Exception as e:
        print(f"Error searching jobs: {e}")
        return []

def get_job_details(job_id):
    """Get details for a specific job"""
    try:
        response = requests.get(
            f"{BASE_URL}/job-details",
            headers=HEADERS,
            params={"job_id": job_id}
        )
        response.raise_for_status()
        return response.json().get("data", [])
    except Exception as e:
        print(f"Error getting job details: {e}")
        return None