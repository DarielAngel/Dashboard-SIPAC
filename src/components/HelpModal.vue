<template>
  <div v-if="show" class="help-modal-overlay" @click.self="close">
    <div class="help-modal">
      <div class="help-modal-header">
        <h2>Guía de Usuario - Dashboard SIPAC</h2>
        <button class="close-btn" @click="close">&times;</button>
      </div>
      <div class="help-modal-content">
        <div class="help-sidebar">
          <div 
            v-for="(section, index) in sections" 
            :key="index" 
            class="sidebar-item"
            :class="{ active: activeSection === index }"
            @click="activeSection = index"
          >
            <i :class="section.icon"></i>
            {{ section.title }}
          </div>
        </div>
        <div class="help-main-content">
          <div class="help-section" v-if="activeSection === 0">
            <h3><i class="fas fa-info-circle"></i> Introducción</h3>
            <p>Bienvenido al Dashboard SIPAC, una herramienta diseñada para visualizar y analizar actividades, procesos y estadísticas de manera eficiente. Esta guía le ayudará a entender cómo utilizar todas las funcionalidades disponibles.</p>
            <div class="feature-cards">
              <div class="feature-card">
                <i class="fas fa-chart-line"></i>
                <h4>Análisis</h4>
                <p>Visualice tendencias y patrones en sus actividades</p>
              </div>
              <div class="feature-card">
                <i class="fas fa-filter"></i>
                <h4>Filtrado</h4>
                <p>Filtre datos por múltiples criterios</p>
              </div>
              <div class="feature-card">
                <i class="fas fa-file-export"></i>
                <h4>Exportación</h4>
                <p>Exporte datos en diferentes formatos</p>
              </div>
            </div>
          </div>

          <div class="help-section" v-if="activeSection === 1">
            <h3><i class="fas fa-compass"></i> Navegación</h3>
            <p>El panel lateral izquierdo (sidebar) contiene las principales secciones de la aplicación:</p>
            <div class="nav-items">
              <div class="nav-item">
                <i class="fas fa-chart-bar"></i>
                <div>
                  <h4>Actividades</h4>
                  <p>Vista general con estadísticas y gráficos principales</p>
                </div>
              </div>
              <div class="nav-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Actividades por lugares y estrategias</h4>
                  <p>Análisis de actividades por ubicación y estrategia</p>
                </div>
              </div>
              <div class="nav-item">
                <i class="fas fa-bullseye"></i>
                <div>
                  <h4>Actividades por objetivos estratégicos</h4>
                  <p>Análisis de actividades por objetivos</p>
                </div>
              </div>
              <div class="nav-item">
                <i class="fas fa-project-diagram"></i>
                <div>
                  <h4>Actividades por procesos estratégicos</h4>
                  <p>Análisis de actividades por proceso</p>
                </div>
              </div>
              <div class="nav-item">
                <i class="fas fa-tasks"></i>
                <div>
                  <h4>Planes</h4>
                  <p>Gestión y visualización de planes</p>
                </div>
              </div>
            </div>
          </div>

          <div class="help-section" v-if="activeSection === 2">
            <h3><i class="fas fa-filter"></i> Filtros</h3>
            <p>En cada sección encontrará diferentes opciones de filtrado:</p>
            <div class="filter-options">
              <div class="filter-option">
                <div class="filter-icon"><i class="fas fa-calendar-alt"></i></div>
                <div class="filter-details">
                  <h4>Rango de fechas</h4>
                  <p>Seleccione un período específico o utilice rangos predefinidos</p>
                </div>
              </div>
              <div class="filter-option">
                <div class="filter-icon"><i class="fas fa-calendar-day"></i></div>
                <div class="filter-details">
                  <h4>Mes y Año</h4>
                  <p>Filtre por un mes y/o año específico</p>
                </div>
              </div>
              <div class="filter-option">
                <div class="filter-icon"><i class="fas fa-list-ul"></i></div>
                <div class="filter-details">
                  <h4>Tipos de actividad</h4>
                  <p>Filtre por videoconferencias, reuniones, actividades de control, etc.</p>
                </div>
              </div>
              <div class="filter-option">
                <div class="filter-icon"><i class="fas fa-map-marker-alt"></i></div>
                <div class="filter-details">
                  <h4>Lugares</h4>
                  <p>Filtre actividades por ubicación</p>
                </div>
              </div>
              <div class="filter-option">
                <div class="filter-icon"><i class="fas fa-project-diagram"></i></div>
                <div class="filter-details">
                  <h4>Procesos</h4>
                  <p>Filtre actividades por proceso (permite selección múltiple)</p>
                </div>
              </div>
            </div>
            <div class="tip-box">
              <i class="fas fa-lightbulb"></i>
              <p>Después de seleccionar los filtros deseados, haga clic en "Aplicar filtros" para actualizar la visualización.</p>
            </div>
          </div>

          <div class="help-section" v-if="activeSection === 3">
            <h3><i class="fas fa-chart-line"></i> Gráficos y Estadísticas</h3>
            <p>Los gráficos se actualizan automáticamente según los filtros aplicados. Puede interactuar con ellos de varias formas:</p>
            <ul class="interactive-list">
              <li><i class="fas fa-mouse-pointer"></i> Pase el cursor sobre los elementos para ver información detallada</li>
              <li><i class="fas fa-list"></i> Haga clic en elementos de leyendas para mostrar/ocultar series</li>
              <li><i class="fas fa-search-plus"></i> Use los controles de zoom para ampliar áreas específicas</li>
            </ul>
            <div class="chart-example">
              <img src="https://via.placeholder.com/500x250?text=Ejemplo+de+Gráfico" alt="Ejemplo de gráfico">
              <div class="chart-caption">Ejemplo de interacción con gráficos</div>
            </div>
          </div>

          <div class="help-section" v-if="activeSection === 4">
            <h3><i class="fas fa-file-export"></i> Exportación de Datos</h3>
            <p>Para exportar datos o gráficos:</p>
            <div class="steps-container">
              <div class="step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>Aplicar filtros</h4>
                  <p>Seleccione los filtros deseados para los datos que quiere exportar</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>Buscar icono de descarga</h4>
                  <p>Localice el icono de descarga en la esquina superior derecha de cada panel</p>
                </div>
              </div>
              <div class="step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>Seleccionar formato</h4>
                  <p>Elija el formato deseado (CSV, Excel, PDF o imagen)</p>
                </div>
              </div>
            </div>
          </div>

          <div class="help-section" v-if="activeSection === 5">
            <h3><i class="fas fa-question-circle"></i> Soporte</h3>
            <p>Si encuentra algún problema o necesita asistencia adicional, contacte al equipo de soporte a través de:</p>
            <div class="support-options">
              <div class="support-option">
                <i class="fas fa-envelope"></i>
                <h4>Email</h4>
                <p>soporte@sipac.cu</p>
              </div>
              <div class="support-option">
                <i class="fas fa-phone-alt"></i>
                <h4>Teléfono</h4>
                <p>(123) 456-7890</p>
              </div>
              <div class="support-option">
                <i class="fas fa-comments"></i>
                <h4>Chat en vivo</h4>
                <p>Disponible de 9:00 AM a 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="help-modal-footer">
        <button class="btn-secondary" @click="close">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const activeSection = ref(0);

const sections = [
  { title: 'Introducción', icon: 'fas fa-info-circle' },
  { title: 'Navegación', icon: 'fas fa-compass' },
  { title: 'Filtros', icon: 'fas fa-filter' },
  { title: 'Gráficos', icon: 'fas fa-chart-line' },
  { title: 'Exportación', icon: 'fas fa-file-export' },
  { title: 'Soporte', icon: 'fas fa-question-circle' }
];

const close = () => {
  emit('close');
};
</script>

<style scoped>
.help-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  backdrop-filter: blur(3px);
}

.help-modal {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 1000px;
  height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.help-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #eaeaea;
  background: linear-gradient(135deg, #2a1b3d, #5e2c8a);
  color: white;
}

.help-modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: white;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

.help-modal-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.help-sidebar {
  width: 220px;
  background-color: #f8f9fa;
  border-right: 1px solid #eaeaea;
  padding: 20px 0;
  overflow-y: auto;
}

.sidebar-item {
  padding: 12px 20px;
  cursor: pointer;
  color: #495057;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.sidebar-item i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.sidebar-item:hover {
  background-color: #f1f3f5;
  color: #5e2c8a;
}

.sidebar-item.active {
  background-color: #e9ecef;
  color: #5e2c8a;
  border-left: 3px solid #5e2c8a;
}

.help-main-content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}

.help-section {
  max-width: 800px;
  margin: 0 auto;
}

.help-section h3 {
  color: #2a1b3d;
  margin-bottom: 20px;
  font-size: 1.4rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.help-section h3 i {
  margin-right: 10px;
  color: #5e2c8a;
}

.help-section p {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* Estilos para las tarjetas de características */
.feature-cards {
  display: flex;
  gap: 20px;
  margin: 30px 0;
}

.feature-card {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.feature-card i {
  font-size: 2rem;
  color: #5e2c8a;
  margin-bottom: 15px;
}

.feature-card h4 {
  color: #2a1b3d;
  margin-bottom: 10px;
}

/* Estilos para los elementos de navegación */
.nav-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.nav-item {
  display: flex;
  align-items: flex-start;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.nav-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.nav-item i {
  font-size: 1.5rem;
  color: #5e2c8a;
  margin-right: 15px;
  margin-top: 5px;
}

.nav-item h4 {
  color: #2a1b3d;
  margin: 0 0 5px 0;
}

.nav-item p {
  margin: 0;
  font-size: 0.9rem;
}

/* Estilos para las opciones de filtro */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

.filter-option {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  transition: transform 0.2s;
}

.filter-option:hover {
  transform: translateX(5px);
}

.filter-icon {
  width: 50px;
  height: 50px;
  background-color: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.filter-icon i {
  font-size: 1.2rem;
  color: #5e2c8a;
}

.filter-details h4 {
  color: #2a1b3d;
  margin: 0 0 5px 0;
}

.filter-details p {
  margin: 0;
  font-size: 0.9rem;
}

/* Caja de consejos */
.tip-box {
  background-color: #e9f7fe;
  border-left: 4px solid #3498db;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.tip-box i {
  font-size: 1.5rem;
  color: #3498db;
  margin-right: 15px;
}

.tip-box p {
  margin: 0;
  color: #2980b9;
}

/* Lista interactiva */
.interactive-list {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.interactive-list li {
  padding: 10px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.interactive-list li i {
  margin-right: 10px;
  color: #5e2c8a;
  width: 20px;
  text-align: center;
}

/* Ejemplo de gráfico */
.chart-example {
  margin: 20px 0;
  text-align: center;
}

.chart-example img {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.chart-caption {
  margin-top: 10px;
  font-style: italic;
  color: #6c757d;
}

/* Pasos numerados */
.steps-container {
  margin: 30px 0;
}

.step {
  display: flex;
  margin-bottom: 20px;
}

.step-number {
  width: 40px;
  height: 40px;
  background-color: #5e2c8a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 15px;
  flex-shrink: 0;
}

.step-content h4 {
  margin: 0 0 5px 0;
  color: #2a1b3d;
}

.step-content p {
  margin: 0;
}

/* Opciones de soporte */
.support-options {
  display: flex;
  gap: 20px;
  margin: 30px 0;
}

.support-option {
  flex: 1;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.support-option i {
  font-size: 2rem;
  color: #5e2c8a;
  margin-bottom: 15px;
}

.support-option h4 {
  color: #2a1b3d;
  margin-bottom: 10px;
}

.support-option p {
  margin: 0;
}

.help-modal-footer {
  padding: 15px 30px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: flex-end;
  background-color: #f8f9fa;
}

.btn-secondary {
  background-color: #5e2c8a;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #4a2370;
}

@media (max-width: 768px) {
  .help-modal {
    width: 95%;
    height: 90vh;
  }
  
  .help-modal-content {
    flex-direction: column;
  }
  
  .help-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eaeaea;
    padding: 10px 0;
  }
  
  .sidebar-item {
    padding: 8px 15px;
  }
  
  .feature-cards, .support-options {
    flex-direction: column;
  }
  
  .help-main-content {
    padding: 20px;
  }
}
</style>