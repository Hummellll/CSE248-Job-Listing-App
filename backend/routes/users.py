from flask import Blueprint, request, jsonify
from services.user_services import (
    create_user, 
    login_user, 
    get_user_by_id, 
    get_user_preferences,
    update_user_preferences
)

users_bp = Blueprint('users', __name__, url_prefix='/api/users')

@users_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not all(k in data for k in ['username', 'email', 'password']):
            return jsonify({"error": "Missing required fields"}), 400
        

        result = create_user(data['username'], data['email'], data['password'])
        
        if not result['success']:
            return jsonify({"error": result['error']}), 400
        
        return jsonify({
            "user": result['user']
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not all(k in data for k in ['email', 'password']):
            return jsonify({"error": "Email and password are required"}), 400
        
        result = login_user(data['email'], data['password'])
        
        if not result['success']:
            return jsonify({"error": result['error']}), 401
        
        return jsonify({
            "user": result['user']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.route('/preferences/<user_id>', methods=['GET'])
def get_preferences(user_id):
    try:
        result = get_user_preferences(user_id)
        
        if not result['success']:
            return jsonify({"error": result['error']}), 404
        
        return jsonify(result['preferences'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.route('/preferences/<user_id>', methods=['POST'])
def update_preferences(user_id):
    try:
        data = request.get_json()
        
        result = update_user_preferences(user_id, data)
        
        if not result['success']:
            return jsonify({"error": result['error']}), 400
        
        return jsonify(result['preferences'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.route('/profile/<user_id>', methods=['GET'])
def get_profile(user_id):
    try:
        result = get_user_by_id(user_id)
        
        if not result['success']:
            return jsonify({"error": result['error']}), 404
        
        return jsonify(result['user'])
    except Exception as e:
        return jsonify({"error": str(e)}), 500