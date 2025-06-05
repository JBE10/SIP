#!/usr/bin/env node

// scripts/find-railway-backend.js
const https = require('https');

const possibleUrls = [
  'https://sip-production.up.railway.app',
  'https://backend-production.up.railway.app', 
  'https://api-production.up.railway.app',
  // Agregar aquí otras posibles URLs si las conoces
];

const endpoints = [
  '/docs',
  '/openapi.json', 
  '/auth/register',
  '/health'
];

function testEndpoint(baseUrl, endpoint) {
  return new Promise((resolve) => {
    const url = new URL(endpoint, baseUrl);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'GET',
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url: url.toString(),
          status: res.statusCode,
          headers: res.headers,
          isApi: res.headers['content-type']?.includes('json') || 
                 res.headers['content-type']?.includes('html') &&
                 (data.includes('FastAPI') || data.includes('swagger') || data.includes('openapi'))
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        url: url.toString(),
        status: 'ERROR',
        error: err.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url: url.toString(),
        status: 'TIMEOUT'
      });
    });

    req.end();
  });
}

async function findBackend() {
  console.log('🔍 Buscando el backend en Railway...\n');
  
  for (const baseUrl of possibleUrls) {
    console.log(`🌐 Probando: ${baseUrl}`);
    
    for (const endpoint of endpoints) {
      const result = await testEndpoint(baseUrl, endpoint);
      
      const status = result.status === 'ERROR' ? '❌' : 
                     result.status === 'TIMEOUT' ? '⏱️' : 
                     result.status === 200 ? '✅' : 
                     result.status === 404 ? '🚫' : '⚠️';
      
      console.log(`  ${status} ${result.url} - ${result.status}`);
      
      if (result.isApi) {
        console.log(`    🎯 ¡Posible API encontrada!`);
      }
    }
    console.log('');
  }
}

findBackend().catch(console.error); 