import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient
from datetime import datetime
from seed_data import mock_profiles

# Load environment variables
load_dotenv()

def seed_database():
    try:
        # MongoDB Atlas connection
        mongo_uri = os.getenv("MONGODB_URI")
        if not mongo_uri:
            print("Error: MONGODB_URI environment variable not set")
            sys.exit(1)
            
        client = MongoClient(mongo_uri)
        db = client[os.getenv("MONGODB_DB_NAME", "sportmatch")]
        
        # Check if profiles collection is empty
        if db.profiles.count_documents({}) == 0:
            print("Seeding profiles collection...")
            profiles = []
            for profile in mock_profiles:
                profile["createdAt"] = datetime.now()
                profile["updatedAt"] = datetime.now()
                profiles.append(profile)
                
            if profiles:
                result = db.profiles.insert_many(profiles)
                print(f"Successfully inserted {len(result.inserted_ids)} profiles")
            else:
                print("No profiles to insert")
        else:
            print("Profiles collection is not empty. Skipping seed.")
            
        print("Database seeding completed successfully!")
            
    except Exception as e:
        print(f"Error seeding database: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    seed_database()
