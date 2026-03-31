<script setup lang="ts">
const props = defineProps<{
  title: string;
  subtitle?: string;
  eyebrow?: string;
  backPath?: string;
  showBack?: boolean;
}>();

const router = useRouter();

const goBack = () => {
  if (props.backPath) {
    router.push(props.backPath);
    return;
  }

  if (import.meta.client && globalThis.history?.state?.back) {
    router.back();
  } else {
    router.replace('/auth/beforeLogin');
  }
};

const goLanguage = () => {
  router.push('/mine/language');
};
</script>

<template>
  <div class="authShell">
    <div class="authBackdrop"></div>
    <div class="authNoise"></div>

    <div class="authTopBar">
      <button type="button" class="topAction" v-if="showBack !== false" @click="goBack" :aria-label="$t('comm.c58') || 'Go back'">
        <Icon name="solar:alt-arrow-left-linear" size="18" />
      </button>
      <div class="topSpacer" v-else></div>
      <button type="button" class="topAction" @click="goLanguage" :aria-label="$t('comm.c83') || 'Change language'">
        <Icon name="solar:global-linear" size="18" />
      </button>
    </div>

    <div class="authWrap">
      <div class="authHero">
        <div class="eyebrow" v-if="eyebrow">{{ eyebrow }}</div>
        <h1 class="authTitle">{{ title }}</h1>
        <p class="authSubtitle" v-if="subtitle">{{ subtitle }}</p>
        <slot name="hero"></slot>
      </div>

      <div class="authCard">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.authShell {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #0d1117;
  color: var(--text-primary);
}

.authBackdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% -8%, rgba(212, 154, 58, 0.16), transparent 28%),
    linear-gradient(180deg, #151a21 0%, #10151d 26%, #0d1117 100%);
}

.authNoise {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
  background-size: 26px 26px;
  opacity: 0.28;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.36), transparent 78%);
  pointer-events: none;
}

.authTopBar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 16px 0;
}

.topAction,
.topSpacer {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topAction {
  appearance: none;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  backdrop-filter: blur(18px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  transition:
    transform var(--motion-fast) ease,
    background-color var(--motion-fast) ease,
    border-color var(--motion-fast) ease;
}

.topAction:active {
  transform: translateY(1px) scale(0.985);
}

.authWrap {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 18px;
  padding: 20px 16px 32px;
}

.authHero {
  padding: 8px 2px 0;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  padding: 0;
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.authTitle {
  margin: 8px 0 0;
  font-size: 30px;
  line-height: 1.12;
  font-weight: 800;
  color: var(--text-primary);
  max-width: none;
}

.authSubtitle {
  margin: 10px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.55;
  max-width: 28ch;
}

.authCard {
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;
}
</style>
