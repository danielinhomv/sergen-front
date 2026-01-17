<template>
  <div class="metric-card" :class="`border-top-${variant}`">
    <div class="metric-header">
      <span class="metric-label">{{ title }}</span>
      <span v-if="badge" class="trend-badge" :class="variant">{{ badge }}</span>
      <div v-if="icon" class="metric-icon" :class="`text-${variant}`">
        <i :class="icon"></i>
      </div>
    </div>

    <div class="metric-body">
      <slot name="body">
        <span class="metric-number" :class="`text-${textColor}`">{{ value }}</span>
      </slot>
    </div>

    <div class="metric-footer">
      <span class="metric-sub">{{ subtitle }}</span>
      <div v-if="progress !== null" class="progress-minimal mt-2">
        <div class="bar" :style="{ width: progress + '%', backgroundColor: progressColor }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], default: '' },
  subtitle: { type: String, default: '' },
  badge: { type: String, default: null },
  icon: { type: String, default: null },
  progress: { type: Number, default: null },
  // Variantes: success, warning, danger, info, dark, indigo
  variant: { type: String, default: 'neutral' }
});

const colorMap = {
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  indigo: '#6366f1',
  dark: '#1e293b',
  neutral: '#94a3b8'
};

const textColor = computed(() => {
  return props.variant === 'neutral' ? 'dark' : props.variant;
});

const progressColor = computed(() => colorMap[props.variant] || colorMap.neutral);
</script>

<style scoped>
.metric-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.metric-card:hover {
  transform: translateY(-3px);
}

/* Variantes de Borde Superior */
.border-top-success {
  border-top: 4px solid #10b981;
}

.border-top-warning {
  border-top: 4px solid #f59e0b;
}

.border-top-danger {
  border-top: 4px solid #ef4444;
}

.border-top-info {
  border-top: 4px solid #3b82f6;
}

.border-top-indigo {
  border-top: 4px solid #6366f1;
}

.border-top-dark {
  border-top: 4px solid #1e293b;
}

.border-top-neutral {
  border-top: 4px solid #cbd5e1;
}

/* Colores de Texto */
.text-success {
  color: #059669;
}

.text-warning {
  color: #d97706;
}

.text-danger {
  color: #dc2626;
}

.text-info {
  color: #2563eb;
}

.text-indigo {
  color: #4f46e5;
}

.text-dark {
  color: #0f172a;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.05em;
}

.metric-number {
  font-size: 3rem;
  /* BIG NUMBER */
  font-weight: 800;
  line-height: 1;
  display: block;
  margin-bottom: 0.5rem;
}

.metric-sub {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

.trend-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
}

.trend-badge.success {
  background: #d1fae5;
  color: #065f46;
}

.progress-minimal {
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
  width: 100%;
}

.progress-minimal .bar {
  height: 100%;
  border-radius: 3px;
}
</style>