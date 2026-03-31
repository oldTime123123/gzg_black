<script setup lang="ts">
import { defineProps } from "vue";

import { UseExchangeNumber } from "../utils";

const props = defineProps<{
  data: {
    id: number | string;
    showMore?: boolean;
    price: number | string;
    number: number | string;
    deal_time: string;
    close_money: number | string;
    close_number: number | string;
    close_time: string;
    profit_type: number;
    expected_profit: number | string;
    expected_profit_rate: number | string;
    product: {
      pro_name: string;
      pro_code: string;
      is_rise: number;
      price: number | string;
      rise: number | string;
      rise_rate: number | string;
    };
  };
}>();
const data = props.data;

const router = useRouter();
const goDetails = () => {
  router.push("/trade/tradeRecordDetails?id=" + data.id);
};
</script>

<template>
  <div class="recordItemEl mb-3 overflow-hidden rounded-[20px]">
    <div class="cardHeader px-3 py-3">
      <div class="titleBlock flex flex-col">
        <span class="titleText text-sm">{{ data.product.pro_name }}</span>
        <div class="flex">
          <div class="codeBadge mt-1 h-[20px] px-2 text-center text-xs leading-[20px]">
            {{ data.product.pro_code }}
          </div>
        </div>
      </div>
      <div class="quoteStrip" :class="getBlockBgClass(true, data.product.is_rise)">
        <div class="quoteMain">
          <div class="quoteLabel">{{ $t("comm.c26") }}</div>
          <div class="quotePriceRow" :class="data.product?.is_rise > 1 ? 'colorUp' : 'colorDown'">
            <div class="valueText">{{ UseExchangeNumber(data.product.price) }}</div>
            <Icon
              :name="
                data.product?.is_rise > 1
                  ? 'solar:alt-arrow-up-bold'
                  : 'solar:alt-arrow-down-bold'
              "
              class="trendIcon"
            />
          </div>
        </div>
        <div class="quoteDelta text-[11px]" :class="getNumberClass(true, data.product?.is_rise)">
          <div class="trendLine">
            {{ getNumberType(true, data.product?.is_rise) + UseExchangeNumber(data.product?.rise) }}
          </div>
          <div class="trendLine">
            ({{ getNumberType(true, data.product?.is_rise) + data.product?.rise_rate }}%)
          </div>
        </div>
      </div>
    </div>

    <div class="summaryGrid px-3">
      <div class="summaryCard">
        <div class="summaryLabel">{{ $t("comm.c24") }}</div>
        <div class="summaryValue" :class="getNumberClass(true, data.profit_type)">
          {{ getNumberType(true, data.profit_type) }}{{ UseExchangeNumber(data.expected_profit) }}
        </div>
      </div>
      <div class="summaryCard">
        <div class="summaryLabel">{{ $t("comm.c25") }}</div>
        <div class="summaryValue" :class="getNumberClass(true, data.profit_type)">
          {{ getNumberType(true, data.profit_type) }}{{ data.expected_profit_rate }}%
        </div>
      </div>
    </div>

    <div class="mt-3 space-y-2 px-3 pb-3 text-sm">
      <div class="detailRow">
        <div>{{ $t("comm.c26") }}</div>
        <div class="rowValue">{{ UseExchangeNumber(data.price) }}</div>
      </div>
      <div class="detailRow">
        <div>{{ $t("comm.c30") }}</div>
        <div class="rowValue">{{ data.number }}</div>
      </div>
      <div class="detailRow">
        <div>{{ $t("comm.c31") }}</div>
        <div class="rowValue">{{ UseExchangeNumber(data.price * data.number) }}</div>
      </div>

      <button type="button" class="expandToggle" v-if="!data.showMore" @click="data.showMore = true">
        {{ $t("comm.c29") }}
        <Icon name="solar:alt-arrow-down-bold" size="20" />
      </button>

      <div class="space-y-2" v-else>
        <div class="detailRow">
          <div>{{ $t("comm.c32") }}</div>
          <div class="rowValue">{{ data.deal_time }}</div>
        </div>
        <div class="detailRow">
          <div>{{ $t("comm.c34") }}</div>
          <div class="rowValue">{{ UseExchangeNumber(data.close_money) }}</div>
        </div>
        <div class="detailRow">
          <div>{{ $t("comm.c35") }}</div>
          <div class="rowValue">{{ data.close_number }}</div>
        </div>
        <div class="detailRow">
          <div>{{ $t("comm.c36") }}</div>
          <div class="rowValue">{{ data.close_time }}</div>
        </div>
        <button type="button" class="collapseToggle" @click="data.showMore = false">
          {{ $t("theme.collapse") }}
          <Icon name="solar:alt-arrow-up-bold" size="20" />
        </button>
      </div>

      <button type="button" class="contentBtn mt-2" @click="goDetails">
        {{ $t("comm.c37") }}
      </button>
    </div>
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
  color: currentColor;
}

.trendLine {
  line-height: 1.35;
  word-break: break-word;
}

.trendIcon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: currentColor;
}

.summaryGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.summaryCard {
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.025);
  text-align: center;
}

.summaryLabel {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.summaryValue {
  margin-top: 8px;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.34;
  word-break: break-word;
  overflow-wrap: anywhere;
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
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.collapseToggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  color: var(--brand-primary);
  font-weight: 600;
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

</style>
