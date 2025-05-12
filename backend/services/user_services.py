from datetime import datetime
from database.connection import supabase

def create_user(username, email, password):
    try:

        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })
        
        if not auth_response.user:
            return {"success": False, "error": "Registration failed"}
        
        user_id = auth_response.user.id
        

        profile_data = {
            "id": user_id,
            "username": username,
            "email": email,
            "preferences": {
                "jobType": [],
                "location": "",
                "salary": "",
                "keySkills": [],
                "industries": []
            },
            "created_at": datetime.utcnow().isoformat()
        }
        
        profile_response = supabase.table('profiles').insert(profile_data).execute()
        
        return {
            "success": True,
            "user": {
                "id": user_id,
                "username": username,
                "email": email,
                "preferences": profile_data["preferences"],
                "created_at": profile_data["created_at"]
            }
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def login_user(email, password):
    try:
        print(f"Attempting login with: {email}")
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if not auth_response.user:
            return {"success": False, "error": "Invalid credentials"}
        
        user_id = auth_response.user.id
        
        profile_response = supabase.table('profiles').select("*").eq("id", user_id).execute()
        
        if not profile_response.data or len(profile_response.data) == 0:
            return {"success": False, "error": "User profile not found"}
        
        user_profile = profile_response.data[0]
        
        return {
            "success": True,
            "user": {
                "id": user_id,
                "username": user_profile["username"],
                "email": user_profile["email"],
                "preferences": user_profile["preferences"],
                "created_at": user_profile["created_at"]
            }
        }
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return {"success": False, "error": str(e)}

def get_user_by_id(user_id):
    try:
        profile_response = supabase.table('profiles').select("*").eq("id", user_id).execute()
        
        if not profile_response.data or len(profile_response.data) == 0:
            return {"success": False, "error": "User not found"}
        
        user_profile = profile_response.data[0]
        
        return {
            "success": True,
            "user": {
                "id": user_id,
                "username": user_profile["username"],
                "email": user_profile["email"],
                "preferences": user_profile["preferences"],
                "created_at": user_profile["created_at"]
            }
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_user_preferences(user_id):
    try:
        profile_response = supabase.table('profiles').select("preferences").eq("id", user_id).execute()
        
        if not profile_response.data or len(profile_response.data) == 0:
            return {"success": False, "error": "User not found"}
        
        return {
            "success": True,
            "preferences": profile_response.data[0]["preferences"]
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

def update_user_preferences(user_id, preferences):
    try:
        profile_response = supabase.table('profiles').select("preferences").eq("id", user_id).execute()
        
        if not profile_response.data or len(profile_response.data) == 0:
            return {"success": False, "error": "User not found"}
        
        current_preferences = profile_response.data[0]["preferences"]
        
        updated_preferences = {**current_preferences, **preferences}
        
        update_response = supabase.table('profiles').update(
            {"preferences": updated_preferences}
        ).eq("id", user_id).execute()
        
        return {
            "success": True,
            "preferences": updated_preferences
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}