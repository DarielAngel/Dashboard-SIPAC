/**
 * Utility functions for the dashboard
 */

/**
 * Format a number with commas as thousands separators
 * @param {number} num - The number to format
 * @returns {string} The formatted number
 */
export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Format a currency value
 * @param {number} value - The value to format
 * @param {string} currency - The currency symbol
 * @returns {string} The formatted currency value
 */
export const formatCurrency = (value, currency = '$') => {
  return `${currency}${formatNumber(value)}`;
};

/**
 * Calculate percentage change
 * @param {number} current - The current value
 * @param {number} previous - The previous value
 * @returns {number} The percentage change
 */
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
};

/**
 * Get a color based on percentage change
 * @param {number} change - The percentage change
 * @returns {string} The color code
 */
export const getChangeColor = (change) => {
  if (change > 0) return '#1cc88a'; // Green for positive
  if (change < 0) return '#e74a3b'; // Red for negative
  return '#858796'; // Gray for no change
};

/**
 * Generate random data for testing
 * @param {number} count - The number of data points
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {Array} Array of random values
 */
export const generateRandomData = (count, min = 0, max = 100) => {
  return Array.from({ length: count }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

/**
 * Group data by a specific time period
 * @param {Array} data - The data array with date properties
 * @param {string} period - The period to group by (day, week, month, year)
 * @param {string} dateField - The name of the date field in the data
 * @param {string} valueField - The name of the value field in the data
 * @returns {Array} The grouped data
 */
export const groupDataByPeriod = (data, period, dateField = 'date', valueField = 'value') => {
  if (!data || !data.length) return [];
  
  const result = {};
  
  data.forEach(item => {
    const date = new Date(item[dateField]);
    let key;
    
    switch (period) {
      case 'day':
        key = `${date.getHours()}:00`;
        break;
      case 'week':
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        key = days[date.getDay()];
        break;
      case 'month':
        key = `Semana ${Math.ceil(date.getDate() / 7)}`;
        break;
      case 'year':
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        key = months[date.getMonth()];
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    if (!result[key]) {
      result[key] = 0;
    }
    
    result[key] += Number(item[valueField]);
  });
  
  return Object.entries(result).map(([label, value]) => ({ label, value }));
};