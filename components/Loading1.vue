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
  background:
    radial-gradient(circle at 50% 12%, rgba(103, 214, 255, 0.12), transparent 28%),
    linear-gradient(180deg, var(--overlay-scrim), var(--overlay-scrim-strong));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 101;
  backdrop-filter: blur(14px) saturate(118%);
  -webkit-backdrop-filter: blur(14px) saturate(118%);
}

.loadingPanel {
  position: relative;
  width: 188px;
  padding: 24px 18px 20px;
  border-radius: var(--overlay-panel-radius-compact);
  background:
    radial-gradient(circle at top, rgba(56, 189, 248, 0.16), transparent 36%),
    var(--surface-loading-panel);
  border: 1px solid var(--overlay-panel-border);
  box-shadow: var(--overlay-panel-shadow-strong), var(--overlay-panel-inner-stroke);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.loadingPanel::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.045);
  pointer-events: none;
}

.spinnerRing {
  position: relative;
  width: 62px;
  height: 62px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: var(--brand-primary);
  border-right-color: rgba(103, 214, 255, 0.72);
  box-shadow: 0 0 0 9px var(--loading-orbit-soft);
  animation: spin 0.95s linear infinite;
}

.spinnerRing::before {
  content: "";
  position: absolute;
  inset: -9px;
  border-radius: inherit;
  border: 1px solid rgba(103, 214, 255, 0.18);
}

.loadingTitle {
  margin-top: 16px;
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.3;
}

.loadingDesc {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.55;
  text-align: center;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
