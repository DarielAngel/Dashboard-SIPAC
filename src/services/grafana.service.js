/**
 * Service for handling Grafana API interactions
 */
class GrafanaService {
  constructor() {
    this.baseUrl = 'http://localhost:3000';
    this.apiKey = ''; // Add your Grafana API key if needed
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
}

export default new GrafanaService();