<script lang="ts" setup>
import { computed, ref } from 'vue';
import { homeNoitceBarInfo, getNewsList, getStockIndexList, getTradeProduct } from '~/api/home/home';

const { t } = useI18n();

type HomeNewsItem = {
  type: number;
  url?: string;
  show_time_format?: string;
  name?: string;
  [key: string]: unknown;
};

type TradeItem = Record<string, any>;

const router = useRouter();
const pub = usePublicStore();
const useSocketStore = socketStore();

const isSticky = ref(false);
const noticeTxt = ref('');
const newsList = ref<HomeNewsItem[]>([]);
const lineDataList = ref<TradeItem[]>([]);
const showNewsSeketLoading = ref(true);
const showSeketLoading = ref(true);

const selectStockInfo = ref<any>({
  price: 0,
  exchange_name: '',
  is_rise: 0,
  chart: {
    rise_rate: 0,
    rise: 0,
  },
  rise_rate: 0,
});

const HomeKlineRef = ref('');
const homeKlineEmitData = ref({
  open: '0',
  close: '0',
  high: '0',
  low: '0',
});

const selfData = ref({
  high: 0,
  low: 0,
});

const topFixedChange = (val: boolean) => {
  isSticky.value = val;
};

const changePage = (url: string) => {
  if (url) {
    router.push(url);
  }
};

const actionGroups = computed(() => {
  return [
    {
      title: t('theme.accountActions'),
      hint: t('theme.tradingAccess'),
      items: [
        {
          name: t('index.i10'),
          icon: 'solar:user-id-linear',
          url: '/trade/insiderTrade',
          tone: 'strong',
        },
        {
          name: t('index.i15'),
          icon: 'solar:buildings-linear',
          url: '/trade/blockTrade',
          tone: 'strong',
        },
        {
          name: t('index.i13'),
          icon: 'solar:scale-linear',
          url: '/trade/leveragedTrade',
          tone: 'soft',
        },
      ],
    },
    {
      title: t('index.i23'),
      hint: t('theme.marketBoardSubtext'),
      items: [
        {
          name: t('index.i11'),
          icon: 'solar:document-add-linear',
          url: '/trade/spoRecord',
          tone: 'soft',
        },
        {
          name: t('index.i12'),
          icon: 'solar:safe-2-linear',
          url: '/fund',
          tone: 'soft',
        },
        {
          name: t('index.i16'),
          icon: 'solar:wallet-2-linear',
          url: '/loan',
          tone: 'soft',
        },
      ],
    },
  ];
});

const boardStats = computed(() => {
  return [
    {
      label: t('index.i17'),
      value: UseExchangeNumber(homeKlineEmitData.value.open),
    },
    {
      label: t('index.i18'),
      value: UseExchangeNumber(homeKlineEmitData.value.close),
    },
    {
      label: t('index.i19'),
      value: UseExchangeNumber(selfData.value.high),
    },
    {
      label: t('index.i20'),
      value: UseExchangeNumber(selfData.value.low),
    },
  ];
});

const quickBoardRows = computed(() => {
  return lineDataList.value.slice(0, 4);
});

const featuredNewsList = computed(() => {
  return newsList.value.slice(0, 4);
});

const insightCards = computed(() => {
  return [
    {
      label: t('x.a8'),
      value: newsList.value[0]?.show_time_format || '--',
      note: newsList.value[0]?.name || t('theme.chronologicalNewsFlow'),
    },
  ];
});

const updateHomeKlineTopData = (data: any) => {
  homeKlineEmitData.value = data;
};

const goNewsDetail = (item: HomeNewsItem) => {
  if (item.type !== 2) {
    pub.selectNews = item;
    router.push('/mine/newsDetail');
  } else if (import.meta.client && item.url) {
    globalThis.open?.(item.url, '_blank');
  }
};

const goTrade = (item: TradeItem) => {
  useSocketStore.currentCoin = item;
  router.push('/trade');
};

const getData = () => {
  homeNoitceBarInfo().then((res) => {
    if (res.status > 0) {
      noticeTxt.value = res.content;
    }
  });

  getNewsList({
    pos: 1,
    size: 10,
    page: 1,
  })
    .then((res) => {
      newsList.value = res.list || [];
    })
    .finally(() => {
      showNewsSeketLoading.value = false;
    });

  getStockIndexList().then((res) => {
    selectStockInfo.value = res.index?.[0] || selectStockInfo.value;
    if (selectStockInfo.value.chart) {
      HomeKlineRef.value.initKlineData(selectStockInfo.value.chart);
      selfData.value.high = selectStockInfo.value.chart.meta?.regularMarketDayHigh || 0;
      selfData.value.low = selectStockInfo.value.chart.meta?.regularMarketDayLow || 0;
    }
  });

  getTradeProduct({
    vol: 1,
    size: 4,
  })
    .then((res) => {
      lineDataList.value = res || [];
    })
    .finally(() => {
      showSeketLoading.value = false;
    });
};

const loginStore = useLoginStore();

onMounted(() => {
  if (loginStore.loading) {
    loginStore.loading = false;
  }
  pub.ipoActRecordType = 0;
  pub.spoActRecordType = 0;
  pub.actRecordType = 3;
  getData();
});
</script>

<template>
  <section>
    <ClientOnly>
      <div class="pageShell homeShell">
        <van-sticky offset-top="0" @change="topFixedChange">
          <div class="homeTopBar px-3 py-3" :class="isSticky ? 'topStickyEl' : ''">
            <div class="signalStrip">
              <div class="signalStrip__icon">
                <Icon name="solar:bell-bing-linear" size="18" />
              </div>
              <div class="signalStrip__body">
                <div class="signalStrip__meta">{{ $t('theme.marketBoardSubtext') }}</div>
                <van-notice-bar scrollable :text="noticeTxt" background="transparent" color="var(--text-primary)" />
              </div>
            </div>

            <div class="topBarActions">
              <button type="button" class="topAction" @click="changePage('/service')">
                <Icon name="solar:headphones-round-sound-linear" size="18" />
              </button>
              <button type="button" class="topAction" @click="changePage('/setting/identify')">
                <Icon name="solar:shield-check-linear" size="18" />
              </button>
            </div>
          </div>
        </van-sticky>

        <div class="pageContainer px-3 pb-6">
          <div class="homeFrame">
            <section class="heroMatrix sectionCard">
              <div class="heroMatrix__backdrop"></div>
              <div class="heroMatrix__header">
                <div class="heroMatrix__titleWrap">
                  <div class="heroMatrix__eyebrow">{{ $t('theme.marketBoardSubtext') }}</div>
                  <h1 class="heroMatrix__title">{{ selectStockInfo.exchange_name || $t('theme.appName') }}</h1>
                </div>
                <button type="button" class="heroMatrix__link" @click="changePage('/tabbar/market')">
                  <span>{{ $t('index.i23') }}</span>
                  <Icon name="solar:alt-arrow-right-linear" size="16" />
                </button>
              </div>

              <div class="heroMatrix__lead">
                <div class="heroSpotlight">
                  <div class="heroSpotlight__head">
                    <div class="heroSpotlight__valueBlock">
                    <div class="heroSpotlight__price">{{ UseExchangeNumber(selectStockInfo.price) }}</div>
                   <div class="flex items-center mt-1">
                        <div class="heroSpotlight__delta"
                          :class="selectStockInfo.is_rise > 1 ? 'colorUp' : 'colorDown'">
                          {{ getNumberType(true, selectStockInfo.is_rise) +
                            UseExchangeNumber(selectStockInfo.chart?.rise) }}
                        </div>
                        <div class="heroSpotlight__tone ml-2" :class="selectStockInfo.is_rise > 1 ? 'colorUp' : 'colorDown'">
                          <Icon
                            :name="selectStockInfo.is_rise > 1 ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'"
                            size="14" />
                          <span>{{ getNumberType(true, selectStockInfo.is_rise) + selectStockInfo.rise_rate }}%</span>
                        </div>



                   </div>
                  </div>
                  </div>
                  <div class="heroSpotlight__chart">
                    <HomeKLine ref="HomeKlineRef" @updateHomeKlineTopData="updateHomeKlineTopData" />
                  </div>
                </div>
              </div>

              <div class="heroBoardGrid">
                <div v-for="item in boardStats" :key="item.label" class="heroBoardCell">
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>
            </section>

            <section class="sectionCard overviewDeck">
              <div class="overviewDeck__groups">
                <div v-for="group in actionGroups" :key="group.title" class="actionColumn">
                  <div class="actionColumn__header">
                    <div class="actionColumn__title">{{ group.title }}</div>
                  </div>
                  <div class="actionColumn__list">
                    <button
                      v-for="item in group.items"
                      :key="item.url"
                      type="button"
                      class="commandStrip"
                      @click="changePage(item.url)"
                    >
                      <div class="iconFrame">
                        <Icon :name="item.icon" size="20" />
                      </div>
                      <div class="commandStrip__copy">
                        <div class="commandStrip__name">{{ item.name }}</div>
                      </div>
                      <Icon name="solar:alt-arrow-right-linear" size="18" class="commandStrip__arrow" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section class="sectionCard marketDeck">
              <div class="sectionHeading">
                <div>
                  <div class="sectionTitle">{{ $t('index.i21') }}</div>
                </div>
                <button type="button" class="sectionLink" @click="changePage('/tabbar/market?type=1')">
                  {{ $t('index.i23') }}
                  <Icon name="solar:alt-arrow-right-linear" size="16" />
                </button>
              </div>

              <div class="marketDeck__list renderBudgetDense">
                <template v-if="showSeketLoading">
                  <div class="skeletonRow" v-for="item in 4" :key="item"></div>
                </template>
                <template v-else>
                  <button
                    type="button"
                    class="marketGridRow"
                    v-for="item in quickBoardRows"
                    :key="item.id || item.pro_code"
                    @click="goTrade(item)"
                  >
                    <div class="marketGridRow__main">
                      <strong class="marketGridRow__name">{{ item.pro_name }}</strong>
                      <span class="marketGridRow__code">{{ item.pro_code }}</span>
                    </div>
                    <div class="marketGridRow__side">
                      <strong class="marketGridRow__price">{{ item.price }}</strong>
                      <span class="marketGridRow__delta" :class="item.is_rise > 1 ? 'colorUp' : 'colorDown'">
                        <Icon :name="item.is_rise > 1 ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'" class="marketGridRow__deltaIcon" />
                        <span>{{ getNumberType(true, item.is_rise) + item.rise_rate }}%</span>
                      </span>
                    </div>
                  </button>
                </template>
              </div>
            </section>

            <section class="sectionCard newsDeck">
              <div class="sectionHeading">
                <div>
                  <div class="sectionTitle">{{ t('x.a8') }}</div>
                </div>
                <button type="button" class="sectionLink" @click="changePage('/tabbar/news')">
                  {{ $t('index.i23') }}
                  <Icon name="solar:alt-arrow-right-linear" size="16" />
                </button>
              </div>

              <div class="newsDeck__list renderBudgetDense">
                <template v-if="showNewsSeketLoading">
                  <div class="newsSkeleton" v-for="item in 4" :key="item"></div>
                </template>
                <template v-else>
                  <button
                    type="button"
                    class="newsPanel"
                    v-for="(item, index) in featuredNewsList"
                    :key="index"
                    @click="goNewsDetail(item)"
                  >
                    <div class="newsPanel__time">{{ item.show_time_format }}</div>
                    <div class="newsPanel__title">{{ item.name }}</div>
                    <div class="newsPanel__foot">
                      <span>{{ $t('theme.marketBoardSubtext') }}</span>
                      <Icon name="solar:alt-arrow-right-linear" size="16" />
                    </div>
                  </button>
                </template>
              </div>
            </section>
          </div>
        </div>
      </div>
    </ClientOnly>
    <Tabbar />
  </section>
</template>

<style lang="less" scoped>
:deep(.apexcharts-tooltip-candlestick) {
  padding: 10px;
  background: var(--surface-overlay-strong);
  color: var(--text-primary);
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid var(--brand-primary-border);
}

:deep(.apexcharts-tooltip-candlestick div) {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.pageContainer {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 130px);
  padding-top: 8px;
}

.homeTopBar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.homeFrame {
  display: grid;
  gap: 12px;
}

.signalStrip {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 0 14px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(24, 43, 64, 0.76), rgba(17, 31, 48, 0.68));
  border: 1px solid rgba(125, 211, 252, 0.1);
  box-shadow: 0 10px 24px rgba(5, 12, 22, 0.12);
}

.signalStrip__icon {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  background: var(--gradient-brand-soft);
  flex-shrink: 0;
}

.signalStrip__body {
  flex: 1;
  min-width: 0;
}

.signalStrip__meta {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.topBarActions {
  display: flex;
  gap: 10px;
}

.topAction {
  appearance: none;
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  background: var(--surface-overlay);
  border: 1px solid var(--border-strong);
}

.heroMatrix {
  position: relative;
  overflow: hidden;
  padding: 20px 18px 15px;
  background: linear-gradient(180deg, rgba(28, 49, 73, 0.9), rgba(19, 36, 54, 0.86));
  border: 1px solid rgba(125, 211, 252, 0.1);
  box-shadow: 0 12px 28px rgba(5, 12, 22, 0.12);
}

.heroMatrix__backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.22), transparent 34%),
    radial-gradient(circle at 100% 14%, rgba(37, 99, 235, 0.2), transparent 30%),
    radial-gradient(circle at 40% 100%, rgba(14, 165, 233, 0.12), transparent 28%);
  pointer-events: none;
}

.heroMatrix__header,
.heroMatrix__lead,
.heroBoardGrid {
  position: relative;
  z-index: 1;
}

.heroMatrix__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.heroMatrix__eyebrow {
  color: var(--text-accent);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.heroMatrix__title {
  margin: 10px 0 0;
  color: var(--text-primary);
  font-family: var(--font-family-display);
  font-size: clamp(1.36rem, 6.5vw, 1.88rem);
  line-height: 1.02;
  font-weight: var(--weight-heavy);
  letter-spacing: -0.05em;
}

.heroMatrix__link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--surface-frost-strong);
  border: 1px solid var(--brand-primary-border);
  color: var(--text-primary);
  flex-shrink: 0;
}

.heroMatrix__lead {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.heroSpotlight {
  display: grid;
  gap: 12px;
}

.heroSpotlight__head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 10px;
}

.heroSignalRail {
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.heroSignalCard {
  min-width: 0;
  display: grid;
  gap: 2px;
  padding: 0 0 0 10px;
  border-left: 1px solid rgba(125, 211, 252, 0.14);
}

.heroSignalCard__label {
  color: var(--text-muted);
  font-size: 10px;
  line-height: 1.3;
}

.heroSignalCard__value {
  color: var(--text-primary);
  font-size: 11px;
  line-height: 1.25;
  font-weight: 700;
}

.heroSignalCard__note {
  color: var(--text-secondary);
  font-size: 10px;
  line-height: 1.32;
}

.heroSpotlight__tone {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border-radius: 999px;
  background: var(--surface-frost-strong);
  font-size: 11px;
  font-weight: 700;
}

.heroSpotlight__valueBlock {
  display: grid;
  gap: 5px;
}

.heroSpotlight__price {
  color: var(--text-primary);
  font-family: var(--font-family-display);
  font-size: clamp(1.62rem, 7.8vw, 2.18rem);
  line-height: 0.94;
  font-weight: 780;
  letter-spacing: -0.05em;
  word-break: break-word;
}

.heroSpotlight__delta {
  font-size: 12px;
  font-weight: 700;
}

.heroSpotlight__chartMeta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 2px;
  margin-top: 2px;
  color: var(--text-muted);
  font-size: 10px;
  line-height: 1.3;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.heroSpotlight__chart {
  overflow: hidden;
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(125, 211, 252, 0.1);
  border-radius: 0;
  background: transparent;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
}

.heroInsightRail {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 10px;
}

.insightCard {
  display: grid;
  gap: 8px;
  padding: 14px 12px;
  border-radius: 18px;
  background: var(--surface-frost);
  border: 1px solid var(--border-soft);
}

.insightCard__label {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.3;
}

.insightCard__value {
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.22;
  font-weight: 700;
  word-break: break-word;
}

.insightCard__note {
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.42;
}

.heroBoardGrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(125, 211, 252, 0.1);
}

.heroBoardCell {
  display: grid;
  gap: 4px;
  padding: 10px 10px 0;
  border-radius: 0;
  background: transparent;
  border: 0;
}

.heroBoardCell + .heroBoardCell {
  border-left: 1px solid rgba(125, 211, 252, 0.08);
}

.heroBoardCell span {
  color: var(--text-muted);
  font-size: 10px;
  line-height: 1.3;
}

.heroBoardCell strong {
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.22;
  font-weight: 700;
}

.overviewDeck,
.marketDeck,
.newsDeck {
  display: grid;
  gap: 10px;
  background: linear-gradient(180deg, rgba(23, 42, 62, 0.88), rgba(16, 30, 46, 0.84));
  border: 1px solid rgba(125, 211, 252, 0.08);
}

.overviewDeck__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.overviewMetric {
  display: grid;
  gap: 6px;
  padding: 14px 12px;
  border-radius: 18px;
  background: var(--surface-frost);
  border: 1px solid var(--border-soft);
}

.overviewMetric span {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.3;
}

.overviewMetric strong {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.25;
  font-weight: 700;
}

.overviewDeck__groups {
  display: grid;
  gap: 14px;
}

.actionColumn {
  display: grid;
  gap: 10px;
}

.actionColumn__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.actionColumn__title {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 700;
}

.actionColumn__hint {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.4;
  text-align: right;
}

.actionColumn__list {
  display: grid;
  gap: 10px;
}

.commandStrip {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  border-radius: 0;
  background: transparent;
  border: 0;
  text-align: left;
}

.commandStrip + .commandStrip {
  border-top: 1px solid rgba(125, 211, 252, 0.08);
}

.commandStripStrong {
  background: var(--gradient-brand-soft);
  border-color: rgba(125, 211, 252, 0.16);
}

.commandStrip__copy {
  min-width: 0;
}

.commandStrip__name {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
}

.commandStrip__arrow {
  color: var(--text-muted);
}

.marketDeck__chart {
  overflow: hidden;
  border-radius: 20px;
  background: var(--surface-frost);
  border: 1px solid var(--border-soft);
}

.marketDeck__list,
.newsDeck__list {
  display: grid;
  gap: 10px;
}

.marketGridRow,
.newsPanel {
  width: 100%;
  text-align: left;
}

.marketGridRow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  padding: 13px 0;
  border-radius: 0;
  background: transparent;
  border: 0;
}

.marketGridRow + .marketGridRow {
  border-top: 1px solid rgba(125, 211, 252, 0.08);
}

.marketGridRow__main,
.marketGridRow__side {
  display: grid;
  gap: 5px;
}

.marketGridRow__side {
  justify-items: end;
}

.marketGridRow__name,
.marketGridRow__price {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.3;
  font-weight: 700;
}

.marketGridRow__code {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.35;
}

.marketGridRow__delta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
}

.marketGridRow__deltaIcon {
  width: 14px;
  height: 14px;
}

.newsPanel {
  display: grid;
  gap: 8px;
  padding: 13px 0;
  border-radius: 0;
  background: transparent;
  border: 0;
}

.newsPanel + .newsPanel {
  border-top: 1px solid rgba(125, 211, 252, 0.08);
}

.newsPanel__time {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.35;
}

.newsPanel__title {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.55;
  font-weight: 600;
}

.newsPanel__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--text-accent);
  font-size: 12px;
  line-height: 1.35;
}

.sectionLink {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  color: var(--text-accent);
  font-size: var(--text-label);
  font-weight: var(--weight-bold);
  background: transparent;
  border: 0;
}

.skeletonRow,
.newsSkeleton {
  height: 84px;
  border-radius: 18px;
  background: var(--surface-frost-strong);
  border: 1px solid var(--border-soft);
}

@media (max-width: 420px) {
  .heroBoardGrid,
  .overviewDeck__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .heroSpotlight__head {
    grid-template-columns: 1fr;
  }

  .heroSignalRail {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 360px) {
  .heroInsightRail,
  .heroBoardGrid,
  .overviewDeck__summary {
    grid-template-columns: 1fr;
  }

  .heroBoardCell + .heroBoardCell {
    border-left: 0;
    border-top: 1px solid rgba(125, 211, 252, 0.08);
  }
}
</style>
