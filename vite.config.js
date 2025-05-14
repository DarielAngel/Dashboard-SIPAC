import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // Configuración de Grafana para integración con Vue y plugin Infinity
  
  // Para que Grafana 11.6.1 pueda comunicarse correctamente con tu API a través del plugin Infinity y utilizando tokens de autenticación desde tu frontend Vue, necesitas realizar varias configuraciones:
  
  // ## 1. Configuración del Datasource Infinity
  
  // 1. **Habilitar el modo de autenticación adecuado**:
  //    - Ve a Configuración > Data Sources > yesoreyeram-infinity-datasource
  //    - En la sección "Auth", selecciona "Bearer Token" como método de autenticación
  //    - En el campo "Value", usa la sintaxis `${token}` para que Grafana utilice la variable de dashboard
  
  // 2. **Configurar los hosts permitidos**:
  //    - En la sección "Allowed hosts", añade las URLs de tu API
  //    - Asegúrate de incluir tanto la URL de desarrollo como la de producción
  
  // ## 2. Configuración de Variables en Grafana
  
  // 1. **Crear una variable global para el token**:
  //    - Ve a Dashboard > Settings > Variables
  //    - Crea una nueva variable de tipo "Constant" o "Custom"
  //    - Nombre: `token`
  //    - Valor por defecto: puedes dejarlo vacío o con un valor de prueba
  
  // ## 3. Modificaciones en vite.config.js
  server: {
    proxy: {
      '/grafana': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          // Interceptar todas las solicitudes a Grafana
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Interceptando solicitud a Grafana:', req.url);
            
            // Extraer token de diferentes fuentes
            let token = null;
            
            // 1. Buscar en headers personalizados
            if (req.headers['x-auth-token']) {
              token = req.headers['x-auth-token'];
              console.log('Token encontrado en header X-Auth-Token');
            }
            
            // 2. Buscar en header de autorización
            if (!token && req.headers.authorization) {
              const authHeader = req.headers.authorization;
              if (authHeader.startsWith('Token ') || authHeader.startsWith('Token ')) {
                token = authHeader.split(' ')[1];
                console.log('Token encontrado en header Authorization');
              }
            }
            
            // 3. Buscar en cookies
            if (!token && req.headers.cookie) {
              const cookies = req.headers.cookie.split(';');
              const tokenCookie = cookies.find(c => c.trim().startsWith('grafana_auth_token='));
              if (tokenCookie) {
                token = tokenCookie.split('=')[1];
                console.log('Token encontrado en cookies');
              }
            }
            
            // 4. Buscar en parámetros de URL
            if (!token && req.url) {
              try {
                const url = new URL(req.url, 'http://localhost');
                token = url.searchParams.get('var-token');
                if (token) {
                  console.log('Token encontrado en parámetros URL');
                }
              } catch (e) {
                console.error('Error al parsear URL:', e);
              }
            }
            
            // Si encontramos un token, aplicarlo a la solicitud
            if (token) {
              // Para solicitudes a Infinity o a la API
              if (req.url.includes('/api/ds/query') || 
                  req.url.includes('yesoreyeram-infinity-datasource') || 
                  req.url.includes('proxy')) {
                console.log('Aplicando token a solicitud de Infinity/API');
                
                // Usar el formato que espera tu API
                proxyReq.setHeader('Authorization', `Token ${token}`);
                
                // También añadir como header independiente
                proxyReq.setHeader('X-Auth-Token', token);
                
                // Modificar el cuerpo de la solicitud si es POST
                if (req.method === 'POST' && req.body) {
                  let bodyData = '';
                  req.on('data', chunk => {
                    bodyData += chunk.toString();
                  });
                  
                  req.on('end', () => {
                    try {
                      const body = JSON.parse(bodyData);
                      
                      // Modificar los headers en el cuerpo si existen
                      if (body.headers) {
                        body.headers['Authorization'] = `Token ${token}`;
                      }
                      
                      // Reescribir el cuerpo
                      const modifiedBody = JSON.stringify(body);
                      proxyReq.setHeader('content-length', Buffer.byteLength(modifiedBody));
                      proxyReq.write(modifiedBody);
                      proxyReq.end();
                    } catch (e) {
                      console.error('Error al modificar el cuerpo:', e);
                    }
                  });
                }
              } else {
                // Para otras solicitudes a Grafana
                proxyReq.setHeader('Authorization', `Bearer ${token}`);
              }
            }
          });
          
          // Manejar errores del proxy
          proxy.on('error', (err, req, res) => {
            console.error('Error de proxy:', err);
            if (!res.headersSent) {
              res.writeHead(500, {'Content-Type': 'text/plain'});
              res.end('Error de proxy: ' + err.message);
            }
          });
        }
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
