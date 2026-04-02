<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getCircleOption } from '~/utils/indexLineStyle';
import { getUserAccountBalance } from '~/api/home/home';

const colors = ['#D49A3A', '#73A3D6', '#F4B740', '#18C37E'];
const series = ref([0, 0, 0, 0]);
const { t } = useI18n();

type BalanceSummary = {
  totalAsset: number;
  balance: number;
  frozenAmount: number;
  product_balance: number;
  inStockProfit: number;
};

const balanceList = ref<BalanceSummary>({
  totalAsset: 0,
  balance: 0,
  frozenAmount: 0,
  product_balance: 0,
  inStockProfit: 0,
});

const getData = () => {
  getUserAccountBalance().then((res: BalanceSummary) => {
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

const changeRecordType = (type: number) => {
  if (actRecordType.value == type) return;
  pub.actRecordType = type;
  pub.showLoading = true;
};

const router = useRouter();
const changePage = (url: string) => {
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
          <div class="portfolioHero grid gap-5">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-[12px] uppercase tracking-[0.06em] leading-[1.4] text-[var(--text-muted)]">{{ t('index.i1') }}</div>
              </div>
              <button
                type="button"
                class="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-[radial-gradient(circle_at_left_center,rgba(56,189,248,0.08),transparent_36%),rgba(255,255,255,0.03)] px-2.5 py-1.5 text-[12px] leading-[1.2] text-[var(--text-secondary)] transition-[transform,border-color,background-color] duration-200 ease-out"
                :aria-pressed="showBalance"
                @click="showBalance = !showBalance"
              >
                <Icon :name="showBalance ? 'solar:eye-closed-linear' : 'solar:eye-linear'" size="16" />
                <span>{{ showBalance ? $t('theme.hideBalance') : $t('theme.showBalance') }}</span>
              </button>
            </div>

            <div class="flex w-full items-end gap-2">
              <span class="shrink-0 text-[29px] font-extrabold leading-[0.96] tracking-[-0.025em] text-[var(--text-primary)]">{{ getCurrency() }}</span>
              <span class="min-w-0 flex-1 break-words text-[29px] font-extrabold leading-[0.92] tracking-[-0.03em] text-[var(--text-primary)] [overflow-wrap:anywhere]">
                {{ showBalance ? '*****' : UseExchangeNumber(balanceList.totalAsset) }}
              </span>
            </div>

            <div class="portfolioBody">
              <div class="chartCard">
                <div class="chartWrap">
                  <apexchart v-if="series" type="donut" width="150" height="150" :options="circleChartStyle"
                    :series="series" />
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
                <button type="button" v-for="(tab, index) in recordTypeTabs" :class="actRecordType == tab.type ? 'tabChip active' : 'tabChip'"
                  :key="index" :aria-pressed="actRecordType == tab.type" @click="changeRecordType(tab.type)">
                  {{ tab.text }}
                </button>
              </div>

              <button type="button" class="contentBtn addBtn" v-if="actRecordType == 3" @click="changePage('/trade/spoRecord')">
                <span>{{ $t('comm.c5') }}</span>
                <Icon name="material-symbols:add-circle-rounded" size="20" class="addBtnIcon" />
              </button>
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
  padding: 18px;
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: none;
}

.portfolioBody {
  display: grid;
  gap: 14px;
  margin-top: 20px;
}

.chartCard {
  display: flex;
  justify-content: center;
  padding: 8px 0 14px;
  border-radius: 0;
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.chartWrap {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto;
}

.metricGrid {
  display: grid;
  gap: 0;
  padding: 0;
  border-radius: 0;
  background: transparent;
  border: 0;
}

.metricItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.metricItem:last-child {
  border-bottom: 0;
}

.metricLabel {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: var(--text-body-compact);
  line-height: 1.55;
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
  font-weight: var(--weight-bold);
  font-size: 1rem;
  line-height: 1.45;
  flex: 0 1 42%;
  max-width: 42%;
  text-align: right;
  word-break: break-word;
  font-variant-numeric: tabular-nums lining-nums;
  font-feature-settings: "tnum" 1, "lnum" 1;
}

.recordBoxEl {
  background: rgba(255, 255, 255, 0.018);
  border: 1px solid rgba(255, 255, 255, 0.05);
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
  background: rgba(255, 255, 255, 0.02);
  width: 100%;
}

.tabChip {
  appearance: none;
  min-height: 40px;
  padding: 8px 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
  cursor: pointer;
  min-width: 0;
  text-align: center;
  word-break: break-word;
  background: transparent;
  border: 0;
  transition:
    transform var(--motion-fast),
    background-color var(--motion-fast),
    color var(--motion-fast);

  &.active {
    background: rgba(56, 189, 248, 0.12);
    color: var(--brand-primary);
  }
}

.addBtn {
  width: 100%;
  min-width: 0;
  white-space: normal;
  line-height: 1.2;
  min-height: 50px;
  height: auto;
  padding: 12px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: var(--weight-bold);
}

.addBtnIcon {
  color: rgba(125, 211, 252, 0.92);
  flex-shrink: 0;
}

.tabChip:active,
.addBtn:active {
  transform: scale(0.98);
}
</style>
