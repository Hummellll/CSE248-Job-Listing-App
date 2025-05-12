import os
import requests
from dotenv import load_dotenv
import openai
load_dotenv()
RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY
BASE_URL = "https://jsearch.p.rapidapi.com"
HEADERS = {
    "X-RapidAPI-Key": RAPIDAPI_KEY,
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
}

def search_jobs(query="", location="", page=1, salary="", job_type="", industries=""):
    try:
        print(f"Searching jobs with: query={query}, location={location}, page={page}, salary={salary}, job_type={job_type}, industries={industries}")
        
        search_query = query
        if location:
            search_query += f" {location}"
            
        response = requests.get(
            f"{BASE_URL}/search",
            headers=HEADERS,
            params={
                "query": search_query if search_query else "developer",
                "page": page,
                "num_pages": 2,
                "page_size": 20
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
    
def summarize_job_description(description):
    try:
        if not description:
            return {"success": False, "error": "No description provided"}
        
        print(f"Summarizing job description of length: {len(description)}")
        
        client = openai.OpenAI(api_key=OPENAI_API_KEY)
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Extract only the key requirements, responsibilities, and qualifications from job descriptions. Focus on required education, years of experience, technical skills, and essential duties."},
                {"role": "user", "content": f"Summarize this job description focusing ONLY on requirements, skills, education, and experience needed:\n\n{description}"}
            ],
            max_tokens=150
        )
        
        summary = response.choices[0].message.content
        print(f"Generated summary: {summary}")
        
        return {
            "success": True,
            "summary": summary
        }
        
    except Exception as e:
        print(f"OpenAI API error: {str(e)}")
        return {"success": False, "error": str(e)}