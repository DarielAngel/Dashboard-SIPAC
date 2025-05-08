<template>
  <div>
    <div class="nav-menu">
      <router-link to="/dashboard" class="nav-item active">
        <i class="fas fa-home"></i>
        <span>Dashboard</span>
      </router-link>
      
      <router-link to="/tables" class="nav-item">
        <i class="fas fa-table"></i>
        <span>Tables</span>
      </router-link>
      
      <router-link to="/billing" class="nav-item">
        <i class="fas fa-credit-card"></i>
        <span>Billing</span>
      </router-link>
      
      <router-link to="/virtual-reality" class="nav-item">
        <i class="fas fa-vr-cardboard"></i>
        <span>Virtual Reality</span>
      </router-link>
      
      <router-link to="/rtl" class="nav-item">
        <i class="fas fa-align-right"></i>
        <span>RTL</span>
      </router-link>
    </div>
    
    <div class="section-title">ACCOUNT PAGES</div>
    
    <div class="nav-menu">
      <router-link to="/profile" class="nav-item">
        <i class="fas fa-user"></i>
        <span>Profile</span>
      </router-link>
      
      <router-link to="/login" class="nav-item">
        <i class="fas fa-sign-in-alt"></i>
        <span>Sign in</span>
      </router-link>
      
      <router-link to="/register" class="nav-item">
        <i class="fas fa-user-plus"></i>
        <span>Sign Up</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// No se necesita lógica adicional
</script>