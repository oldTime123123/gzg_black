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
  <AuthShell :show-back="false" :eyebrow="$t('theme.access')" :title="$t('login.l1')"
    >
    <template #hero>
      <div class="heroPanel">

        <div class="heroMeta">
          <div class="heroMetaItem">
            <span>{{ $t('theme.tradingAccess') }}</span>
            <strong>{{ $t('theme.trading') }}</strong>
          </div>
          <div class="heroMetaItem">
            <span>{{ $t('theme.recoveryAccess') }}</span>
            <strong>{{ $t('theme.secure') }}</strong>
          </div>
        </div>
      </div>
    </template>

    <div class="ctaStack">
      <button type="button" class="ctaPrimary contentBtn" @click="changePage('/auth/login')">{{ $t('login.l1') }}</button>

      <div class="secondaryPanel">
        <div class="secondaryTitle">{{ $t('login.l2') }}</div>
        <button type="button" class="secondaryAction" @click="changePage('/auth/register')">
          <span>{{ $t('login.l3') }}</span>
          <Icon name="solar:alt-arrow-right-linear" size="18" />
        </button>
      </div>

    </div>
  </AuthShell>
</template>

<style scoped>
.heroPanel {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.heroLine {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.18);
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.heroDot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--brand-primary);
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.12);
}

.heroMeta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.heroMetaItem {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.heroMetaItem span {
  color: var(--text-secondary);
  font-size: 12px;
}

.heroMetaItem strong {
  display: block;
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
}

.ctaStack {
  display: grid;
  gap: 14px;
}

.ctaPrimary {
  width: 100%;
}

.secondaryPanel,
.helpPanel {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.secondaryPanel {
  padding: 16px;
}

.secondaryTitle {
  color: var(--text-secondary);
  font-size: 13px;
}

.secondaryAction {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--brand-primary);
  font-weight: 700;
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
}

.helpPanel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

.helpCopy {
  flex: 1;
}

.helpTitle {
  color: var(--text-primary);
  font-weight: 700;
}

.helpText {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.helpArrow {
  color: var(--text-muted);
}
</style>
