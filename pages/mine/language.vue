<script setup lang="ts">
const pub = usePublicStore();
const { locales, setLocale, locale } = useI18n();

onMounted(() => {
  pub.showLoading = false;
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('mine.m21')" />

    <div class="pageWrap px-3 pb-6">
      <div class="sectionCard listCard mt-4">
        <div
          v-for="lang in locales"
          :key="lang.name"
          class="langItem"
          :class="lang.code == locale ? 'isActive' : ''"
          @click="setLocale(lang.code)"
        >
          <div class="langInfo">
            <div class="langName">{{ lang.name }}</div>
            <div class="langCode">{{ lang.code.toUpperCase() }}</div>
          </div>
          <Icon
            :name="lang.code == locale ? 'solar:check-circle-bold' : 'solar:alt-arrow-right-linear'"
            size="18"
            class="langIcon"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pageWrap {
  min-height: calc(100vh - 60px);
}

.heroCard {
  margin-top: 14px;
  padding: 18px;
  border-radius: 24px;
  background: var(--gradient-hero);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
}

.heroTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 800;
}

.heroDesc {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.55;
}

.listCard {
  padding: 12px;
}

.langItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
  cursor: pointer;
}

.langItem + .langItem {
  margin-top: 10px;
}

.langItem.isActive {
  background: rgba(95, 224, 179, 0.12);
  border-color: var(--brand-primary-border);
}

.langName {
  color: var(--text-primary);
  font-weight: 700;
}

.langCode {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.langIcon {
  color: var(--text-secondary);
}

.langItem.isActive .langIcon {
  color: var(--brand-primary);
}
</style>
