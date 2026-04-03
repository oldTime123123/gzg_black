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


      <div class="recordCenter mt-4">
        <div class="contentCard mt-4">
          <div class="tabRail tabRailWide">
            <button type="button" v-for="(tab, index) in recordTypeTabs" class="tabChip flex-1" :class="tab.type == actRecordType ? 'active' : ''" :key="index" :aria-pressed="tab.type == actRecordType" @click="handleTabChange(tab.type)">
              {{ tab.text }}
            </button>
          </div>
          <BalanceRecordList v-if="1 == actRecordType" />
          <PaymentRecordList v-if="2 == actRecordType" />
          <WithdrawalRecordList v-if="3 == actRecordType" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}
.heroEyebrow{color:var(--brand-primary);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.ledgerStage{padding:2px 2px 8px}
.stageTitle{margin-top:8px;color:var(--text-primary);font-size:22px;line-height:1.15;font-weight:700}
.recordCenter{padding:4px 2px 0}
.centerTop{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.centerTitle{margin-top:8px;color:var(--text-primary);font-size:20px;line-height:1.2;font-weight:700}
.contentCard{padding:0;background:transparent;box-shadow:none}.tabRail{display:inline-flex;gap:8px;padding:6px;border-radius:999px;background:rgba(255,255,255,.025)}.tabRailWide{width:100%}
.tabChip{appearance:none;min-height:40px;padding:0 16px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;color:var(--text-secondary);font-size:13px;text-align:center;background:transparent;border:0;transition:transform var(--motion-fast),background-color var(--motion-fast),color var(--motion-fast)}.tabChip.active{background:var(--brand-primary-soft);color:var(--brand-primary)}.tabChip:active{transform:scale(.98)}
</style>
