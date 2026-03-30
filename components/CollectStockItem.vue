<script setup lang="ts">
import { defineProps } from 'vue';
import { stockCollect } from '~/api/home/home';

import { showToast } from 'vant';
const { t } = useI18n()

const props = defineProps<{
    data: Record<string, any>
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
const goTrade = data => {
  useSocketStore.currentCoin = {
    ...data.stock,
    id: data.pid,
    pro_code:data.stock.code,
    pro_name:data.stock.name,
  }
  router.push('/trade')
}
</script>


<template>
    <div class="collectStockItemEl cursor-pointer p-4 rounded-[20px]" @click="goTrade(data)" >
        <div class="headerRow">
            <div class="grow text-sm min-w-0">
                <div class="itemTitle">{{ data.stock.name }}</div>
                <div class="codeBadge">{{ data.stock.code }}</div>
            </div>
            <div>
                <Icon name="tabler:star-filled" size="20" class="text-[var(--brand-primary)]" @click.stop="collectHandle" />
            </div>
        </div>
        <div class="mt-3 priceBox">
            <div class="priceTop" :class="data.stock.is_rise == 2 ? 'colorUp' : 'colorDown'">
                <span class="priceValue">{{ data.stock.price }}</span>
                <Icon :name="data.stock.is_rise == 2 ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'" class="trendIcon" />
            </div>
            <div v-if="data.stock.is_rise == 2" class="priceDelta colorUp2">
                +{{ UseExchangeNumber(data.stock.rise) }}(+{{ UseExchangeNumber(data.stock.rise_rate) }}%)
            </div>
            <div v-else class="priceDelta colorDown2">
                <span>-{{ UseExchangeNumber(data.stock.rise) }}(-{{ UseExchangeNumber(data.stock.rise_rate) }}%)</span>
            </div>

        </div>
    </div>
</template>

<style lang="less" scoped>
.collectStockItemEl {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-soft);
    box-shadow: var(--shadow-card);
    min-height: 214px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;

    .headerRow {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
    }

    .itemTitle {
        color: var(--text-primary);
        font-weight: 700;
        font-size: 15px;
        line-height: 1.5;
        min-height: 68px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-word;
    }

    .priceBox {
        display: grid;
        gap: 10px;
        padding-top: 14px;
        border-top: 1px solid var(--border-soft);
    }

    .codeBadge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 24px;
        margin-top: 8px;
        padding: 0 10px;
        border-radius: 999px;
        background: var(--brand-primary-soft);
        color: var(--brand-primary);
        font-size: 12px;
        font-weight: 700;
        width: max-content;
        max-width: 100%;
    }

    .priceTop {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
    }

    .priceValue {
        color: currentColor;
        min-width: 0;
        font-size: 24px;
        font-weight: 800;
        line-height: 1.1;
        word-break: break-word;
    }

    .priceDelta {
        justify-self: start;
        width: max-content;
        max-width: 100%;
        font-size: 12px;
        line-height: 1.35;
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
        flex-shrink: 0;
        color: currentColor;
    }
}
</style>
