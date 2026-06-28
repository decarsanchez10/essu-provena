<template>
  <div class="loading-skeleton">
    <div class="skeleton-card">
      <!-- Header skeleton -->
      <div class="skeleton-header">
        <div class="skeleton-icon shimmer"></div>
        <div class="skeleton-title-group">
          <div class="skeleton-title shimmer"></div>
          <div class="skeleton-sub shimmer"></div>
        </div>
      </div>

      <!-- Content skeleton -->
      <div class="skeleton-content">
        <div v-for="i in lines" :key="i" class="skeleton-line shimmer" :style="{ width: getRandomWidth(i) }"></div>
      </div>

      <!-- Actions skeleton -->
      <div class="skeleton-actions">
        <div class="skeleton-btn shimmer"></div>
        <div class="skeleton-btn shimmer"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  lines: {
    type: Number,
    default: 4
  }
})

const getRandomWidth = (index) => {
  const widths = ['100%', '85%', '92%', '78%', '95%', '82%', '88%', '75%']
  return widths[index % widths.length]
}
</script>

<style scoped>
.loading-skeleton {
  width: 100%;
}

.skeleton-card {
  background: rgba(10, 21, 16, 0.4);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 16px;
  padding: 32px;
}

.skeleton-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.skeleton-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(34, 197, 94, 0.1);
}

.skeleton-title-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-title {
  height: 20px;
  width: 60%;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
}

.skeleton-sub {
  height: 14px;
  width: 40%;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.skeleton-line {
  height: 16px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
}

.skeleton-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.skeleton-btn {
  height: 44px;
  width: 140px;
  border-radius: 100px;
  background: rgba(34, 197, 94, 0.15);
}

/* Shimmer animation */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.08),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@media (max-width: 640px) {
  .skeleton-card {
    padding: 20px;
  }

  .skeleton-icon {
    width: 40px;
    height: 40px;
  }

  .skeleton-btn {
    width: 100%;
  }

  .skeleton-actions {
    flex-direction: column;
  }
}
</style>
