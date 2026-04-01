<script setup lang="ts">
const loginStore = useLoginStore();

const showLoading = computed(() => {
  return loginStore.loading;
});

const showLoadingText = computed(() => {
  return loginStore.loadingText;
});
</script>

<template>
  <ClientOnly>
    <div class="loginLoadingPage" v-if="showLoading">
      <div class="loadingShell">
        <div class="loadingHead">
          <div class="loadingSignal"></div>
          <div class="loadingMeta">{{ $t('theme.secureAccess') }}</div>
        </div>
        <div class="loadingSpinner"></div>
        <div class="loadingTitle">{{ showLoadingText }}</div>
        <div class="loadingSub">{{ $t('comm.c66') }}</div>
        <div class="brandBox">
          <img src="/ico.png" alt="QSoe Pro" class="brandIcon" decoding="async" width="64" height="64">
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.loginLoadingPage {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.14), transparent 24%),
    linear-gradient(180deg, #101b2f 0%, #0a1321 28%, #08101b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loadingShell {
  width: min(320px, calc(100vw - 32px));
  padding: 28px 22px;
  border-radius: 28px;
  background: rgba(8, 18, 31, 0.88);
  border: 1px solid rgba(125, 211, 252, 0.12);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
  text-align: center;
  backdrop-filter: blur(18px);
}

.loadingHead {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(125, 211, 252, 0.12);
}

.loadingSignal {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--brand-primary);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.12);
}

.loadingMeta {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.loadingSpinner {
  width: 64px;
  height: 64px;
  margin: 22px auto 0;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: var(--brand-primary);
  border-right-color: rgba(103, 183, 255, 0.8);
  animation: spin 0.9s linear infinite;
}

.loadingTitle {
  margin-top: 18px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 800;
}

.loadingSub {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

.brandBox {
  margin-top: 22px;
  display: flex;
  justify-content: center;
}

.brandIcon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
