<script lang="ts" setup>
import { getStockIndexList } from '~/api/home/home';
import { LineOption } from '~/utils/indexLineStyle';

const { t } = useI18n();

type MarketIndexItem = {
  exchange_name?: string;
  is_rise: number;
  rise_rate: number | string;
  price: number | string;
  chart: {
    rise?: number | string;
    indicators: {
      quote: Array<{
        close: Array<number | null>;
      }>;
    };
  };
};

const actRecordType = ref(0);
const tabs = ref([
  {
    text: t('market.m1'),
    type: 0,
  },
  {
    text: t('market.m2'),
    type: 1,
  },
]);

const lineDataList = ref<MarketIndexItem[]>([]);

const getData = () => {
  getStockIndexList().then((res: { index: MarketIndexItem[] }) => {
    lineDataList.value = Array.isArray(res.index) ? res.index.slice(0, 2) : [];
  });
};

const route = useRoute();
onMounted(() => {
  if (route.query.type) {
    actRecordType.value = Number(route.query.type);
  }
  getData();
});

const changeLineTypeData = (data: Array<number | null>) => {
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

const pub = usePublicStore();
const changeDataType = (type: number) => {
  if (actRecordType.value === type) return;
  actRecordType.value = type;
  pub.showLoading = true;
};
</script>

<template>
  <section>
    <div class="hasNormalBg pageShell">
      <TabbarTopNavBar />

      <div class="pageContainer px-3 mt-3 pb-6">
        <div class="marketShell">
          <div class="marketHero sectionCard">
            <div class="marketHero__head">
              <div>
                <div class="marketHero__eyebrow">{{ $t('theme.marketBoardSubtext') }}</div>
                <div class="marketHero__title">{{ $t('index.i21') }}</div>
              </div>
              <div class="marketHero__caption">{{ $t('theme.chronologicalNewsFlow') }}</div>
            </div>

            <div class="marketHero__grid" v-if="lineDataList.length">
              <div class="marketStage" v-for="chartItem in lineDataList" :key="chartItem.exchange_name">
                <div class="stageHeader">
                  <div class="stageIntro">
                    <div class="stageTitle">{{ chartItem.exchange_name }}</div>
                  </div>
                  <div class="stageMeta" :class="chartItem.is_rise == 2 ? 'colorUp' : 'colorDown'">
                    <div class="stageMetaRow">
                      <Icon :name="chartItem.is_rise == 2 ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'" class="trendIcon" />
                      {{ getNumberType(true, chartItem.is_rise) + UseExchangeNumber(chartItem.chart?.rise) }}
                    </div>
                    <div class="stageMetaBadge">
                      {{ getNumberType(true, chartItem.is_rise) }} {{ chartItem.rise_rate }}%
                    </div>
                  </div>
                </div>

                <div class="stagePrice">{{ chartItem.price }}</div>

                <div class="stageChart">
                  <ClientOnly>
                    <apexchart
                      width="100%"
                      height="116"
                      type="area"
                      :options="LineOption(chartItem.is_rise)"
                      :series="[
                        {
                          data: changeLineTypeData(chartItem.chart.indicators.quote[0].close),
                        },
                      ]"
                    />
                  </ClientOnly>
                </div>
              </div>
            </div>
          </div>

          <div class="marketSection sectionCard">
            <div class="sectionTop">
              <div>
                <div class="sectionTitle">{{ actRecordType < 1 ? $t('market.m1') : $t('market.m2') }}</div>
              </div>
              <div class="sectionCaption">{{ $t('theme.chronologicalNewsFlow') }}</div>
            </div>

            <div class="tabRail mt-4">
              <button
                type="button"
                v-for="(tab, index) in tabs"
                :class="actRecordType == tab.type ? 'tabChip active' : 'tabChip'"
                :key="index"
                :aria-pressed="actRecordType == tab.type"
                @click="changeDataType(tab.type)"
              >
                {{ tab.text }}
              </button>
            </div>

            <div class="marketLedger renderBudget mt-4">
              <MarketRecordList v-if="actRecordType < 1" />
              <CollectStockList v-else @changeDataType="changeDataType" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <Tabbar />
  </section>
</template>

<style lang="less" scoped>
.pageContainer {
  min-height: calc(100vh - 130px);
}

.marketShell {
  display: grid;
  gap: 14px;
}

.marketHero,
.marketSection {
  background: var(--surface-module);
  border: 1px solid rgba(125, 211, 252, 0.1);
  box-shadow: var(--shadow-card);
}

.marketHero {
  display: grid;
  gap: 16px;
}

.marketHero__head,
.sectionTop {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.marketHero__eyebrow {
  color: var(--brand-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.marketHero__title,
.sectionTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
}

.marketHero__caption,
.sectionCaption {
  max-width: 122px;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.45;
  text-align: right;
}

.marketHero__grid {
  display: grid;
  gap: 12px;
}

.marketStage {
  padding: 18px 16px 16px;
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.14), transparent 30%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(125, 211, 252, 0.12);
}

.stageHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.stageIntro {
  min-width: 0;
}

.stageTitle {
  color: var(--text-primary);
  font-size: 18px;
  line-height: 1.35;
  font-weight: 700;
}

.stageMeta {
  min-width: 108px;
  text-align: right;
}

.stageMetaRow {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
}

.stageMetaBadge {
  display: inline-flex;
  justify-content: center;
  min-width: 84px;
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
  font-size: 12px;
}

.stagePrice {
  margin-top: 18px;
  color: var(--text-primary);
  font-size: 30px;
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -0.03em;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.stageChart {
  margin-top: 12px;
}

.trendIcon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.marketSection {
  padding: 18px 16px;
}

.tabRail {
  display: flex;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.025);
  width: 100%;
}

.tabChip {
  appearance: none;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: var(--text-secondary);
  font-size: 13px;
  background: transparent;
  border: 0;
  cursor: pointer;
  transition:
    transform var(--motion-fast),
    background-color var(--motion-fast),
    color var(--motion-fast);

  &.active {
    background: var(--brand-primary-soft);
    color: var(--brand-primary);
  }
}

.tabChip:active {
  transform: scale(0.98);
}

.marketLedger {
  padding-top: 4px;
}
</style>
