import dashboardStore from '@/store/dashboard.store';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Dashboard Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    dashboardStore.state = {
      timeRange: 'now-6h',
      apiParams: {},
      dashboardData: null,
      loading: false,
      error: null,
      initialized: false
    };
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  it('should update time range', () => {
    // Call updateTimeRange
    dashboardStore.updateTimeRange('now-24h');
    
    // Verify state was updated
    expect(dashboardStore.state.timeRange).toBe('now-24h');
  });

  it('should update API parameters', () => {
    // Sample params
    const params = {
      format: 'json',
      videoconferencia: 'True',
      reunion: 'False'
    };
    
    // Call updateApiParams
    dashboardStore.updateApiParams(params);
    
    // Verify state was updated
    expect(dashboardStore.state.apiParams).toEqual(params);
  });

  it('should fetch dashboard data successfully', async () => {
    // Mock successful API response
    const mockData = { 
      activities: [{ id: 1, name: 'Test Activity' }],
      stats: { total: 10, completed: 8 }
    };
    
    axios.get.mockResolvedValue({ data: mockData });

    // Call fetchDashboardData
    await dashboardStore.fetchDashboardData();
    
    // Verify axios was called
    expect(axios.get).toHaveBeenCalled();
    
    // Verify state was updated
    expect(dashboardStore.state.dashboardData).toEqual(mockData);
    expect(dashboardStore.state.loading).toBe(false);
    expect(dashboardStore.state.error).toBeNull();
    expect(dashboardStore.state.initialized).toBe(true);
  });

  it('should handle fetch dashboard data failure', async () => {
    // Mock API error
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    // Call fetchDashboardData
    await dashboardStore.fetchDashboardData();
    
    // Verify state was updated with error
    expect(dashboardStore.state.loading).toBe(false);
    expect(dashboardStore.state.error).toBe(errorMessage);
    expect(dashboardStore.state.dashboardData).toBeNull();
  });
});