<script setup lang="ts">
const router = useRouter();

const changePage = (url: string) => {
  router.push(url);
};

const pub = usePublicStore();
onMounted(() => {
  pub.showLoading = false;
});
</script>

<template>
  <AuthShell :show-back="false" :eyebrow="$t('theme.access')" :title="$t('login.l1')">
    <template #hero>
      <section class="relative overflow-hidden rounded-shell border border-skin-border/80 bg-[rgba(9,20,36,0.42)] px-5 py-6 shadow-soft backdrop-blur-xl">
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_48%)]"></div>
        <div class="pointer-events-none absolute -right-8 top-6 h-24 w-24 rounded-full border border-white/10 bg-[rgba(255,255,255,0.05)] blur-xl floatOrb"></div>
        <div class="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-[rgba(56,189,248,0.14)] blur-2xl"></div>

        <div class="relative z-[1] grid gap-6">
          <div class="grid gap-3">
            <div class="inline-flex w-fit items-center gap-2 rounded-pill border border-[rgba(125,211,252,0.18)] bg-[rgba(56,189,248,0.08)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-skin-primary">
              <span class="h-2 w-2 rounded-full bg-skin-primary pulseDot"></span>
              {{ $t('theme.tradingAccess') }}
            </div>

            <div class="max-w-[18rem]">
              <p class="text-[28px] font-extrabold leading-[1.08] tracking-[-0.04em] text-skin-text">
                {{ $t('theme.manageAccountVerificationAccess') }}
              </p>
              <p class="mt-3 text-[13px] leading-6 text-skin-muted">
                {{ $t('theme.entryExperienceCopy') }}
              </p>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              class="contentBtn min-h-[54px] w-full"
              @click="changePage('/auth/login')"
            >
              {{ $t('login.l1') }}
            </button>

            <button
              type="button"
              class="inline-flex min-h-[54px] w-full items-center justify-center rounded-[18px] border border-[rgba(125,211,252,0.16)] bg-white/[0.04] px-4 text-[14px] font-bold text-skin-text transition duration-200 active:scale-[0.985]"
              @click="changePage('/auth/register')"
            >
              {{ $t('login.l3') }}
            </button>
          </div>
        </div>
      </section>
    </template>
  </AuthShell>
</template>

<style scoped>
.floatOrb {
  animation: float-orb 7s ease-in-out infinite;
}

.pulseDot {
  animation: pulse-dot 2.4s ease-in-out infinite;
}

@keyframes float-orb {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -8px, 0);
  }
}

@keyframes pulse-dot {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.22);
    opacity: 0.92;
  }
  50% {
    box-shadow: 0 0 0 6px rgba(56, 189, 248, 0);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .floatOrb,
  .pulseDot {
    animation: none;
  }
}
</style>
