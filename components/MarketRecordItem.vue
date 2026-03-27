<script setup lang="ts">
import { stockCollect } from '~/api/home/home';
import { showToast } from 'vant';
const { t, locale } = useI18n()
const props = defineProps<{
    data: Record<string, any>
}>();
const data = props.data

const collectHandle = () => {
    data.isCollect = !data.isCollect
    stockCollect({
        pid: data.id,
        status: "1"
    }).then(res => {
        showToast(t('comm.c67'))
    })
}

const router = useRouter()
const useSocketStore = socketStore()
const goTrade = item => {
  useSocketStore.currentCoin = item
  router.push('/trade')
}
</script>

<template>
    <div>
        <div class="mb-3 recordItemEl p-3 rounded-[18px]" @click="goTrade(data)">
            <div class="flex items-center text-sm justify-between">
                <div class="flex items-center text-sm">
                    <div class="font-black itemTitle">{{ data.pro_name }}</div>
                    <div class="ml-1 flex items-center" :class="data.is_rise == 2 ? 'colorUp' : 'colorDown'">
                        {{ data.pro_code }}
                        <Icon :name="data.is_rise == 2 ? 'solar:arrow-to-top-left-linear' : 'solar:arrow-to-bottom-right-linear'" class="trendIcon" />
                    </div>

                </div>
                <div>
                    <Icon name="tabler:star-filled" size="20"
                        :class="data.isCollect ? ' text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'" @click.stop="collectHandle" />

                </div>
            </div>

            <div class="mt-3 infoGrid">
                <div class="infoRow">
                    <span>{{$t('comm.c68')}}</span>
                    <span class="valueText">{{ data.price }}</span>
                </div>
                <div class="infoRow">
                    <span>{{$t('comm.c69')}}</span>
                    <span v-if="data.is_rise == 2" class="colorUp">+{{ UseExchangeNumber(data.rise) }}</span>
                    <span v-else class="colorDown">-{{ UseExchangeNumber(data.rise) }}</span>
                </div>
                <div class="infoRow">
                    <span>{{$t('comm.c70')}}</span>
                    <span v-if="data.is_rise == 2" class="colorUp">+{{ data.rise_rate }}%</span>
                    <span v-else class="colorDown">-{{ data.rise_rate }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.recordItemEl {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-soft);
    box-shadow: var(--shadow-card);
    color: var(--text-secondary);
}

.itemTitle {
    color: var(--text-primary);
}

.infoGrid {
    display: grid;
    gap: 8px;
}

.infoRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    font-size: 13px;
}

.valueText {
    color: var(--text-primary);
    font-weight: 700;
}

.trendIcon {
    width: 14px;
    height: 14px;
    margin-left: 6px;
}
</style>
