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

    <div class="pageWrap">
      <ClientOnly>
        <div class="pdfShell">
          <VuePdfApp class="pdfApp" :pdf="pdfUrl" theme="light" style="height: 100%;" />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.pageWrap {
  height: calc(100vh - 60px);
  overflow: hidden;
}

.pdfShell {
  height: 100%;
  background: linear-gradient(180deg, rgba(44, 75, 108, 0.96), rgba(29, 53, 79, 0.94));
}

.pdfShell :deep(.pdf-app) {
  height: 100%;
}

.pdfShell :deep(#outerContainer) {
  border: 0;
}

.pdfShell :deep(#viewerContainer) {
  inset: 32px 0 0;
}
</style>
