<script setup lang="ts">
const { t } = useI18n();
const recordContent = [
  { name: t('record.r18'), value: '買い増し' },
  { name: t('record.r19'), value: '17616286124045' },
  { name: t('record.r20'), value: '3,000' },
  { name: t('record.r21'), value: '3,000' },
  { name: t('record.r22'), value: '3,000' },
  { name: t('record.r23'), value: '3,000' },
  { name: t('record.r24'), value: '3,000' },
  { name: t('record.r25'), value: '12,054,000' },
  { name: t('record.r26'), value: '1' },
  { name: t('record.r27'), value: '12,054,000' },
];
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('record.r28')" />

    <div class="pageWrap px-3 pb-6">
      <div class="heroCard mt-4">
        <div class="heroEyebrow">{{ $t('theme.saleRecord') }}</div>
        <div class="heroDesc">{{ $t('theme.saleRecordCopy') }}</div>
      </div>

      <div class="sectionCard mt-4 detailCard">
        <div class="detailHead">
          <div>
            <div class="detailTitle">{{ $t('record.r29') }}</div>
            <div class="detailCode">7011</div>
          </div>
          <div class="detailMeta">{{ $t('record.r30') }}</div>
        </div>

        <div class="pnlBlock">
          <div class="pnlRate colorUp">10.48%</div>
          <div class="pnlAmount">{{ $t('record.r31') }}1,263,000</div>
        </div>

        <div class="tagPill">{{ $t('record.r32') }}</div>

        <div class="detailList">
          <div class="detailRow" v-for="(item, index) in recordContent" :key="index">
            <span>{{ item.name }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}
.heroEyebrow{color:var(--brand-primary);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.heroDesc{margin-top:10px;color:var(--text-secondary);font-size:13px;line-height:1.55}
.detailCard{padding:18px}.detailHead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.detailTitle{color:var(--text-primary);font-size:18px;font-weight:800}.detailCode{margin-top:4px;color:var(--brand-primary);font-size:13px;font-weight:700}.detailMeta{color:var(--text-secondary);font-size:13px}
.pnlBlock{margin-top:18px;padding:16px;border-radius:20px;background:rgba(255,255,255,.025);text-align:center}.pnlRate{font-size:24px;font-weight:800;line-height:1.08;word-break:break-word;overflow-wrap:anywhere}.pnlAmount{margin-top:8px;color:var(--text-secondary);font-size:13px;word-break:break-word;overflow-wrap:anywhere}
.tagPill{display:inline-flex;margin-top:16px;padding:8px 12px;border-radius:999px;background:var(--brand-primary-soft);color:var(--brand-primary);font-size:12px;font-weight:700}
.detailList{display:grid;gap:8px;margin-top:16px}.detailRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.025);color:var(--text-secondary);font-size:13px}.detailRow strong{color:var(--text-primary);font-size:14px;line-height:1.34;text-align:right;word-break:break-word;overflow-wrap:anywhere}
</style>
