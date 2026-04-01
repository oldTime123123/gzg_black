<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { watch } from 'vue'

const router = useRouter()
const route = useRoute()
const active = ref(0)
const { t } = useI18n()

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
      icon: 'solar:chart-square-linear',
      activeIcon: 'solar:chart-square-bold',
    },
    {
      name: t('comm.c79'),
      path: '/tabbar/invest',
      icon: 'solar:case-round-linear',
      activeIcon: 'solar:case-round-bold',
    },
    {
      name: t('comm.c80'),
      path: '/tabbar/news',
      icon: 'solar:clipboard-text-linear',
      activeIcon: 'solar:clipboard-text-bold',
    },
    {
      name: t('comm.c81'),
      path: '/tabbar/mine',
      icon: 'solar:user-circle-linear',
      activeIcon: 'solar:user-circle-bold',
    }
  ]
})

const onChange = (index: number) => {
  active.value = index
  router.push(tabs.value[index].path)
}

const setActiveTab = () => {
  const currentPath = route.path
  const index = tabs.value.findIndex(tab => tab.path === currentPath)
  if (index !== -1) {
    active.value = index
  }
}

watch(() => route.path, () => {
  setActiveTab()
}, { immediate: true })
</script>

<template>
  <div class="tabbarWrap">
    <van-tabbar v-model="active" @change="onChange" class="tabbar" :safe-area-inset-bottom="true">
      <van-tabbar-item v-for="(tab, index) in tabs" :key="tab.path" :name="index" :index="index">
        <template #icon="props">
          <div class="tabbar-item-box" :class="props.active ? 'is-active' : ''">
            <div class="tabbar-icon-shell">
              <Icon :name="props.active ? tab.activeIcon : tab.icon" class="tabbar-icon" />
            </div>
            <div class="tabbar-label">{{ tab.name }}</div>
          </div>
        </template>
      </van-tabbar-item>
    </van-tabbar>
    <div class="tabbarSpacer"></div>
  </div>
</template>

<style lang="scss" scoped>
.tabbarWrap {
  position: relative;
}

.tabbar {
  bottom: calc(env(safe-area-inset-bottom, 0px) + 10px) !important;
  left: 50%;
  z-index: 110 !important;
  width: calc(100% - 20px);
  max-width: calc(var(--pageWidth) - 20px);
  height: 74px;
  transform: translateX(-50%);
  padding: 8px 10px;
  border: 1px solid rgba(125, 211, 252, 0.18);
  border-radius: 30px;
  background:
    linear-gradient(180deg, rgba(8, 20, 36, 0.94), rgba(7, 16, 29, 0.98)),
    rgba(10, 20, 34, 0.92);
  box-shadow:
    0 18px 44px rgba(2, 8, 20, 0.48),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  overflow: hidden;

  :deep(.van-tabbar-item) {
    min-width: 0;
    padding-top: 0;
    background: transparent;
    color: var(--text-muted);
  }

  :deep(.van-tabbar-item--active) {
    background: transparent;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at top center, rgba(56, 189, 248, 0.16), transparent 44%);
    pointer-events: none;
  }
}

.tabbar-item-box {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 3px;
  width: 100%;
  min-width: 0;
  padding: 2px 0;
}

.tabbar-icon-shell {
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(148, 163, 184, 0.08);
  transition:
    transform var(--motion-fast) var(--ease-out-quart),
    background-color var(--motion-fast) var(--ease-out-quart),
    color var(--motion-fast) var(--ease-out-quart),
    border-color var(--motion-fast) var(--ease-out-quart),
    box-shadow var(--motion-fast) var(--ease-out-quart);
}

.tabbar-label {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  font-size: 11px;
  line-height: 1.2;
  font-weight: var(--weight-semibold);
  letter-spacing: 0.01em;
  color: var(--text-muted);
  transition: color var(--motion-fast) var(--ease-out-quart);
}

.is-active {
  .tabbar-label {
    color: var(--text-primary);
  }

  .tabbar-icon-shell {
    color: #ecfeff;
    border-color: rgba(56, 189, 248, 0.24);
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.9), rgba(37, 99, 235, 0.96));
    box-shadow:
      0 12px 24px rgba(14, 165, 233, 0.24),
      inset 0 1px 0 rgba(255, 255, 255, 0.22);
  }
}

.tabbar-icon {
  width: 22px;
  height: 22px;
}

.tabbarSpacer {
  height: 98px;
}

:deep(.van-tabbar-item__icon) {
  width: 100%;
  margin-bottom: 0;
}
</style>
