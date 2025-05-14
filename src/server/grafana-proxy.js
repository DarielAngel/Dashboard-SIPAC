const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const router = express.Router();

// Configuración del proxy para Grafana
router.use('/grafana-proxy', (req, res, next) => {
  // Obtener el token de Django y Grafana de los headers
  const djangoToken = req.headers['django-token'];
  const grafanaToken = process.env.GRAFANA_API_KEY || req.headers['grafana-token'];

  // Verificar que tenemos el token de Django
  if (!djangoToken) {
    return res.status(401).json({ error: 'Django token no proporcionado' });
  }

  // Crear el middleware de proxy con la configuración adecuada
  const proxyMiddleware = createProxyMiddleware({
    target: process.env.GRAFANA_URL || 'http://localhost:3000',
    changeOrigin: true,
    pathRewrite: {
      '^/api/grafana-proxy': '',
    },
    onProxyReq: (proxyReq, req) => {
      console.log('Headers originales de la solicitud:', req.headers);

      // Determinar si la solicitud es para el datasource Infinity
      const isInfinityRequest = req.url.includes('yesoreyeram-infinity-datasource') || 
                               req.url.includes('api/ds/query');

      // Añadir el token de Grafana al header de la solicitud
      if (grafanaToken) {
        // Para solicitudes a Infinity, usar el formato que espera la API de Django
        if (isInfinityRequest) {
          // Formato para Django API: Token {token}
          // Modificar para usar el formato exacto que espera tu API
          proxyReq.setHeader('Authorization', `Token ${djangoToken}`);
          
          // También añadir como X-API-Key para mayor compatibilidad
          proxyReq.setHeader('X-API-Key', djangoToken);
          
          // Asegurarse de que el token se pasa como variable para Infinity
          proxyReq.setHeader('X-Grafana-Token', grafanaToken);
          proxyReq.setHeader('X-Django-Token', djangoToken);
        } else {
          // Para otras solicitudes a Grafana, usar Bearer
          proxyReq.setHeader('Authorization', `Bearer ${grafanaToken}`);
        }
      }

      // NO sobrescribir los headers de autorización existentes si no tenemos tokens propios
      if (!grafanaToken && req.headers.authorization) {
        proxyReq.setHeader('Authorization', req.headers.authorization);
      }

      // Copiar los parámetros de consulta de la API como headers
      if (req.query) {
        Object.keys(req.query).forEach(key => {
          if (key !== 'authToken') {
            proxyReq.setHeader(`X-Query-${key}`, req.query[key]);
          }
        });
      }

      // Para solicitudes Infinity, añadir headers específicos para la API de Django
      if (isInfinityRequest) {
        // Añadir token como cookie para mayor compatibilidad
        proxyReq.setHeader('Cookie', `grafana_session=${grafanaToken}; django_token=${djangoToken}`);
        
        // Añadir headers CORS para evitar problemas de acceso
        proxyReq.setHeader('Access-Control-Allow-Origin', '*');
        proxyReq.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-API-Key');
        
        // Modificar el cuerpo de la solicitud para incluir el token si es POST
        if (req.method === 'POST' && req.body) {
          try {
            const contentType = proxyReq.getHeader('content-type');
            if (contentType && contentType.includes('application/json')) {
              let bodyStr = req.body.toString();
              let body = JSON.parse(bodyStr);
              
              // Añadir token al cuerpo de la solicitud para datasources
              if (!body.headers) body.headers = {};
              
              // Usar el formato específico para Django API
              body.headers['Authorization'] = `Token ${djangoToken}`;
              body.headers['X-API-Key'] = djangoToken;
              
              const modifiedBody = JSON.stringify(body);
              proxyReq.setHeader('content-length', Buffer.byteLength(modifiedBody));
              proxyReq.write(modifiedBody);
              proxyReq.end();
            }
          } catch (e) {
            console.error('Error al modificar el cuerpo de la solicitud:', e);
          }
        }
      }

      console.log('Headers modificados de la solicitud proxy:', {
        ...Object.fromEntries(proxyReq.getHeaders()),
        'Authorization': '****',
        'X-Grafana-Token': '****',
        'X-Django-Token': '****'
      });
    },
    onProxyRes: (proxyRes, req, res) => {
      // Añadir headers CORS a la respuesta
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type, X-API-Key';
      
      // Manejar errores de autenticación y autorización
      if (proxyRes.statusCode === 401 || proxyRes.statusCode === 403) {
        console.log(`Error de autenticación/autorización en Grafana: ${proxyRes.statusCode}`);
        console.log('Headers de la solicitud:', req.headers);
        console.log('URL de la solicitud:', req.url);
        
        // Capturar el cuerpo de la respuesta para diagnóstico
        let responseBody = '';
        proxyRes.on('data', (chunk) => {
          responseBody += chunk;
        });
        
        proxyRes.on('end', () => {
          console.log('Respuesta del servidor:', responseBody);
          
          const errorMessage = proxyRes.statusCode === 401 
            ? 'Error de autenticación en Grafana' 
            : 'Error de autorización en Grafana - Verifique los permisos del token';
          
          // No modificar la respuesta si ya ha sido enviada
          if (!res.headersSent) {
            res.status(proxyRes.statusCode).json({ 
              error: errorMessage,
              details: responseBody
            });
          }
        });
      }
    },
  });

  // Aplicar el middleware
  return proxyMiddleware(req, res, next);
});

module.exports = router;