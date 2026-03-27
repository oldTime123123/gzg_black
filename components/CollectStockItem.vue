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
    <div class="collectStockItemEl cursor-pointer p-3 rounded-[18px]" @click="goTrade(data)" >
        <div class="flex justify-between ">
            <div class="grow text-sm">
                <div class="itemTitle h-[40px]">{{ data.stock.name }}</div>
                <div class="colorSecond">{{ data.stock.code }}</div>
            </div>
            <div>
                <Icon name="tabler:star-filled" size="20" class="text-[var(--brand-primary)]" @click.stop="collectHandle" />
            </div>
        </div>
        <div class="mt-3 priceBox rounded-[14px] p-2 text-center">
            <div class="text-lg font-bold  flex items-center" :class="data.stock.is_rise == 2 ? 'colorUp' : 'colorDown'">
                {{ data.stock.price }}
                <Icon :name="data.stock.is_rise == 2 ? 'solar:arrow-to-top-left-linear' : 'solar:arrow-to-down-left-linear'" class="trendIcon" />
            </div>
            <div v-if="data.stock.is_rise == 2" class="text-sm mt-1 rounded-md colorUp2">
                +{{ UseExchangeNumber(data.stock.rise) }}(+{{ UseExchangeNumber(data.stock.rise_rate) }}%)
            </div>
            <div v-else class="text-sm mt-1 rounded-md colorDown2">
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

    .itemTitle {
        color: var(--text-primary);
        font-weight: 700;
    }

    .priceBox {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border-soft);
    }

    .colorUp2 {
        background: rgba(240, 68, 82, 0.12);
        color: var(--color-up);
        border-radius: 999px;
        padding: 4px 8px;
    }

    .colorDown2 {
        background: rgba(24, 195, 126, 0.12);
        color: var(--color-down);
        border-radius: 999px;
        padding: 4px 8px;
    }

    .trendIcon {
        width: 14px;
        height: 14px;
        margin-left: 6px;
        vertical-align: -2px;
    }
}
</style>
