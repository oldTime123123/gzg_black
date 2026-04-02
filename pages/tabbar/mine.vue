<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getUserAccountBalance } from '~/api/home/home';
import { getSettingFinanceWay } from '~/api/pay/realse';
import { showToast } from 'vant';

const { t } = useI18n();
const userStore = useUserStore();
const showID = ref(false);
const showPop = ref(false);
const isSticky = ref(false);

const topFixedChange = (val: boolean) => {
  isSticky.value = val;
};

const router = useRouter();
const changePage = (url: string) => {
  router.push(url);
};

const handleLogout = () => {
  showPop.value = true;
};

const confirmClosePositionHandle = () => {
  userStore.logout();
  changePage('/auth/beforeLogin');
};

const rechargeTypeStatus = ref({
  recharge_type: [] as string[],
  recharge_unavailable_txt: '',
});

type AccountSummary = {
  totalAsset: number;
  balance: number;
  frozenAmount: number;
  profit: number;
};

const account = ref<AccountSummary>({
  totalAsset: 0,
  balance: 0,
  frozenAmount: 0,
  profit: 0,
});

const fetchPageData = () => {
  getUserAccountBalance().then((data: AccountSummary) => {
    account.value = data;
  });
  getSettingFinanceWay().then((res) => {
    rechargeTypeStatus.value = res;
  });
};

const goDeposit = (url: string) => {
  if (rechargeTypeStatus.value.recharge_type.length === 0 && rechargeTypeStatus.value.recharge_unavailable_txt) {
    showToast(rechargeTypeStatus.value.recharge_unavailable_txt);
    return;
  }

  if (
    rechargeTypeStatus.value.recharge_type.length < 2 &&
    Number(rechargeTypeStatus.value.recharge_type[0]) === 18
  ) {
    router.push('/pay/rechargeService');
  } else {
    router.push(url);
  }
};

const formatMoney = (value: number) => {
  return showID.value ? Number(value).toLocaleString('en-US') : '****';
};

const accountFocusStats = computed(() => {
  return [
    { label: t('mine.m15'), value: getCurrency() + formatMoney(account.value.balance), tone: 'default' },
    { label: t('mine.m16'), value: getCurrency() + formatMoney(account.value.frozenAmount), tone: 'default' },
    { label: t('mine.m17'), value: getCurrency() + formatMoney(account.value.profit), tone: 'profit' },
  ];
});

const primaryActions = computed(() => {
  return [
    {
      name: t('mine.m18'),
      icon: 'solar:card-recive-linear',
      onClick: () => goDeposit('/pay/deposit'),
      emphasis: true,
    },
    {
      name: t('mine.m19'),
      icon: 'solar:card-send-linear',
      onClick: () => changePage('/pay/withdraw'),
    },
  ];
});

const groupedActions = computed(() => {
  return [
    {
      title: t('theme.accountActions'),
      items: [
        { name: t('mine.m3'), icon: 'solar:card-2-linear', url: '/setting/bankList' },
        { name: t('mine.m7'), icon: 'solar:bill-list-linear', url: '/record/userBalanceRecord' },
      ],
    },
    {
      title: t('theme.secureAccess'),
      items: [
        { name: t('mine.m4'), icon: 'solar:shield-user-linear', url: '/setting/identify' },
        { name: t('mine.m5'), icon: 'solar:key-linear', url: '/setting/password?type=1' },
        { name: t('mine.m8'), icon: 'solar:lock-password-linear', url: '/setting/password?type=0' },
      ],
    },
    {
      title: t('theme.onlineCustomerService'),
      items: [
        { name: t('mine.m6'), icon: 'solar:headphones-round-sound-linear', url: '/service' },
        { name: t('mine.m21'), icon: 'solar:global-linear', url: '/mine/language' },
      ],
    },
  ];
});

onMounted(() => {
  fetchPageData();
  userStore.flush();
});
</script>

<template>
  <section>
    <ClientOnly>
      <div class="hasNormalBg pageShell min-h-screen">
        <van-sticky offset-top="0" @change="topFixedChange">
          <div
            class="tabbarPageTopNav flex items-center justify-between px-4 py-3"
            :class="isSticky ? 'topStickyEl' : ''"
          >
            <div class="w-10" />
            <div class="flex-1 text-center text-[var(--text-primary)] text-base font-bold tracking-[-0.02em]">
              {{ $t('mine.m13') }}
            </div>
            <div class="flex w-[88px] flex-row-reverse gap-2">
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-interactive-soft)] text-[var(--text-primary)] transition active:scale-[0.98]"
                @click="changePage('/mine/language')"
                :aria-label="$t('comm.c83') || 'Change language'"
              >
                <Icon name="solar:global-linear" size="18" />
              </button>
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-interactive-soft)] text-[var(--text-primary)] transition active:scale-[0.98]"
                @click="changePage('/service')"
                :aria-label="$t('theme.onlineCustomerService')"
              >
                <Icon name="solar:headphones-round-sound-linear" size="18" />
              </button>
            </div>
          </div>
        </van-sticky>

        <div class="px-3 pb-6 pt-3">
          <div class="grid gap-4">
            <section
              class="overflow-hidden rounded-[28px] border border-[color:rgba(125,211,252,0.12)] bg-[image:var(--gradient-hero)] p-4 shadow-soft"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--text-accent)]">
                    {{ $t('theme.idLabel') }}
                  </div>
                  <div class="mt-2 text-xl font-extrabold tracking-[-0.03em] text-[var(--text-primary)]">
                    {{ userStore.data.id }}
                  </div>
                  <div class="mt-1 break-all text-xs text-[var(--text-secondary)]">
                    {{ $t('login.l6') }} {{ userStore.data.phone }}
                  </div>
                </div>
                <button
                  type="button"
                  class="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[color:var(--border-default)] bg-white/10 px-3 text-xs font-semibold text-[var(--text-secondary)] transition active:scale-[0.98]"
                  @click="showID = !showID"
                  :aria-pressed="showID"
                >
                  <Icon :name="!showID ? 'solar:eye-closed-linear' : 'solar:eye-linear'" size="16" />
                  <span>{{ showID ? $t('theme.hideBalance') : $t('theme.showBalance') }}</span>
                </button>
              </div>

              <div class="mt-5">
                <div class="text-[11px] uppercase tracking-[0.1em] text-[rgba(239,246,255,0.72)]">
                  {{ $t('mine.m14') }}
                </div>
                <div class="mt-2 flex items-end gap-2 text-[var(--text-primary)]">
                  <span class="text-2xl font-extrabold leading-none tracking-[-0.04em]">{{ getCurrency() }}</span>
                  <span class="min-w-0 flex-1 break-all text-[32px] font-extrabold leading-none tracking-[-0.05em]">
                    {{ formatMoney(account.totalAsset) }}
                  </span>
                </div>
              </div>

              <div v-if="userStore.data.vip?.name" class="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-[color:rgba(191,219,254,0.2)] bg-white/10 px-3 py-1.5 text-xs font-semibold text-[var(--text-primary)]">
                <img
                  :src="userStore.data.vip?.pic"
                  :alt="userStore.data.vip?.name || 'member badge'"
                  class="h-[18px] w-[18px] rounded-full object-cover"
                  decoding="async"
                >
                <span>{{ userStore.data.vip?.name }}</span>
              </div>

              <div class="mt-5 grid grid-cols-3 gap-2">
                <div
                  v-for="(item, index) in accountFocusStats"
                  :key="index"
                  class="rounded-2xl border border-[color:rgba(191,219,254,0.12)] bg-[rgba(255,255,255,0.08)] px-3 py-3"
                >
                  <div class="text-[11px] leading-4 text-[rgba(239,246,255,0.7)]">
                    {{ item.label }}
                  </div>
                  <div
                    class="mt-2 break-all text-sm font-bold leading-5"
                    :class="item.tone === 'profit' ? 'text-emerald-200' : 'text-[var(--text-primary)]'"
                  >
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </section>

            <section
              class="rounded-[28px] border border-[color:rgba(125,211,252,0.12)] bg-[linear-gradient(180deg,rgba(33,61,92,0.92),rgba(22,42,65,0.9))] p-3.5 shadow-soft"
            >
              <div class="grid grid-cols-2 gap-2.5">
                <button
                  v-for="(item, index) in primaryActions"
                  :key="index"
                  type="button"
                  class="group relative overflow-hidden rounded-[24px] border text-left transition active:scale-[0.985]"
                  :class="item.emphasis
                    ? 'border-[color:rgba(125,211,252,0.22)] bg-[linear-gradient(135deg,rgba(125,211,252,0.22),rgba(56,189,248,0.08)_58%,rgba(16,26,45,0.16))] px-4 py-4'
                    : 'border-[color:rgba(191,219,254,0.12)] bg-white/6 px-4 py-4'"
                  @click="item.onClick"
                >
                  <div
                    v-if="item.emphasis"
                    class="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.3),rgba(125,211,252,0))]"
                  />
                  <div class="relative flex items-center justify-between gap-3">
                    <div class="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:rgba(191,219,254,0.14)] bg-[rgba(125,211,252,0.14)] text-[var(--brand-primary)]">
                      <Icon :name="item.icon" size="22" />
                    </div>
                    <Icon name="solar:alt-arrow-right-linear" size="18" class="text-[var(--text-secondary)]" />
                  </div>
                  <div class="relative mt-5 text-base font-bold tracking-[-0.02em] text-[var(--text-primary)]">
                    {{ item.name }}
                  </div>
                </button>
              </div>
            </section>

            <section
              class="rounded-[28px] border border-[color:rgba(125,211,252,0.12)] bg-[linear-gradient(180deg,rgba(30,54,81,0.9),rgba(22,41,63,0.88))] p-3.5 shadow-soft"
            >
              <div class="space-y-3">
                <div
                  v-for="(group, groupIndex) in groupedActions"
                  :key="groupIndex"
                  class="rounded-[24px] border border-[color:rgba(191,219,254,0.1)] bg-white/5 p-3"
                >
                  <div class="px-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[rgba(226,232,240,0.72)]">
                    {{ group.title }}
                  </div>
                  <div class="mt-3 grid grid-cols-2 gap-2">
                    <button
                      v-for="(item, index) in group.items"
                      :key="index"
                      type="button"
                      class="flex items-center gap-3 rounded-2xl border border-[color:rgba(191,219,254,0.1)] bg-[rgba(255,255,255,0.045)] px-3 py-3 text-left transition active:scale-[0.985]"
                      @click="changePage(item.url)"
                    >
                      <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[color:rgba(191,219,254,0.12)] bg-[rgba(125,211,252,0.12)] text-[var(--brand-primary)]">
                        <Icon :name="item.icon" size="18" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="truncate text-sm font-semibold text-[var(--text-primary)]">
                          {{ item.name }}
                        </div>
                      </div>
                      <Icon name="solar:alt-arrow-right-linear" size="16" class="shrink-0 text-[var(--text-muted)]" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <button
                type="button"
                class="flex w-full items-center justify-center rounded-[24px] border border-[color:rgba(248,113,113,0.18)] bg-[rgba(239,68,68,0.08)] px-4 py-3.5 text-sm font-semibold text-[var(--text-primary)] transition active:scale-[0.985]"
                @click="handleLogout"
              >
                {{ $t('mine.m20') }}
              </button>
            </section>
          </div>
        </div>
      </div>

      <van-overlay :show="showPop" @click="showPop = false" z-index="999">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div
            class="w-full max-w-[350px] rounded-[28px] border border-[color:rgba(125,211,252,0.16)] bg-[var(--surface-modal-panel)] p-4 text-[var(--text-primary)] shadow-float"
            @click.stop
          >
            <div class="pb-1 text-center text-lg font-bold leading-[1.35] text-[var(--text-primary)]">
              {{ $t('mine.m9') }}
            </div>
            <div class="mt-3 rounded-2xl border border-[color:var(--border-soft)] bg-[color:var(--surface-interactive-soft)] p-4">
              <div class="flex items-center justify-center">
                <span class="font-bold">{{ $t('mine.m12') }}</span>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-2">
              <button type="button" class="borderContentBtn" @click="showPop = false">{{ $t('comm.c56') }}</button>
              <button type="button" class="contentBtn" @click="confirmClosePositionHandle">
                {{ $t('comm.c57') }}
              </button>
            </div>
          </div>
        </div>
      </van-overlay>

      <Tabbar />
    </ClientOnly>
  </section>
</template>
