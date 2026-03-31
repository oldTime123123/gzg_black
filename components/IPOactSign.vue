<template>
  <div class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-[2px]"  v-if="pub.showIPONoticePop" @click="pub.showIPONoticePop = false">
    <div
      class="flex min-h-screen items-center justify-center px-4 py-8"
      @click.stop
    >
      <div
        class="relative w-full max-w-[380px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,#1a2430_0%,#101720_100%)] shadow-[0_28px_80px_rgba(0,0,0,0.48)]"
      >
        <div class="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,rgba(212,154,58,0.18),transparent_62%)]"></div>
        <div class="border-b border-white/8 px-5 pb-4 pt-5">
          <div class="inline-flex items-center gap-2 rounded-full bg-[#12c37e]/12 px-3 py-2 text-xs font-bold text-[var(--brand-primary)]">
            <Icon name="solar:bell-bing-linear" size="18" />
            <span>{{ t('x.a4') }}</span>
          </div>
          <div class="mt-4 pr-8 text-[24px] font-extrabold leading-[1.25] text-[var(--text-primary)]">
            {{ ipoNoticeData.product?.pro_name }}
          </div>
          <div class="mt-2 text-[13px] text-[var(--text-secondary)]">
            ({{ ipoNoticeData.product?.pro_code }})
          </div>
          <button
            type="button"
            class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-[var(--text-secondary)]"
            @click="pub.showIPONoticePop = false"
          >
            <Icon name="solar:close-circle-linear" size="20" />
          </button>
        </div>

        <div class="space-y-3 px-6 pb-6 pt-5">
          <div class="rounded-[20px] border border-white/8 bg-white/4 p-4">
            <div class="flex items-center justify-between gap-4">
              <span class="text-[13px] text-[var(--text-secondary)]">{{ t('x.a5') }}</span>
              <strong class="text-right text-[18px] font-extrabold leading-none text-[var(--text-primary)]">
                {{ ipoNoticeData.buy_number }}
              </strong>
            </div>
          </div>

          <div class="rounded-[20px] border border-white/8 bg-white/4 p-4">
            <div class="flex items-center justify-between gap-4">
              <span class="text-[13px] text-[var(--text-secondary)]">{{ t('x.a6') }}</span>
              <strong class="text-right text-[18px] font-extrabold leading-none text-[var(--text-primary)]">
                {{ ipoNoticeData.number }}
              </strong>
            </div>
          </div>

          <button type="button" class="contentBtn mt-2 w-full" @click="closePop">
            {{ t('mine.m10') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const pub = usePublicStore();

const ipoNoticeData = computed(() => {
  return pub.ipoNoticeData;
});

const route = useRoute();
const router = useRouter();

const closePop = () => {
  pub.showIPONoticePop = false;

  if (route.fullPath == '/trade/spoRecord' || route.fullPath == '/trade/ipoRecord') {
    window.location.reload();
    return;
  }

  if (ipoNoticeData.value.type < 2) {
    pub.ipoActRecordType = 2;
    router.push('/trade/ipoRecord');
  } else {
    pub.spoActRecordType = 2;
    router.push('/trade/spoRecord');
  }
};
</script>
