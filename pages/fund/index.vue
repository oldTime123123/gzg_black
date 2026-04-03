<script lang="ts" setup>
import { getLixibaoInfo } from '../../api/trade';
import { UseExchangeNumber } from '../../utils';

type FundProduct = {
  id: number | string;
  title: string;
  rate: number;
  day: number | string;
  can_buy: number;
};

type FundOverview = {
  balance: number;
  lixibao_balance: number;
  lixibao_shouru: number;
  lixibao_shouru_yuji: number;
};

type FundInfoResponse = FundOverview & {
  can_interrupt: number;
  lixibaos: FundProduct[];
  lixibao_desc: string;
};

const pub = usePublicStore();
const router = useRouter();
const rightClickHandle = () => {
  router.push('/record/fundRecord');
};
const goDetail = (item: FundProduct) => {
  if (item.can_buy !== 1) return;
  router.push('/fund/' + item.id);
};

const richTxt = ref('');
const pageInfo = ref<FundOverview>({
  balance: 0,
  lixibao_balance: 0,
  lixibao_shouru: 0,
  lixibao_shouru_yuji: 0,
});
const lixibaoList = ref<FundProduct[]>([]);
const getData = () => {
  getLixibaoInfo().then((res: FundInfoResponse) => {
    pageInfo.value.balance = res.balance;
    pageInfo.value.lixibao_balance = res.lixibao_balance;
    pageInfo.value.lixibao_shouru = res.lixibao_shouru;
    pageInfo.value.lixibao_shouru_yuji = res.lixibao_shouru_yuji;
    pub.cancelLixibaoFlag = res.can_interrupt > 0;
    lixibaoList.value = res.lixibaos;
    richTxt.value = res.lixibao_desc;
  });
};

onBeforeMount(() => {
  getData();
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('index.i12')">
      <button type="button" class="navActionIcon" @click="rightClickHandle" :aria-label="$t('record.r33') || 'Open fund records'">
        <Icon name="solar:bill-list-linear" size="18" />
      </button>
    </SecondPageNavBar>

    <div class="pageWrap pageStack px-3 pb-6">
      <div class="heroCard mt-4">
        <div class="metricGrid">
          <div class="metricItem metricItemLead">
            <span>{{ $t('fund.f1') }}</span>
            <strong>{{ UseExchangeNumber(pageInfo.balance) + getCurrency() }}</strong>
          </div>
          <div class="metricItem">
            <span>{{ $t('fund.f2') }}</span>
            <strong>{{ UseExchangeNumber(pageInfo.lixibao_balance) + getCurrency() }}</strong>
          </div>
          <div class="metricItem">
            <span>{{ $t('fund.f3') }}</span>
            <strong>{{ UseExchangeNumber(pageInfo.lixibao_shouru) + getCurrency() }}</strong>
          </div>
          <div class="metricItem metricItemWide">
            <span>{{ $t('fund.f4') }}</span>
            <strong>{{ UseExchangeNumber(pageInfo.lixibao_shouru_yuji) + getCurrency() }}</strong>
          </div>
        </div>
      </div>

      <div class="sectionCard mt-4 sectionBody">
        <div class="sectionHeader">
          <div>
            <div class="sectionTitle">{{ $t('fund.f5') }}</div>
          </div>
        </div>

        <div v-if="lixibaoList.length == 0">
          <div class="nullData"></div>
          <div class="emptyText">{{ $t('trade.t8') }}</div>
        </div>

        <div v-else class="productList">
          <div class="productCard" v-for="(item, index) in lixibaoList" :key="index">
            <div class="productTitle">{{ item.title }}</div>
            <div class="productMeta">
              <div class="metaRow">
                <span>{{ $t('fund.f6') }}</span>
                <strong>{{ item.rate * 100 }}%</strong>
              </div>
              <div class="metaRow">
                <span>{{ $t('fund.f7') }}</span>
                <strong>{{ item.day + $t('fund.f18') }}</strong>
              </div>
            </div>
            <button type="button" class="contentBtn mt-4" :class="item.can_buy !== 1 ? 'disBtn' : ''" :disabled="item.can_buy !== 1" @click="goDetail(item)">
              {{ $t('fund.f8') }}
            </button>
          </div>
        </div>
      </div>

      <div class="sectionCard mt-4 sectionBody">
        <div class="sectionHeader">
          <div class="sectionTitle">{{ $t('fund.f9') }}</div>
        </div>
        <div class="richCard" v-html="richTxt"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}
.navActionIcon{appearance:none;width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.04);border:1px solid var(--border-soft);color:var(--text-primary);transition:transform var(--motion-fast),border-color var(--motion-fast),background-color var(--motion-fast)}
.heroEyebrow{color:var(--brand-primary);font-size:var(--text-caption);font-weight:var(--weight-bold);letter-spacing:var(--tracking-eyebrow);text-transform:uppercase}
.metricGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-xs);margin-top:var(--space-m)}
.metricItem{padding:16px;border-radius:18px;background:rgba(255,255,255,.025);display:grid;gap:8px}
.metricItemLead{grid-column:1/-1;padding:20px;gap:10px}
.metricItemLead strong{font-family:var(--font-family-display);font-size:2rem;line-height:1.06;font-weight:var(--weight-heavy);letter-spacing:var(--tracking-tight)}
.metricItemWide{grid-column:1/-1}
.metricItem span{color:var(--text-secondary);font-size:var(--text-label);line-height:1.5}
.metricItem strong{color:var(--text-primary);font-size:1.0625rem;line-height:1.35;font-weight:var(--weight-bold);font-variant-numeric:tabular-nums lining-nums;font-feature-settings:"tnum" 1,"lnum" 1}
.sectionBody{padding:clamp(20px,4vw,24px)}
.sectionHeader{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-s);margin-bottom:var(--space-s)}
.emptyText{text-align:center;color:var(--text-secondary);margin-top:10px}
.productList{display:grid;gap:var(--space-m)}
.productCard{padding:18px;border-radius:20px;background:rgba(255,255,255,.025);border:1px solid var(--border-soft);display:grid;gap:var(--space-s)}
.productTitle{color:var(--text-primary);font-family:var(--font-family-display);font-size:1.125rem;font-weight:var(--weight-bold);line-height:1.32;letter-spacing:var(--tracking-dense);max-width:24ch}
.productMeta{display:grid;gap:10px}
.metaRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px;border-radius:14px;background:rgba(255,255,255,.025);color:var(--text-secondary);font-size:1rem;line-height:1.55}
.metaRow strong{color:var(--text-primary);line-height:1.35}
.richCard{padding:18px;border-radius:20px;background:rgba(255,255,255,.025);color:var(--text-secondary);font-size:1rem;line-height:1.82;max-width:65ch}
.disBtn{background:#6b7280!important;color:#d1d5db!important}
.navActionIcon:hover{border-color:rgba(56,189,248,.18);background:rgba(255,255,255,.055)}
.navActionIcon:active,.productCard .contentBtn:active{transform:scale(.98)}

</style>
