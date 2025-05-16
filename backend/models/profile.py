from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from datetime import datetime

# MongoDB connection
client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGODB_DB_NAME", "sportmatch")]

class Profile:
    @staticmethod
    def get_all():
        return list(db.profiles.find())
    
    @staticmethod
    def get_by_id(id):
        return db.profiles.find_one({"_id": ObjectId(id)})
    
    @staticmethod
    def create(profile_data):
        profile_data["createdAt"] = datetime.now()
        profile_data["updatedAt"] = datetime.now()
        
        result = db.profiles.insert_one(profile_data)
        profile_data["_id"] = result.inserted_id
        
        return profile_data
    
    @staticmethod
    def update(id, profile_data):
        profile_data["updatedAt"] = datetime.now()
        
        result = db.profiles.update_one(
            {"_id": ObjectId(id)},
            {"$set": profile_data}
        )
        
        if result.modified_count > 0:
            return db.profiles.find_one({"_id": ObjectId(id)})
        
        return None
    
    @staticmethod
    def delete(id):
        result = db.profiles.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
