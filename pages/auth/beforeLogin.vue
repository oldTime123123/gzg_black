<script setup lang="ts">
const router = useRouter()
const pub = usePublicStore()

onMounted(() => {
  pub.showLoading = false
})

const go = (url: string) => router.push(url)

const stats = [
  { val: '99.9%',  label: 'Uptime'  },
  { val: '<2ms',   label: 'Latency' },
  { val: 'AES256', label: 'Encrypt' },
]
</script>

<template>
  <AuthShell :show-back="false" :title="$t('login.l1')">
    <template  #hero>

      <!-- ░░ 动画装饰层 ░░ -->
      <div class="canvas" aria-hidden="true">
        <div class="grid-layer" />
        <div class="radial-top" />
        <div class="radial-corner" />
        <div class="scan-h" />
        <div class="scan-v" />
        <div class="corner tl" /><div class="corner tr" />
        <div class="corner bl" /><div class="corner br" />
        <div class="orb orb-a" /><div class="orb orb-b" />
        <div v-for="i in 9" :key="i" class="dot" :style="`--i:${i}`" />
      </div>

      <!-- ░░ 内容层：继承 authHero 的 flex:1 flex-col，用 justify-between 撑满 ░░ -->
      <div class="page-body">

        <header class="flex flex-col gap-4 entry-a">
          <div class="flex items-center gap-2">
            <span class="sys-tag">
              <span class="live-dot" />
              SYS·ONLINE
            </span>
            <span class="sys-tag opacity-40">v4.2</span>
          </div>
          <div class="space-y-1.5">
            <p class="font-mono text-[9px] tracking-[0.45em] uppercase text-cyan-400/40">
              TRADING · TERMINAL
            </p>
            <h2 class="headline">{{ $t('login.l1') }}</h2>
          </div>
          <div class="flex gap-2">
            <div v-for="s in stats" :key="s.label" class="stat-chip">
              <span class="stat-val">{{ s.val }}</span>
              <span class="stat-lbl">{{ s.label }}</span>
            </div>
          </div>
        </header>

        <div class="mid-strip entry-b" style="--d:0.08s">
          <div class="strip-bar" />
          <div class="flex gap-1.5 items-center">
            <span v-for="n in 14" :key="n" class="strip-tick" :style="`--n:${n}`" />
          </div>
          <div class="strip-bar" />
        </div>

        <footer class="flex flex-col gap-3 entry-b" style="--d:0.18s">
          <button type="button" class="btn-cta group" @click="go('/auth/login')">
            <span class="cta-glow" />
            <span class="cta-sheen" />
            <span class="relative z-10 flex items-center gap-2 font-bold tracking-wide text-sm">
              {{ $t('login.l1') }}
              <Icon name="lucide:arrow-up-right" size="14"
                class="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </button>
          <button type="button" class="btn-ghost" @click="go('/auth/register')">
            {{ $t('login.l3') }}
          </button>
          <div class="flex gap-2">
            <span v-for="tag in ['SYNC', 'SHIELD', 'LIVE']" :key="tag" class="pill">{{ tag }}</span>
          </div>
        </footer>

      </div>
    </template>
  </AuthShell>
</template>

<style scoped>
/* canvas 绝对定位覆盖 authHero */
.canvas {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 0;
}
.grid-layer {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(34 211 238 / 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34 211 238 / 0.05) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: radial-gradient(ellipse 90% 60% at 50% 0%, black, transparent 80%);
  animation: grid-breathe 7s ease-in-out infinite alternate;
}
.radial-top {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 80% 45% at 50% -5%,
    rgba(6 182 212 / 0.2) 0%, rgba(14 165 233 / 0.05) 55%, transparent 100%);
}
.radial-corner {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 50% 60% at 110% 95%,
    rgba(37 99 235 / 0.16) 0%, transparent 65%);
  animation: corner-drift 11s ease-in-out infinite alternate;
}
.scan-h {
  position: absolute; inset-x: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34 211 238 / 0.85), transparent);
  box-shadow: 0 0 14px rgba(34 211 238 / 0.4);
  animation: scan-y 5.5s linear infinite;
}
.scan-v {
  position: absolute; inset-y: 0; width: 1px;
  background: linear-gradient(180deg, transparent, rgba(56 189 248 / 0.5), transparent);
  animation: scan-x 9s linear infinite;
}
.corner { position: absolute; width: 16px; height: 16px; }
.corner::before, .corner::after {
  content: ''; position: absolute;
  background: rgba(34 211 238 / 0.5); border-radius: 1px;
}
.corner::before { width: 100%;  height: 1.5px; top: 0; left: 0; }
.corner::after  { width: 1.5px; height: 100%;  top: 0; left: 0; }
.tl { top: 0;    left: 0;  }
.tr { top: 0;    right: 0; transform: scaleX(-1); }
.bl { bottom: 0; left: 0;  transform: scaleY(-1); }
.br { bottom: 0; right: 0; transform: scale(-1);  }
.orb { position: absolute; border-radius: 50%; filter: blur(50px); }
.orb-a {
  width: 180px; height: 180px; top: -60px; left: -40px;
  background: radial-gradient(circle, rgba(6 182 212 / 0.2), transparent 70%);
  animation: float-a 10s ease-in-out infinite;
}
.orb-b {
  width: 220px; height: 220px; bottom: -80px; right: -60px;
  background: radial-gradient(circle, rgba(37 99 235 / 0.18), transparent 68%);
  animation: float-b 7.5s ease-in-out infinite;
}
.dot {
  position: absolute; width: 2px; height: 2px; border-radius: 50%;
  background: rgba(34 211 238 / 0.7);
  box-shadow: 0 0 5px rgba(34 211 238 / 0.5);
  left: calc(var(--i) * 11% + 2%);
  animation: dot-fall calc(3.2s + var(--i) * 0.35s) linear infinite;
  animation-delay: calc(var(--i) * -0.65s);
}

/* ── page-body 撑满 authHero ─────────────────── */
/* authHero 已经是 flex:1 + flex-col，
   page-body 同样 flex:1 + flex-col + justify-between 即可 */
.page-body {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0;
}

.sys-tag {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 9px; border-radius: 4px;
  border: 1px solid rgba(34 211 238 / 0.18);
  background: rgba(34 211 238 / 0.05);
  font-family: ui-monospace, monospace;
  font-size: 9px; letter-spacing: 0.18em; font-weight: 700;
  color: rgba(34 211 238 / 0.75);
}
.live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #22d3ee; box-shadow: 0 0 7px #22d3ee;
  animation: pulse-dot 2.2s ease-in-out infinite;
}
.headline {
  margin: 0; font-size: 40px; font-weight: 900;
  line-height: 0.9; letter-spacing: -0.055em;
  background: linear-gradient(145deg, #fff 35%, rgba(147 222 255 / 0.8) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.stat-chip {
  display: flex; flex-direction: column; gap: 2px;
  padding: 7px 11px; border-radius: 8px;
  border: 1px solid rgba(34 211 238 / 0.1);
  background: rgba(34 211 238 / 0.04);
  min-width: 62px; position: relative; overflow: hidden;
}
.stat-chip::before {
  content: ''; position: absolute; inset-x: 0; top: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(34 211 238 / 0.4), transparent);
}
.stat-val { font-family: ui-monospace, monospace; font-size: 13px; font-weight: 700; color: #22d3ee; }
.stat-lbl { font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; color: rgba(148 163 184 / 0.45); }

.mid-strip { display: flex; align-items: center; gap: 10px; }
.strip-bar { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(34 211 238 / 0.2), transparent); }
.strip-tick {
  display: block; width: 2px; border-radius: 1px;
  background: rgba(34 211 238 / 0.35);
  height: calc(4px + (var(--n, 1) % 3) * 4px);
  animation: tick-pulse calc(1.8s + var(--n) * 0.1s) ease-in-out infinite alternate;
  animation-delay: calc(var(--n) * 0.07s);
}

.btn-cta {
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  min-height: 54px; width: 100%; border-radius: 12px;
  border: 1px solid rgba(34 211 238 / 0.3);
  background: linear-gradient(135deg,
    rgba(8 145 178 / 0.9) 0%, rgba(3 105 161 / 0.85) 45%, rgba(29 78 216 / 0.8) 100%);
  color: #dff8ff; cursor: pointer;
  box-shadow: 0 0 35px rgba(6 182 212 / 0.18), 0 10px 28px rgba(0 5 14 / 0.4), inset 0 1px 0 rgba(255 255 255 / 0.15);
  transition: box-shadow 0.2s, transform 0.15s;
}
.btn-cta:hover { box-shadow: 0 0 55px rgba(6 182 212 / 0.3), 0 14px 36px rgba(0 5 14 / 0.5), inset 0 1px 0 rgba(255 255 255 / 0.2); }
.btn-cta:active { transform: scale(0.981); }
.cta-glow {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 65% 80% at 50% -10%, rgba(34 211 238 / 0.22), transparent 65%);
  pointer-events: none;
}
.cta-sheen {
  position: absolute; inset: 0;
  background: linear-gradient(108deg, transparent 28%, rgba(255 255 255 / 0.15) 48%, transparent 68%);
  animation: sheen 3.5s ease-in-out infinite; pointer-events: none;
}
.btn-ghost {
  display: flex; align-items: center; justify-content: center;
  min-height: 50px; width: 100%; border-radius: 12px;
  border: 1px solid rgba(255 255 255 / 0.08);
  background: rgba(255 255 255 / 0.03);
  color: rgba(203 213 225 / 0.65); font-size: 14px; font-weight: 500; cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.15s;
}
.btn-ghost:hover { background: rgba(255 255 255 / 0.055); border-color: rgba(34 211 238 / 0.15); color: rgba(226 232 240 / 0.85); }
.btn-ghost:active { transform: scale(0.981); }
.pill {
  padding: 4px 10px; border-radius: 4px;
  border: 1px solid rgba(34 211 238 / 0.1);
  background: rgba(34 211 238 / 0.035);
  font-family: ui-monospace, monospace;
  font-size: 9px; letter-spacing: 0.22em; color: rgba(34 211 238 / 0.38); font-weight: 600;
}

.entry-a { animation: entry 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }
.entry-b { animation: entry 0.65s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0.12s) both; }

@keyframes entry {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes grid-breathe { from { opacity: 0.5; } to { opacity: 1; } }
@keyframes corner-drift { from { transform: translate(0,0); } to { transform: translate(-12px,-16px); } }
@keyframes scan-y {
  0%   { top: -2px; opacity: 0; } 6% { opacity: 1; } 88% { opacity: 0.65; } 100% { top: 100%; opacity: 0; }
}
@keyframes scan-x {
  0%   { left: -2px; opacity: 0; } 6% { opacity: 1; } 88% { opacity: 0.45; } 100% { left: 100%; opacity: 0; }
}
@keyframes dot-fall {
  0% { top: -4px; opacity: 0; } 8% { opacity: 0.85; } 88% { opacity: 0.4; } 100% { top: 100%; opacity: 0; }
}
@keyframes float-a {
  0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(14px,-18px) scale(1.1); }
}
@keyframes float-b {
  0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-12px,-14px) scale(1.08); }
}
@keyframes pulse-dot {
  0%, 100% { opacity: 0.8; box-shadow: 0 0 0 0 rgba(34 211 238 / 0.4); }
  50%       { opacity: 1;   box-shadow: 0 0 0 6px rgba(34 211 238 / 0); }
}
@keyframes tick-pulse {
  from { opacity: 0.2; transform: scaleY(0.5); } to { opacity: 0.9; transform: scaleY(1); }
}
@keyframes sheen {
  0%   { transform: translateX(-155%) skewX(-18deg); }
  100% { transform: translateX(210%)  skewX(-18deg); }
}
@media (prefers-reduced-motion: reduce) {
  .scan-h, .scan-v, .dot, .orb-a, .orb-b,
  .live-dot, .cta-sheen, .entry-a, .entry-b,
  .grid-layer, .radial-corner, .strip-tick { animation: none; }
}
</style>
