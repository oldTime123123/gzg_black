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

const primaryQuickActions = computed(() => commList.value.slice(0, 2));
const secondaryQuickActions = computed(() => commList.value.slice(2));

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

const newsList = ref([]);
const lineDataList = ref([]);
const pub = usePublicStore();
const noticeTxt = ref('');
const selectStockInfo = ref({
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

const updateHomeKlineTopData = (data) => {
  homeKlineEmitData.value = data;
};

const goNewsDetail = (item) => {
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
      <div class="hasNormalBg pageShell">
        <van-sticky offset-top="0" @change="topFixedChange">
          <div class="homeTopBar px-3 py-3 tabbarPageTopNav" :class="isSticky ? 'topStickyEl' : ''">
            <div class="noticeBar">
              <div class="noticeIcon">
                <Icon name="solar:bell-bing-linear" size="18" />
              </div>
              <div class="noticeContent">
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

        <div class="pageContainer pageStack px-3 mt-3 pb-6">
          <div class="homeGrid">
            <div class="marketBoard sectionCard">
              <div class="sectionHeading">
                <div>
                  <div class="heroEyebrow">{{ $t('theme.marketBoardSubtext') }}</div>
                  <div class="boardTitle">{{ selectStockInfo.exchange_name || 'Market Board' }}</div>
                </div>
              </div>

              <div class="marketBoardBody">
                <div class="marketMeta">
                  <div class="marketPriceBlock" :class="selectStockInfo.is_rise > 1 ? 'colorUp' : 'colorDown'">
                    <div class="marketPrice">{{ UseExchangeNumber(selectStockInfo.price) }}</div>
                    <div class="marketChange">
                      <span>{{ getNumberType(true, selectStockInfo.is_rise) + UseExchangeNumber(selectStockInfo.chart.rise) }}</span>
                      <span>{{ getNumberType(true, selectStockInfo.is_rise) + selectStockInfo.rise_rate }}%</span>
                    </div>
                  </div>

                  <div class="statsGrid">
                    <div class="statItem">
                      <span>{{ $t('index.i17') }}</span>
                      <strong>{{ UseExchangeNumber(homeKlineEmitData.open) }}</strong>
                    </div>
                    <div class="statItem">
                      <span>{{ $t('index.i18') }}</span>
                      <strong>{{ UseExchangeNumber(homeKlineEmitData.close) }}</strong>
                    </div>
                    <div class="statItem">
                      <span>{{ $t('index.i19') }}</span>
                      <strong>{{ UseExchangeNumber(selfData.high) }}</strong>
                    </div>
                    <div class="statItem">
                      <span>{{ $t('index.i20') }}</span>
                      <strong>{{ UseExchangeNumber(selfData.low) }}</strong>
                    </div>
                  </div>
                </div>

                <div class="chartShell">
                  <HomeKLine ref="HomeKlineRef" @updateHomeKlineTopData="updateHomeKlineTopData" />
                </div>

                <div class="boardActionRow">
                  <div class="boardActionHead">
                    <div class="boardActionNote">{{ $t('theme.accountActions') }}</div>
                  </div>
                  <div class="actionHeroRail">
                    <button type="button" class="actionCard actionCardPrimary" v-for="(item, index) in primaryQuickActions" :key="index" @click="changePage(item.url)">
                      <div class="iconFrame">
                        <Icon :name="item.icon" size="20" />
                      </div>
                      <div class="actionCopy">
                        <div class="actionName">{{ item.name }}</div>
                        <div class="actionHint">{{ $t('theme.tradingAccess') }}</div>
                      </div>
                    </button>
                  </div>
                  <div class="actionRail">
                    <button type="button" class="actionCard" v-for="(item, index) in secondaryQuickActions" :key="item.url" @click="changePage(item.url)">
                      <div class="iconFrame">
                        <Icon :name="item.icon" size="20" />
                      </div>
                      <div class="actionCopy">
                        <div class="actionName">{{ item.name }}</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="sidebarStack">
              <div class="sectionCard sectionBlock moversBlock">
                <div class="sectionHeading">
                  <div class="sectionTitle">{{ $t('index.i21') }}</div>
                  <button type="button" class="sectionLink" @click="changePage('/tabbar/market?type=1')">
                    {{ $t('index.i23') }}
                    <Icon name="solar:alt-arrow-right-linear" size="16" />
                  </button>
                </div>

                <div class="grid gap-3">
                  <template v-if="showSeketLoading">
                    <div class="h-[86px] rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.04)]" v-for="item in 4" :key="item"></div>
                  </template>
                  <template v-else>
                    <div v-if="lineDataList.length" class="grid gap-3 renderBudgetDense">
                      <button
                        type="button"
                        class="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.022))] px-4 py-4 text-left transition-[transform,background-color,border-color] duration-200 ease-out hover:border-[rgba(212,154,58,0.22)] hover:bg-white/[0.045] active:scale-[0.99]"
                        v-for="item in lineDataList"
                        :key="item.id || item.pro_code"
                        @click="goTrade(item)"
                      >
                        <div class="min-w-0">
                          <div class="truncate text-[1rem] font-semibold leading-[1.45] text-[var(--text-primary)]">{{ item.pro_name }}</div>
                          <div class="mt-1 text-[0.9375rem] leading-[1.45] text-[var(--text-secondary)]">{{ item.pro_code }}</div>
                        </div>
                        <div class="min-w-fit text-right" :class="item.is_rise > 1 ? 'colorUp' : 'colorDown'">
                          <div class="text-[1rem] font-extrabold leading-[1.15]">{{ item.price }}</div>
                          <div class="mt-2 inline-flex items-center gap-1 text-[0.9375rem] font-bold leading-[1.2]">
                            <Icon :name="item.is_rise > 1 ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'" class="h-3.5 w-3.5" />
                            <span>{{ getNumberType(true, item.is_rise) + item.rise_rate }}%</span>
                          </div>
                        </div>
                      </button>
                    </div>
                  </template>
                </div>
              </div>

              <div class="sectionCard sectionBlock newsBlock">
                <div class="sectionHeading">
                  <div class="sectionTitle">{{ t('x.a8') }}</div>
                  <button type="button" class="sectionLink" @click="changePage('/tabbar/news')">
                    {{ $t('index.i23') }}
                    <Icon name="solar:alt-arrow-right-linear" size="16" />
                  </button>
                </div>

                <div class="grid gap-3">
                  <template v-if="showNewsSeketLoading">
                    <div class="h-[84px] rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.04)]" v-for="(item, index) in 4" :key="index"></div>
                  </template>
                  <template v-else>
                    <div v-if="newsList.length" class="grid gap-3 renderBudgetDense">
                      <button
                        type="button"
                        class="grid w-full gap-2 rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.022))] px-4 py-4 text-left transition-[transform,background-color,border-color] duration-200 ease-out hover:border-[rgba(212,154,58,0.2)] hover:bg-white/[0.045] active:scale-[0.99]"
                        v-for="(item, index) in newsList"
                        :key="index"
                        @click="goNewsDetail(item)"
                      >
                        <div class="text-[1rem] font-semibold leading-[1.58] text-[var(--text-primary)]">{{ item.name }}</div>
                        <div class="text-[0.875rem] leading-[1.45] text-[var(--text-secondary)]">{{ item.show_time_format }}</div>
                      </button>
                    </div>
                  </template>
                </div>
              </div>
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
  background: rgba(19, 26, 34, 0.94);
  color: var(--text-primary);
  border-radius: 10px;
  font-size: 12px;
  border: 1px solid var(--border-soft);
}

:deep(.apexcharts-tooltip-candlestick div) {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.pageContainer {
  min-height: calc(100vh - 120px);
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
  gap: 10px;
  min-height: 54px;
  padding: 0 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: none;
}

.noticeIcon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  background: rgba(212, 154, 58, 0.12);
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
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: none;
  cursor: pointer;
  transition:
    transform var(--motion-fast),
    background-color var(--motion-fast),
    border-color var(--motion-fast),
    color var(--motion-fast);
}

.heroPanel {
  display: grid;
  gap: 18px;
  padding: 18px 16px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: none;
}

.heroEyebrow {
  color: var(--brand-primary);
  font-size: var(--text-caption);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
}

.heroDesc {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.heroQuote {
  padding: 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.quoteName {
  color: var(--text-secondary);
  font-size: 12px;
}

.quotePrice {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 28px;
  line-height: 1.05;
  font-weight: 800;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.quoteDelta {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 700;


}

.boardActionRow {
  display: grid;
  gap: var(--space-s);
  padding-top: var(--space-l);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.boardActionHead {
  display: grid;
  gap: 4px;
}

.boardActionNote {
  color: var(--text-muted);
  font-size: 13px;
  line-height: 1.45;
}

.actionHeroRail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-xs);
}

.actionRail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-xs);
}

.actionCard {
  appearance: none;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  min-height: 98px;
  padding: 16px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: none;
  text-align: left;
  cursor: pointer;
  transition:
    transform var(--motion-fast),
    border-color var(--motion-fast),
    background-color var(--motion-fast);
}

.actionCardPrimary {
  min-height: 112px;
  border-color: rgba(212, 154, 58, 0.14);
  background:
    radial-gradient(circle at top left, rgba(212, 154, 58, 0.08), transparent 36%),
    rgba(255, 255, 255, 0.03);
}

.actionCopy {
  min-width: 0;
  display: grid;
  gap: 4px;
  align-content: start;
}

.actionName {
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: var(--weight-semibold);
  line-height: 1.42;
  max-width: 9ch;
  text-wrap: balance;
}

.actionHint {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.35;
}

.homeGrid {
  display: grid;
  gap: var(--space-l);
}

.marketBoard {
  padding: clamp(20px, 5vw, 24px) clamp(18px, 4vw, 22px);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: none;
}

.marketBoardBody {
  display: grid;
  gap: var(--space-m);
  margin-top: var(--space-m);
}

.boardTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-family: var(--font-family-display);
  font-size: var(--text-heading);
  line-height: var(--leading-tight);
  font-weight: var(--weight-heavy);
  letter-spacing: var(--tracking-tight);
}

.marketMeta {
  display: grid;
  gap: var(--space-m);
}

.marketPriceBlock {
  padding: 0 0 14px;
  border-radius: 0;
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  .marketPrice {
    color: var(--text-primary);
    font-family: var(--font-family-display);
    font-size: 1.75rem;
    font-weight: var(--weight-heavy);
    line-height: 1.06;
    letter-spacing: var(--tracking-tight);
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .marketChange {
    display: flex;
    gap: 12px;
    margin-top: 8px;
    font-size: var(--text-body-compact);
    font-weight: var(--weight-bold);
  }
}

.statsGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 var(--space-s);
}

.statItem {
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  span {
    display: block;
    color: var(--text-secondary);
    font-size: var(--text-label);
    line-height: 1.5;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: var(--weight-bold);
    line-height: 1.4;
  }
}

.statItem:nth-last-child(-n + 2) {
  border-bottom: 0;
}

.chartShell {
  overflow: hidden;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.018);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.sidebarStack {
  display: grid;
  gap: var(--space-m);
}

.sectionBlock {
  padding: clamp(18px, 4vw, 22px);
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: none;
}

.moversBlock,
.newsBlock {
  display: grid;
  gap: var(--space-s);
}

.sectionLink {
  appearance: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  color: var(--brand-primary);
  font-size: var(--text-label);
  font-weight: var(--weight-bold);
  background: transparent;
  border: 0;
  cursor: pointer;
  transition:
    color var(--motion-fast),
    transform var(--motion-fast);
}

.topAction:hover,
.actionCard:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(212, 154, 58, 0.2);
}

.sectionLink:hover {
  color: color-mix(in srgb, var(--brand-primary) 85%, white 15%);
}

.topAction:active,
.actionCard:active,
.sectionLink:active {
  transform: scale(0.98);
}

</style>
