<template>
  <div class="klineHost relative h-[250px] w-full">
    <div id="klineChartBox" style="width: 100%; height: 250px"></div>
    <div v-if="showSkeletonLoading"
      class="absolute h-full w-full left-0 animate-pulse top-0 chartSkeleton"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onUnmounted } from "vue";
import { dispose, init } from "klinecharts";
import { useI18n } from "vue-i18n";
import { getKlineStyles } from "~/utils/lineChartStyle";
import { exchangeKLineDta } from "../../utils";

const { t } = useI18n();
const klineStyles = getKlineStyles("none");
const showSkeletonLoading = ref(true);
const emit = defineEmits(["updateHomeKlineTopData"]);
const chart = ref(null);

const initKlineData = (data) => {
  if (!data || data.indicators.quote[0].length <1 ) return;

  const klineData = exchangeKLineDta(data);
  // const klineData = cleanDataList(rawData);
  if (klineData.length === 0) return;
  const newLastBar = klineData[klineData.length - 1];
  emit("updateHomeKlineTopData", newLastBar);

  if (chart.value) return;

  chart.value = init("klineChartBox");

  chart.value.setOffsetRightDistance(10);
  chart.value.setBarSpace(10);
  chart.value.setStyles(klineStyles);
  chart.value.setSymbol({ ticker: 'TestSymbol' })
  //  type: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
  chart.value.setPeriod({ span: 1, type: 'minute' })
  chart.value.setDataLoader({
    getBars: ({ callback }) => {
      callback(klineData)
    }
  })
  showSkeletonLoading.value = false;

};

onUnmounted(() => {
  if (chart.value) {
    dispose("klineChartBox");
    chart.value = null;
  }
});

defineExpose({
  initKlineData,
});
</script>

<style scoped>
.klineHost {
  border-radius: 16px;
  overflow: hidden;
}

.chartSkeleton {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.015)),
    var(--surface-chart);
  border: 1px solid rgba(125, 211, 252, 0.08);
  border-radius: 16px;
}
</style>
