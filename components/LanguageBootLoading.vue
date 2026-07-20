<script setup lang="ts">
const languageReady = useState('languageReady', () => false);
</script>

<template>
  <div v-if="!languageReady" class="languageBoot" role="status" aria-busy="true">
    <div class="bootMark">
      <div class="bootRing"></div>
      <img src="/ico.png" alt="" class="bootLogo">
    </div>
  </div>
</template>

<style scoped>
.languageBoot {
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 50% 38%, rgba(95, 224, 179, 0.12), transparent 30%),
    linear-gradient(180deg, #18212b 0%, #101721 32%, #0d1117 100%);
}

.bootMark {
  position: relative;
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bootRing {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-top-color: var(--brand-primary);
  animation: bootSpin 0.9s linear infinite;
}

.bootLogo {
  width: 60px;
  height: 60px;
  border-radius: 18px;
  object-fit: cover;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.36);
}

@keyframes bootSpin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bootRing {
    animation-duration: 1.8s;
  }
}
</style>
