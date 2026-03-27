<script setup lang="ts">
const { t } = useI18n();
const actRecordType = ref(1);
const recordTypeTabs = ref([
  { text: t('record.r33'), type: 1 },
  { text: t('record.r34'), type: 2 },
  { text: t('record.r35'), type: 3 },
]);
const handleTabChange = (type: number) => {
  if (actRecordType.value == type) return;
  actRecordType.value = type;
};
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('record.r36')" />

    <div class="pageWrap px-3 pb-6">
      <div class="heroCard mt-4">
        <div class="sectionSubtext">{{ $t('theme.balanceRecord') }}</div>
        <div class="heroDesc">{{ $t('theme.balanceRecordCopy') }}</div>
      </div>

      <div class="sectionCard mt-4 contentCard">
        <div class="tabRail tabRailWide">
          <div v-for="(tab, index) in recordTypeTabs" class="tabChip flex-1" :class="tab.type == actRecordType ? 'active' : ''" :key="index" @click="handleTabChange(tab.type)">
            {{ tab.text }}
          </div>
        </div>
        <BalanceRecordList v-if="1 == actRecordType" />
        <PaymentRecordList v-if="2 == actRecordType" />
        <WithdrawalRecordList v-if="3 == actRecordType" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}.heroCard{padding:18px;border-radius:24px;background:var(--gradient-hero);border:1px solid var(--border-soft);box-shadow:var(--shadow-float)}
.heroTitle{margin-top:8px;color:var(--text-primary);font-size:24px;font-weight:800}.heroDesc{margin-top:10px;color:var(--text-secondary);font-size:13px;line-height:1.55}
.contentCard{padding:16px}.tabRail{display:inline-flex;gap:8px;padding:6px;border-radius:999px;background:rgba(255,255,255,.03)}.tabRailWide{width:100%}
.tabChip{min-height:38px;padding:0 16px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;color:var(--text-secondary);font-size:13px;text-align:center}.tabChip.active{background:rgba(95,224,179,.12);color:var(--brand-primary)}
</style>
