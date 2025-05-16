from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from datetime import datetime

# MongoDB connection
client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGODB_DB_NAME", "sportmatch")]

class Match:
    @staticmethod
    def get_by_user_id(user_id):
        return list(db.matches.find({
            "$or": [{"user1Id": user_id}, {"user2Id": user_id}]
        }))
    
    @staticmethod
    def get_by_id(id):
        if not ObjectId.is_valid(id):
            return None
        return db.matches.find_one({"_id": ObjectId(id)})
    
    @staticmethod
    def create(match_data):
        match_data["createdAt"] = datetime.now()
        match_data["updatedAt"] = datetime.now()
        
        result = db.matches.insert_one(match_data)
        match_data["_id"] = result.inserted_id
        
        return match_data
    
    @staticmethod
    def update(id, match_data):
        if not ObjectId.is_valid(id):
            return None
            
        match_data["updatedAt"] = datetime.now()
        
        result = db.matches.update_one(
            {"_id": ObjectId(id)},
            {"$set": match_data}
        )
        
        if result.modified_count > 0:
            return db.matches.find_one({"_id": ObjectId(id)})
        
        return None
    
    @staticmethod
    def delete(id):
        if not ObjectId.is_valid(id):
            return False
            
        result = db.matches.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
