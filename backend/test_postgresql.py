#!/usr/bin/env python3

import sys
from app.database import engine, Base
from app import models
import sqlalchemy as sa

def test_postgresql_connection():
    try:
        print("🐘 Probando conexión a PostgreSQL de Railway...")
        
        # Probar conexión
        with engine.connect() as conn:
            result = conn.execute(sa.text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ Conexión exitosa!")
            print(f"📋 Versión de PostgreSQL: {version}")
        
        print("\n📋 Creando tablas...")
        
        # Crear todas las tablas
        Base.metadata.create_all(bind=engine)
        print("✅ Tablas creadas exitosamente!")
        
        # Verificar tablas creadas
        with engine.connect() as conn:
            result = conn.execute(sa.text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = [row[0] for row in result.fetchall()]
            print(f"📄 Tablas en la base de datos: {tables}")
        
        print("\n🎉 PostgreSQL configurado correctamente!")
        return True
        
    except Exception as e:
        print(f"❌ Error conectando a PostgreSQL: {e}")
        print(f"🔍 Tipo de error: {type(e).__name__}")
        return False

if __name__ == "__main__":
    success = test_postgresql_connection()
    sys.exit(0 if success else 1) 