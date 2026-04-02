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
        <div class="loadingSpinnerShell">
          <div class="loadingSpinner"></div>
          <div class="loadingCenterIcon">
            <Icon name="solar:shield-keyhole-linear" size="24" />
          </div>
        </div>
        <div class="loadingTitle">{{ showLoadingText }}</div>
        <div class="loadingSub">{{ $t('comm.c66') }}</div>
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
    linear-gradient(180deg, rgba(7, 15, 27, 0.18), rgba(7, 15, 27, 0.32)),
    var(--surface-auth-shell);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  backdrop-filter: blur(12px) saturate(118%);
  -webkit-backdrop-filter: blur(12px) saturate(118%);
}

.loadingShell {
  position: relative;
  overflow: hidden;
  width: min(332px, calc(100vw - 36px));
  padding: 30px 22px 24px;
  border-radius: var(--overlay-panel-radius);
  background:
    radial-gradient(circle at 50% 0%, rgba(103, 214, 255, 0.16), transparent 34%),
    var(--surface-loading-panel);
  border: 1px solid rgba(125, 211, 252, 0.16);
  box-shadow: var(--overlay-panel-shadow-strong), var(--overlay-panel-inner-stroke);
  text-align: center;
  backdrop-filter: blur(18px);
}

.loadingShell::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.045);
  pointer-events: none;
}

.loadingHead,
.loadingSpinnerShell,
.loadingTitle,
.loadingSub {
  position: relative;
  z-index: 1;
}

.loadingHead {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(125, 211, 252, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.loadingSignal {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--brand-primary);
  box-shadow: 0 0 0 7px rgba(56, 189, 248, 0.12);
}

.loadingMeta {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.loadingSpinnerShell {
  position: relative;
  width: 88px;
  height: 88px;
  margin: 24px auto 0;
}

.loadingSpinnerShell::before {
  content: "";
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(103, 214, 255, 0.18), transparent 64%);
  filter: blur(8px);
}

.loadingSpinner {
  position: relative;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: var(--brand-primary);
  border-right-color: rgba(103, 214, 255, 0.84);
  box-shadow: 0 0 0 10px var(--loading-orbit-soft);
  animation: spin 0.95s linear infinite;
}

.loadingCenterIcon {
  position: absolute;
  inset: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: var(--brand-primary);
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid rgba(125, 211, 252, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.loadingTitle {
  margin-top: 20px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.24;
}

.loadingSub {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
