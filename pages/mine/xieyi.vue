<script setup lang="ts">
import { getUserAgreement } from '~/api/home/home';

const pdfUrl = ref('');

const getData = () => {
  getUserAgreement().then(async (res) => {
    pdfUrl.value = res.agreement;
  });
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('x.a12')" />

    <div class="pageWrap px-3 pb-6">
      <div class="heroCard">
        <div class="sectionSubtext">{{ $t('theme.agreement') }}</div>
        <div class="heroDesc">{{ $t('theme.agreementCopy') }}</div>
      </div>

      <div class="pdfCard mt-4">
        <ClientOnly>
          <div class="pdfViewport">
            <VuePdfApp :pdf="pdfUrl" theme="light" style="height: 75vh;" />
          </div>
        </ClientOnly>
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

.pdfCard {
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
  background:
    radial-gradient(circle at top right, rgba(95, 224, 179, 0.1), transparent 28%),
    linear-gradient(180deg, rgba(24, 33, 43, 0.96), rgba(13, 17, 23, 0.98));
  padding: 14px;
}

.pdfViewport {
  overflow: hidden;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
