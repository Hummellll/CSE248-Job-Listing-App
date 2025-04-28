from flask import Blueprint, request, jsonify
from services.job_api import search_jobs, get_job_details

jobs_bp = Blueprint('jobs', __name__, url_prefix='/api/jobs')

@jobs_bp.route('/search', methods=['GET'])
def job_search():
    query = request.args.get('title', '')
    location = request.args.get('location', '')
    page = request.args.get('page', 1, type=int)
    
    jobs = search_jobs(query, location, page)
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