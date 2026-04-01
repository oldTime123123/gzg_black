<script lang="ts" setup>
import { storage } from '~/stores/storage';

const pub = usePublicStore();
const router = useRouter();
const loginStore = useLoginStore();

onBeforeMount(() => {
  const search = import.meta.client ? globalThis.location?.search || '' : '';
  if (search.includes('?t=')) {
    const token = search.split('?t=')[1];
    storage.setItem('token', token);
    globalThis.location?.replace('/tabbar/home');
    return;
  }
  pub.showLoading = false;
});

onMounted(() => {
  if (import.meta.client && storage.getItem('token')) {
    setTimeout(() => {
      router.push('/tabbar/home');
    }, 2000);
  } else {
    loginStore.showLoadingText = '';
    setTimeout(() => {
      router.push('/auth/beforeLogin');
    }, 2000);
  }
});

const showLoadingText = computed(() => loginStore.loadingText);
</script>

<template>
  <div class="bootPage">
    <ClientOnly>
      <div class="bootShell">
        <div class="bootGrid"></div>
        <div class="bootHead">
          <div class="bootSignal"></div>
          <div class="bootMeta">{{ $t('theme.secureAccess') }}</div>
        </div>
        <div class="bootLogo">
          <img src="/ico.png" alt="QSoe Pro" class="bootIcon" decoding="async" width="72" height="72">
        </div>
        <div class="bootTitle">{{ showLoadingText || $t('theme.appName') }}</div>
        <div class="bootSub">{{ $t('comm.c66') }}</div>
        <div class="bootProgress">
          <div class="bootProgress__bar"></div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.bootPage {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 30%),
    radial-gradient(circle at top right, rgba(37, 99, 235, 0.16), transparent 26%),
    linear-gradient(180deg, #0f1b2f 0%, #09111f 42%, #050c16 100%);
}

.bootShell {
  position: relative;
  overflow: hidden;
  width: min(340px, calc(100vw - 32px));
  padding: 28px 22px;
  border-radius: 30px;
  background: rgba(8, 18, 31, 0.88);
  border: 1px solid rgba(125, 211, 252, 0.12);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
  text-align: center;
  backdrop-filter: blur(18px);
}

.bootGrid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(125, 211, 252, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(125, 211, 252, 0.04) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.9), transparent 90%);
  pointer-events: none;
}

.bootHead,
.bootLogo,
.bootTitle,
.bootSub,
.bootProgress {
  position: relative;
  z-index: 1;
}

.bootHead {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(125, 211, 252, 0.12);
}

.bootSignal {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--brand-primary);
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.12);
}

.bootMeta {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.bootLogo {
  margin-top: 22px;
  display: flex;
  justify-content: center;
}

.bootIcon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
}

.bootTitle {
  margin-top: 20px;
  color: var(--text-primary);
  font-size: 28px;
  line-height: 1.02;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.bootSub {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 14px;
}

.bootProgress {
  margin-top: 24px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.bootProgress__bar {
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #22d3ee, #2563eb, #38bdf8);
  animation: loading 1.6s var(--ease-out-quart) infinite;
}

@keyframes loading {
  0% {
    width: 18%;
  }
  50% {
    width: 72%;
  }
  100% {
    width: 38%;
  }
}
</style>
