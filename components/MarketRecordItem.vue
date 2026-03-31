<script setup lang="ts">
import { stockCollect } from '~/api/home/home';
import { showToast } from 'vant';
const { t, locale } = useI18n()
const props = defineProps<{
    data: {
        id: number | string;
        pro_name: string;
        pro_code: string;
        isCollect: boolean;
        is_rise: number;
        price: number | string;
        rise: number | string;
        rise_rate: number | string;
    }
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
const goTrade = (item: typeof data) => {
  useSocketStore.currentCoin = item
  router.push('/trade')
}
</script>

<template>
    <div class="mb-3 recordItemEl p-4 rounded-[22px]" role="button" tabindex="0" @click="goTrade(data)"
        @keydown.enter.prevent="goTrade(data)" @keydown.space.prevent="goTrade(data)">
        <div class="headerRow">
            <div class="titleWrap">
                <div class="font-black itemTitle">{{ data.pro_name }}</div>
                <div class="codeBadge">{{ data.pro_code }}</div>
            </div>
            <button class="bookmarkBtn" type="button" @click.stop="collectHandle">
                <Icon name="tabler:star-filled" size="18"
                    :class="data.isCollect ? ' text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'" />
            </button>
        </div>

        <div class="quoteRow" :class="data.is_rise == 2 ? 'colorUp' : 'colorDown'">
            <div class="quoteMain">
                <div class="valueText">{{ data.price }}</div>
                <Icon :name="data.is_rise == 2 ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'"
                    class="trendIcon" />
            </div>
            <div class="quoteMeta">
                <div class="deltaText">
                    <span v-if="data.is_rise == 2">+{{ UseExchangeNumber(data.rise) }}</span>
                    <span v-else>-{{ UseExchangeNumber(data.rise) }}</span>
                </div>
                <div class="rateBadge">
                    <span v-if="data.is_rise == 2">+{{ data.rise_rate }}%</span>
                    <span v-else>-{{ data.rise_rate }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.recordItemEl {
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid var(--border-soft);
    color: var(--text-secondary);
    min-height: 152px;
    display: grid;
    gap: 14px;
    cursor: pointer;
    transition:
        transform var(--motion-fast),
        border-color var(--motion-fast),
        background-color var(--motion-fast);
}

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
    font-size: 16px;
    line-height: 1.4;
    min-height: 44px;
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
    margin-top: 8px;
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
    background: rgba(255, 255, 255, 0.03);
    flex-shrink: 0;
    border: 1px solid rgba(255, 255, 255, 0.06);
    transition:
        transform var(--motion-fast),
        border-color var(--motion-fast),
        background-color var(--motion-fast);
}

.quoteRow {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    padding-top: 14px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.valueText {
    font-weight: 800;
    color: currentColor;
    font-size: 24px;
    line-height: 1;
    letter-spacing: -0.02em;
    word-break: break-word;
}

.trendIcon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: currentColor;
    opacity: 1;
    transform: translateY(-1px);
}

.quoteMain {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
}

.quoteMeta {
    display: grid;
    justify-items: end;
    gap: 6px;
    flex: 0 0 auto;
    text-align: right;
    font-size: 13px;
    font-weight: 700;
    line-height: 1.4;
    word-break: break-word;
}

.deltaText {
    white-space: nowrap;
}

.rateBadge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.045);
    color: inherit;
    white-space: nowrap;
}

.recordItemEl:hover {
    background: rgba(255, 255, 255, 0.035);
    border-color: rgba(212, 154, 58, 0.18);
}

.recordItemEl:active,
.bookmarkBtn:active {
    transform: scale(0.98);
}
</style>
