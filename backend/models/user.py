from datetime import datetime
from bson import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash


class User:
    def __init__(self, username,email,password,_id=None, created_at=None, preferences=None):
        self._id= _id if _id else ObjectId()
        self.username = username
        self.email = email
        self.password_hash = generate_password_hash(password) if password else None
        self.created_at = created_at if created_at else datetime.uctnow()
        self.preferences = preferences if preferences else{
            "jobType" : [],
            "loation": "",
            "salary": "",
            "keyskills": [],
            "industries": []

        }