<script lang="ts" setup>

const isFixed = ref(false)
const changeFixedHandle = (e) => {
    isFixed.value = e
}
const props = defineProps<{
    title: String;
    rightIcon?: string;
    hasNoBg?: boolean;
    rightClickHandle?:Function
}>()
const router = useRouter()
const route = useRoute()
const changePage = (url: any) => {
    if (url !=='back') {
        router.push(url)
    } else {
        // 方法一的变种：判断 state.back
      if (window.history.state.back) {
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
                    <div class="navAction cursor-pointer" @click="changePage('back')">
                        <Icon name="solar:alt-arrow-left-linear" size="20" />
                    </div>
                </div>
                <div class="flex-1 text-center text-xl font-bold truncate navTitle">
                    {{ props.title }}
                </div>
                <div class="w-[40px] flex flex-row-reverse cursor-pointer ">
                  <slot></slot>
                    <div v-if="props.rightIcon"
                        class="navAction"
                        @click="props.rightClickHandle">
                        <img :src="props.rightIcon" class="w-5 h-5" />
                    </div>
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
    background: rgba(13, 17, 23, 0.88);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border-soft);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
}

.navAction {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-soft);
    color: var(--text-primary);
}

.navTitle {
    color: var(--text-primary);
    letter-spacing: 0.02em;
}
</style>
