<template>
  <div class="language-switcher">
    <button 
      class="language-btn" 
      @click="toggleLanguage"
      :title="$t('changeLanguage')"
    >
      {{ currentLanguage === 'en' ? 'ES' : 'EN' }}
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

// Current language
const currentLanguage = computed(() => locale.value);

// Toggle language function
const toggleLanguage = () => {
  const newLang = locale.value === 'en' ? 'es' : 'en';
  locale.value = newLang;
  localStorage.setItem('userLanguage', newLang);
  
  // Dispatch a global event to notify all components
  window.dispatchEvent(new CustomEvent('language-changed', { detail: newLang }));
};

// Listen for language changes from other components
onMounted(() => {
  window.addEventListener('language-changed', (event) => {
    // Update component if needed
  });
});

// Cleanup
onUnmounted(() => {
  window.removeEventListener('language-changed', () => {});
});
</script>

<style scoped>
.language-switcher {
  display: inline-block;
}

.language-btn {
  padding: 8px 12px;
  background-color: #f8f9fa;
  border: none;
  border-radius: 8px;
  color: #67748e;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.language-btn:hover {
  background-color: #e9ecef;
}
</style>