import { shallowMount } from '@vue/test-utils';
import MainContent from '@/components/paneles/MainContent.vue';
import dashboardStore from '@/store/dashboard.store';

// Mock the dashboard store
jest.mock('@/store/dashboard.store', () => ({
  updateTimeRange: jest.fn(),
  updateApiParams: jest.fn(),
  fetchDashboardData: jest.fn(),
  state: {
    timeRange: 'now-6h',
    apiParams: {}
  }
}));

describe('MainContent.vue', () => {
  let wrapper;

  beforeEach(() => {
    // Create a fresh wrapper for each test
    wrapper = shallowMount(MainContent, {
      global: {
        stubs: ['GrafanaPanel']
      }
    });
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    // Verify component renders
    expect(wrapper.exists()).toBe(true);
    
    // Check for key elements
    expect(wrapper.find('.filter-panel').exists()).toBe(true);
    expect(wrapper.find('.main-panel').exists()).toBe(true);
  });

  it('initializes with default filter values', () => {
    // Check default values
    expect(wrapper.vm.selectedTimeRange).toBe('now-6h');
    expect(wrapper.vm.activityFilters.videoconference).toBe(true);
    expect(wrapper.vm.activityFilters.meetings).toBe(true);
    expect(wrapper.vm.activityFilters.controlActivities).toBe(true);
    expect(wrapper.vm.activityFilters.punctualActivities).toBe(true);
    expect(wrapper.vm.activityFilters.extraPlanActivities).toBe(true);
    
    expect(wrapper.vm.taskFilters.completed).toBe(true);
    expect(wrapper.vm.taskFilters.incomplete).toBe(true);
    expect(wrapper.vm.taskFilters.inProgress).toBe(true);
    expect(wrapper.vm.taskFilters.postponed).toBe(true);
  });

  it('applies filters correctly', async () => {
    // Set up some filter values
    await wrapper.setData({
      selectedTimeRange: 'now-24h',
      activityFilters: {
        videoconference: true,
        meetings: false,
        controlActivities: true,
        punctualActivities: false,
        extraPlanActivities: true
      }
    });
    
    // Call applyFilters method
    await wrapper.vm.applyFilters();
    
    // Verify store methods were called
    expect(dashboardStore.updateTimeRange).toHaveBeenCalledWith('now-24h');
    expect(dashboardStore.updateApiParams).toHaveBeenCalled();
    expect(dashboardStore.fetchDashboardData).toHaveBeenCalled();
    
    // Verify the API params
    const apiParams = dashboardStore.updateApiParams.mock.calls[0][0];
    expect(apiParams.videoconferencia).toBe('True');
    expect(apiParams.reunion).toBe('False');
    expect(apiParams.actividad_control).toBe('True');
    expect(apiParams.puntualizada).toBe('False');
    expect(apiParams.extra_plan).toBe('True');
  });

  it('resets filters correctly', async () => {
    // First modify filters
    await wrapper.setData({
      selectedTimeRange: 'now-24h',
      activityFilters: {
        videoconference: false,
        meetings: false
      }
    });
    
    // Then reset
    await wrapper.vm.resetFilters();
    
    // Verify filters were reset
    expect(wrapper.vm.selectedTimeRange).toBe('now-6h');
    expect(wrapper.vm.activityFilters.videoconference).toBe(true);
    expect(wrapper.vm.activityFilters.meetings).toBe(true);
    
    // Verify store methods were called
    expect(dashboardStore.updateTimeRange).toHaveBeenCalledWith('now-6h');
    expect(dashboardStore.fetchDashboardData).toHaveBeenCalled();
  });

  it('updates custom date range correctly', async () => {
    // Set date range
    const fromDate = '2023-01-01';
    const toDate = '2023-01-31';
    
    await wrapper.setData({
      dateRange: {
        from: fromDate,
        to: toDate
      }
    });
    
    // Call updateCustomDateRange
    await wrapper.vm.updateCustomDateRange();
    
    // Verify timeRange was updated with timestamp format
    expect(wrapper.vm.selectedTimeRange).toContain('/');
    
    // Verify store method was called
    expect(dashboardStore.updateTimeRange).toHaveBeenCalled();
  });
});