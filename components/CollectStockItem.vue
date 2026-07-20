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
                <Icon name="lucide:star" size="20" class="isCollected text-[var(--brand-primary)]" @click.stop="collectHandle" />
            </div>
        </div>
        <div class="mt-3 priceBox" :class="data.stock.is_rise == 2 ? 'colorUp' : 'colorDown'">
            <div class="priceTop">
                <span class="priceValue">{{ data.stock.price }}</span>
            </div>
            <div class="priceMeta">
              <div class="priceDelta">
                <Icon :name="data.stock.is_rise == 2 ? 'lucide:arrow-up-right' : 'lucide:arrow-down-right'" class="trendIcon" />
                <span v-if="data.stock.is_rise == 2">+{{ UseExchangeNumber(data.stock.rise) }}</span>
                <span v-else>-{{ UseExchangeNumber(data.stock.rise) }}</span>
              </div>
              <div class="rateBadge">
                <span v-if="data.stock.is_rise == 2">+{{ UseExchangeNumber(data.stock.rise_rate) }}%</span>
                <span v-else>-{{ UseExchangeNumber(data.stock.rise_rate) }}%</span>
              </div>
            </div>

        </div>
    </div>
</template>

<style lang="less" scoped>
.collectStockItemEl {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-soft);
    box-shadow: var(--shadow-card);
    min-height: 136px;
    display: grid;
    gap: 12px;

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
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-word;
    }

    .priceBox {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
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
        font-size: clamp(20px, 6.2vw, 24px);
        font-weight: 800;
        line-height: 1.1;
        white-space: nowrap;
        word-break: normal;
        font-variant-numeric: tabular-nums;
    }

    .priceMeta {
        display: grid;
        justify-items: end;
        gap: 5px;
        font-size: 12px;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }

    .priceDelta {
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        gap: 4px;
    }

    .rateBadge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 26px;
        border-radius: 999px;
        padding: 0 9px;
        background: rgba(255, 255, 255, 0.045);
    }

    .trendIcon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
        color: currentColor;
    }

    .isCollected {
        fill: currentColor;
    }
}

@media (max-width: 359px) {
    .collectStockItemEl {
        padding: 12px !important;
    }

    .priceBox {
        gap: 8px !important;
    }

    .priceMeta {
        font-size: 11px !important;
    }
}
</style>
