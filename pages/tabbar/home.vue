<script lang="ts" setup>
import { computed, ref } from 'vue';
import { homeNoitceBarInfo, getNewsList, getStockIndexList, getTradeProduct } from '~/api/home/home';

const { t } = useI18n();

type HomeNewsItem = {
  type: number;
  url?: string;
  [key: string]: unknown;
};

const commList = computed(() => {
  return [
    {
      name: t('index.i10'),
      icon: 'solar:user-id-linear',
      url: '/trade/insiderTrade',
    },
    {
      name: t('index.i15'),
      icon: 'solar:buildings-linear',
      url: '/trade/blockTrade',
    },
    {
      name: t('index.i13'),
      icon: 'solar:scale-linear',
      url: '/trade/leveragedTrade',
    },
    {
      name: t('index.i11'),
      icon: 'solar:document-add-linear',
      url: '/trade/spoRecord',
    },
    {
      name: t('index.i12'),
      icon: 'solar:safe-2-linear',
      url: '/fund',
    },
    {
      name: t('index.i16'),
      icon: 'solar:wallet-2-linear',
      url: '/loan',
    },
  ];
});

const isSticky = ref(false);
const topFixedChange = (val: boolean) => {
  isSticky.value = val;
};

const router = useRouter();
const useSocketStore = socketStore();

const changePage = (url: string) => {
  if (url) {
    router.push(url);
  }
};

const newsList = ref<HomeNewsItem[]>([]);
const lineDataList = ref<any[]>([]);
const pub = usePublicStore();
const noticeTxt = ref('');
const selectStockInfo = ref<any>({
  price: 0,
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

const showNewsSeketLoading = ref(true);
const showSeketLoading = ref(true);

const selfData = ref({
  high: 0,
  low: 0,
});

const heroStats = computed(() => {
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

const pulseMetrics = computed(() => {
  return [
    {
      label: t('theme.marketBoardSubtext'),
      value: selectStockInfo.value.exchange_name || 'Market Board',
      tone: 'neutral',
    },
    {
      label: t('theme.accountActions'),
      value: `${commList.value.length}`,
      tone: 'primary',
    },
    {
      label: t('x.a8'),
      value: `${newsList.value.length}`,
      tone: 'neutral',
    },
  ];
});

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
      newsList.value = res.list;
    })
    .finally(() => {
      showNewsSeketLoading.value = false;
    });

  getStockIndexList().then((res) => {
    selectStockInfo.value = res.index[0];
    if (selectStockInfo.value.chart) {
      HomeKlineRef.value.initKlineData(selectStockInfo.value.chart);
      selfData.value.high = selectStockInfo.value.chart.meta.regularMarketDayHigh;
      selfData.value.low = selectStockInfo.value.chart.meta.regularMarketDayLow;
    }
  });

  getTradeProduct({
    vol: 1,
    size: 4,
  })
    .then((res) => {
      lineDataList.value = res;
    })
    .finally(() => {
      showSeketLoading.value = false;
    });
};

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

const goTrade = (item: Record<string, unknown>) => {
  useSocketStore.currentCoin = item;
  router.push('/trade');
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
            <div class="noticeBar">
              <div class="noticeIcon">
                <Icon name="solar:bell-bing-linear" size="18" />
              </div>
              <div class="noticeContent">
                <div class="noticeMeta">{{ $t('theme.marketBoardSubtext') }}</div>
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

        <div class="pageContainer pageStack px-3 pb-6">
          <div class="overviewStack">
            <div class="heroConsole sectionCard">
              <div class="heroConsole__backdrop"></div>
              <div class="heroConsole__header">
                <div>
                  <div class="heroEyebrow">{{ $t('theme.brandBadge') }}</div>
                  <div class="heroTitle">{{ selectStockInfo.exchange_name || $t('theme.appName') }}</div>
                  <div class="heroDesc">{{ $t('theme.marketBoardSubtext') }}</div>
                </div>
                <button type="button" class="heroShortcut" @click="changePage('/tabbar/market')">
                  <Icon name="solar:chart-square-linear" size="18" />
                  <span>{{ $t('index.i23') }}</span>
                </button>
              </div>

              <div class="heroConsole__body">
                <div class="heroSpotlight">
                  <div class="spotlightTone" :class="selectStockInfo.is_rise > 1 ? 'colorUp' : 'colorDown'">
                    <Icon :name="selectStockInfo.is_rise > 1 ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'" size="16" />
                    <span>{{ getNumberType(true, selectStockInfo.is_rise) + selectStockInfo.rise_rate }}%</span>
                  </div>
                  <div class="spotlightPrice">{{ UseExchangeNumber(selectStockInfo.price) }}</div>
                  <div class="spotlightDelta" :class="selectStockInfo.is_rise > 1 ? 'colorUp' : 'colorDown'">
                    {{ getNumberType(true, selectStockInfo.is_rise) + UseExchangeNumber(selectStockInfo.chart.rise) }}
                  </div>
                </div>

                <div class="heroPulseRail">
                  <div v-for="item in pulseMetrics" :key="item.label" class="pulseCard" :class="item.tone === 'primary' ? 'pulseCardPrimary' : ''">
                    <span>{{ item.label }}</span>
                    <strong>{{ item.value }}</strong>
                  </div>
                </div>
              </div>

              <div class="heroStatsGrid">
                <div v-for="item in heroStats" :key="item.label" class="heroStatItem">
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>
            </div>

            <div class="commandDeck sectionCard">
              <div class="sectionHeading">
                <div>
                  <div class="sectionTitle">{{ $t('theme.accountActions') }}</div>
                  <div class="sectionSubtext">{{ $t('theme.tradingAccess') }}</div>
                </div>
              </div>

              <div class="commandDeck__grid">
                <button
                  type="button"
                  class="commandCard"
                  :class="index < 2 ? 'commandCardPrimary' : ''"
                  v-for="(item, index) in commList"
                  :key="item.url"
                  @click="changePage(item.url)"
                >
                  <div class="iconFrame">
                    <Icon :name="item.icon" size="20" />
                  </div>
                  <div class="commandCopy">
                    <div class="commandName">{{ item.name }}</div>
                    <div class="commandHint">{{ index < 2 ? $t('theme.marketBoardSubtext') : $t('theme.tradingAccess') }}</div>
                  </div>
                  <Icon name="solar:alt-arrow-right-linear" size="18" class="commandArrow" />
                </button>
              </div>
            </div>
          </div>

          <div class="sectionCard analyticsDeck">
            <div class="sectionHeading">
              <div>
                <div class="sectionTitle">{{ $t('index.i21') }}</div>
                <div class="sectionSubtext">{{ $t('theme.chronologicalNewsFlow') }}</div>
              </div>
              <button type="button" class="sectionLink" @click="changePage('/tabbar/market?type=1')">
                {{ $t('index.i23') }}
                <Icon name="solar:alt-arrow-right-linear" size="16" />
              </button>
            </div>

            <div class="analyticsDeck__chart">
              <HomeKLine ref="HomeKlineRef" @updateHomeKlineTopData="updateHomeKlineTopData" />
            </div>

            <div class="analyticsDeck__list renderBudgetDense">
              <template v-if="showSeketLoading">
                <div class="skeletonRow" v-for="item in 4" :key="item"></div>
              </template>
              <template v-else>
                <button
                  type="button"
                  class="marketRow"
                  v-for="item in lineDataList"
                  :key="item.id || item.pro_code"
                  @click="goTrade(item)"
                >
                  <div class="marketRow__identity">
                    <div class="marketRow__name">{{ item.pro_name }}</div>
                    <div class="marketRow__code">{{ item.pro_code }}</div>
                  </div>
                  <div class="marketRow__price">{{ item.price }}</div>
                  <div class="marketRow__delta" :class="item.is_rise > 1 ? 'colorUp' : 'colorDown'">
                    <Icon :name="item.is_rise > 1 ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'" class="marketRow__deltaIcon" />
                    <span>{{ getNumberType(true, item.is_rise) + item.rise_rate }}%</span>
                  </div>
                </button>
              </template>
            </div>
          </div>

          <div class="sectionCard newsDeck">
            <div class="sectionHeading">
              <div>
                <div class="sectionTitle">{{ t('x.a8') }}</div>
                <div class="sectionSubtext">{{ $t('theme.chronologicalNewsFlow') }}</div>
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
                  class="newsRow"
                  v-for="(item, index) in newsList"
                  :key="index"
                  @click="goNewsDetail(item)"
                >
                  <div class="newsRow__meta">
                    <span class="newsRow__badge">{{ $t('theme.brandBadge') }}</span>
                    <span class="newsRow__time">{{ item.show_time_format }}</span>
                  </div>
                  <div class="newsRow__title">{{ item.name }}</div>
                </button>
              </template>
            </div>
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
  background: rgba(7, 16, 29, 0.96);
  color: var(--text-primary);
  border-radius: 12px;
  font-size: 12px;
  border: 1px solid rgba(125, 211, 252, 0.16);
}

:deep(.apexcharts-tooltip-candlestick div) {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.pageContainer {
  min-height: calc(100vh - 130px);
  padding-top: 12px;
}

.homeShell {
  background: transparent;
}

.homeTopBar {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.noticeBar {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 0 14px;
  border-radius: 20px;
  background: rgba(7, 16, 29, 0.74);
  border: 1px solid rgba(125, 211, 252, 0.12);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.noticeMeta {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.noticeIcon {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d9f7ff;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.24), rgba(37, 99, 235, 0.24));
  flex-shrink: 0;
}

.noticeContent {
  flex: 1;
  min-width: 0;
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
  background: rgba(7, 16, 29, 0.74);
  border: 1px solid rgba(125, 211, 252, 0.12);
}

.overviewStack {
  display: grid;
  gap: var(--space-m);
}

.heroConsole {
  position: relative;
  overflow: hidden;
  padding: 22px 18px 18px;
  background: linear-gradient(180deg, rgba(9, 20, 36, 0.96), rgba(7, 16, 29, 0.92));
  border: 1px solid rgba(125, 211, 252, 0.12);
}

.heroConsole__backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), transparent 34%),
    radial-gradient(circle at 100% 12%, rgba(59, 130, 246, 0.22), transparent 30%),
    radial-gradient(circle at 50% 100%, rgba(14, 165, 233, 0.12), transparent 24%);
  pointer-events: none;
}

.heroConsole__header,
.heroConsole__body,
.heroStatsGrid {
  position: relative;
  z-index: 1;
}

.heroConsole__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.heroEyebrow {
  color: #7dd3fc;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.heroTitle {
  margin-top: 10px;
  color: var(--text-primary);
  font-family: var(--font-family-display);
  font-size: clamp(1.5rem, 7vw, 2rem);
  line-height: 1.02;
  font-weight: var(--weight-heavy);
  letter-spacing: -0.04em;
}

.heroDesc {
  margin-top: 8px;
  max-width: 20ch;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.heroShortcut {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(125, 211, 252, 0.16);
  color: var(--text-primary);
  flex-shrink: 0;
}

.heroConsole__body {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.heroSpotlight {
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(125, 211, 252, 0.14);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.spotlightTone {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  font-size: 12px;
  font-weight: 700;
}

.spotlightPrice {
  margin-top: 14px;
  color: var(--text-primary);
  font-family: var(--font-family-display);
  font-size: clamp(2rem, 10vw, 2.8rem);
  line-height: 0.98;
  font-weight: var(--weight-heavy);
  letter-spacing: -0.05em;
  word-break: break-word;
}

.spotlightDelta {
  margin-top: 10px;
  font-size: 15px;
  font-weight: 700;
}

.heroPulseRail {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.pulseCard {
  min-width: 0;
  display: grid;
  gap: 8px;
  padding: 14px 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.pulseCard span {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.3;
}

.pulseCard strong {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.25;
  font-weight: 700;
  word-break: break-word;
}

.pulseCardPrimary {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.16), rgba(37, 99, 235, 0.16));
  border-color: rgba(125, 211, 252, 0.18);
}

.heroStatsGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.heroStatItem {
  display: grid;
  gap: 6px;
  padding: 14px 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.heroStatItem span {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.35;
}

.heroStatItem strong {
  color: var(--text-primary);
  font-size: 16px;
  line-height: 1.25;
  font-weight: 700;
}

.commandDeck {
  display: grid;
  gap: 16px;
  background: rgba(8, 18, 31, 0.9);
  border: 1px solid rgba(125, 211, 252, 0.1);
}

.commandDeck__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.commandCard {
  min-width: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 16px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: left;
}

.commandCardPrimary {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(37, 99, 235, 0.08));
  border-color: rgba(125, 211, 252, 0.16);
}

.commandCopy {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.commandName {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.4;
  font-weight: 700;
}

.commandHint {
  color: var(--text-muted);
  font-size: 11px;
  line-height: 1.35;
}

.commandArrow {
  color: var(--text-muted);
}

.analyticsDeck,
.newsDeck {
  display: grid;
  gap: 16px;
  background: rgba(8, 18, 31, 0.9);
  border: 1px solid rgba(125, 211, 252, 0.1);
}

.analyticsDeck__chart {
  overflow: hidden;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.analyticsDeck__list,
.newsDeck__list {
  display: grid;
  gap: 10px;
}

.marketRow,
.newsRow {
  width: 100%;
  text-align: left;
}

.marketRow {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 12px;
  padding: 14px 14px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.025));
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.marketRow__identity {
  min-width: 0;
}

.marketRow__name {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.35;
  font-weight: 700;
}

.marketRow__code {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.35;
}

.marketRow__price {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.2;
  font-weight: 700;
}

.marketRow__delta {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 13px;
  font-weight: 700;
}

.marketRow__deltaIcon {
  width: 14px;
  height: 14px;
}

.newsRow {
  display: grid;
  gap: 10px;
  padding: 16px 14px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.022));
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.newsRow__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.newsRow__badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(14, 165, 233, 0.14);
  color: #7dd3fc;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.newsRow__time {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.35;
}

.newsRow__title {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.55;
  font-weight: 600;
}

.sectionLink {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  color: #7dd3fc;
  font-size: var(--text-label);
  font-weight: var(--weight-bold);
  background: transparent;
  border: 0;
}

.skeletonRow,
.newsSkeleton {
  height: 84px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

@media (max-width: 360px) {
  .heroPulseRail,
  .commandDeck__grid {
    grid-template-columns: 1fr;
  }

  .marketRow {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .marketRow__delta {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
}
</style>
