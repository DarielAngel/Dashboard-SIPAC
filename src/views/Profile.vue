<template>
  <div class="app-container">
    <div class="sidebar">
      <div class="logo">
        <div class="logo-icon">A</div>
        <h3>Argon Dashboard 2</h3>
      </div>
      
      <div class="nav-links">
        <router-link to="/dashboard" class="nav-link">
          <i class="fas fa-home"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/tables" class="nav-link">
          <i class="fas fa-table"></i>
          <span>Tables</span>
        </router-link>
        <router-link to="/billing" class="nav-link">
          <i class="fas fa-credit-card"></i>
          <span>Billing</span>
        </router-link>
        <router-link to="/virtual-reality" class="nav-link">
          <i class="fas fa-vr-cardboard"></i>
          <span>Virtual Reality</span>
        </router-link>
        <router-link to="/rtl" class="nav-link">
          <i class="fas fa-align-right"></i>
          <span>RTL</span>
        </router-link>
      </div>
      
      <div class="account-section">
        <h6 class="section-title">ACCOUNT PAGES</h6>
        <div class="nav-links">
          <router-link to="/profile" class="nav-link active">
            <i class="fas fa-user"></i>
            <span>Profile</span>
          </router-link>
          <router-link to="/login" class="nav-link">
            <i class="fas fa-sign-in-alt"></i>
            <span>Sign In</span>
          </router-link>
          <router-link to="/register" class="nav-link">
            <i class="fas fa-user-plus"></i>
            <span>Sign Up</span>
          </router-link>
        </div>
      </div>
      
      <div class="help-section">
        <p>{{ $t('needHelp') }}</p>
        <button class="help-button">{{ $t('contactSupport') }}</button>
      </div>
    </div>
    
    <div class="main-content">
      <!-- Barra superior con botones de acción -->
      <div class="top-navbar">
        <div class="search-container">
          <input type="text" placeholder="Type here..." class="search-input" />
        </div>
        <div class="navbar-actions">
          <button class="navbar-btn">
            <i class="fas fa-user"></i>
            <span>Sign In</span>
          </button>
          <button class="navbar-btn" @click="toggleSettingsPanel">
            <i class="fas fa-cog"></i>
            <span>Settings</span>
          </button>
          <button class="navbar-btn language-btn" @click="toggleLanguage">
            {{ currentLanguage === 'en' ? 'ES' : 'EN' }}
          </button>
        </div>
      </div>

      <div class="profile-header">
        <div class="user-info">
          <img src="@/assets/img/profile-avatar.jpg" alt="Sayo Kravits" class="user-avatar" />
          <div class="user-details">
            <h2>Sayo Kravits</h2>
            <p>{{ $t('publicRelations') }}</p>
          </div>
        </div>
      </div>
      
      <!-- Panel de configuraciones -->
      <div class="settings-panel" v-if="showSettingsPanel">
        <div class="settings-header">
          <h3>{{ $t('settingsPanel') }}</h3>
          <button class="btn-close" @click="toggleSettingsPanel">×</button>
        </div>
        <div class="settings-content">
          <div class="settings-group">
            <h4>{{ $t('language') }}</h4>
            <div class="language-options">
              <button 
                class="language-option" 
                :class="{ active: currentLanguage === 'en' }"
                @click="changeLanguage('en')"
              >
                English
              </button>
              <button 
                class="language-option" 
                :class="{ active: currentLanguage === 'es' }"
                @click="changeLanguage('es')"
              >
                Español
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Overlay para cuando el panel está abierto -->
      <div class="settings-overlay" v-if="showSettingsPanel" @click="toggleSettingsPanel"></div>
      
      <div class="profile-content">
        <div class="edit-profile">
          <div class="section-header">
            <h3>{{ $t('editProfile') }}</h3>
            <button class="btn-settings-small">{{ $t('settings') }}</button>
          </div>
          
          <div class="form-section">
            <h4>{{ $t('userInformation') }}</h4>
            
            <div class="form-row">
              <div class="form-group">
                <label>{{ $t('username') }}</label>
                <input type="text" class="form-control" />
              </div>
              <div class="form-group">
                <label>{{ $t('emailAddress') }}</label>
                <input type="email" class="form-control" />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>First name</label>
                <input type="text" class="form-control" value="Jesse" />
              </div>
              <div class="form-group">
                <label>Last name</label>
                <input type="text" class="form-control" />
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h4>CONTACT INFORMATION</h4>
            
            <div class="form-group full-width">
              <label>Address</label>
              <input type="text" class="form-control" />
            </div>
            
            <div class="form-row three-columns">
              <div class="form-group">
                <label>City</label>
                <input type="text" class="form-control" />
              </div>
              <div class="form-group">
                <label>Country</label>
                <input type="text" class="form-control" />
              </div>
              <div class="form-group">
                <label>Postal code</label>
                <input type="text" class="form-control" />
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h4>ABOUT ME</h4>
            
            <div class="form-group full-width">
              <label>About me</label>
              <textarea class="form-control" rows="4"></textarea>
            </div>
          </div>
        </div>
        
        <div class="profile-card">
          <div class="card-header">
            <img src="@/assets/img/university-bg.jpg" alt="Background" class="card-bg" />
            <img src="@/assets/img/profile-avatar2.jpg" alt="Mark Davis" class="card-avatar" />
          </div>
          
          <div class="card-stats">
            <div class="stat-item">
              <div class="stat-value">22</div>
              <div class="stat-label">Friends</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">10</div>
              <div class="stat-label">Photos</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">89</div>
              <div class="stat-label">Comments</div>
            </div>
          </div>
          
          <div class="card-info">
            <h3>Mark Davis <span>, 35</span></h3>
            <p class="location">Bucharest, Romania</p>
            <p class="position">Solution Manager - Creative Tim Officer</p>
            <p class="university">University of Computer Science</p>
            
            <div class="card-actions">
              <button class="btn-connect">Connect</button>
              <button class="btn-message">Message</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="footer">
        <p>© 2023, {{ $t('madeWith') }} ❤️ {{ $t('byCreativeTim') }}</p>
        <div class="footer-links">
          <a href="#">Creative Tim</a>
          <a href="#">{{ $t('aboutUs') }}</a>
          <a href="#">Blog</a>
          <a href="#">{{ $t('license') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Estado para el panel de configuraciones
const showSettingsPanel = ref(false);
const currentLanguage = ref('en');

// Funciones para el panel de configuraciones
const toggleSettingsPanel = () => {
  showSettingsPanel.value = !showSettingsPanel.value;
};

const changeLanguage = (lang) => {
  currentLanguage.value = lang;
  // Aquí implementarías la lógica para cambiar el idioma
};

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'en' ? 'es' : 'en';
  // Aquí implementarías la lógica para cambiar el idioma
};
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Open Sans', sans-serif;
}

.sidebar {
  width: 250px;
  background-color: white;
  padding: 25px 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.logo {
  display: flex;
  align-items: center;
  margin-bottom: 35px;
}

.logo-icon {
  width: 38px;
  height: 38px;
  background-color: #35d1a0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  margin-right: 12px;
}

.logo h3 {
  font-size: 16px;
  font-weight: 700;
  color: #344767;
  margin: 0;
}

.nav-links {
  margin-bottom: 25px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #67748e;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-link i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.nav-link.active, .nav-link:hover {
  background-color: #f8f9fa;
  color: #344767;
}

.section-title {
  color: #344767;
  font-size: 12px;
  margin: 15px 0 10px;
  font-weight: 700;
}

.help-section {
  margin-top: auto;
  padding: 20px 15px;
  background-color: #f8f9fa;
  border-radius: 10px;
  margin-bottom: 20px;
}

.help-section p {
  color: #344767;
  font-size: 14px;
  margin-bottom: 15px;
  font-weight: 600;
}

.help-button {
  width: 100%;
  padding: 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #67748e;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.help-button:hover {
  background-color: #f1f1f1;
}

.main-content {
  margin-left: 250px;
  padding: 30px;
  width: calc(100% - 250px);
}

/* Estilos para la barra superior */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  border-radius: 12px;
  padding: 12px 24px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.search-container {
  flex: 1;
}

.search-input {
  width: 100%;
  max-width: 300px;
  padding: 12px 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 14px;
  color: #67748e;
  background-color: #f8f9fa;
}

.navbar-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.navbar-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  border: none;
  background-color: #f8f9fa;
  color: #67748e;
  cursor: pointer;
  transition: all 0.2s;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 35px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  width: 100%;
}

.user-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 25px;
  border: 3px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.user-details h2 {
  margin: 0 0 8px;
  color: #344767;
  font-size: 26px;
}

.user-details p {
  margin: 0;
  color: #67748e;
  font-size: 15px;
}

.profile-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 35px;
  margin-bottom: 35px;
}

.edit-profile, .profile-card {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 1px solid #eee;
}

.section-header h3 {
  margin: 0;
  color: #344767;
  font-size: 18px;
}

.btn-settings-small {
  padding: 8px 15px;
  background-color: #f8f9fa;
  border: none;
  border-radius: 8px;
  color: #67748e;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-settings-small:hover {
  background-color: #e9ecef;
}

.form-section {
  padding: 30px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.form-section h4 {
  margin: 0 0 25px;
  color: #344767;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px dashed #eee;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 30px;
}

.form-row:last-child {
  margin-bottom: 10px;
}

.form-row.three-columns {
  grid-template-columns: 1fr 1fr 1fr;
}

.form-group {
  margin-bottom: 25px;
  padding-right: 15px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 12px;
  color: #67748e;
  font-size: 14px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #344767;
  transition: all 0.2s;
  background-color: #f8f9fa;
  margin-right: 15px;
  box-sizing: border-box;
}

.form-control:focus {
  border-color: #35d1a0;
  outline: none;
  box-shadow: 0 0 0 3px rgba(53, 209, 160, 0.2);
  background-color: white;
}

textarea.form-control {
  min-height: 120px;
  resize: vertical;
}

.card-header {
  position: relative;
  height: 150px;
}

.card-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-avatar {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.card-stats {
  display: flex;
  justify-content: space-around;
  padding: 40px 20px 20px;
  border-bottom: 1px solid #eee;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #344767;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #67748e;
}

.card-info {
  padding: 20px;
  text-align: center;
}

.card-info h3 {
  margin: 0 0 10px;
  color: #344767;
  font-size: 18px;
}

.card-info h3 span {
  font-weight: 400;
  color: #67748e;
}

.card-info p {
  margin: 5px 0;
  color: #67748e;
  font-size: 14px;
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.btn-connect, .btn-message {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-connect {
  background-color: #35d1a0;
  color: white;
}

.btn-message {
  background-color: #f8f9fa;
  color: #67748e;
}

.btn-connect:hover {
  background-color: #2bb98a;
}

.btn-message:hover {
  background-color: #e9ecef;
}

.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background-color: white;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
  transition: transform 0.3s ease;
  padding-bottom: 20px;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px;
  border-bottom: 1px solid #eee;
}

.settings-content {
  padding: 25px;
}

.language-options {
  display: flex;
  gap: 15px;
}

.language-option {
  padding: 10px 20px;
  background-color: #f8f9fa;
  border: none;
  border-radius: 8px;
  color: #67748e;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.language-option:hover {
  background-color: #e9ecef;
}

.language-option.active {
  background-color: #35d1a0;
  color: white;
}

.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 0;
  border-top: 1px solid #eee;
  color: #67748e;
  font-size: 14px;
  margin-top: 10px;
}

.footer-links {
  display: flex;
  gap: 25px;
}

.footer-links a {
  color: #67748e;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #344767;
}
</style>