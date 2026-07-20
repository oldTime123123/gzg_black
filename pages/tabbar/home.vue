<script lang="ts" setup>
import { computed, ref } from 'vue';
import { LineOption } from '~/utils/indexLineStyle';
import { homeNoitceBarInfo, getNewsList, getTradeProduct, getStockIndexList } from '~/api/home/home';

const { t } = useI18n();

const commList = computed(() => {
  return [
    {
      name: t('index.i10'),
      icon: 'lucide:briefcase-business',
      url: '/trade/insiderTrade',
    },
    {
      name: t('index.i15'),
      icon: 'lucide:building-2',
      url: '/trade/blockTrade',
    },
    {
      name: t('index.i13'),
      icon: 'lucide:scale',
      url: '/trade/leveragedTrade',
    },
    {
      name: t('index.i11'),
      icon: 'lucide:file-plus-2',
      url: '/trade/spoRecord',
    },
    {
      name: t('index.i12'),
      icon: 'lucide:vault',
      url: '/fund',
    },
    {
      name: t('index.i16'),
      icon: 'lucide:wallet',
      url: '/loan',
    },
  ];
});

const isSticky = ref(false);
const topFixedChange = (val: boolean) => {
  isSticky.value = val;
};

const lineDataList = ref([]);
const router = useRouter();

const changePage = (url: string) => {
  if (url) {
    router.push(url);
  }
};

const newsList = ref([]);
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

const showSeketLoading = ref(true);
const showNewsSeketLoading = ref(true);

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

  getTradeProduct({
    vol: 1,
    size: 10,
  })
    .then((res) => {
      lineDataList.value = res;
    })
    .finally(() => {
      showSeketLoading.value = false;
    });

  getStockIndexList().then((res) => {
    selectStockInfo.value = res.index[0];
    if (selectStockInfo.value.chart) {
      HomeKlineRef.value.initKlineData(selectStockInfo.value.chart);
      selfData.value.high = selectStockInfo.value.chart.meta.regularMarketDayHigh;
      selfData.value.low = selectStockInfo.value.chart.meta.regularMarketDayLow;
    }
  });
};

const changeLineTypeData = (data) => {
  const result = Array(100)
    .fill(null)
    .map((_, i) => data[i] ?? null);
  for (let i = 1; i < 100; i++) {
    if (result[i] == null) {
      result[i] = result[i - 1];
    }
  }

  return result;
};

const updateHomeKlineTopData = (data) => {
  homeKlineEmitData.value = data;
};

const goNewsDetail = (item) => {
  if (item.type !== 2) {
    pub.selectNews = item;
    router.push('/mine/newsDetail');
  } else {
    window.open(item.url);
  }
};

const useSocketStore = socketStore();
const goTrade = (item) => {
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
                <Icon name="lucide:bell" size="18" />
              </div>
              <div class="noticeContent">
                <van-notice-bar scrollable :text="noticeTxt" background="transparent" color="var(--text-primary)" />
              </div>
            </div>

            <div class="topBarActions">
              <div class="topAction" @click="changePage('/service')">
                <Icon name="lucide:headset" size="18" />
              </div>
              <div class="topAction" @click="changePage('/setting/identify')">
                <Icon name="lucide:shield-check" size="18" />
              </div>
            </div>
          </div>
        </van-sticky>

        <div class="pageContainer px-3 mt-3 pb-6">


          <div class="homeGrid mt-4">
            <div class="marketBoard sectionCard">
              <div class="sectionHeading">
                <div>
                  <div class="sectionSubtext">{{ $t('theme.marketBoardSubtext') }}</div>
                </div>
              </div>

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

              <div class="chartShell mt-4">
                <HomeKLine ref="HomeKlineRef" @updateHomeKlineTopData="updateHomeKlineTopData" />
              </div>
            </div>
    <div class="actionRail mt-4">
            <div class="actionCard" v-for="(item, index) in commList" :key="index" @click="changePage(item.url)">
              <div class="iconFrame">
                <Icon :name="item.icon" size="20" />
              </div>
              <div class="actionName">{{ item.name }}</div>
            </div>
          </div>

            <div class="sidebarStack">
              <div class="sectionCard sectionBlock">
                <div class="sectionHeading">
                  <div class="sectionTitle">{{ $t('index.i21') }}</div>
                  <div class="sectionLink" @click="changePage('/tabbar/market?type=1')">
                    {{ $t('index.i22') }}
                    <Icon name="lucide:chevron-right" size="16" />
                  </div>
                </div>

                <div class="productList mt-4">
                  <template v-if="showSeketLoading">
                    <div class="productSkeleton" v-for="(item, index) in 3" :key="index"></div>
                  </template>
                  <div v-else class="productCard" v-for="item in lineDataList.slice(0, 3)" :key="item.id || item.pro_code"
                    @click="goTrade(item)">
                    <div class="productTop">
                      <div class="productInfo">
                        <div class="productName">{{ item.pro_name }}</div>
                        <div class="productCode">{{ item.pro_code }}</div>
                      </div>
                      <div class="productPriceBlock">
                        <div class="productPrice">{{ item.price }}</div>
                        <div class="productBottom" :class="item.is_rise > 1 ? 'colorUp' : 'colorDown'">
                          <Icon
                            :name="item.is_rise > 1 ? 'lucide:arrow-up-right' : 'lucide:arrow-down-right'"
                            class="productTrendIcon"
                          />
                          <span>{{ getNumberType(true, item.is_rise) + item.rise }}</span>
                          <span class="productPercent">{{ getNumberType(true, item.is_rise) + item.rise_rate }}%</span>
                        </div>
                      </div>
                    </div>

                    <div class="productChart" v-if="item.chart.length > 0">
                      <ClientOnly>
                        <apexchart width="100%" height="42" type="area" :options="LineOption"
                          :series="[{ data: changeLineTypeData(item.chart.indicators.quote[0].close) }]" />
                      </ClientOnly>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sectionCard sectionBlock">
                <div class="sectionHeading">
                  <div class="sectionTitle">{{ t('x.a8') }}</div>
                  <div class="sectionLink" @click="changePage('/tabbar/news')">
                    {{ $t('index.i23') }}
                    <Icon name="lucide:chevron-right" size="16" />
                  </div>
                </div>

                <div class="newsList mt-4">
                  <template v-if="showNewsSeketLoading">
                    <div class="newsSkeleton" v-for="(item, index) in 3" :key="index"></div>
                  </template>
                  <template v-else>
                    <div class="newsLeadCard" v-if="newsList[0]" @click="goNewsDetail(newsList[0])">
                      <div class="newsLeadEyebrow">{{ $t('theme.featured') }}</div>
                      <div class="newsLeadTitle">{{ newsList[0].name }}</div>
                      <div class="newsMeta">{{ newsList[0].show_time_format }}</div>
                    </div>
                    <div class="newsCompactList" v-if="newsList.length > 1">
                      <div class="newsCard compact" v-for="(item, index) in newsList.slice(1, 4)" :key="index" @click="goNewsDetail(item)">
                        <div class="newsTitle">{{ item.name }}</div>
                        <div class="newsMeta">{{ item.show_time_format }}</div>
                      </div>
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
  gap: 12px;
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
  background: rgba(19, 26, 34, 0.78);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
}

.noticeIcon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  background: rgba(95, 224, 179, 0.12);
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
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  background: rgba(19, 26, 34, 0.78);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
}

.heroPanel {
  display: grid;
  gap: 18px;
  padding: 22px 20px;
  border-radius: 28px;
  background: var(--gradient-hero);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
}

.heroEyebrow {
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.heroTitle {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 26px;
  line-height: 1.15;
  font-weight: 700;
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-soft);
}

.quoteName {
  color: var(--text-secondary);
  font-size: 12px;
}

.quotePrice {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 32px;
  line-height: 1;
  font-weight: 800;
}

.quoteDelta {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  font-size: 13px;
  font-weight: 700;


}

.actionRail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.actionCard {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
}

.actionName {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
}

.homeGrid {
  display: grid;
  gap: 14px;
}

.marketBoard {
  padding: 18px;
}

.marketMeta {
  display: grid;
  gap: 14px;
  margin-top: 16px;
}

.marketPriceBlock {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);

  .marketPrice {
    color: var(--text-primary);
    font-size: 28px;
    font-weight: 800;
  }

  .marketChange {
    display: flex;
    gap: 12px;
    margin-top: 8px;
    font-size: 13px;
    font-weight: 700;
  }
}

.statsGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.statItem {
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);

  span {
    display: block;
    color: var(--text-secondary);
    font-size: 12px;
  }

  strong {
    display: block;
    margin-top: 6px;
    color: var(--text-primary);
    font-size: 14px;
  }
}

.chartShell {
  overflow: hidden;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
}

.sidebarStack {
  display: grid;
  gap: 14px;
}

.sectionBlock {
  padding: 16px;
}

.sectionLink {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.productList,
.newsList {
  display: grid;
  gap: 12px;
}

.productCard {
  padding: 14px 14px 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
}

.productTop {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.productInfo {
  flex: 1;
  min-width: 0;
}

.productName {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  word-break: break-word;
}

.productCode {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.productPriceBlock {
  min-width: 112px;
  text-align: right;
}

.productPrice {
  color: var(--text-primary);
  font-size: 17px;
  font-weight: 800;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.productChart {
  margin-top: 8px;
  opacity: 0.92;
}

.productBottom {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 6px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.productPercent {
  opacity: 0.92;
}

.productTrendIcon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

@media (max-width: 359px) {
  .homeTopBar {
    gap: 8px;
  }

  .topBarActions {
    gap: 6px;
  }

  .topAction {
    width: 38px;
    height: 38px;
  }

  .actionCard {
    gap: 8px;
    padding: 12px 10px;
  }

  .iconFrame {
    width: 40px;
    height: 40px;
  }

  .productCard {
    padding-inline: 12px;
  }

  .productPriceBlock {
    min-width: 104px;
  }
}

.newsCard {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
}

.newsLeadCard {
  padding: 16px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--border-soft);
}

.newsLeadEyebrow {
  color: var(--brand-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.newsLeadTitle {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.5;
  font-weight: 700;
}

.newsCompactList {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.newsCard.compact {
  padding: 12px 14px;
}

.newsTitle {
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.45;
  font-weight: 600;
}

.newsMeta {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12px;
}

.productSkeleton,
.newsSkeleton {
  height: 88px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-soft);
}
</style>
