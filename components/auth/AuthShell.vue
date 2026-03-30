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

  if (window.history.state.back) {
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
      <div class="topAction" v-if="showBack !== false" @click="goBack">
        <Icon name="solar:alt-arrow-left-linear" size="18" />
      </div>
      <div class="topSpacer" v-else></div>
      <div class="topAction" @click="goLanguage">
        <Icon name="solar:global-linear" size="18" />
      </div>
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
    radial-gradient(circle at 0% 0%, rgba(95, 224, 179, 0.18), transparent 28%),
    radial-gradient(circle at 100% 0%, rgba(103, 183, 255, 0.14), transparent 24%),
    linear-gradient(180deg, #18212b 0%, #101721 28%, #0d1117 100%);
}

.authNoise {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.6), transparent 85%);
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
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  backdrop-filter: blur(18px);
}

.authWrap {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 18px;
  padding: 18px 16px 32px;
}

.authHero {
  padding: 18px 4px 0;
}

.eyebrow {
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.authTitle {
  margin: 10px 0 0;
  font-size: 34px;
  line-height: 1.08;
  font-weight: 800;
  color: var(--text-primary);
}

.authSubtitle {
  margin: 12px 0 0;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.55;
}

.authCard {
  padding: 18px;
  border-radius: 28px;
  background: rgba(19, 26, 34, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(18px);
}
</style>
