<style scoped>
.grafana-panel {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2a1b3d;
  margin-bottom: 5px;
}

.panel-subtitle {
  font-size: 0.9rem;
  color: #67748e;
}

.panel-content {
  flex: 1;
  padding: 15px;
  position: relative;
}

.panel-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-button {
  background-color: transparent;
  border: 1px solid #d2d6da;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  color: #67748e;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.toolbar-button:hover {
  background-color: #f8f9fa;
  color: #344767;
}

.toolbar-button.active {
  background-color: #5e2c8a;
  color: white;
  border-color: #5e2c8a;
}

.grafana-iframe {
  width: 100%;
  height: 100%;
  border: none;
  min-height: 400px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(94, 44, 138, 0.1);
  border-radius: 50%;
  border-top-color: #5e2c8a;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>