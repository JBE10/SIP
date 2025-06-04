import os
print("Testing database connection...")

# Cargar DATABASE_URL
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL: {DATABASE_URL[:50] if DATABASE_URL else 'None'}...")

# Probar conexión
try:
    from sqlalchemy import create_engine
    engine = create_engine(DATABASE_URL)
    print("Engine created successfully")
    
    # Probar conexión real
    with engine.connect() as conn:
        result = conn.execute("SELECT 1")
        print("Connection test successful!")
        
except Exception as e:
    print(f"Error: {e}")
    
print("Test completed.") 