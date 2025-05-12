from flask import Blueprint, request, jsonify
from services.job_api import search_jobs, get_job_details, summarize_job_description

jobs_bp = Blueprint('jobs', __name__, url_prefix='/api/jobs')

@jobs_bp.route('/search', methods=['GET'])
def job_search():
    title = request.args.get('title', '')
    location = request.args.get('location', '')
    salary = request.args.get('salary', '')
    job_type = request.args.get('jobType', '')
    industries = request.args.get('industries', '')
    page = request.args.get('page', 1, type=int)
    
    print(f"Searching with title: {title}, location: {location}, salary: {salary}, job_type: {job_type}, industries: {industries}")

    jobs = search_jobs(title, location, page, salary, job_type, industries)
    return jsonify(jobs)

@jobs_bp.route('/details/<job_id>', methods=['GET'])
def job_details(job_id):
    details = get_job_details(job_id)
    if not details:
        return jsonify({"error": "Job not found"}), 404
    return jsonify(details)

@jobs_bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({"message": " test route working!"})

@jobs_bp.route('/summarize', methods=['POST'])
def summarize_description():
    try:
        data = request.get_json()
        if not data:
            print("No JSON data received")
            return jsonify({"error": "No data provided"}), 400
            
        description = data.get('description', '')
        if not description:
            print("No description in request")
            return jsonify({"error": "No description provided"}), 400
        
        print(f"Received description to summarize, length: {len(description)}")
        
        result = summarize_job_description(description)
        
        if not result['success']:
            print(f"Error in summarize_job_description: {result['error']}")
            return jsonify({"error": result['error']}), 400
            
        return jsonify({"summary": result['summary']})
        
    except Exception as e:
        print(f"Exception in summarize_description: {str(e)}")
        return jsonify({"error": f"Failed to summarize: {str(e)}"}), 500