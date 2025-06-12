<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">S</span>
        <span class="logo-text">Dashboard - SIPAC</span>
      </div>
    </div>
    
    <div class="sidebar-menu">
      <div class="menu-item" 
           :class="{ active: activeItem === 'dashboard' }"
           @click="changeSection('dashboard')">
        <i class="fas fa-tachometer-alt"></i>
        <span class="menu-text">Actividades</span>
      </div>
      
      <!-- <div class="menu-item" 
           :class="{ active: activeItem === 'tables' }"
           @click="changeSection('tables')">
        <i class="fas fa-table"></i>
        <span class="menu-text">Tables</span>
      </div> -->

      <div class="menu-item" 
           :class="{ active: activeItem === 'actividades_lugar_estrategia' }"
           @click="changeSection('actividades_lugar_estrategia')">
        <i class="fas fa-project-diagram"></i>
        <span class="menu-text">Actividades por lugares y estrategias</span>
      </div>

      <div class="menu-item" 
           :class="{ active: activeItem === 'actividades_objetivos' }"
           @click="changeSection('actividades_objetivos')">
        <i class="fas fa-project-diagram"></i>
        <span class="menu-text">Actividades por objetivos estratégico</span>
      </div>

      <div class="menu-item" 
           :class="{ active: activeItem === 'actividades_procesos' }"
           @click="changeSection('actividades_procesos')">
        <i class="fas fa-project-diagram"></i>
        <span class="menu-text">Actividades por procesos estratégicos</span>
      </div>

      <div class="menu-item" 
           :class="{ active: activeItem === 'planes' }"
           @click="changeSection('planes')">
        <i class="fas fa-project-diagram"></i>
        <span class="menu-text">Planes</span>
      </div>



      <!-- <div class="menu-item" 
           :class="{ active: activeItem === 'pruebas' }"
           @click="changeSection('pruebas')">
        <i class="fas fa-vial"></i>
        <span class="menu-text">Prueba</span>
      </div>
      
      <div class="menu-item" 
           :class="{ active: activeItem === 'billing' }"
           @click="changeSection('billing')">
        Billing
      </div>
      
      <div class="menu-item" 
           :class="{ active: activeItem === 'virtual-reality' }"
           @click="changeSection('virtual-reality')">
        Virtual Reality
      </div>
      
      <div class="menu-item" 
           :class="{ active: activeItem === 'rtl' }"
           @click="changeSection('rtl')">
        RTL
      </div> -->
      
      <!-- <div class="section-title">ACCOUNT PAGES</div>

      <div class="menu-item" 
           :class="{ active: activeItem === 'profile' }"
           @click="changeSection('profile')">
        <i class="fas fa-user"></i>
        <span class="menu-text">Profile</span>
      </div>
      
      <router-link to="/login" class="menu-item" :class="{ active: activeItem === 'signin' }">
        <i class="fas fa-sign-in-alt"></i>
        <span class="menu-text">Sign In</span>
      </router-link>
      
      <router-link to="/register" class="menu-item" :class="{ active: activeItem === 'signup' }">
        <i class="fas fa-user-plus"></i>
        <span class="menu-text">Sign Up</span>
      </router-link> -->
    </div>
    
    <div class="sidebar-footer">
      <div class="help-section">
        <div class="help-title">Need Help?</div>
        <button class="support-btn" @click="openHelpModal">Ayuda</button>
        <button class="contact-btn" @click="contactSupport">Contact support</button>
      </div>
    </div>
  </div>
  
  <!-- Modal de Ayuda -->
  <div v-if="showHelpModal" class="help-modal-overlay" @click.self="closeHelpModal">
    <div class="help-modal">
      <div class="help-modal-header">
        <h2>Guía de Usuario - Dashboard SIPAC</h2>
        <button class="close-btn" @click="closeHelpModal">&times;</button>
      </div>
      <div class="help-modal-content">
        <div class="help-section">
          <h3>Introducción</h3>
          <p>Bienvenido al Dashboard SIPAC, una herramienta diseñada para visualizar y analizar actividades, procesos y estadísticas de manera eficiente. Esta guía le ayudará a entender cómo utilizar todas las funcionalidades disponibles.</p>
        </div>

        <div class="help-section">
          <h3>Navegación</h3>
          <p>El panel lateral izquierdo (sidebar) contiene las principales secciones de la aplicación:</p>
          <ul>
            <li><strong>Actividades:</strong> Vista general con estadísticas y gráficos principales</li>
            <li><strong>Actividades por lugares y estrategias:</strong> Análisis de actividades por ubicación y estrategia</li>
            <li><strong>Actividades por objetivos estratégico:</strong> Análisis de actividades por objetivos</li>
            <li><strong>Actividades por procesos estratégicos:</strong> Análisis de actividades por proceso</li>
            <li><strong>Planes:</strong> Gestión y visualización de planes</li>
          </ul>
        </div>

        <div class="help-section">
          <h3>Filtros</h3>
          <p>En cada sección encontrará diferentes opciones de filtrado:</p>
          <ul>
            <li><strong>Rango de fechas:</strong> Seleccione un período específico o utilice rangos predefinidos</li>
            <li><strong>Mes y Año:</strong> Filtre por un mes y/o año específico</li>
            <li><strong>Tipos de actividad:</strong> Filtre por videoconferencias, reuniones, actividades de control, etc.</li>
            <li><strong>Lugares:</strong> Filtre actividades por ubicación</li>
            <li><strong>Procesos:</strong> Filtre actividades por proceso (permite selección múltiple)</li>
          </ul>
          <p>Después de seleccionar los filtros deseados, haga clic en "Aplicar filtros" para actualizar la visualización.</p>
        </div>

        <div class="help-section">
          <h3>Gráficos y Estadísticas</h3>
          <p>Los gráficos se actualizan automáticamente según los filtros aplicados. Puede interactuar con ellos de varias formas:</p>
          <ul>
            <li>Pase el cursor sobre los elementos para ver información detallada</li>
            <li>Haga clic en elementos de leyendas para mostrar/ocultar series</li>
            <li>Use los controles de zoom para ampliar áreas específicas</li>
          </ul>
        </div>

        <div class="help-section">
          <h3>Exportación de Datos</h3>
          <p>Para exportar datos o gráficos:</p>
          <ol>
            <li>Aplique los filtros deseados</li>
            <li>Busque el icono de descarga en la esquina superior derecha de cada panel</li>
            <li>Seleccione el formato deseado (CSV, Excel, PDF o imagen)</li>
          </ol>
        </div>

        <div class="help-section">
          <h3>Consejos Útiles</h3>
          <ul>
            <li>Los datos se actualizan automáticamente cada cierto tiempo, pero puede forzar una actualización con el botón de refrescar</li>
            <li>Guarde configuraciones frecuentes de filtros utilizando la función de favoritos</li>
          </ul>
        </div>

        <div class="help-section">
          <h3>Soporte</h3>
          <p>Si encuentra algún problema o necesita asistencia adicional, contacte al equipo de soporte a través de:</p>
          <ul>
            <li>Email: soporte@sipac.cu</li>
            <li>Teléfono: (123) 456-7890</li>
          </ul>
        </div>
      </div>
      <div class="help-modal-footer">
        <button class="btn-primary" @click="closeHelpModal">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  initialActiveItem: {
    type: String,
    default: 'dashboard'
  },
  showHelp: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['section-change']);

const route = useRoute();
const activeItem = ref(props.initialActiveItem);
const showHelpModal = ref(false);

const changeSection = (section) => {
  activeItem.value = section;
  emit('section-change', section);
};

const contactSupport = () => {
  // Implementar lógica para contactar soporte
  window.open('mailto:soporte@sipac.cu', '_blank');
};

const openHelpModal = () => {
  showHelpModal.value = true;
};

const closeHelpModal = () => {
  showHelpModal.value = false;
};

onMounted(() => {
  // Actualizar el ítem activo basado en la ruta actual
  const path = route.path;
  if (path.includes('/dashboard')) activeItem.value = 'dashboard';
  else if (path.includes('/tables')) activeItem.value = 'tables';
  else if (path.includes('/billing')) activeItem.value = 'billing';
  else if (path.includes('/virtual-reality')) activeItem.value = 'virtual-reality';
  else if (path.includes('/rtl')) activeItem.value = 'rtl';
  else if (path.includes('/profile')) activeItem.value = 'profile';
  else if (path.includes('/login')) activeItem.value = 'signin';
  else if (path.includes('/register')) activeItem.value = 'signup';
});
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #2a1b3d;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background-color: #5e2c8a;
  color: white;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.logo-text {
  margin-left: 10px;
  font-weight: 600;
  font-size: 1rem;
  color: white;
}

.sidebar-menu {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  cursor: pointer;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-left: 3px solid #5e2c8a;
}

.menu-item.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  border-left: 3px solid #5e2c8a;
}

.menu-item i {
  margin-right: 10px;
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.menu-text {
  font-weight: 500;
}

.section-title {
  padding: 20px 20px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.help-section {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.help-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  margin-bottom: 10px;
}

.support-btn {
  background-color: #5e2c8a;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-bottom: 8px;
  width: 100%;
}

.contact-btn {
  background-color: transparent;
  color: white;
  border: 1px solid #5e2c8a;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  width: 100%;
}

.support-btn:hover, .contact-btn:hover {
  background-color: #4a2370;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(94, 44, 138, 0.3);
}

/* Estilos para el modal de ayuda */
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
}

.help-modal {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 80%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  color: #333;
}

.help-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eaeaea;
}

.help-modal-header h2 {
  margin: 0;
  color: #2a1b3d;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.help-modal-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.help-modal-content .help-section {
  background-color: transparent;
  text-align: left;
  padding: 0;
  margin-bottom: 25px;
}

.help-modal-content .help-section h3 {
  color: #4e73df;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.help-modal-content .help-section ul, 
.help-modal-content .help-section ol {
  padding-left: 20px;
}

.help-modal-content .help-section li {
  margin-bottom: 5px;
}

.help-modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  background-color: #4e73df;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary:hover {
  background-color: #2e59d9;
}
</style>