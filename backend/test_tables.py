#!/usr/bin/env python3

print("🚀 Iniciando prueba de creación de tablas...")

try:
    # Importar database (esto debería mostrar el log de DATABASE_URL)
    print("📦 Importando database...")
    import app.database
    
    # Importar models (esto registra las tablas)
    print("📦 Importando models...")
    import app.models
    
    # Importar Base y engine
    from app.database import Base, engine
    
    # Crear tablas
    print("📋 Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("✅ ¡Tablas creadas exitosamente!")
    
    # Verificar que las tablas fueron creadas
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    
    print(f"📊 Tablas encontradas: {tables}")
    
    if 'users' in tables:
        print("✅ Tabla 'users' creada correctamente")
    else:
        print("❌ Tabla 'users' NO encontrada")
        
    if 'usuarios' in tables:
        print("✅ Tabla 'usuarios' creada correctamente")
    else:
        print("❌ Tabla 'usuarios' NO encontrada")

except Exception as e:
    print(f"❌ Error durante la prueba: {e}")
    import traceback
    traceback.print_exc()

print("🏁 Prueba finalizada.") 