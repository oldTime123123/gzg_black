<script lang="ts" setup>
import { getStockIndexList } from "~/api/home/home";
import { LineOption } from "~/utils/indexLineStyle";
const { t } = useI18n();

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

const lineDataList = ref([]);

const getData = () => {
  getStockIndexList().then((res: any) => {
    lineDataList.value = Array.isArray(res.index) && res.index.length > 1 ? res.index.slice(0, 2) : res.index;
  });
};

const route = useRoute();
onMounted(() => {
  if (route.query.type) {
    actRecordType.value = Number(route.query.type);
  }
  getData();
});

const changeLineTypeData = (data: any) => {
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
  if (actRecordType.value == type) return;
  actRecordType.value = type;
  pub.showLoading = true;
};
</script>

<template>
  <section>
    <div class="hasNormalBg pageShell">
      <TabbarTopNavBar />

      <div class="pageContainer px-3 mt-3 pb-6">
        <div class="heroPanel">
          <div class="sectionSubtext">{{ $t('market.m3') }}</div>
          <div class="heroTitle">{{ $t('theme.marketHeroTitle') }}</div>
          <div class="heroDesc">{{ $t('theme.marketHeroCopy') }}</div>
        </div>

        <div class="indexGrid mt-4">
          <div class="indexCard" v-for="(item, index) in lineDataList" :key="index">
            <div class="indexHeader">
              <div>
                <div class="indexName">{{ item.exchange_name }}</div>
                <div class="indexPrice">{{ item.price }}</div>
              </div>
              <div class="indexChange" :class="item.is_rise == 2 ? 'isUp' : 'isDown'">
                <div class="changeRow">
                  <Icon :name="item.is_rise == 2 ? 'solar:arrow-to-top-left-linear' : 'solar:arrow-to-bottom-right-linear'" class="trendIcon" />
                  {{ getNumberType(true, item.is_rise) + UseExchangeNumber(item.chart?.rise) }}
                </div>
                <div class="changeBadge">
                  {{ getNumberType(true, item.is_rise) }} {{ item.rise_rate }}%
                </div>
              </div>
            </div>

            <div class="indexChart">
              <ClientOnly>
                <apexchart width="100%" height="72" type="area" :options="LineOption" :series="[
                    {
                      data: changeLineTypeData(item.chart.indicators.quote[0].close),
                    },
                  ]" />
              </ClientOnly>
            </div>
          </div>
        </div>

        <div class="marketPanel sectionCard mt-4 p-3">
          <div class="tabRail">
            <div v-for="(tab, index) in tabs" :class="actRecordType == tab.type ? 'tabChip active' : 'tabChip'"
              :key="index" @click="changeDataType(tab.type)">
              {{ tab.text }}
            </div>
          </div>

          <div class="mt-4">
            <MarketRecordList v-if="actRecordType < 1" />
            <CollectStockList v-else @changeDataType="changeDataType" />
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

.heroPanel {
  padding: 22px 18px;
  border-radius: 26px;
  background: var(--gradient-hero);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
}

.heroTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 24px;
  line-height: 1.2;
  font-weight: 700;
}

.heroDesc {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
}

.indexGrid {
  display: grid;
  gap: 14px;
}

.indexCard {
  padding: 16px;
  border-radius: 22px;
  background: var(--gradient-panel);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
}

.indexHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.indexName {
  color: var(--text-secondary);
  font-size: 12px;
}

.indexPrice {
  margin-top: 6px;
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 700;
}

.indexChange {
  text-align: right;

  &.isUp {
    color: var(--color-up);
  }

  &.isDown {
    color: var(--color-down);
  }
}

.changeRow {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
}

.trendIcon {
  width: 14px;
  height: 14px;
}

.changeBadge {
  display: inline-flex;
  justify-content: center;
  min-width: 88px;
  margin-top: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: inherit;
  font-size: 12px;
}

.indexChart {
  margin-top: 12px;
}

.tabRail {
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
}

.tabChip {
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;

  &.active {
    background: rgba(95, 224, 179, 0.12);
    color: var(--brand-primary);
  }
}
</style>
