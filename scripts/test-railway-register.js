#!/usr/bin/env node

// scripts/test-railway-register.js
const https = require('https');

const userData = {
  username: "bauti123_test",
  email: "bauti_test@sportmatch.com",
  password: "12345678",
  deportes_preferidos: "Fútbol,Tenis",
  descripcion: "Usuario de prueba desde script",
  foto_url: "https://miurl.com/foto.jpg",
  video_url: "https://miurl.com/video.mp4",
  age: 22,
  location: "CABA"
};

const postData = JSON.stringify(userData);

const options = {
  hostname: 'sip-production.up.railway.app',
  port: 443,
  path: '/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🚂 Probando registro en Railway...');
console.log('📡 Endpoint:', `https://${options.hostname}${options.path}`);
console.log('📊 Datos a enviar:', userData);
console.log('⏳ Enviando request...\n');

const req = https.request(options, (res) => {
  console.log(`📈 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n📥 Respuesta del servidor:');
    try {
      const jsonResponse = JSON.parse(data);
      console.log(JSON.stringify(jsonResponse, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\n✅ ¡Registro exitoso en Railway!');
      } else {
        console.log('\n❌ Error en el registro');
      }
    } catch (err) {
      console.log('📝 Respuesta (texto plano):', data);
    }
  });
});

req.on('error', (err) => {
  console.error('💥 Error en la request:', err);
});

// Enviar los datos
req.write(postData);
req.end(); 