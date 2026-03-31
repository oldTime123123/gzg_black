<template>
  <div class="realModal" v-if="showModalPop" @click="pub.show209Modal(false)">
    <div class="realModalCard" @click.stop>
      <button type="button" class="realModalClose" @click="pub.show209Modal(false)">
        <Icon name="solar:close-circle-linear" size="20" />
      </button>

      <div class="realModalBadge">
        <Icon name="solar:shield-user-linear" size="18" />
        <span>{{ t('setting.s35') }}</span>
      </div>

      <div class="realModalTitle">{{ t('trade.t59') }}</div>
      <div class="realModalDesc">
        {{ t('x.a1') }}
      </div>

      <div class="realModalActions">
        <div class="borderContentBtn" @click="closePop(1)">
          {{ t('mine.m11') }}
        </div>
        <div class="contentBtn" @click="closePop(2)">
          {{ t('mine.m10') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const pub = usePublicStore()
const { t } = useI18n();
const router = useRouter()
const showModalPop = computed({
    get: () => pub.show209PopFlag,
});
const closePop = (type: number) => {
    pub.show209Modal(false)
    if (type > 1) {
        router.push('/setting/identify')
    }
}
</script>

<style scoped>
.realModal {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(4, 7, 12, 0.72);
  backdrop-filter: blur(8px);
}

.realModalCard {
  position: relative;
  width: min(360px, 100%);
  padding: 24px 20px 20px;
  border-radius: 28px;
  overflow: hidden;
  background:
    radial-gradient(circle at top left, rgba(212, 154, 58, 0.16), transparent 28%),
    radial-gradient(circle at top right, rgba(103, 183, 255, 0.14), transparent 24%),
    linear-gradient(180deg, #18212b 0%, #101721 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
}

.realModalClose {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
}

.realModalBadge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
}

.realModalTitle {
  margin-top: 18px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.2;
}

.realModalDesc {
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.7;
}

.realModalActions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}
</style>
