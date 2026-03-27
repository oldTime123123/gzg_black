<script lang="ts" setup>
const pub = usePublicStore();
const router = useRouter();
const loginStore = useLoginStore();

onBeforeMount(() => {
  if (window.location.search.includes("?t=")) {
    const token = window.location.search.split("?t=")[1];
    localStorage.setItem("token", token);
    window.location.href = "/tabbar/home";
    return;
  }
  pub.showLoading = false;

});

onMounted(() => {
  if (localStorage.getItem('token')) {
    setTimeout(() => {
      router.push('/tabbar/home');
    }, 2000);
  } else {
    loginStore.showLoadingText = "";
    setTimeout(() => {
      router.push('/auth/beforeLogin');
    }, 2000);
  }
});

const showLoadingText = computed(() => {
  return loginStore.loadingText;
});
</script>

<template>
  <div class="bootPage">
    <ClientOnly>
      <div class="bootShell">
        <div class="bootBadge">{{ $t('theme.brandBadge') }}</div>
        <div class="bootLogo">
          <img src="/ico.png" class="bootIcon">
        </div>
        <div class="bootTitle">{{ showLoadingText || $t('theme.appName') }}</div>
        <div class="bootSub">{{ $t('comm.c66') }}</div>
        <div class="bootSpinner"></div>
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
    radial-gradient(circle at top left, rgba(95, 224, 179, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(103, 183, 255, 0.14), transparent 24%),
    linear-gradient(180deg, #18212b 0%, #101721 28%, #0d1117 100%);
}

.bootShell {
  width: min(320px, calc(100vw - 32px));
  padding: 28px 22px;
  border-radius: 28px;
  background: rgba(19, 26, 34, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
  text-align: center;
  backdrop-filter: blur(18px);
}

.bootBadge {
  display: inline-flex;
  min-height: 30px;
  padding: 0 12px;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(95, 224, 179, 0.12);
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
}

.bootLogo {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

.bootIcon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
}

.bootTitle {
  margin-top: 18px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 800;
}

.bootSub {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 14px;
}

.bootSpinner {
  width: 58px;
  height: 58px;
  margin: 22px auto 0;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: var(--brand-primary);
  border-right-color: rgba(103, 183, 255, 0.8);
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
