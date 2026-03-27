<script lang="ts" setup>
const isSticky = ref(false);
const topFixedChange = (val: boolean) => {
    isSticky.value = val
};

const router = useRouter()
const changePage = (url: any) => {
    router.push(url)
}
</script>

<template>
    <div>
        <van-sticky offset-top="0" @change="topFixedChange">
            <div class="px-3 py-3 tabbarPageTopNav " :class="isSticky ? 'topStickyEl' : ''">
                <div class="searchBox pr-4 rounded-3xl flex items-center cursor-zoom-in" @click="changePage('/search')">
                    <div class="leftBoxEl flex items-center justify-center">
                        <div class="iconFrame iconFrame--small">
                            <Icon name="solar:magnifer-linear" size="18" />
                        </div>
                    </div>
                    <div class="flex-1 text-sm searchPlaceholder">
                        {{ $t('comm.c82') }}
                    </div>
                    <Icon name="solar:arrow-right-linear" size="18" class="searchTail" />
                </div>
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
    min-height: 54px;
    width: 100%;
    max-width: 100%;
    padding-left: 10px;
    padding-right: 12px;
    background: rgba(19, 26, 34, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 16px 34px rgba(0, 0, 0, 0.22);
    backdrop-filter: blur(18px);
    box-sizing: border-box;

    justify-content: space-between;
    gap: 10px;

    .leftBoxEl {
        height: 35px;
        width: 44px;
        flex-shrink: 0;
    }
}

.searchPlaceholder {
    color: var(--text-secondary);
    flex: 1;
    font-size: 13px;
    line-height: 1.3;
    overflow: visible;
    text-overflow: clip;
    white-space: nowrap;
}

.searchTail {
    color: var(--text-muted);
    flex-shrink: 0;
    margin-left: 8px;
}
</style>
