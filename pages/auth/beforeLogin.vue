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
      <section class="relative overflow-hidden rounded-shell border border-skin-border bg-skin-panel/55 px-5 py-5 shadow-soft backdrop-blur-xl">
        <div class="absolute inset-x-[-8%] top-[-120px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(103,214,255,0.18)_0%,rgba(103,214,255,0)_70%)] blur-2xl"></div>
        <div class="absolute right-[-18px] top-6 h-24 w-24 rounded-full border border-white/10 bg-white/5 blur-[2px] floatOrb orbDelay"></div>
        <div class="absolute left-[-12px] bottom-4 h-16 w-16 rounded-full border border-[rgba(56,189,248,0.18)] bg-[rgba(56,189,248,0.08)] blur-[1px] floatOrb"></div>

        <div class="relative z-[1] grid gap-5">
          <div class="flex items-start justify-between gap-3">
            <div class="grid gap-3">
              <div class="inline-flex w-fit items-center gap-2 rounded-pill border border-[var(--brand-primary-border)] bg-[var(--brand-primary-soft)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-skin-primary">
                <span class="h-2 w-2 rounded-full bg-skin-primary pulseDot"></span>
                {{ $t('theme.tradingAccess') }}
              </div>
              <div class="max-w-[24rem]">
                <div class="text-[26px] font-extrabold leading-[1.14] tracking-[-0.03em] text-skin-text">
                  {{ $t('theme.manageAccountVerificationAccess') }}
                </div>
                <p class="mt-3 text-[13px] leading-6 text-skin-muted">
                  {{ $t('theme.entryExperienceCopy') }}
                </p>
              </div>
            </div>

            <div class="hidden min-w-[88px] rounded-[22px] border border-white/10 bg-white/5 px-3 py-3 text-right sm:block">
              <div class="text-[11px] font-semibold uppercase tracking-[0.12em] text-skin-subtle">{{ $t('theme.mode') }}</div>
              <div class="mt-2 text-[17px] font-extrabold leading-none text-skin-text">{{ $t('theme.secure') }}</div>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-3">
            <div class="infoCard">
              <div class="infoLabel">{{ $t('theme.tradingAccess') }}</div>
              <strong>{{ $t('theme.trading') }}</strong>
              <p>{{ $t('theme.marketBoardSubtext') }}</p>
            </div>
            <div class="infoCard">
              <div class="infoLabel">{{ $t('theme.recoveryAccess') }}</div>
              <strong>{{ $t('theme.secure') }}</strong>
              <p>{{ $t('theme.securityUpdate') }}</p>
            </div>
            <div class="infoCard">
              <div class="infoLabel">{{ $t('theme.supportAccess') }}</div>
              <strong>{{ $t('theme.onlineCustomerService') }}</strong>
              <p>{{ $t('theme.supportFirst') }}</p>
            </div>
          </div>

          <div class="relative overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] px-4 py-4">
            <div class="absolute inset-y-0 left-[38%] w-px bg-[linear-gradient(180deg,rgba(125,211,252,0),rgba(125,211,252,0.3),rgba(125,211,252,0))]"></div>
            <div class="grid grid-cols-[1.15fr_0.85fr] items-center gap-4">
              <div>
                <div class="text-[12px] font-semibold uppercase tracking-[0.12em] text-skin-subtle">{{ $t('theme.portfolioDashboard') }}</div>
                <div class="mt-2 text-[15px] font-bold leading-6 text-skin-text">{{ $t('theme.marketHeroTitle') }}</div>
              </div>
              <div class="grid gap-2 text-right">
                <div class="text-[12px] text-skin-muted">{{ $t('theme.verificationStatus') }}</div>
                <div class="inline-flex justify-end">
                  <span class="rounded-pill border border-[rgba(125,211,252,0.2)] bg-[rgba(56,189,248,0.08)] px-3 py-1 text-[12px] font-bold text-skin-primary">
                    {{ $t('theme.secureAccess') }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <div class="grid gap-4">
      <div class="rounded-shell border border-skin-border bg-[rgba(12,22,36,0.2)] p-4 shadow-soft backdrop-blur-xl">
        <div class="grid gap-4">
          <div class="grid gap-1">
            <div class="text-[12px] font-semibold uppercase tracking-[0.1em] text-skin-subtle">{{ $t('theme.authPath') }}</div>
            <div class="text-[22px] font-extrabold leading-[1.2] tracking-[-0.02em] text-skin-text">{{ $t('login.l4') }}</div>
            <p class="text-[13px] leading-6 text-skin-muted">{{ $t('theme.securityUpdateCopy') }}</p>
          </div>

          <button type="button" class="contentBtn min-h-[52px]" @click="changePage('/auth/login')">
            {{ $t('login.l1') }}
          </button>

          <div class="grid gap-3 rounded-[20px] border border-white/10 bg-white/[0.03] p-4">
            <div class="flex items-start gap-3">
              <div class="iconFrame iconFrame--small shrink-0">
                <Icon name="solar:user-plus-linear" size="18" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-[14px] font-bold text-skin-text">{{ $t('login.l2') }}</div>
                <p class="mt-1 text-[12px] leading-5 text-skin-muted">{{ $t('theme.createAccess') }}</p>
              </div>
            </div>

            <button type="button" class="secondaryAction" @click="changePage('/auth/register')">
              <span>{{ $t('login.l3') }}</span>
              <Icon name="solar:alt-arrow-right-linear" size="18" />
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="utilityCard">
          <div class="utilityLabel">{{ $t('theme.accountRecovery') }}</div>
          <div class="utilityValue">{{ $t('theme.recoveryRoute') }}</div>
        </div>
        <div class="utilityCard">
          <div class="utilityLabel">{{ $t('theme.supportAccess') }}</div>
          <div class="utilityValue">{{ $t('theme.supportFirst') }}</div>
        </div>
      </div>
    </div>
  </AuthShell>
</template>

<style scoped>
.infoCard {
  @apply rounded-[20px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-md;
}

.infoLabel {
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.infoCard strong {
  display: block;
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.2;
  font-weight: 800;
}

.infoCard p {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.secondaryAction {
  display: inline-flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-radius: 16px;
  border: 1px solid rgba(125, 211, 252, 0.14);
  background: rgba(56, 189, 248, 0.08);
  padding: 14px 16px;
  color: var(--brand-primary);
  font-size: 14px;
  font-weight: 700;
  transition:
    transform var(--motion-fast) ease,
    background-color var(--motion-fast) ease,
    border-color var(--motion-fast) ease;
}

.secondaryAction:active {
  transform: translateY(1px) scale(0.985);
}

.utilityCard {
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  padding: 14px;
  backdrop-filter: blur(16px);
}

.utilityLabel {
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.utilityValue {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
}

.floatOrb {
  animation: float-orb 6s ease-in-out infinite;
}

.orbDelay {
  animation-delay: 1.6s;
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
