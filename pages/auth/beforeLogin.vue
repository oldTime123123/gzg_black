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
  <AuthShell :show-back="false" :title="$t('login.l1')">
    <template #hero>
      <section class="relative isolate overflow-hidden rounded-shell border border-white/10 bg-[linear-gradient(180deg,rgba(7,19,35,0.94),rgba(4,12,24,0.98))] px-5 py-6 shadow-[0_28px_80px_rgba(2,8,20,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl">
        <div class="pointer-events-none absolute inset-0 opacity-95">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(95,195,255,0.24),transparent_34%),radial-gradient(circle_at_85%_18%,rgba(31,111,255,0.16),transparent_26%),linear-gradient(180deg,rgba(9,22,44,0.1),rgba(4,10,20,0.5))]"></div>
          <div class="absolute inset-x-[-18%] top-[-18%] h-[58%] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(116,211,255,0)_0deg,rgba(116,211,255,0.2)_45deg,rgba(116,211,255,0)_118deg,rgba(116,211,255,0.12)_180deg,rgba(116,211,255,0)_260deg,rgba(116,211,255,0.18)_320deg,rgba(116,211,255,0)_360deg)] blur-2xl heroAurora"></div>
          <div class="absolute inset-0 opacity-60 mix-blend-screen heroLightCurtain"></div>
          <div class="absolute inset-0 heroGrid"></div>
          <div class="absolute inset-y-0 left-[-22%] w-[70%] bg-[linear-gradient(90deg,rgba(125,211,252,0),rgba(125,211,252,0.18),rgba(125,211,252,0))] blur-2xl heroSweep"></div>
          <div class="absolute inset-x-3 top-[16%] h-px bg-[linear-gradient(90deg,transparent,rgba(157,224,255,0.82),transparent)] opacity-80 scanLine"></div>
          <div class="absolute inset-0 opacity-85 heroParticles"></div>
          <div class="absolute -left-10 top-16 h-32 w-32 rounded-full border border-white/10 bg-[radial-gradient(circle,rgba(125,211,252,0.24),rgba(125,211,252,0.02)_62%,transparent_72%)] blur-xl floatOrbSlow"></div>
          <div class="absolute -right-12 bottom-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.28),rgba(37,99,235,0.04)_58%,transparent_72%)] blur-2xl floatOrbFast"></div>
        </div>

        <div class="relative z-[1] grid min-h-[360px] content-between gap-8">
          <div class="space-y-5">
            <div class="inline-flex w-fit items-center gap-2 rounded-pill border border-sky-300/15 bg-sky-300/8 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-100/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <span class="h-2 w-2 rounded-full bg-sky-300 pulseDot"></span>
              Access
            </div>

            <div class="max-w-[15rem] space-y-3">
              <h2 class="text-[34px] font-black leading-[0.96] tracking-[-0.06em] text-white text-balance drop-shadow-[0_8px_30px_rgba(80,180,255,0.16)]">
                {{ $t('login.l1') }}
              </h2>
              <p class="max-w-[14rem] text-[13px] leading-6 text-sky-100/68">
                Secure access to your trading workspace.
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid gap-3">
              <button
                type="button"
                class="group relative inline-flex min-h-[56px] w-full items-center justify-center overflow-hidden rounded-[20px] border border-sky-200/25 bg-[linear-gradient(135deg,rgba(110,208,255,0.96),rgba(52,142,255,0.92))] px-4 text-[15px] font-bold text-slate-950 shadow-[0_20px_40px_rgba(42,123,255,0.28),inset_0_1px_0_rgba(255,255,255,0.45)] transition duration-300 active:scale-[0.985]"
                @click="changePage('/auth/login')"
              >
                <span class="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.42),transparent)] ctaSheen"></span>
                <span class="relative inline-flex items-center gap-2">
                  {{ $t('login.l1') }}
                  <Icon name="lucide:arrow-up-right" size="16" class="transition duration-300 group-active:translate-x-0.5 group-active:-translate-y-0.5" />
                </span>
              </button>

              <button
                type="button"
                class="inline-flex min-h-[54px] w-full items-center justify-center rounded-[18px] border border-white/12 bg-white/[0.045] px-4 text-[14px] font-semibold text-white/86 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition duration-300 active:scale-[0.985]"
                @click="changePage('/auth/register')"
              >
                {{ $t('login.l3') }}
              </button>
            </div>

            <div class="grid grid-cols-3 gap-2.5 text-[10px] uppercase tracking-[0.2em] text-sky-100/36">
              <div class="rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-2 text-center">Sync</div>
              <div class="rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-2 text-center">Shield</div>
              <div class="rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-2 text-center">Live</div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </AuthShell>
</template>

<style scoped>
.heroAurora {
  animation: aurora-spin 18s linear infinite;
  transform-origin: center;
}

.heroLightCurtain {
  background:
    repeating-linear-gradient(
      90deg,
      rgba(130, 207, 255, 0.07) 0,
      rgba(130, 207, 255, 0.07) 1px,
      transparent 1px,
      transparent 26px
    ),
    linear-gradient(180deg, rgba(125, 211, 252, 0.12), transparent 58%);
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.08));
  animation: curtain-drift 10s ease-in-out infinite alternate;
}

.heroGrid {
  background-image:
    linear-gradient(rgba(130, 207, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(130, 207, 255, 0.08) 1px, transparent 1px);
  background-size: 26px 26px;
  mask-image: radial-gradient(circle at 50% 25%, rgba(0, 0, 0, 0.95), transparent 85%);
  opacity: 0.34;
}

.heroSweep {
  animation: sweep-pass 7.6s ease-in-out infinite;
}

.scanLine {
  animation: scan-drop 6.5s linear infinite;
  box-shadow: 0 0 18px rgba(125, 211, 252, 0.4);
}

.heroParticles {
  background-image:
    radial-gradient(circle at 16% 24%, rgba(186, 230, 253, 0.8) 0 1px, transparent 1.8px),
    radial-gradient(circle at 76% 18%, rgba(147, 197, 253, 0.65) 0 1.2px, transparent 2px),
    radial-gradient(circle at 68% 58%, rgba(125, 211, 252, 0.6) 0 1px, transparent 2px),
    radial-gradient(circle at 26% 72%, rgba(191, 219, 254, 0.45) 0 1.2px, transparent 2px),
    radial-gradient(circle at 86% 82%, rgba(125, 211, 252, 0.5) 0 1px, transparent 2px);
  animation: particle-drift 13s ease-in-out infinite alternate;
}

.floatOrbSlow {
  animation: float-orb-slow 8.8s ease-in-out infinite;
}

.floatOrbFast {
  animation: float-orb-fast 6.4s ease-in-out infinite;
}

.pulseDot {
  animation: pulse-dot 2.2s ease-in-out infinite;
}

.ctaSheen {
  animation: cta-sheen 3.8s ease-in-out infinite;
}

@keyframes aurora-spin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.08);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}

@keyframes curtain-drift {
  0% {
    transform: translate3d(-2%, 0, 0);
    opacity: 0.46;
  }
  100% {
    transform: translate3d(2%, 2%, 0);
    opacity: 0.72;
  }
}

@keyframes sweep-pass {
  0% {
    transform: translate3d(-18%, 0, 0) rotate(-10deg);
    opacity: 0;
  }
  14% {
    opacity: 0.14;
  }
  48% {
    opacity: 0.4;
  }
  100% {
    transform: translate3d(138%, 0, 0) rotate(-10deg);
    opacity: 0;
  }
}

@keyframes scan-drop {
  0% {
    transform: translate3d(0, -18px, 0);
    opacity: 0;
  }
  12% {
    opacity: 0.88;
  }
  70% {
    opacity: 0.68;
  }
  100% {
    transform: translate3d(0, 260px, 0);
    opacity: 0;
  }
}

@keyframes particle-drift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0.45;
  }
  100% {
    transform: translate3d(0, -12px, 0) scale(1.04);
    opacity: 0.92;
  }
}

@keyframes float-orb-slow {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(10px, -14px, 0);
  }
}

@keyframes float-orb-fast {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(-8px, -10px, 0) scale(1.05);
  }
}

@keyframes pulse-dot {
  0%,
  100% {
    opacity: 0.8;
    box-shadow: 0 0 0 0 rgba(125, 211, 252, 0.25);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 0 8px rgba(125, 211, 252, 0);
  }
}

@keyframes cta-sheen {
  0% {
    transform: translate3d(-140%, 0, 0) skewX(-20deg);
    opacity: 0;
  }
  20% {
    opacity: 0.2;
  }
  60% {
    opacity: 0.42;
  }
  100% {
    transform: translate3d(180%, 0, 0) skewX(-20deg);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .heroAurora,
  .heroLightCurtain,
  .heroSweep,
  .scanLine,
  .heroParticles,
  .floatOrbSlow,
  .floatOrbFast,
  .pulseDot,
  .ctaSheen {
    animation: none;
  }
}
</style>
