<script setup lang="ts">
const router = useRouter()
const pub = usePublicStore()

onMounted(() => {
  pub.showLoading = false
})

const go = (url: string) => router.push(url)

const stats = [
  { val: '99.9%', label: 'Uptime' },
  { val: '<2ms', label: 'Latency' },
  { val: 'AES256', label: 'Encrypt' },
]
</script>

<template>

      <section
        class="relative min-h-[calc(100vh-7.5rem)] overflow-hidden px-0 pb-2 pt-3 text-slate-50 sm:min-h-[calc(100vh-8rem)]">
        <div class="absolute inset-0 -z-10 overflow-hidden">
          <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(110,194,255,0.16),_transparent_34%),linear-gradient(180deg,_rgba(3,8,20,0.96)_0%,_rgba(5,12,28,0.98)_48%,_rgba(1,6,16,1)_100%)]" />
          <div class="absolute inset-[-12%] aurora-layer opacity-90" />
          <div class="absolute inset-x-[-18%] top-[-8%] h-[48vh] light-curtain opacity-75" />
          <div class="absolute inset-x-0 top-0 h-full flow-layer opacity-60" />
          <div class="absolute inset-0 grid-layer-full opacity-45" />
          <div class="absolute inset-0 scan-layer mix-blend-screen opacity-55" />
          <div class="absolute inset-0 particle-field">
            <span v-for="i in 18" :key="`particle-${i}`" class="particle" :style="`--i:${i}`" />
          </div>
          <div class="absolute left-[-12%] top-[10%] h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl orb-float-a" />
          <div class="absolute bottom-[8%] right-[-10%] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl orb-float-b" />
          <div
            class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020611] via-[#020611]/72 to-transparent" />
        </div>

        <div class="relative z-10 flex min-h-[inherit] flex-col justify-between gap-2 px-4 pb-6 pt-1 sm:px-5">
          <header class="space-y-5 reveal-block" style="--delay:0s">

            <div class="space-y-2">

          <h2 class="max-w-[640px] whitespace-normal break-words text-[36px] font-black
  tracking-[-0.01em] sm:text-[44px] lg:text-[56px]
  text-transparent bg-clip-text bg-[length:220%_220%]
  bg-[linear-gradient(135deg,#f0f9ff_0%,#7dd3fc_20%,#38bdf8_40%,#0ea5e9_62%,#0369a1_100%)]
  animate-[titleGradient_7s_ease-in-out_infinite]">
            Welcome to the
            <span class="font-black text-transparent bg-clip-text bg-[length:220%_220%]
    bg-[linear-gradient(135deg,#ffffff_0%,#bae6fd_18%,#38bdf8_42%,#0ea5e9_70%,#075985_100%)]
    animate-[titleGradient_5.5s_ease-in-out_infinite]">
              HQBW
            </span>
            Trading Platform
          </h2>
            </div>
          </header>

          <div class="reveal-block" style="--delay:0.09s">
            <div
              class="foreground-card rounded-[28px] border border-white/10 bg-slate-950/28 p-4 shadow-[0_24px_80px_rgba(2,8,20,0.55)] backdrop-blur-xl sm:p-5">
              <div
                class="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/55 to-transparent" />
              <div
                class="pointer-events-none absolute inset-y-10 right-0 w-px bg-gradient-to-b from-transparent via-white/18 to-transparent" />

              <div class="space-y-4">

                <div class="flex items-center gap-3">
                  <div class="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-200/24 to-cyan-200/6" />
                  <div class="flex items-center gap-1.5">
                    <span v-for="n in 12" :key="n" class="h-[5px] w-[2px] rounded-full bg-cyan-200/40 strip-tick"
                      :style="`--n:${n}`" />
                  </div>
                  <div class="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-200/24 to-cyan-200/6" />
                </div>

                <div class="space-y-3">
                  <button type="button"
                    class="group relative flex min-h-[56px] w-full items-center justify-center overflow-hidden rounded-2xl border border-cyan-200/30 bg-[linear-gradient(135deg,#0284c7,#0ea5e9_52%,#0369a1)] px-4 text-sm font-semibold tracking-[0.08em] text-white shadow-[0_20px_50px_rgba(6,48,78,0.42)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(14,116,144,0.34)]"
                    @click="go('/auth/login')">
                    <span
                      class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_52%)]" />
                    <span class="pointer-events-none absolute inset-0 cta-sheen" />
                    <span class="relative z-10 flex items-center gap-2">
                      {{ $t('login.l1') }}
                      <Icon name="lucide:arrow-up-right" size="14"
                        class="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </button>

                  <button type="button"
                    class="flex min-h-[50px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium tracking-[0.08em] text-white/68 transition duration-300 hover:border-cyan-100/20 hover:bg-white/[0.045] hover:text-white/88"
                    @click="go('/auth/register')">
                    {{ $t('login.l3') }}
                  </button>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

</template>

<style scoped>
@keyframes titleGradient {
  0% {
    background-position: 0% 50%;
    filter: brightness(1);
  }
  50% {
    background-position: 100% 50%;
    filter: brightness(1.22);
  }
  100% {
    background-position: 0% 50%;
    filter: brightness(1);
  }
}
.before-login-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.before-login-shell :deep(.authShell) {
  background:
    radial-gradient(circle at top, rgba(74, 180, 255, 0.1), transparent 28%),
    linear-gradient(180deg, #030816 0%, #030a17 38%, #02050e 100%);
}

.before-login-shell :deep(.authBackdrop),
.before-login-shell :deep(.authNoise) {
  opacity: 0;
}

.before-login-shell :deep(.authTopBar) {
  position: relative;
  z-index: 20;
  padding: 20px 16px 0;
}

.before-login-shell :deep(.topAction) {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(18px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 10px 28px rgba(1, 8, 24, 0.28);
}

.before-login-shell :deep(.authWrap) {
  min-height: calc(100vh - 60px);
  padding: 12px 0 0;
}

.before-login-shell :deep(.authHero) {
  position: relative;
  min-height: calc(100vh - 80px);
  padding: 0;
}

.before-login-shell :deep(.authTitle),
.before-login-shell :deep(.eyebrow),
.before-login-shell :deep(.authSubtitle) {
  display: none;
}

.before-login-shell :deep(.authCard) {
  display: none;
}

.foreground-card {
  position: relative;
  overflow: hidden;
}

.aurora-layer {
  background:
    radial-gradient(circle at 18% 22%, rgba(96, 165, 250, 0.2), transparent 32%),
    radial-gradient(circle at 78% 16%, rgba(34, 211, 238, 0.15), transparent 28%),
    radial-gradient(circle at 62% 60%, rgba(59, 130, 246, 0.14), transparent 30%),
    conic-gradient(from 210deg at 50% 50%, rgba(7, 43, 78, 0) 0deg, rgba(67, 168, 255, 0.14) 72deg, rgba(8, 32, 65, 0) 140deg, rgba(34, 211, 238, 0.1) 228deg, rgba(7, 43, 78, 0) 360deg);
  filter: blur(34px) saturate(120%);
  animation: auroraDrift 18s ease-in-out infinite alternate;
}

.light-curtain {
  background:
    linear-gradient(90deg, transparent 0%, rgba(125, 211, 252, 0.05) 18%, rgba(125, 211, 252, 0.16) 36%, rgba(147, 197, 253, 0.08) 48%, rgba(37, 99, 235, 0.12) 62%, transparent 100%);
  filter: blur(24px);
  transform: translate3d(0, 0, 0);
  animation: curtainSweep 16s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}

.flow-layer::before,
.flow-layer::after {
  content: '';
  position: absolute;
  inset: 0;
  background-repeat: no-repeat;
}

.flow-layer::before {
  background-image: linear-gradient(118deg, transparent 18%, rgba(125, 211, 252, 0.12) 42%, transparent 66%);
  transform: translateX(-55%) skewX(-22deg);
  animation: flowSweep 12s linear infinite;
}

.flow-layer::after {
  background-image: linear-gradient(180deg, transparent 0%, rgba(8, 145, 178, 0.08) 48%, transparent 100%);
  mask-image: linear-gradient(180deg, transparent 0%, black 28%, black 72%, transparent 100%);
  animation: verticalPulse 7s ease-in-out infinite alternate;
}

.grid-layer-full {
  background-image:
    linear-gradient(rgba(148, 163, 184, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(circle at 50% 36%, black 0%, rgba(0, 0, 0, 0.72) 52%, transparent 92%);
  animation: gridFloat 14s linear infinite;
}

.scan-layer::before,
.scan-layer::after {
  content: '';
  position: absolute;
}

.scan-layer::before {
  inset-inline: 0;
  top: -12%;
  height: 22%;
  background: linear-gradient(180deg, transparent 0%, rgba(147, 197, 253, 0.18) 42%, transparent 100%);
  filter: blur(10px);
  animation: scanDown 8s linear infinite;
}

.scan-layer::after {
  inset-block: 0;
  left: -20%;
  width: 28%;
  background: linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.1) 44%, transparent 100%);
  filter: blur(16px);
  animation: scanAcross 12s linear infinite;
}

.particle {
  position: absolute;
  left: calc((var(--i) * 5.4%) + 2%);
  top: calc((var(--i) * 4.2%) - 6%);
  width: 2px;
  height: 2px;
  border-radius: 999px;
  background: rgba(186, 230, 253, 0.9);
  box-shadow: 0 0 10px rgba(125, 211, 252, 0.85);
  opacity: 0;
  animation: particleFloat calc(8s + (var(--i) * 0.45s)) linear infinite;
  animation-delay: calc(var(--i) * -0.55s);
}

.pulse-dot {
  animation: pulseDot 2.4s ease-in-out infinite;
}

.strip-tick {
  animation: tickPulse calc(1.6s + var(--n) * 0.08s) ease-in-out infinite alternate;
  animation-delay: calc(var(--n) * 0.05s);
}

.reveal-block {
  animation: revealUp 0.75s cubic-bezier(0.22, 1, 0.36, 1) var(--delay, 0s) both;
}

.cta-sheen {
  background: linear-gradient(110deg, transparent 22%, rgba(255, 255, 255, 0.18) 48%, transparent 68%);
  transform: translateX(-150%) skewX(-18deg);
  animation: sheenMove 3.6s ease-in-out infinite;
}

.orb-float-a {
  animation: orbFloatA 16s ease-in-out infinite alternate;
}

.orb-float-b {
  animation: orbFloatB 18s ease-in-out infinite alternate;
}

@keyframes revealUp {
  from {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes auroraDrift {
  0% {
    transform: translate3d(-2%, -1%, 0) scale(1);
  }

  50% {
    transform: translate3d(3%, 2%, 0) scale(1.06);
  }

  100% {
    transform: translate3d(-1%, 4%, 0) scale(1.03);
  }
}

@keyframes curtainSweep {
  0% {
    transform: translate3d(-12%, -6%, 0) scaleX(1);
    opacity: 0.34;
  }

  50% {
    transform: translate3d(10%, 4%, 0) scaleX(1.08);
    opacity: 0.8;
  }

  100% {
    transform: translate3d(-4%, 10%, 0) scaleX(0.96);
    opacity: 0.46;
  }
}

@keyframes flowSweep {
  0% {
    transform: translateX(-60%) skewX(-22deg);
  }

  100% {
    transform: translateX(130%) skewX(-22deg);
  }
}

@keyframes verticalPulse {
  from {
    opacity: 0.18;
    transform: translateY(-1%);
  }

  to {
    opacity: 0.5;
    transform: translateY(2%);
  }
}

@keyframes gridFloat {
  from {
    transform: perspective(900px) rotateX(76deg) translateY(12%);
  }

  to {
    transform: perspective(900px) rotateX(76deg) translateY(18%);
  }
}

@keyframes scanDown {
  0% {
    transform: translateY(-120%);
    opacity: 0;
  }

  10% {
    opacity: 0.72;
  }

  90% {
    opacity: 0.2;
  }

  100% {
    transform: translateY(520%);
    opacity: 0;
  }
}

@keyframes scanAcross {
  0% {
    transform: translateX(-120%);
    opacity: 0;
  }

  12% {
    opacity: 0.56;
  }

  100% {
    transform: translateX(520%);
    opacity: 0;
  }
}

@keyframes particleFloat {
  0% {
    transform: translate3d(0, 8px, 0) scale(0.8);
    opacity: 0;
  }

  12% {
    opacity: 0.9;
  }

  55% {
    transform: translate3d(16px, 42px, 0) scale(1.15);
    opacity: 0.7;
  }

  100% {
    transform: translate3d(-10px, 96px, 0) scale(0.92);
    opacity: 0;
  }
}

@keyframes pulseDot {

  0%,
  100% {
    opacity: 0.78;
    box-shadow: 0 0 0 0 rgba(103, 232, 249, 0.35);
  }

  50% {
    opacity: 1;
    box-shadow: 0 0 0 8px rgba(103, 232, 249, 0);
  }
}

@keyframes tickPulse {
  from {
    transform: scaleY(0.72);
    opacity: 0.22;
  }

  to {
    transform: scaleY(1);
    opacity: 0.88;
  }
}

@keyframes sheenMove {
  0% {
    transform: translateX(-160%) skewX(-18deg);
  }

  100% {
    transform: translateX(220%) skewX(-18deg);
  }
}

@keyframes orbFloatA {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }

  to {
    transform: translate3d(24px, -18px, 0) scale(1.08);
  }
}

@keyframes orbFloatB {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }

  to {
    transform: translate3d(-28px, -20px, 0) scale(1.1);
  }
}

@media (prefers-reduced-motion: reduce) {

  .aurora-layer,
  .light-curtain,
  .flow-layer::before,
  .flow-layer::after,
  .grid-layer-full,
  .scan-layer::before,
  .scan-layer::after,
  .particle,
  .pulse-dot,
  .strip-tick,
  .reveal-block,
  .cta-sheen,
  .orb-float-a,
  .orb-float-b {
    animation: none !important;
  }
}
</style>
