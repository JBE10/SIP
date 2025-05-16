from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import json
from bson.objectid import ObjectId
from models.profile import Profile
from models.match import Match
from models.message import Message

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Helper function to convert ObjectId to string for JSON serialization
def parse_json(data):
    return json.loads(json.dumps(data, default=str))

# Routes for profiles
@app.route('/api/profiles', methods=['GET'])
def get_profiles():
    try:
        profiles = Profile.get_all()
        return jsonify({"profiles": parse_json(profiles)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profiles/<id>', methods=['GET'])
def get_profile(id):
    try:
        profile = Profile.get_by_id(id)
        if profile:
            return jsonify({"profile": parse_json(profile)})
        return jsonify({"error": "Profile not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profiles', methods=['POST'])
def create_profile():
    try:
        profile_data = request.json
        profile = Profile.create(profile_data)
        return jsonify({"success": True, "profile": parse_json(profile)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profiles/<id>', methods=['PUT'])
def update_profile(id):
    try:
        profile_data = request.json
        profile = Profile.update(id, profile_data)
        
        if profile:
            return jsonify({"success": True, "profile": parse_json(profile)})
        
        return jsonify({"error": "Profile not found or not modified"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profiles/<id>', methods=['DELETE'])
def delete_profile(id):
    try:
        success = Profile.delete(id)
        
        if success:
            return jsonify({"success": True})
        
        return jsonify({"error": "Profile not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Routes for matches
@app.route('/api/matches', methods=['GET'])
def get_matches():
    try:
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
            
        matches = Match.get_by_user_id(user_id)
        return jsonify({"matches": parse_json(matches)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/matches', methods=['POST'])
def create_match():
    try:
        match_data = request.json
        match = Match.create(match_data)
        return jsonify({"success": True, "match": parse_json(match)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/matches/<id>', methods=['GET'])
def get_match(id):
    try:
        match = Match.get_by_id(id)
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
            
        messages = Message.get_by_match_id(match_id)
        return jsonify({"messages": parse_json(messages)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/messages', methods=['POST'])
def create_message():
    try:
        message_data = request.json
        message = Message.create(message_data)
        return jsonify({"success": True, "message": parse_json(message)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/messages/read', methods=['PATCH'])
def mark_messages_read():
    try:
        match_id = request.args.get('matchId')
        user_id = request.args.get('userId')
        
        if not match_id or not user_id:
            return jsonify({"error": "Match ID and User ID are required"}), 400
            
        modified_count = Message.mark_as_read(match_id, user_id)
        return jsonify({"success": True, "modified_count": modified_count})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Seed database route
@app.route('/api/seed', methods=['POST'])
def seed_database():
    try:
        from seed_data import mock_profiles
        from pymongo import MongoClient
        
        client = MongoClient(os.getenv("MONGODB_URI"))
        db = client[os.getenv("MONGODB_DB_NAME", "sportmatch")]
        
        # Check if profiles collection is empty
        if db.profiles.count_documents({}) == 0:
            from datetime import datetime
            
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
