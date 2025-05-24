import { shallowMount } from '@vue/test-utils';
import GrafanaPanel from '@/components/dashboard/GrafanaPanel.vue';

describe('GrafanaPanel.vue', () => {
  let wrapper;
  const props = {
    title: 'Test Panel',
    subtitle: 'Test Subtitle',
    dashboardId: 'test-dashboard',
    panelId: '1',
    initialTimeRange: 'now-6h',
    authToken: 'test-token',
    apiParams: {
      format: 'json',
      videoconferencia: 'True'
    }
  };

  beforeEach(() => {
    // Create a fresh wrapper for each test
    wrapper = shallowMount(GrafanaPanel, {
      props,
      global: {
        stubs: ['iframe']
      }
    });
  });

  it('renders correctly', () => {
    // Verify component renders
    expect(wrapper.exists()).toBe(true);
    
    // Check for key elements
    expect(wrapper.find('.panel-title').text()).toBe(props.title);
    expect(wrapper.find('.panel-subtitle').text()).toBe(props.subtitle);
  });

  it('builds panel URL correctly', () => {
    // Get the URL from the iframe src
    const iframeSrc = wrapper.vm.buildPanelUrl();
    
    // Verify URL contains expected parameters
    expect(iframeSrc).toContain(`/grafana/d-solo/${props.dashboardId}`);
    expect(iframeSrc).toContain(`panelId=${props.panelId}`);
    expect(iframeSrc).toContain('from=now-6h');
    expect(iframeSrc).toContain('var-format=json');
    expect(iframeSrc).toContain('var-videoconferencia=True');
  });

  it('handles time range updates', async () => {
    // Mock the emit method
    const emitSpy = jest.spyOn(wrapper.vm, '$emit');
    
    // Call handleTimeRangeUpdate
    const newTimeRange = 'now-24h';
    await wrapper.vm.handleTimeRangeUpdate(newTimeRange);
    
    // Verify emit was called with correct parameters
    expect(emitSpy).toHaveBeenCalledWith('update', newTimeRange);
  });

  it('updates iframe URL when props change', async () => {
    // Initial URL
    const initialUrl = wrapper.vm.buildPanelUrl();
    
    // Update props
    await wrapper.setProps({
      initialTimeRange: 'now-24h',
      apiParams: {
        format: 'json',
        videoconferencia: 'False'
      }
    });
    
    // Get new URL
    const newUrl = wrapper.vm.buildPanelUrl();
    
    // Verify URL changed
    expect(newUrl).not.toBe(initialUrl);
    expect(newUrl).toContain('from=now-24h');
    expect(newUrl).toContain('var-videoconferencia=False');
  });
});