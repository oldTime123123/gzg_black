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
  background:
    radial-gradient(circle at 50% 12%, rgba(103, 214, 255, 0.12), transparent 28%),
    linear-gradient(180deg, var(--overlay-scrim), var(--overlay-scrim-strong));
  backdrop-filter: blur(14px) saturate(118%);
  -webkit-backdrop-filter: blur(14px) saturate(118%);
}

.loadingPanel {
  position: relative;
  width: 196px;
  padding: 26px 18px 20px;
  border-radius: var(--overlay-panel-radius-compact);
  background:
    radial-gradient(circle at top, rgba(56, 189, 248, 0.16), transparent 34%),
    radial-gradient(circle at 50% 120%, rgba(37, 99, 235, 0.12), transparent 42%),
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

.loadingAura {
  position: absolute;
  top: -30px;
  width: 124px;
  height: 124px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--loading-orbit), transparent 64%);
  filter: blur(8px);
  opacity: 0.95;
}

.loaderShell {
  position: relative;
  z-index: 1;
  width: 78px;
  height: 78px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(125, 211, 252, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.loader {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: var(--brand-primary);
  border-right-color: rgba(103, 214, 255, 0.8);
  box-shadow: 0 0 0 9px var(--loading-orbit-soft);
  animation: spin 0.95s linear infinite;
}

.loadingTitle {
  position: relative;
  z-index: 1;
  margin-top: 16px;
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.3;
}

.loadingDesc {
  position: relative;
  z-index: 1;
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  text-align: center;
  line-height: 1.55;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
