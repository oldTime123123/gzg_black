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
    :subtitle="$t('theme.entryExperienceCopy')">
    <template #hero>
      <div class="heroMetrics">
        <div class="metricCard">
          <div class="metricLabel">{{ $t('theme.access') }}</div>
          <div class="metricValue">{{ $t('theme.trading') }}</div>
        </div>
        <div class="metricCard">
          <div class="metricLabel">{{ $t('theme.mode') }}</div>
          <div class="metricValue">{{ $t('theme.secure') }}</div>
        </div>
      </div>
    </template>

    <div class="ctaStack">
      <div class="ctaPrimary contentBtn" @click="changePage('/auth/login')">{{ $t('login.l1') }}</div>

      <div class="secondaryPanel">
        <div class="secondaryTitle">{{ $t('login.l2') }}</div>
        <div class="secondaryAction" @click="changePage('/auth/register')">
          <span>{{ $t('login.l3') }}</span>
          <Icon name="solar:alt-arrow-right-linear" size="18" />
        </div>
      </div>


    </div>
  </AuthShell>
</template>

<style scoped>
.heroMetrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.metricCard {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.metricLabel {
  color: var(--text-secondary);
  font-size: 12px;
}

.metricValue {
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
  background: rgba(255, 255, 255, 0.03);
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
