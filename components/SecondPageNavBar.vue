<script lang="ts" setup>
const isFixed = ref(false)
const changeFixedHandle = (e: boolean) => {
    isFixed.value = e
}
const props = defineProps<{
    title: string;
    rightIcon?: string;
    hasNoBg?: boolean;
    rightClickHandle?: () => void
}>()
const router = useRouter()
const changePage = (url: string) => {
    if (url !=='back') {
        router.push(url)
    } else {
        // 方法一的变种：判断 state.back
      if (import.meta.client && globalThis.history?.state?.back) {
        router.back()
      } else {
        // 如果没有上一页，强制跳转到首页（兜底）
        router.replace({ path: '/' })
      }
    }
}

</script>

<template>
    <div>
        <van-sticky offset-top="0" @change="changeFixedHandle">
            <div class="navWrap px-3 py-3 flex justify-between items-center colorfff "
                :class="isFixed || !props.hasNoBg ?'navSolid':''">
                <div class="w-[40px] flex items-center">
                    <button type="button" class="navAction" @click="changePage('back')" :aria-label="$t('comm.c58') || 'Go back'">
                        <Icon name="solar:alt-arrow-left-linear" size="20" />
                    </button>
                </div>
                <div class="flex-1 text-center truncate navTitleWrap">
                    <div class="text-xl font-bold truncate navTitle">
                        {{ props.title }}
                    </div>
                </div>
                <div class="w-[40px] flex flex-row-reverse cursor-pointer ">
                  <slot></slot>
                    <button type="button" v-if="props.rightIcon"
                        class="navAction"
                        @click="props.rightClickHandle"
                        :aria-label="$t('comm.c84') || 'Secondary action'">
                        <span class="navActionImageWrap">
                          <img :src="props.rightIcon" alt="" class="navActionImage" decoding="async" width="20" height="20" />
                        </span>
                    </button>
                </div>
            </div>
        </van-sticky>


    </div>
</template>


<style lang="less" scoped>
.navWrap {
    position: relative;
    width: 100%;
    z-index: 30;
}

.navSolid {
    background: rgba(22, 42, 64, 0.9);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border-soft);
    box-shadow: 0 10px 24px rgba(4, 12, 24, 0.14);
}

.navAction {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--border-soft);
    color: var(--text-primary);
    appearance: none;
    transition:
        transform var(--motion-fast) ease,
        background-color var(--motion-fast) ease,
        border-color var(--motion-fast) ease;
}

.navAction:active {
    transform: translateY(1px) scale(0.985);
}

.navAction:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(56, 189, 248, 0.18);
}

.navActionImageWrap {
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.14), rgba(37, 99, 235, 0.08));
}

.navActionImage {
    width: 18px;
    height: 18px;
    object-fit: contain;
    filter: grayscale(1) brightness(1.8) hue-rotate(170deg);
}

.navTitleWrap {
    display: grid;
    gap: 3px;
}

.navEyebrow {
    color: var(--brand-primary);
    font-size: var(--text-caption);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-eyebrow);
    text-transform: uppercase;
    line-height: 1;
}

.navTitle {
    color: var(--text-primary);
    font-family: var(--font-family-display);
    font-size: var(--text-title);
    font-weight: var(--weight-bold);
    line-height: 1.2;
    letter-spacing: var(--tracking-dense);
}
</style>
