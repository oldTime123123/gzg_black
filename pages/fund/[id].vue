<script setup lang="ts">
import { onMounted } from 'vue';
import { getLixibaoDetail, investLixibaoHandle } from '../../api/trade';
import { getCurrency, UseExchangeNumber } from '../../utils';
import { showToast } from 'vant';

const { t } = useI18n();
const route = useRoute();
const id = route.params.id;

type FundDetail = {
  title?: string;
  content?: string;
  rate: number;
  day: number;
  progress: number;
  balance: number;
  min_num: number;
  max_num: number;
  vip: { name: string };
};

const pageData = ref<FundDetail>({
  rate: 0,
  day: 0,
  progress: 0,
  balance: 0,
  min_num: 0,
  max_num: 0,
  vip: { name: '' },
});

const getData = () => {
  getLixibaoDetail({ id }).then((res: FundDetail) => {
    pageData.value = res;
  });
};

const inpVal = ref<string | number>('');
const pub = usePublicStore();
const investHandle = () => {
  if (Number(pageData.value.min_num) > Number(inpVal.value) || Number(pageData.value.max_num) < Number(inpVal.value)) {
    showToast(t('pay.p13') + ': ' + pageData.value.min_num + ' ~ ' + pageData.value.max_num);
    return;
  }
  pub.showLoading = true;
  investLixibaoHandle({
    id,
    amount: inpVal.value,
  }).then(() => {
    showToast(t('fund.f10'));
    getData();
  });
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('index.i12')" />

    <div class="pageWrap px-3 pb-6">
      <div class="heroCard mt-4">
        <div class="heroTop">
          <div class="heroHeading">
            <div class="heroEyebrow">{{ $t('theme.fundCenter') }}</div>
            <div class="heroTitle">{{ pageData.title }}</div>
            <div class="vipPill">{{ pageData.vip?.name }} · {{ t('fund.f11') }}</div>
          </div>
        </div>
        <div class="heroStats">
          <div class="statBox">
            <strong>{{ pageData.rate * 100 }}%</strong>
            <span>{{ t('fund.f6') }}</span>
          </div>
          <div class="statBox">
            <strong>{{ pageData.day }}{{ t('fund.f18') }}</strong>
            <span>{{ t('fund.f7') }}</span>
          </div>
        </div>
      </div>

      <div class="sectionCard mt-4 contentSection">
        <div class="rangeGrid">
          <div class="rangeItem">
            <span>{{ t('fund.f12') }}</span>
            <strong>{{ pageData.min_num + getCurrency() }}</strong>
          </div>
          <div class="rangeItem">
            <span>{{ t('fund.f13') }}</span>
            <strong>{{ pageData.max_num + getCurrency() }}</strong>
          </div>
        </div>
        <div class="progressWrap">
          <div class="progressLabel">{{ t('fund.f32') }}</div>
          <van-progress color="var(--brand-primary)" track-color="rgba(255,255,255,.08)" :percentage="pageData.progress" />
        </div>
      </div>

      <div class="sectionCard mt-4 contentSection">
        <div class="balanceCard">
          <span>{{ t('fund.f1') }}</span>
          <strong>{{ UseExchangeNumber(pageData.balance) + getCurrency() }}</strong>
        </div>

        <div class="fieldLabel mt-5">{{ t('fund.f14') }}</div>
        <div class="amountField mt-3">
          <input type="text" v-model="inpVal" :placeholder="t('fund.f15')" class="bg-transparent w-full amountInput" />
          <div class="amountSuffix">{{ getCurrency() }}</div>
        </div>

        <div class="detailList mt-5">
          <div class="detailRow">
            <span>{{ t('fund.f16') }}</span>
            <strong>{{ UseExchangeNumber(inpVal * pageData.rate) + getCurrency() }}</strong>
          </div>
          <div class="detailRow">
            <span>{{ t('fund.f17') }}</span>
            <strong>{{ UseExchangeNumber(inpVal * pageData.rate * pageData.day) + getCurrency() }}</strong>
          </div>
        </div>

        <button type="button" class="contentBtn mt-6 investBtn" @click="investHandle">{{ t('fund.f8') }}</button>
      </div>

      <div class="sectionCard mt-4 contentSection">
        <div class="sectionTitle">{{ t('fund.f9') }}</div>
        <div class="richCard mt-5" v-html="pageData.content"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}
.heroTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.heroHeading{display:grid;gap:10px;min-width:0;width:100%}
.heroEyebrow{color:var(--brand-primary);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.heroTitle{color:var(--text-primary);font-size:22px;font-weight:800;line-height:1.25;word-break:break-word}
.vipPill{display:inline-flex;align-items:center;max-width:100%;width:max-content;padding:8px 12px;border-radius:999px;background:rgba(244,183,64,.14);color:var(--color-warning);font-size:12px;font-weight:700;line-height:1.35;flex-wrap:wrap}
.heroStats{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}
.statBox{padding:16px;border-radius:18px;background:rgba(255,255,255,.025);display:grid;gap:8px;text-align:center}
.statBox strong{color:var(--text-primary);font-size:18px;line-height:1.24;word-break:break-word;overflow-wrap:anywhere}
.statBox span{color:var(--text-secondary);font-size:12px;line-height:1.4}
.contentSection{padding:20px}
.rangeGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.rangeItem{padding:16px;border-radius:18px;background:rgba(255,255,255,.025);display:grid;gap:8px}
.rangeItem span{color:var(--text-secondary);font-size:12px;line-height:1.4}
.rangeItem strong{color:var(--text-primary);font-size:15px;line-height:1.38;word-break:break-word;overflow-wrap:anywhere}
.progressWrap{margin-top:18px;padding:16px;border-radius:18px;background:rgba(255,255,255,.025)}
.progressLabel{margin-bottom:12px;color:var(--text-primary);font-size:13px;font-weight:600}
.balanceCard{padding:16px;border-radius:18px;background:rgba(255,255,255,.025);display:grid;gap:8px}
.balanceCard span{color:var(--text-secondary);font-size:12px;line-height:1.4}
.balanceCard strong{color:var(--text-primary);font-size:16px;line-height:1.34;word-break:break-word;overflow-wrap:anywhere}
.fieldLabel{color:var(--text-primary);font-size:15px;font-weight:700;line-height:1.4}
.amountField{display:flex;align-items:center;gap:12px;padding:0 16px;border-radius:18px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);min-height:56px}
.amountInput{min-height:56px;color:var(--text-primary);outline:none;border:none}
.amountInput::placeholder{color:var(--text-secondary)}
.amountSuffix{color:var(--text-secondary);font-size:13px;font-weight:700}
.detailList{display:grid;gap:10px}
.detailRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.025);color:var(--text-secondary);font-size:13px}
.detailRow strong{color:var(--text-primary);font-size:15px;line-height:1.36;text-align:right;word-break:break-word;overflow-wrap:anywhere}
.sectionTitle{color:var(--text-primary);font-size:18px;font-weight:800}.richCard{padding:18px;border-radius:20px;background:rgba(255,255,255,.025);color:var(--text-secondary);line-height:1.8}
.investBtn{transition:transform var(--motion-fast)}
.investBtn:active{transform:scale(.98)}

</style>
