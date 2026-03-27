<template>
  <div class="mask">
    <div class="loadingDotWrap">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="loadingText">{{ $t('theme.loading') }}</div>
  </div>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(4, 7, 12, 0.64);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 101;
  backdrop-filter: blur(8px);
}

.loadingDotWrap {
  display: inline-flex;
  gap: 8px;
}

.loadingDotWrap span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--brand-primary);
  animation: pulse 1s infinite ease-in-out;
}

.loadingDotWrap span:nth-child(2) {
  animation-delay: 0.15s;
}

.loadingDotWrap span:nth-child(3) {
  animation-delay: 0.3s;
}

.loadingText {
  margin-top: 12px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0.7);
    opacity: 0.55;
  }

  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
