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

const myItemList = computed(() => {
  return [
    {
      name: t('mine.m3'),
      icon: 'solar:card-2-linear',
      url: '/setting/bankList',
    },
    {
      name: t('mine.m4'),
      icon: 'solar:shield-user-linear',
      url: '/setting/identify',
    },
    {
      name: t('mine.m5'),
      icon: 'solar:key-linear',
      url: '/setting/password?type=1',
    },
    {
      name: t('mine.m6'),
      icon: 'solar:headphones-round-sound-linear',
      url: '/service',
    },
    {
      name: t('mine.m7'),
      icon: 'solar:bill-list-linear',
      url: '/record/userBalanceRecord',
    },
    {
      name: t('mine.m8'),
      icon: 'solar:lock-password-linear',
      url: '/setting/password?type=0',
    },
  ];
});

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

  if (rechargeTypeStatus.value.recharge_type.length === 0 && rechargeTypeStatus.value.recharge_unavailable_txt ) {
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

const fundStats = computed(() => {
  return [
    {
      label: t('mine.m14'),
      value: getCurrency() + formatMoney(account.value.totalAsset),
      tone: 'primary',
    },
    {
      label: t('mine.m15'),
      value: getCurrency() + formatMoney(account.value.balance),
      tone: 'default',
    },
    {
      label: t('mine.m16'),
      value: getCurrency() + formatMoney(account.value.frozenAmount),
      tone: 'default',
    },
    {
      label: t('mine.m17'),
      value: getCurrency() + formatMoney(account.value.profit),
      tone: 'profit',
    },
  ];
});

const accountFocusStats = computed(() => fundStats.value.slice(1));

onMounted(() => {
  fetchPageData();
  userStore.flush();
});
</script>

<template>
  <section>
    <ClientOnly>
      <div class="hasNormalBg minePage pageShell">
        <van-sticky offset-top="0" @change="topFixedChange">
          <div class="pageTopBar px-4 py-3 tabbarPageTopNav flex justify-between items-center"
            :class="isSticky ? 'topStickyEl' : ''">
            <div class="w-[40px]"></div>
            <div class="flex-1 text-center colorfff pageTitle">
              {{ $t('mine.m13') }}
            </div>
            <div class="w-[88px] flex flex-row-reverse gap-2">
              <button type="button" class="topAction" @click="changePage('/mine/language')" :aria-label="$t('comm.c83') || 'Change language'">
                <Icon name="solar:global-linear" size="18" />
              </button>
              <button type="button" class="topAction" @click="changePage('/service')" :aria-label="$t('theme.onlineCustomerService')">
                <Icon name="solar:headphones-round-sound-linear" size="18" />
              </button>
            </div>
          </div>
        </van-sticky>

        <div class="pageContainer px-3 pt-3 pb-6">
          <div class="grid gap-3.5 rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(212,154,58,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] px-[18px] pb-[18px] pt-[22px]">

            <div class="flex w-full min-w-0 items-center gap-2">

              <div
                class=" min-w-0 flex-1 items-center gap-2 text-[12px] leading-[1.35] text-[var(--text-primary)] opacity-70">
                <div class="shrink-0">{{ $t('theme.idLabel') }} {{ userStore.data.id }}</div>
                <div class="min-w-0 truncate">{{ $t('login.l6') }} {{ userStore.data.phone }}</div>
              </div>
  <button type="button"
                class="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-[radial-gradient(circle_at_left_center,rgba(212,154,58,0.08),transparent_36%),rgba(255,255,255,0.03)] px-2.5 py-1.5 text-[12px] leading-[1.2] text-[var(--text-secondary)] transition-[transform,border-color,background-color] duration-200 ease-out"
                @click="showID = !showID" :aria-pressed="showID">
                <Icon :name="showID ? 'solar:eye-closed-linear' : 'solar:eye-linear'" size="16" />
                <span>{{ showID ? $t('theme.hideBalance') : $t('theme.showBalance') }}</span>
              </button>
            </div>
            <div>
              <div class="text-[12px] uppercase tracking-[0.06em] leading-[1.4] text-[var(--text-muted)]">{{
                $t('mine.m14') }}</div>
            </div>
            <div class="w-full">
              <div class="flex w-full items-end gap-2">
                <span class="shrink-0 text-[26px] font-extrabold leading-[0.96] tracking-[-0.025em] text-[var(--text-primary)]">{{ getCurrency() }}</span>
                <span class="min-w-0 flex-1 break-words text-[26px] font-extrabold leading-[0.92] tracking-[-0.03em] text-[var(--text-primary)] [overflow-wrap:anywhere]">{{ formatMoney(account.totalAsset) }}</span>
              </div>
            </div>
            <div v-if="userStore.data.vip?.name"
              class="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-[radial-gradient(circle_at_left_center,rgba(212,154,58,0.1),transparent_34%),rgba(255,255,255,0.03)] px-2.5 py-1.5 text-[12px] leading-[1.2] text-[var(--text-primary)]">
              <img :src="userStore.data.vip?.pic" :alt="userStore.data.vip?.name || 'member badge'"
                class="h-4 w-4 shrink-0 rounded-full object-cover" decoding="async">
              <span>{{ userStore.data.vip?.name }}</span>
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <div
                v-for="(item, index) in accountFocusStats"
                :key="index"
                class="rounded-2xl border border-white/10"
                :class="index === 0
                  ? 'col-span-2 border-[rgba(212,154,58,0.16)] bg-[radial-gradient(circle_at_top_right,rgba(212,154,58,0.12),transparent_30%),rgba(255,255,255,0.035)] p-4'
                  : 'bg-[rgba(255,255,255,0.025)] p-3.5'"
              >
                <div class="text-[12px] leading-[1.4] text-[var(--text-secondary)]">{{ item.label }}</div>
                <div
                  class="mt-2 break-words text-base font-bold leading-[1.35] text-[var(--text-primary)]"
                  :class="item.tone === 'profit' ? '!text-[var(--color-up)]' : ''"
                >
                  {{ item.value }}
                </div>
              </div>
            </div>

          </div>

          <div class="actionCard sectionCard mt-4 p-3">
            <div class="sectionHeading">
              <div>
                <div class="sectionTitle">{{ $t('theme.accountActions') }}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 mt-4">
              <button type="button" class="actionButton actionDeposit" @click="goDeposit('/pay/deposit')">
                <div class="iconFrame">
                  <Icon name="solar:card-recive-linear" size="22" />
                </div>
                <div class="actionCopy">
                  <div class="actionLabel">
                    {{ $t('mine.m18') }}
                  </div>
                </div>
              </button>

              <button type="button" class="actionButton actionWithdraw" @click="changePage('/pay/withdraw')">
                <div class="iconFrame">
                  <Icon name="solar:card-send-linear" size="22" />
                </div>
                <div class="actionCopy">
                  <div class="actionLabel">
                    {{ $t('mine.m19') }}
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div class="menuSection sectionCard mt-4 p-4">
            <div class="sectionHeading">
              <div>
                <div class="sectionTitle">{{ $t('theme.toolsSettings') }}</div>
              </div>
            </div>
            <div class="menuGrid renderBudget mt-4">
              <button type="button" class="menuItem" v-for="(item, index) in myItemList" :key="index" @click="changePage(item.url)">
                <div class="iconFrame">
                  <Icon :name="item.icon" size="20" />
                </div>
                <div class="menuContent">
                  <div class="menuName">{{ item.name }}</div>
                </div>
                <Icon name="solar:alt-arrow-right-linear" size="18" class="menuArrow" />
              </button>
            </div>
          </div>

          <div class="logoutSection mt-6">
            <div class="sectionCard p-3">
              <button type="button" class="contentBtn" @click="handleLogout">
                {{ $t('mine.m20') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <van-overlay :show="showPop" @click="showPop = false" z-index="999">
        <div class="overlayWrap">
          <div class="dialogCard p-4 w-[350px] rounded-3xl" @click.stop>
            <div class="text-center font-bold pb-1 title">
              {{ $t('mine.m9') }}
            </div>
            <div class="dialogBody">
              <div class="flex items-center justify-center">
                <span class="font-bold">{{ $t('mine.m12') }}</span>
              </div>
            </div>

            <div class="dialogActions mt-4 grid grid-cols-2 gap-2">
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

<style lang="less" scoped>
.pageContainer {
  min-height: calc(100vh - 120px);
}

.pageTitle {
  color: var(--text-primary);
  font-weight: 700;
}

.topAction {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
  color: var(--text-primary);
  appearance: none;
  transition:
    transform var(--motion-fast) ease,
    background-color var(--motion-fast) ease,
    border-color var(--motion-fast) ease;
}

.heroEyebrow {
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.actionCard,
.menuSection {
  background: rgba(255, 255, 255, 0.025);
  box-shadow: none;
}

.actionCard {
  padding: 18px 16px !important;
}

.actionButton {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 76px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: left;
  appearance: none;
  transition:
    transform var(--motion-fast) ease,
    border-color var(--motion-fast) ease,
    background-color var(--motion-fast) ease;
}

.actionLabel {
  color: var(--text-primary);
  font-weight: 700;
}

.menuGrid {
  display: grid;
  gap: 12px;
}

.menuItem {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 0 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
  width: 100%;
  text-align: left;
  appearance: none;
  transition:
    transform var(--motion-fast) ease,
    border-color var(--motion-fast) ease,
    background-color var(--motion-fast) ease;
}

.menuContent {
  flex: 1;
  min-width: 0;
}

.menuName {
  color: var(--text-primary);
  font-weight: 600;
  line-height: 1.4;
}

.menuArrow {
  color: var(--text-secondary);
}

.dialogBody {
  margin-top: 12px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.dialogActions {
  margin-top: 16px;
}

.fundTile {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);

  &.primary {
    background: rgba(212, 154, 58, 0.12);
    border-color: var(--brand-primary-border);
  }

  &.profit .fundValue {
    color: var(--color-up);
  }
}

.fundLabel {
  color: var(--text-secondary);
  font-size: 12px;
}

.fundValue {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
}

.visibilityToggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  color: var(--text-secondary);
  font-size: 12px;
}

.actionButton {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  min-height: 70px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.actionDeposit {
  background: rgba(212, 154, 58, 0.12);
}

.actionWithdraw {
  background: rgba(255, 255, 255, 0.025);
}

.actionCard,
.menuSection {
  background: rgba(255, 255, 255, 0.018);
  box-shadow: none;
}

.actionCopy {
  min-width: 0;
}

.actionLabel {
  color: var(--text-primary);
  font-weight: 700;
}

.actionHint {
  display: none;
}

.menuGrid {
  display: grid;
  gap: 12px;
}

.menuItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.018);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.menuContent {
  flex: 1;
  min-width: 0;
}

.menuName {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.menuArrow {
  color: var(--text-muted);
}

.dialogCard {
  background:
    radial-gradient(circle at top right, rgba(212, 154, 58, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(24, 33, 43, 0.98), rgba(13, 17, 23, 0.98));
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
  color: var(--text-primary);
}

.overlayWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
}

.title {
  color: var(--text-primary);
  font-size: 18px;
  line-height: 1.35;
}

.dialogBody {
  margin-top: 18px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
  color: var(--text-secondary);
  text-align: center;
}

.topAction:active,
.visibilityToggle:active,
.actionButton:active,
.menuItem:active {
  transform: translateY(1px) scale(0.995);
}

@media (hover: hover) {
  .topAction:hover,
  .visibilityToggle:hover,
  .actionButton:hover,
  .menuItem:hover {
    border-color: rgba(255, 255, 255, 0.12);
  }
}
</style>
