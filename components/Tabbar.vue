<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const route = useRoute()
const active = ref(0)

const tabs = computed(() => {
    return [
        {
            name: t('comm.c77'),
            path: '/tabbar/home',
            icon: 'solar:home-2-linear',
            activeIcon: 'solar:home-2-bold',
        },
        {
            name: t('comm.c78'),
            path: '/tabbar/market',
            icon: 'solar:chart-2-linear',
            activeIcon: 'solar:chart-2-bold',
        },
        {
            name: t('comm.c79'),
            path: '/tabbar/invest',
            icon: 'solar:wallet-money-linear',
            activeIcon: 'solar:wallet-money-bold',
        },
        {
            name: t('comm.c80'),
            path: '/tabbar/news',
            icon: 'solar:document-text-linear',
            activeIcon: 'solar:document-text-bold',
        },
        {
            name: t('comm.c81'),
            path: '/tabbar/mine',
            icon: 'solar:user-circle-linear',
            activeIcon: 'solar:user-circle-bold',
        }
    ]
})


const onChange = (index) => {
    active.value = index
    router.push(tabs.value[index].path)
}

// 根据当前路由设置激活的标签
const setActiveTab = () => {
    const currentPath = route.path
    const index = tabs.value.findIndex(tab => tab.path === currentPath)
    if (index !== -1) {
        active.value = index
    }
}
// 初始化时设置激活的标签
setActiveTab()

// 监听路由变化
router.afterEach(() => {
    setActiveTab()
})


</script>

<template>
    <div>
        <van-tabbar v-model="active" @change="onChange" class="tabbar" :safe-area-inset-bottom="true">
            <van-tabbar-item :name="0" :index="0">
                <template #icon="props">
                    <div class="tabbar-item-box">
                        <div class="tabbar-icon-shell" :class="props.active ? 'is-active' : ''">
                            <Icon :name="props.active ? tabs[0].activeIcon : tabs[0].icon" class="tabbar-icon" />
                        </div>
                        <div class="f12">{{ tabs[0].name }}</div>
                    </div>
                </template>
            </van-tabbar-item>
            <van-tabbar-item :index="1" :name="1" :dot="false">
                <template #icon="props">
                    <div class="tabbar-item-box">
                        <div class="tabbar-icon-shell" :class="props.active ? 'is-active' : ''">
                            <Icon :name="props.active ? tabs[1].activeIcon : tabs[1].icon" class="tabbar-icon" />
                        </div>
                        <div class="f12">{{ tabs[1].name }}</div>
                    </div>
                </template>
            </van-tabbar-item>
            <van-tabbar-item :index="2" :name="2">
                <template #icon="props">
                    <div class="tabbar-item-box">
                        <div class="tabbar-icon-shell" :class="props.active ? 'is-active' : ''">
                            <Icon :name="props.active ? tabs[2].activeIcon : tabs[2].icon" class="tabbar-icon" />
                        </div>
                        <div class="f12">{{ tabs[2].name }}</div>
                    </div>
                </template>
            </van-tabbar-item>
            <van-tabbar-item :index="3" :name="3">
                <template #icon="props">
                    <div class="tabbar-item-box">
                        <div class="tabbar-icon-shell" :class="props.active ? 'is-active' : ''">
                            <Icon :name="props.active ? tabs[3].activeIcon : tabs[3].icon" class="tabbar-icon" />
                        </div>
                        <div class="f12">{{ tabs[3].name }}</div>
                    </div>
                </template>
            </van-tabbar-item>
            <van-tabbar-item :index="4" :name="4">
                <template #icon="props">
                    <div class="tabbar-item-box">
                        <div class="tabbar-icon-shell" :class="props.active ? 'is-active' : ''">
                            <Icon :name="props.active ? tabs[4].activeIcon : tabs[4].icon" class="tabbar-icon" />
                        </div>
                        <div class="f12">{{ tabs[4].name }}</div>
                    </div>
                </template>
            </van-tabbar-item>
        </van-tabbar>
        <div style="height: 78px;"></div>
    </div>
</template>

<style lang="scss" scoped>
.tabbar {
    bottom: 0 !important;
    max-width: var(--pageWidth);
    width: 100%;
    left: 50%;
    z-index: 100 !important;
    transform: translateX(-50%);
    background: rgba(19, 26, 34, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-bottom: 0;
    backdrop-filter: blur(18px);
    border-radius: 26px 26px 0 0;
    box-shadow: 0 -16px 42px rgba(0, 0, 0, 0.34);
    overflow: hidden;

    :deep(.van-tabbar-item--active) {
        background: transparent;
    }

    :deep(.van-tabbar-item) {
        color: var(--text-muted);
        padding-top: 10px;
    }

    height: 64px;
}

.tabbar-item-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    min-width: 0;
}

.tabbar-icon-shell {
    width: 36px;
    height: 36px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: all 0.2s ease;

    &.is-active {
        background: var(--gradient-brand);
        color: #fff7dc;
        box-shadow: 0 10px 22px rgba(212, 154, 58, 0.22);
    }
}

.tabbar-icon {
    width: 22px;
    height: 22px;
}

.f12 {
    text-align: center;
    font-size: 10px;
    line-height: 1.15;
    color: inherit;
    font-weight: 600;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

:deep(.van-tabbar-item__icon) {
    width: 100%;
}

:deep(.van-tabbar-item) {
    min-width: 0;
}
</style>
