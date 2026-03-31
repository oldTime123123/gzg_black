<script setup lang="ts">
import { defineProps } from "vue";

import { subCloseStockHandle } from "~/api/trade";
import { showToast } from "vant";
import { getNumberClass, getNumberType, UseExchangeNumber } from "../utils";

const { t } = useI18n();
const props = defineProps<{
  data: Record<string, any>;
}>();
const data: any = props.data;

const showPop = ref(false);
const closePosition = () => {
  showPop.value = true;
};

const router = useRouter();
const goDetails = () => {
  router.push("/trade/tradeRecordDetails?id=" + data.id);
};
const emits = defineEmits();
const pub = usePublicStore();
const confirmClosePositionHandle = () => {
  showPop.value = false;
  pub.showLoading = true;
  subCloseStockHandle({
    order_id: data.id,
  }).then(() => {
    showToast(t("comm.c6"));
    emits("updateRecordHandle");
  });
};
</script>

<template>
  <div class="recordItemEl mb-3 overflow-hidden rounded-[20px]">
    <div class="cardHeader px-3 py-3">
      <div class="titleBlock flex flex-col">
        <span class="titleText text-sm">{{ data.product.pro_name }}</span>
        <div class="flex">
          <div class="codeBadge mt-1 text-center px-2 h-[20px] leading-[20px] text-xs">
            {{ data.product.pro_code }}
          </div>
        </div>
      </div>
      <div class="quoteStrip" :class="getBlockBgClass(true, data.product.is_rise)">
        <div class="quoteMain">
          <div class="quoteLabel">{{ $t("comm.c41") }}</div>
          <div class="quotePriceRow" :class="data.product?.is_rise > 1 ? 'colorUp' : 'colorDown'">
            <div class="valueText">{{ UseExchangeNumber(data.product.price) }}</div>
            <Icon
              :name="data.product?.is_rise > 1 ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'"
              class="trendIcon"
            />
          </div>
        </div>
        <div class="quoteDelta text-[11px]">
          <div class="trendLine">
            {{ getNumberType(true, data.product?.is_rise) + UseExchangeNumber(data.product?.rise) }}
          </div>
          <div class="trendLine">
            ({{ getNumberType(true, data.product?.is_rise) + data.product?.rise_rate }}%)
          </div>
        </div>
      </div>
    </div>

    <div class="px-3 py-2 space-y-2 text-sm">
      <div class="detailRow">
        <div>{{ $t("comm.c41") }}</div>
        <div class="rowValue">{{ UseExchangeNumber(data.price) }}</div>
      </div>
      <div class="detailRow">
        <div>{{ $t("comm.c42") }}</div>
        <div class="rowValue" :class="getNumberClass(true, data.order_analysis?.is_rise)">
          {{ getNumberType(true, data.order_analysis?.is_rise) + data.order_analysis?.raise }}
        </div>
      </div>
      <div class="detailRow">
        <div>{{ $t("comm.c43") }}</div>
        <div class="rowValue" :class="getNumberClass(true, data.order_analysis?.is_rise)">
          {{ getNumberType(true, data.order_analysis?.is_rise) + data.order_analysis?.raise_rate + "%" }}
        </div>
      </div>

      <div class="expandToggle" v-if="!data.showMore" @click="data.showMore = true">
        {{ $t("comm.c44") }}
        <Icon name="solar:alt-arrow-down-bold" size="20" />
      </div>
      <div class="space-y-3" v-else>
        <div class="detailRow">
          <div>{{ $t("comm.c45") }}</div>
          <div class="rowValue">{{ data.number }}</div>
        </div>
        <div class="detailRow">
          <div>{{ $t("comm.c46") }}</div>
          <div class="rowValue">{{ UseExchangeNumber(data.price * data.number) }}</div>
        </div>
        <div class="detailRow">
          <div>{{ $t("comm.c47") }}</div>
          <div class="rowValue">{{ data.deal_time }}</div>
        </div>
        <div class="detailRow">
          <div>{{ $t("comm.c49") }}</div>
          <div class="rowValue">{{ UseExchangeNumber(data.product?.price * data.number) }}</div>
        </div>
        <div class="collapseToggle" @click="data.showMore = false">
          {{ $t("theme.collapse") }}
          <Icon name="solar:alt-arrow-up-bold" size="20" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="mt-3 contentBtn" @click="goDetails">{{ $t("comm.c50") }}</div>
        <div class="mt-3 contentBtn" @click="closePosition">{{ $t("comm.c51") }}</div>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false" z-index="999">
      <div class="overlayWrap">
        <div class="dialogCard" @click.stop>
          <div class="dialogTitle">{{ $t("comm.c51") }}</div>
          <div class="dialogBody">
            <div class="dialogIdentity">
              <span class="dialogName">{{ data.product.pro_name }}</span>
              <div class="codeBadge px-2 h-[20px] leading-[20px] ml-2 text-xs">
                {{ data.product.pro_code }}
              </div>
            </div>
            <div class="detailRow mt-3">
              <div class="text-sm">{{ $t("comm.c53") }}</div>
              <div class="rowValue">{{ UseExchangeNumber(data.price) }}</div>
            </div>
            <div class="detailRow">
              <div class="text-sm">{{ $t("comm.c54") }}</div>
              <div class="rowValue">{{ UseExchangeNumber(data.product?.price) }}</div>
            </div>
            <div class="detailRow">
              <div class="text-sm">{{ $t("record.a2") }}</div>
              <div class="rowValue">{{ data.number }}</div>
            </div>
            <div class="detailRow">
              <div class="text-sm">{{ $t("comm.c55") }}</div>
              <div class="rowValue" :class="getNumberClass(true, data.profit_type)">
                {{ getNumberType(true, data.profit_type) + UseExchangeNumber(data.expected_profit) }}
              </div>
            </div>
          </div>
          <div class="dialogActions">
            <div class="borderContentBtn" @click="showPop = false">{{ $t("comm.c56") }}</div>
            <div class="contentBtn" @click="confirmClosePositionHandle">{{ $t("comm.c57") }}</div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style lang="less" scoped>
.recordItemEl {
  background: var(--gradient-panel);
  border: 1px solid var(--border-soft);
  box-shadow: none;
  color: var(--text-secondary);
}

.cardHeader {
  display: grid;
  gap: 12px;
  background: rgba(255, 255, 255, 0.025);
}

.titleBlock {
  min-width: 0;
}

.titleText {
  color: var(--text-primary);
  font-weight: 700;
  line-height: 1.4;
  word-break: break-word;
}

.codeBadge {
  border-radius: 999px;
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
}

.quoteStrip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
}

.quoteMain {
  min-width: 0;
}

.quoteLabel {
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.4;
  text-transform: uppercase;
}

.quotePriceRow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  min-width: 0;
}

.valueText {
  color: currentColor;
  min-width: 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 1.24;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.quoteDelta {
  display: grid;
  justify-items: end;
  gap: 2px;
  min-width: 0;
  text-align: right;
  font-size: 12px;
  font-weight: 700;
}

.trendLine {
  line-height: 1.35;
  word-break: break-word;
}

.trendIcon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.detailRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
  min-width: 0;
}

.rowValue {
  color: var(--text-primary);
  text-align: right;
  min-width: 0;
  flex: 0 1 46%;
  max-width: 46%;
  line-height: 1.45;
  word-break: break-word;
  overflow-wrap: anywhere;
  font-size: 13px;
}

.expandToggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  color: var(--brand-primary);
  font-weight: 600;
}

.collapseToggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  color: var(--brand-primary);
  font-weight: 600;
}

.overlayWrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 16px;
}

.dialogCard {
  width: min(360px, 100%);
  padding: 18px;
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(212, 154, 58, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(24, 33, 43, 0.98), rgba(13, 17, 23, 0.98));
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
}

.dialogTitle {
  text-align: center;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 800;
  line-height: 1.35;
}

.dialogBody {
  margin-top: 16px;
  display: grid;
  gap: 10px;
}

.dialogIdentity {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.dialogName {
  color: var(--text-primary);
  font-weight: 700;
  word-break: break-word;
}

.dialogActions {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
</style>
