<script lang="ts" setup>
const isSticky = ref(false);
const topFixedChange = (val: boolean) => {
    isSticky.value = val
};

const router = useRouter()
const changePage = (url: string) => {
    router.push(url)
}
</script>

<template>
    <div>
        <van-sticky offset-top="0" @change="topFixedChange">
            <div class="px-3 py-3 tabbarPageTopNav " :class="isSticky ? 'topStickyEl' : ''">
                <button type="button" class="searchBox pr-4 rounded-3xl flex items-center cursor-zoom-in" @click="changePage('/search')" :aria-label="$t('comm.c82')">
                    <div class="leftBoxEl flex items-center justify-center">
                        <div class="iconFrame iconFrame--small">
                            <Icon name="solar:magnifer-linear" size="18" />
                        </div>
                    </div>
                    <div class="searchBody">
                        <div class="searchEyebrow">{{ $t('theme.marketBoardSubtext') }}</div>
                        <div class="flex-1 text-sm searchPlaceholder">
                            {{ $t('comm.c82') }}
                        </div>
                    </div>
                    <Icon name="solar:arrow-right-linear" size="18" class="searchTail" />
                </button>
            </div>
        </van-sticky>
    </div>
</template>


<style lang="less" scoped>
.tabbarPageTopNav {
    width: 100%;
    max-width: var(--pageWidth);
    margin: 0 auto;
    box-sizing: border-box;
    min-height: 78px;
    padding-bottom: 12px;
}

.searchBox {
    appearance: none;
    min-height: 58px;
    width: 100%;
    max-width: 100%;
    padding-left: 10px;
    padding-right: 12px;
    background:
      radial-gradient(circle at left center, rgba(103, 214, 255, 0.18), transparent 32%),
      linear-gradient(180deg, rgba(33, 58, 86, 0.84), rgba(24, 43, 65, 0.78));
    border: 1px solid rgba(125, 211, 252, 0.14);
    box-shadow: 0 12px 26px rgba(5, 12, 22, 0.12);
    backdrop-filter: blur(18px);
    box-sizing: border-box;

    justify-content: space-between;
    gap: 10px;
    text-align: left;
    transition:
      transform var(--motion-fast) ease,
      border-color var(--motion-fast) ease,
      background-color var(--motion-fast) ease,
      box-shadow var(--motion-fast) ease;

    .leftBoxEl {
        height: 35px;
        width: 44px;
        flex-shrink: 0;
    }
}

.searchBox:hover {
    border-color: rgba(103, 214, 255, 0.18);
    background:
      radial-gradient(circle at left center, rgba(103, 214, 255, 0.2), transparent 34%),
      linear-gradient(180deg, rgba(38, 66, 97, 0.88), rgba(28, 50, 74, 0.82));
    box-shadow: 0 14px 28px rgba(6, 16, 30, 0.12);
}

.searchBox:active {
    transform: translateY(1px) scale(0.995);
}

.searchBody {
    display: grid;
    gap: 4px;
    min-width: 0;
    flex: 1;
}

.searchEyebrow {
    color: var(--brand-primary);
    font-size: var(--text-caption);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    line-height: 1;
}

.searchPlaceholder {
    color: var(--text-secondary);
    flex: 1;
    font-size: var(--text-body-compact);
    line-height: 1.45;
    font-weight: var(--weight-medium);
    overflow: visible;
    text-overflow: clip;
    white-space: nowrap;
}

.searchTail {
    color: var(--brand-primary);
    flex-shrink: 0;
    margin-left: 8px;
}
</style>
