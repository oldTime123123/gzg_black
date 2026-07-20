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
    <div class="mb-3 recordItemEl p-4 rounded-[22px]" @click="goTrade(data)">
        <div class="headerRow">
            <div class="titleWrap">
                <div class="font-black itemTitle">{{ data.pro_name }}</div>
                <div class="codeBadge">{{ data.pro_code }}</div>
            </div>
            <button class="bookmarkBtn" type="button" @click.stop="collectHandle">
                <Icon name="lucide:star" size="18"
                    :class="data.isCollect ? 'isCollected text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'" />
            </button>
        </div>

        <div class="quoteRow" :class="data.is_rise == 2 ? 'colorUp' : 'colorDown'">
            <div class="quoteMain">
                <div class="valueText">{{ data.price }}</div>
            </div>
            <div class="quoteMeta">
                <div class="deltaText">
                    <Icon :name="data.is_rise == 2 ? 'lucide:arrow-up-right' : 'lucide:arrow-down-right'"
                        class="trendIcon" />
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
    min-height: 136px;
    display: grid;
    gap: 12px;
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
    font-size: 15px;
    line-height: 1.35;
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
    margin-top: 6px;
    padding: 0 11px;
    border-radius: 999px;
    background: var(--brand-primary-soft);
    color: var(--brand-primary);
    font-size: 12px;
    font-weight: 700;
}

.bookmarkBtn {
    width: 34px;
    height: 34px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.03);
    flex-shrink: 0;
}

.isCollected {
    fill: currentColor;
}

.quoteRow {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.quoteMain {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
}

.valueText {
    font-size: clamp(20px, 6.2vw, 24px);
    font-weight: 800;
    color: currentColor;
    line-height: 1;
    letter-spacing: -0.02em;
    white-space: nowrap;
    word-break: normal;
    font-variant-numeric: tabular-nums;
}

.quoteMeta {
    display: grid;
    justify-items: end;
    gap: 5px;
    flex: 0 0 auto;
    text-align: right;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.35;
    white-space: nowrap;
    word-break: normal;
    font-variant-numeric: tabular-nums;
}

.trendIcon {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    color: currentColor;
    opacity: 1;
    transform: translateY(-1px);
}

.deltaText {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;
    white-space: nowrap;
}

.rateBadge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 26px;
    padding: 0 9px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.045);
    color: inherit;
    white-space: nowrap;
}

@media (max-width: 359px) {
    .recordItemEl {
        padding: 12px !important;
    }

    .quoteRow {
        gap: 8px;
    }

    .quoteMeta {
        font-size: 11px;
    }

    .rateBadge {
        padding-inline: 7px;
    }
}
</style>
