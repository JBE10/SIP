from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import json
from bson.objectid import ObjectId
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# MongoDB connection
from pymongo import MongoClient

# Get MongoDB URI from environment variables
mongo_uri = os.getenv("MONGODB_URI")
if not mongo_uri:
    raise ValueError("MONGODB_URI environment variable not set")

client = MongoClient(mongo_uri)
db = client[os.getenv("MONGODB_DB_NAME", "sportmatch")]

# Helper function to convert ObjectId to string for JSON serialization
def parse_json(data):
    return json.loads(json.dumps(data, default=str))

# Routes for profiles
@app.route('/api/profiles', methods=['GET'])
def get_profiles():
    try:
        profiles = list(db.profiles.find())
        return jsonify({"profiles": parse_json(profiles)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profiles/<id>', methods=['GET'])
def get_profile(id):
    try:
        profile = db.profiles.find_one({"_id": ObjectId(id)})
        if profile:
            return jsonify({"profile": parse_json(profile)})
        return jsonify({"error": "Profile not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profiles', methods=['POST'])
def create_profile():
    try:
        profile_data = request.json
        profile_data["createdAt"] = datetime.now()
        profile_data["updatedAt"] = datetime.now()
        
        result = db.profiles.insert_one(profile_data)
        profile_data["_id"] = result.inserted_id
        
        return jsonify({"success": True, "profile": parse_json(profile_data)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Routes for matches
@app.route('/api/matches', methods=['GET'])
def get_matches():
    try:
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
            
        matches = list(db.matches.find({
            "$or": [{"user1Id": user_id}, {"user2Id": user_id}]
        }))
        return jsonify({"matches": parse_json(matches)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/matches', methods=['POST'])
def create_match():
    try:
        match_data = request.json
        match_data["createdAt"] = datetime.now()
        match_data["updatedAt"] = datetime.now()
        
        result = db.matches.insert_one(match_data)
        match_data["_id"] = result.inserted_id
        
        return jsonify({"success": True, "match": parse_json(match_data)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/matches/<id>', methods=['GET'])
def get_match(id):
    try:
        match = db.matches.find_one({"_id": ObjectId(id)})
        if match:
            return jsonify({"match": parse_json(match)})
        return jsonify({"error": "Match not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Routes for messages
@app.route('/api/messages', methods=['GET'])
def get_messages():
    try:
        match_id = request.args.get('matchId')
        if not match_id:
            return jsonify({"error": "Match ID is required"}), 400
            
        messages = list(db.messages.find({"matchId": match_id}).sort("timestamp", 1))
        return jsonify({"messages": parse_json(messages)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/messages', methods=['POST'])
def create_message():
    try:
        message_data = request.json
        message_data["timestamp"] = datetime.now()
        message_data["createdAt"] = datetime.now()
        message_data["updatedAt"] = datetime.now()
        message_data["read"] = False
        
        result = db.messages.insert_one(message_data)
        message_data["_id"] = result.inserted_id
        
        return jsonify({"success": True, "message": parse_json(message_data)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/messages/read', methods=['PATCH'])
def mark_messages_read():
    try:
        match_id = request.args.get('matchId')
        user_id = request.args.get('userId')
        
        if not match_id or not user_id:
            return jsonify({"error": "Match ID and User ID are required"}), 400
            
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
        
        return jsonify({"success": True, "modified_count": result.modified_count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Seed database route
@app.route('/api/seed', methods=['POST'])
def seed_database():
    try:
        from seed_data import mock_profiles
        
        # Check if profiles collection is empty
        if db.profiles.count_documents({}) == 0:
            profiles = []
            for profile in mock_profiles:
                profile["createdAt"] = datetime.now()
                profile["updatedAt"] = datetime.now()
                profiles.append(profile)
                
            if profiles:
                db.profiles.insert_many(profiles)
                return jsonify({"success": True, "message": f"Inserted {len(profiles)} profiles"})
        
        return jsonify({"success": False, "message": "Profiles collection is not empty"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))
