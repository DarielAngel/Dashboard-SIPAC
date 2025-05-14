/**
 * Service for handling Grafana API interactions
 */
class GrafanaService {
  constructor() {
    // Usar la URL del proxy en lugar de la URL directa de Grafana
    this.baseUrl = '/api/grafana-proxy';
    this.djangoToken = '';
    this.grafanaToken = '';
  }

  /**
   * Set the base URL for Grafana
   * @param {string} url - The base URL
   */
  setBaseUrl(url) {
    this.baseUrl = url;
  }

  /**
   * Set the Django token
   * @param {string} token - The Django authentication token
   */
  setDjangoToken(token) {
    this.djangoToken = token;
  }

  /**
   * Set the Grafana token
   * @param {string} token - The Grafana API key
   */
  setGrafanaToken(token) {
    this.grafanaToken = token;
  }

  /**
   * Get the URL for a Grafana panel
   * @param {string} dashboardId - The dashboard ID
   * @param {string} panelId - The panel ID
   * @param {string} timeRange - The time range (e.g., 'now-6h')
   * @param {Object} options - Additional options
   * @returns {string} The panel URL
   */
  getPanelUrl(dashboardId, panelId, timeRange = 'now-6h', options = {}) {
    const baseUrl = `${this.baseUrl}/d-solo/${dashboardId}`;
    const params = new URLSearchParams();
    
    params.append('orgId', options.orgId || 1);
    params.append('from', timeRange);
    params.append('to', 'now');
    params.append('panelId', panelId);
    params.append('refresh', options.refresh || '1h');
    params.append('theme', options.theme || 'light');
    params.append('_t', Date.now());
    
    if (options.kiosk) {
      params.append('kiosk', true);
    }
    
    // Agregar el token de autenticación como parámetro de la URL
    if (this.grafanaToken) {
      params.append('auth_token', this.grafanaToken);
    }
    
    return `${baseUrl}?${params.toString()}`;

  }

  /**
   * Get the render URL for a Grafana panel (for preloading)
   * @param {string} dashboardId - The dashboard ID
   * @param {string} panelId - The panel ID
   * @param {Object} options - Additional options
   * @returns {string} The render URL
   */
  getRenderUrl(dashboardId, panelId, options = {}) {
    const baseUrl = `${this.baseUrl}/render/d-solo/${dashboardId}`;
    const params = new URLSearchParams();
    
    params.append('orgId', options.orgId || 1);
    params.append('panelId', panelId);
    params.append('width', options.width || 800);
    params.append('height', options.height || 300);
    params.append('_t', Date.now());
    
    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Fetch dashboard data from Grafana API
   * @param {string} dashboardId - The dashboard ID
   * @returns {Promise} Promise with dashboard data
   */
  async fetchDashboard(dashboardId) {
    try {
      const headers = this.getAuthHeaders();
      
      console.log('Headers para fetchDashboard:', {
        ...headers,
        'Authorization': headers['Authorization'] ? '****' : undefined,
        'Grafana-Token': headers['Grafana-Token'] ? '****' : undefined
      });
      
      const response = await fetch(`${this.baseUrl}/api/dashboards/uid/${dashboardId}`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching dashboard: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching Grafana dashboard:', error);
      throw error;
    }
  }

  /**
   * Get all datasources from Grafana
   * @returns {Promise} Promise with datasources data
   */
  async getDataSources() {
    try {
      const headers = this.getAuthHeaders();
      
      console.log('Headers para la solicitud:', {
        ...headers,
        'Authorization': headers['Authorization'] ? '****' : undefined,
        'Grafana-Token': headers['Grafana-Token'] ? '****' : undefined
      });
      
      const response = await fetch(`${this.baseUrl}/api/datasources`, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`Error al obtener datasources: ${response.statusText}`);
      }

      console.log(response);
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener datasources de Grafana:', error);
      throw error;
    }
  }

  // Método para obtener los headers de autenticación
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
      'Django-Token': this.djangoToken
    };
    
    if (this.grafanaToken) {
      // Asegurar que el token se envíe en el formato correcto para Grafana
      headers['Authorization'] = `Token ${this.grafanaToken}`;
      // Agregar el token también como Grafana-Token para compatibilidad
      headers['Grafana-Token'] = this.grafanaToken;
    }

    // Registrar los headers para monitoreo
    this.logRequestHeaders(headers);
    
    return headers;
  }

  /**
   * Registra y valida los headers de la solicitud
   * @param {Object} headers - Los headers de la solicitud
   * @private
   */
  logRequestHeaders(headers) {
    const timestamp = new Date().toISOString();
    const hasAuthToken = 'Authorization' in headers;
    const authFormat = hasAuthToken ? headers['Authorization'].startsWith('Token ') : false;

    console.log(`[${timestamp}] Grafana API Request Headers:`, {
      hasAuthToken,
      authFormat,
      headers: {
        ...headers,
        'Authorization': hasAuthToken ? '****' : undefined // Ocultar el token real por seguridad
      }
    });

    if (!hasAuthToken) {
      console.warn(`[${timestamp}] Advertencia: Solicitud sin token de autorización`);
    } else if (!authFormat) {
      console.warn(`[${timestamp}] Advertencia: Token de autorización con formato incorrecto`);
    }
  }

  /**
   * Get a specific datasource by ID
   * @param {number} id - The datasource ID
   * @returns {Promise} Promise with datasource data
   */
  async getDataSource(id) {
    try {
      const headers = this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/api/datasources/${id}`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching datasource: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching Grafana datasource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a datasource with API Key Value pair authentication
   * @param {number} id - The datasource ID
   * @param {string} keyName - The key name (e.g., 'Authorization')
   * @param {string} keyValue - The key value (e.g., 'Token BNIET4JLJGLUG')
   * @param {string} addTo - Where to add the key (e.g., 'Header' or 'Query Param')
   * @returns {Promise} Promise with updated datasource data
   */
  async updateDataSourceAuth(id, keyName, keyValue, addTo = 'Header') {
    try {
      // First get the current datasource configuration
      const datasource = await this.getDataSource(id);
      
      // Update the authentication settings
      datasource.jsonData = datasource.jsonData || {};
      datasource.secureJsonData = datasource.secureJsonData || {};
      
      // Set authentication type to API Key Value pair
      datasource.jsonData.httpHeaderName1 = keyName;
      datasource.secureJsonData.httpHeaderValue1 = keyValue;
      
      // Set where to add the key (Header or Query Param)
      if (addTo.toLowerCase().includes('header')) {
        datasource.jsonData.authType = 'apiKey';
        datasource.jsonData.apiKeyInHeader = true;
      } else if (addTo.toLowerCase().includes('query') || addTo.toLowerCase().includes('param')) {
        datasource.jsonData.authType = 'apiKey';
        datasource.jsonData.apiKeyInHeader = false;
      }
      
      // Reset secure JSON fields to update the secure values
      datasource.secureJsonFields = {};
      
      const headers = this.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/api/datasources/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(datasource)
      });
      
      if (!response.ok) {
        throw new Error(`Error updating datasource: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating Grafana datasource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a datasource with the token from your authentication service
   * @param {number} id - The datasource ID
   * @param {string} token - The authentication token
   * @returns {Promise} Promise with updated datasource data
   */
  async updateDataSourceWithToken(id, token) {
    // Configurar el token en el formato correcto para la API
    return this.updateDataSourceAuth(id, 'Authorization', `Token ${token}`, 'Header');
  }
}

export default new GrafanaService();