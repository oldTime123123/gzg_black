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
        <div class="loadingBadge">{{ $t('theme.secureAccess') }}</div>
        <div class="loadingSpinner"></div>
        <div class="loadingTitle">{{ showLoadingText }}</div>
        <div class="loadingSub">{{ $t('comm.c66') }}</div>
        <div class="brandBox">
          <img src="/ico.png" class="brandIcon">
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
    radial-gradient(circle at top left, rgba(95, 224, 179, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(103, 183, 255, 0.14), transparent 24%),
    linear-gradient(180deg, #18212b 0%, #101721 28%, #0d1117 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loadingShell {
  width: min(320px, calc(100vw - 32px));
  padding: 28px 22px;
  border-radius: 28px;
  background: rgba(19, 26, 34, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
  text-align: center;
  backdrop-filter: blur(18px);
}

.loadingBadge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(95, 224, 179, 0.12);
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
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
