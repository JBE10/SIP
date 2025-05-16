import json
from bson import ObjectId
from datetime import datetime

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super(JSONEncoder, self).default(obj)

def parse_json(data):
    """Convert MongoDB data to JSON serializable format"""
    return json.loads(JSONEncoder().encode(data))

def format_error(message, status_code=500):
    """Format error response"""
    return {"error": message}, status_code
