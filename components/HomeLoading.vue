<template>
  <ClientOnly>
    <div class="mask">
      <div class="loadingPanel">
        <div class="loadingAura"></div>
        <div class="loaderShell">
          <div class="loader"></div>
        </div>
        <div class="loadingTitle">{{ $t('x.a25') }}</div>
        <div class="loadingDesc">{{ $t('theme.preparingNextView') }}</div>
      </div>
    </div>
  </ClientOnly>
</template>

<style lang="less" scoped>
.mask {
  position: fixed;
  inset: 0;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(4, 7, 12, 0.72);
  backdrop-filter: blur(8px);
}

.loadingPanel {
  position: relative;
  width: 188px;
  padding: 24px 18px 20px;
  border-radius: 26px;
  background:
    radial-gradient(circle at top, rgba(56, 189, 248, 0.12), transparent 34%),
    rgba(19, 26, 34, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.loadingAura {
  position: absolute;
  top: -26px;
  width: 108px;
  height: 108px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.24), transparent 64%);
  filter: blur(6px);
  opacity: 0.9;
}

.loaderShell {
  position: relative;
  z-index: 1;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.loader {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: var(--brand-primary);
  border-right-color: rgba(103, 183, 255, 0.8);
  animation: spin 0.9s linear infinite;
}

.loadingTitle {
  position: relative;
  z-index: 1;
  margin-top: 14px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
}

.loadingDesc {
  position: relative;
  z-index: 1;
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  text-align: center;
  line-height: 1.5;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
