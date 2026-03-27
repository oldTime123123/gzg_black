<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
    data: Record<string, any>
}>();
const data = props.data;

const isRiseText: any = {
    1: '-',
    2: '+',
}
const isRiseClass: any = {
    1: 'colorDown',
    2: 'colorUp',
}


</script>

<template>
    <!-- Type 1 -->
    <div class="recordItemEl mb-3 rounded-[20px] overflow-hidden">
        <div class="cardHeader px-3 py-3">
            <div class="titleBlock flex flex-col">
                <span class="titleText text-sm">{{ data.product.pro_name }}</span>
                <div class="flex">
                    <div
                        class="codeBadge mt-1 text-center px-2 h-[20px] leading-[20px] text-xs">
                        {{ data.product.pro_code }}
                    </div>
                </div>
            </div>
            <div class="quoteStrip" :class="getBlockBgClass(true, data.product.is_rise)">
                <div class="quoteMain">
                    <div class="quoteLabel">{{ $t('comm.c41') }}</div>
                    <div class="quotePriceRow" :class="data.product?.is_rise > 1 ? 'colorDown' : 'colorUp'">
                        <div class="valueText">
                            {{ UseExchangeNumber(data.product.price) }}
                        </div>
                        <Icon :name="data.product?.is_rise > 1 ? 'solar:arrow-to-top-left-linear' : 'solar:arrow-to-down-left-linear'" class="trendIcon" />
                    </div>
                </div>
                <div class="quoteDelta text-[11px]">
                    <div class="trendLine">
                        {{
                        getNumberType(true, data.product?.is_rise)
                        +
                        UseExchangeNumber(data.product?.rise)
                        }}
                    </div>
                    <div class="trendLine">
                        ({{
                        getNumberType(true, data.product?.is_rise) +
                        data.product?.rise_rate
                        }}%)
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3 px-3 pb-3 text-sm">

            <div class="detailRow mb-2">
                <div>{{ $t('comm.c61') }}</div>
                <div class="rowValue">{{ data.number }}</div>
            </div>
            <div class="detailRow mb-2">
                <div>{{ $t('comm.c62') }}</div>
                <div class="rowValue">{{ UseExchangeNumber(data.limit_price * data.number) }}</div>
            </div>
            <div class="detailRow mb-2">
                <div>{{ $t('comm.c63') }}</div>
                <div class="rowValue">{{ data.fee }}</div>
            </div>
            <div class="detailRow mb-2">
                <div>{{ $t('comm.c64') }}</div>
                <div class="rowValue">{{ data.create_time }}</div>
            </div>
        </div>

    </div>
</template>

<style lang="less" scoped>
.recordItemEl {
    background: var(--gradient-panel);
    border: 1px solid var(--border-soft);
    box-shadow: var(--shadow-card);
    color: var(--text-secondary);
}

.cardHeader {
    display: grid;
    gap: 12px;
    background: rgba(255, 255, 255, 0.03);
    min-width: 0;
}

.titleBlock {
    flex: 1;
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
    background: rgba(95, 224, 179, 0.12);
    color: var(--brand-primary);
}

.valueText {
    color: currentColor;
    min-width: 0;
    font-size: 20px;
    font-weight: 800;
    line-height: 1.2;
    word-break: break-word;
}

.quotePriceRow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    min-width: 0;
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

.detailRow {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
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

.trendIcon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
}

@media (max-width: 430px) {
    .cardHeader {
        gap: 10px;
    }

    .quoteStrip {
        padding: 12px 14px;
    }

    .valueText {
        font-size: 18px;
    }

    .quoteDelta {
        font-size: 11px;
    }

    .rowValue {
        flex-basis: 44%;
        max-width: 44%;
        font-size: 13px;
    }
}
</style>
