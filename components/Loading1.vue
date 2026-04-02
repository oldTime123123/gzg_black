<script setup lang="ts">
const pub = usePublicStore();
const showLoading = computed(() => {
  return pub.showLoading;
});
</script>

<template>
  <ClientOnly>
    <div class="mask" v-if="showLoading">
      <div class="loadingPanel">
        <div class="spinnerRing"></div>
        <div class="loadingTitle">{{ $t('x.a25') }}</div>
        <div class="loadingDesc">{{ $t('theme.preparingNextView') }}</div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, var(--overlay-scrim), var(--overlay-scrim-strong));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  backdrop-filter: blur(8px);
}

.loadingPanel {
  width: 172px;
  padding: 22px 18px;
  border-radius: 24px;
  background: var(--surface-loading-panel);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: var(--shadow-soft-dark);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinnerRing {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: var(--brand-primary);
  animation: spin 0.9s linear infinite;
}

.loadingTitle {
  margin-top: 14px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
}

.loadingDesc {
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
