<script setup lang="ts">
import { defineProps } from 'vue';
import { stockCollect } from '~/api/home/home';

import { showToast } from 'vant';
const { t } = useI18n()

const props = defineProps<{
    data: {
        pid: number | string;
        isCollect?: boolean;
        stock: {
            code: string;
            name: string;
            price: number | string;
            rise: number | string;
            rise_rate: number | string;
            is_rise: number;
            [key: string]: unknown;
        };
    }
}>();
const data = props.data
const emit = defineEmits()
const collectHandle = () => {

    data.isCollect = !data.isCollect
    stockCollect({
        pid: data.pid,
        status:2
    }).then(res => {
        showToast(t('xx.a2'))
        emit('deleteStock', data)
    })
}

const router = useRouter()
const useSocketStore = socketStore()
const goTrade = (item: typeof data) => {
  useSocketStore.currentCoin = {
    ...item.stock,
    id: item.pid,
    pro_code: item.stock.code,
    pro_name: item.stock.name,
  }
  router.push('/trade')
}
</script>


<template>
    <div class="collectStockItemEl cursor-pointer p-[18px] rounded-[22px]" role="button" tabindex="0" @click="goTrade(data)"
        @keydown.enter.prevent="goTrade(data)" @keydown.space.prevent="goTrade(data)">
        <div class="headerRow">
            <div class="titleWrap">
                <div class="itemTitle">{{ data.stock.name }}</div>
                <div class="codeBadge">{{ data.stock.code }}</div>
            </div>
            <button class="bookmarkBtn" type="button" @click.stop="collectHandle">
                <Icon name="tabler:star-filled" size="18" class="text-[var(--brand-primary)]" />
            </button>
        </div>
        <div class="quoteSummary" :class="data.stock.is_rise == 2 ? 'colorUp' : 'colorDown'">
            <div class="quoteMain">
                <span class="priceValue">{{ data.stock.price }}</span>
                <Icon :name="data.stock.is_rise == 2 ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'"
                    class="trendIcon" />
            </div>
            <div v-if="data.stock.is_rise == 2" class="quoteMeta colorUp2">
                +{{ UseExchangeNumber(data.stock.rise) }}(+{{ UseExchangeNumber(data.stock.rise_rate) }}%)
            </div>
            <div v-else class="quoteMeta colorDown2">
                <span>-{{ UseExchangeNumber(data.stock.rise) }}(-{{ UseExchangeNumber(data.stock.rise_rate) }}%)</span>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.collectStockItemEl {
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid var(--border-soft);
    min-height: 224px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 18px;
    transition:
        transform var(--motion-fast),
        border-color var(--motion-fast),
        background-color var(--motion-fast);

    .headerRow {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
    }

    .titleWrap {
        min-width: 0;
        flex: 1;
    }

    .itemTitle {
        color: var(--text-primary);
        font-weight: 700;
        font-size: 16px;
        line-height: 1.45;
        min-height: 72px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-word;
    }

    .codeBadge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 24px;
        margin-top: 10px;
        padding: 0 11px;
        border-radius: 999px;
        background: var(--brand-primary-soft);
        color: var(--brand-primary);
        font-size: 12px;
        font-weight: 700;
    }

    .bookmarkBtn {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.035);
        flex-shrink: 0;
        border: 1px solid rgba(255, 255, 255, 0.06);
        transition:
            transform var(--motion-fast),
            border-color var(--motion-fast),
            background-color var(--motion-fast);
    }

    .quoteSummary {
        margin-top: auto;
        display: grid;
        gap: 8px;
        padding-top: 14px;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
    }

    .quoteMain {
        display: inline-flex;
        align-items: flex-start;
        gap: 8px;
        min-width: 0;
    }

    .priceValue {
        color: currentColor;
        font-size: 24px;
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.02em;
        word-break: break-word;
    }

    .quoteMeta {
        justify-self: start;
        width: max-content;
        max-width: 100%;
        font-size: 13px;
        line-height: 1.4;
        font-weight: 700;
        word-break: break-word;
        text-align: left;
    }

    .colorUp2 {
        background: rgba(240, 68, 82, 0.12);
        color: var(--color-up);
        border-radius: 999px;
        padding: 6px 10px;
    }

    .colorDown2 {
        background: rgba(24, 195, 126, 0.12);
        color: var(--color-down);
        border-radius: 999px;
        padding: 6px 10px;
    }

    .trendIcon {
        width: 16px;
        height: 16px;
        color: currentColor;
        flex-shrink: 0;
        opacity: 1;
        transform: translateY(-1px);
    }
}

.collectStockItemEl:hover {
    background: rgba(255, 255, 255, 0.035);
    border-color: rgba(56, 189, 248, 0.18);
}

.collectStockItemEl:active,
.collectStockItemEl .bookmarkBtn:active {
    transform: scale(0.98);
}
</style>
