<template>
  <div class="stat-card">
    <div class="stat-content">
      <h3 class="stat-title">{{ title }}</h3>
      <div class="stat-value">{{ value }}</div>
      <div class="stat-change" :class="changeClass">
        {{ changePrefix }}{{ change }} {{ period }}
      </div>
    </div>
    <div class="stat-icon" :style="{ backgroundColor: iconColor }">
      <i :class="icon"></i>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  change: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'fas fa-chart-line'
  },
  iconColor: {
    type: String,
    default: '#4e73df'
  },
  isPositive: {
    type: Boolean,
    default: true
  }
});

const changeClass = computed(() => {
  return props.isPositive ? 'positive-change' : 'negative-change';
});

const changePrefix = computed(() => {
  return props.isPositive ? '+' : '';
});
</script>

<style scoped>
.stat-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-title {
  color: #5a5c69;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.stat-value {
  color: #5a5c69;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 5px;
}

.stat-change {
  font-size: 0.8rem;
}

.positive-change {
  color: #1cc88a;
}

.negative-change {
  color: #e74a3b;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>