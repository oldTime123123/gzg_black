<script lang="ts" setup>
import { getLixibaoInfo } from '../../api/trade';
import { UseExchangeNumber } from '../../utils';

const pub = usePublicStore();
const router = useRouter();
const rightClickHandle = () => {
  router.push('/record/fundRecord');
};
const goDetail = (item: any) => {
  if (item.can_buy !== 1) return;
  router.push('/fund/' + item.id);
};

const richTxt = ref('');
const pageInfo = ref<any>({
  balance: 0,
  lixibao_balance: 0,
  lixibao_shouru: 0,
  lixibao_shouru_yuji: 0,
});
const lixibaoList = ref<any[]>([]);
const getData = () => {
  getLixibaoInfo().then((res) => {
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
      <div class="navActionIcon" @click="rightClickHandle">
        <Icon name="solar:bill-list-linear" size="18" />
      </div>
    </SecondPageNavBar>

    <div class="pageWrap px-3 pb-6">
      <div class="heroCard mt-4">
        <div class="sectionSubtext">{{ $t('theme.fundCenter') }}</div>
        <div class="metricGrid">
          <div class="metricItem">
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
          <div class="metricItem">
            <span>{{ $t('fund.f4') }}</span>
            <strong>{{ UseExchangeNumber(pageInfo.lixibao_shouru_yuji) + getCurrency() }}</strong>
          </div>
        </div>
      </div>

      <div class="sectionCard mt-4 sectionBody">
        <div class="sectionHeader">
          <div>
            <div class="sectionSubtext">{{ $t('theme.products') }}</div>
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
            <div class="contentBtn mt-4" :class="item.can_buy !== 1 ? 'disBtn' : ''" @click="goDetail(item)">
              {{ $t('fund.f8') }}
            </div>
          </div>
        </div>
      </div>

      <div class="sectionCard mt-4 sectionBody">
        <div class="sectionHeader">
          <div class="sectionSubtext">{{ $t('theme.rules') }}</div>
          <div class="sectionTitle">{{ $t('fund.f9') }}</div>
        </div>
        <div class="richCard" v-html="richTxt"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}
.navActionIcon{width:36px;height:36px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.04);border:1px solid var(--border-soft);color:var(--text-primary)}
.heroCard{padding:20px;border-radius:24px;background:var(--gradient-hero);border:1px solid var(--border-soft);box-shadow:var(--shadow-float)}
.heroTitle{margin-top:8px;color:var(--text-primary);font-size:24px;font-weight:800;line-height:1.25}
.metricGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:20px}
.metricItem{padding:16px;border-radius:18px;background:rgba(255,255,255,.03);display:grid;gap:8px}
.metricItem span{color:var(--text-secondary);font-size:12px;line-height:1.4}
.metricItem strong{color:var(--text-primary);font-size:16px;line-height:1.35}
.sectionBody{padding:20px}
.sectionHeader{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}
.emptyText{text-align:center;color:var(--text-secondary);margin-top:10px}
.productList{display:grid;gap:14px}
.productCard{padding:18px;border-radius:20px;background:rgba(255,255,255,.03);border:1px solid var(--border-soft)}
.productTitle{color:var(--text-primary);font-size:16px;font-weight:700;line-height:1.4}
.productMeta{display:grid;gap:10px;margin-top:16px}
.metaRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.03);color:var(--text-secondary);font-size:13px}
.metaRow strong{color:var(--text-primary);line-height:1.35}
.richCard{padding:18px;border-radius:20px;background:rgba(255,255,255,.03);color:var(--text-secondary);line-height:1.8}
.disBtn{background:#6b7280!important;color:#d1d5db!important}

@media (max-width: 380px) {
  .heroCard,
  .sectionBody {
    padding: 18px;
  }

  .metricGrid {
    grid-template-columns: 1fr;
  }
}
</style>
