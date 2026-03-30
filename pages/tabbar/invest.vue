<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getCircleOption } from '~/utils/indexLineStyle';
import { getUserAccountBalance } from '~/api/home/home';

const colors = ['#5FE0B3', '#67B7FF', '#F4B740', '#18C37E'];
const series = ref([0, 0, 0, 0]);
const { t } = useI18n();

const balanceList = ref({
  totalAsset: 0,
  balance: 0,
  frozenAmount: 0,
  product_balance: 0,
  inStockProfit: 0,
});

const getData = () => {
  getUserAccountBalance().then((res: any) => {
    balanceList.value = res;
    series.value = [
      Number(res.balance),
      Number(res.product_balance),
      Number(res.frozenAmount),
    ];
  });
};

const circleChartStyle = getCircleOption(colors);

const balanceBox = computed(() => {
  return [
    {
      amount: balanceList.value.totalAsset || 0,
      color: '#67B7FF',
      name: t('index.i1'),
    },
    {
      amount: series.value[0] || 0,
      color: colors[0],
      name: t('index.i2'),
    },
    {
      amount: series.value[1] || 0,
      color: colors[1],
      name: t('index.i3'),
    },
    {
      amount: series.value[2] || 0,
      color: colors[2],
      name: t('mine.m16'),
    },
    {
      amount: balanceList.value.inStockProfit || 0,
      color: colors[3],
      name: t('index.i4'),
    },
  ];
});

const pub = usePublicStore();

const actRecordType = computed(() => {
  return pub.actRecordType;
});

const recordTypeTabs = ref([
  {
    text: t('index.i5'),
    type: 3,
  },
  {
    text: t('index.i6'),
    type: 1,
  },
  {
    text: t('index.i7'),
    type: 2,
  },
]);

const changeRecordType = (type) => {
  if (actRecordType.value == type) return;
  pub.actRecordType = type;
  pub.showLoading = true;
  actRecordType.value = type;
};

const router = useRouter();
const changePage = (url: any) => {
  if (url) {
    router.push(url);
  }
};

const showBalance = ref(true);

onBeforeMount(() => {
  getData();
});
</script>

<template>
  <section>
    <div class="hasNormalBg pageShell">
      <TabbarTopNavBar />

      <ClientOnly>
        <div class="pageContainer px-3 mt-3 pb-6">
          <div class="portfolioHero">
            <div class="portfolioHeader">
              <div>
                <div class="sectionSubtext">{{ $t('theme.portfolioDashboard') }}</div>
                <div class="portfolioTitle">{{ t('index.i1') }}</div>
              </div>
              <div class="visibilityToggle" @click="showBalance = !showBalance">
                <Icon :name="showBalance ? 'solar:eye-closed-linear' : 'solar:eye-linear'" size="16" />
                <span>{{ showBalance ? $t('theme.hideBalance') : $t('theme.showBalance') }}</span>
              </div>
            </div>

            <div class="portfolioBody">
              <div class="chartCard">
                <div class="chartWrap">
                  <apexchart v-if="series" type="donut" width="150" height="150" :options="circleChartStyle"
                    :series="series" />
                  <div class="totalAmount">
                    <div class="text-center text-xs">
                      <div>{{ t('index.i1') }}</div>
                      <div class="totalAmountValue">{{ showBalance ? '*****' : UseExchangeNumber(balanceList.totalAsset) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="metricGrid">
                <div class="metricItem" v-for="(item, index) in balanceBox" :key="index">
                  <div class="metricLabel">
                    <span class="metricDot" :style="{ background: item.color }"></span>
                    <span>{{ item.name }}</span>
                  </div>
                  <div class="metricValue">
                    {{ getCurrency() + (showBalance ? '*****' : UseExchangeNumber(item.amount)) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="recordBoxEl sectionCard mt-4 p-3">
            <div class="recordHeader">
              <div class="tabRail">
                <div v-for="(tab, index) in recordTypeTabs" :class="actRecordType == tab.type ? 'tabChip active' : 'tabChip'"
                  :key="index" @click="changeRecordType(tab.type)">
                  {{ tab.text }}
                </div>
              </div>

              <div class="contentBtn addBtn" v-if="actRecordType == 3" @click="changePage('/trade/spoRecord')">
                <span>{{ $t('comm.c5') }}</span>
                <Icon name="material-symbols:add-circle-rounded" size="20" class="addBtnIcon" />
              </div>
            </div>

            <div class="mt-4">
              <InvestReocrdList :type="actRecordType" @updateUserBalance="getData" />
            </div>
          </div>
        </div>
      </ClientOnly>
    </div>

    <Tabbar />
  </section>
</template>

<style lang="less" scoped>
.pageContainer {
  min-height: calc(100vh - 130px);
}

.portfolioHero {
  padding: 20px;
  border-radius: 28px;
  background: var(--gradient-hero);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
}

.portfolioHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.portfolioTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 24px;
  line-height: 1.2;
  font-weight: 700;
}

.visibilityToggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  font-size: 12px;
}

.portfolioBody {
  display: grid;
  gap: 16px;
  margin-top: 20px;
}

.chartCard {
  display: flex;
  justify-content: center;
  padding: 16px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
}

.chartWrap {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
}

.totalAmount {
  position: absolute;
  inset: 50%;
  width: 92px;
  height: 92px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: rgba(24, 34, 45, 0.94);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-soft);
  padding: 8px;
  text-align: center;
}

.totalAmountValue {
  margin-top: 4px;
  font-weight: 700;
  line-height: 1.25;
  word-break: break-word;
}

.metricGrid {
  display: grid;
  gap: 12px;
}

.metricItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
}

.metricLabel {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  min-width: 0;
  flex: 1;
}

.metricDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex-shrink: 0;
}

.metricValue {
  color: var(--text-primary);
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
  text-align: right;
}

.recordHeader {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tabRail {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 6px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  width: 100%;
}

.tabChip {
  min-height: 40px;
  padding: 8px 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.35;
  cursor: pointer;
  min-width: 0;
  text-align: center;
  word-break: break-word;

  &.active {
    background: rgba(95, 224, 179, 0.12);
    color: var(--brand-primary);
  }
}

.addBtn {
  width: 100%;
  min-width: 0;
  white-space: normal;
  line-height: 1.2;
  min-height: 48px;
  height: auto;
  padding: 12px 16px;
}
</style>
