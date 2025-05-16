from pymongo import MongoClient
from bson.objectid import ObjectId
import os
from datetime import datetime

# MongoDB connection
client = MongoClient(os.getenv("MONGODB_URI"))
db = client[os.getenv("MONGODB_DB_NAME", "sportmatch")]

class Message:
    @staticmethod
    def get_by_match_id(match_id):
        return list(db.messages.find({"matchId": match_id}).sort("timestamp", 1))
    
    @staticmethod
    def create(message_data):
        message_data["timestamp"] = datetime.now()
        message_data["createdAt"] = datetime.now()
        message_data["updatedAt"] = datetime.now()
        message_data["read"] = False
        
        result = db.messages.insert_one(message_data)
        message_data["_id"] = result.inserted_id
        
        return message_data
    
    @staticmethod
    def mark_as_read(match_id, user_id):
        result = db.messages.update_many(
            {
                "matchId": match_id,
                "receiverId": user_id,
                "read": False
            },
            {
                "$set": {
                    "read": True,
                    "updatedAt": datetime.now()
                }
            }
        )
        
        return result.modified_count
