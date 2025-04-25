/**
 * Service for handling Grafana API interactions
 */
class GrafanaService {
  constructor() {
    // Usar la URL del proxy en lugar de la URL directa de Grafana
    this.baseUrl = '/grafana';
    this.apiKey = ''; // Añade tu API key de Grafana si es necesario
  }

  /**
   * Set the base URL for Grafana
   * @param {string} url - The base URL
   */
  setBaseUrl(url) {
    this.baseUrl = url;
  }

  /**
   * Set the API key for Grafana
   * @param {string} key - The API key
   */
  setApiKey(key) {
    this.apiKey = key;
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
      const headers = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      
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
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Obtener token de localStorage si está disponible
      const userStr = localStorage.getItem('user');
      let token = '';
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          token = user.access || user.token || '';
        } catch (e) {
          console.error('Error al analizar datos de usuario:', e);
        }
      }
      
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      } else if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      
      console.log('Headers para la solicitud:', headers);
      
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

  // Método alternativo usando XMLHttpRequest
  async getDataSourcesAlternative() {
    return new Promise((resolve, reject) => {
      // Obtener el token de autenticación
      const userStr = localStorage.getItem('user');
      let token = '';
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          token = user.access || user.token || '';
        } catch (e) {
          console.error('Error al parsear datos de usuario:', e);
        }
      }
      
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.baseUrl}/api/datasources`, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      if (token) {
        xhr.setRequestHeader('Authorization', `Token ${token}`);
      } else if (this.apiKey) {
        xhr.setRequestHeader('Authorization', `Bearer ${this.apiKey}`);
      }
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (e) {
            reject(new Error('Error parsing response: ' + e.message));
          }
        } else {
          reject(new Error('Request failed with status: ' + xhr.status));
        }
      };
      
      xhr.onerror = function() {
        reject(new Error('Network error occurred'));
      };
      
      xhr.send();
    });
  }

  /**
   * Get a specific datasource by ID
   * @param {number} id - The datasource ID
   * @returns {Promise} Promise with datasource data
   */
  async getDataSource(id) {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      
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
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }
      
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
    // Typically you would use 'Authorization' as the key name and 'Bearer {token}' as the value
    return this.updateDataSourceAuth(id, 'Authorization', `Token ${token}`, 'Header');
  }
}

export default new GrafanaService();