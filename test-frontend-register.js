// Simular registro desde frontend con PostgreSQL
const userData = {
  username: "frontend_user",
  email: "frontend@sportmatch.com",
  password: "12345678",
  deportes_preferidos: "Fútbol,Tenis,Running",
  descripcion: "Usuario creado desde frontend con PostgreSQL",
  foto_url: "https://example.com/foto.jpg",
  age: 24,
  location: "Buenos Aires"
};

console.log('🖥️ Probando registro desde frontend...');
console.log('📊 Datos a enviar:', userData);

fetch('http://localhost:8000/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(userData)
})
.then(response => {
  console.log(`📈 Status: ${response.status}`);
  return response.json();
})
.then(data => {
  console.log('✅ Respuesta del servidor:', data);
  if (data.message === "Usuario registrado correctamente") {
    console.log('🎉 ¡Registro exitoso desde frontend con PostgreSQL!');
  }
})
.catch(error => {
  console.error('❌ Error:', error);
}); 