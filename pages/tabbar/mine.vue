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
          <div class="accountStage">
            <div class="accountStageTop">
              <div class="accountStageMain">
                <div class="heroEyebrow">{{ $t('theme.portfolioDashboard') }}</div>
                <div class="accountStageValue">{{ getCurrency() + formatMoney(account.totalAsset) }}</div>
                <div class="accountStageCaption">{{ $t('mine.m14') }}</div>
              </div>

              <div class="accountStageSide">
                <div class="memberBadge" v-if="userStore.data.vip?.name">
                  <img :src="userStore.data.vip?.pic" :alt="userStore.data.vip?.name || 'member badge'" class="memberBadgeIcon" decoding="async">
                  <span>{{ userStore.data.vip?.name }}</span>
                </div>
                <button type="button" class="visibilityToggle" @click="showID = !showID" :aria-pressed="showID">
                  <Icon :name="showID ? 'solar:eye-closed-linear' : 'solar:eye-linear'" size="16" />
                  <span>{{ showID ? $t('theme.hideBalance') : $t('theme.showBalance') }}</span>
                </button>
              </div>
            </div>

            <div class="identityRow">
              <div class="identityChip">{{ $t('theme.idLabel') }}:{{ userStore.data.id }}</div>
              <div class="identityChip">{{ $t('login.l6') }}:{{ userStore.data.phone }}</div>
            </div>

            <div class="fundStageGrid">
              <div class="fundTile" v-for="(item, index) in accountFocusStats" :key="index" :class="item.tone">
                <div class="fundLabel">{{ item.label }}</div>
                <div class="fundValue">{{ item.value }}</div>
              </div>
            </div>
          </div>

          <div class="actionCard sectionCard mt-4 p-3">
            <div class="sectionHeading">
              <div>
                <div class="panelEyebrow">{{ $t('theme.quickActions') }}</div>
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
                <div class="panelEyebrow">{{ $t('theme.preferences') }}</div>
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

.accountStage {
  padding: 20px 18px;
  border-radius: 30px;
  background:
    radial-gradient(circle at top right, rgba(212, 154, 58, 0.16), transparent 30%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.018));
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.accountStageTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.accountStageMain {
  min-width: 0;
  flex: 1;
}

.accountStageValue {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 30px;
  line-height: 1.04;
  font-weight: 800;
  letter-spacing: -0.03em;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.accountStageCaption {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
}

.accountStageSide {
  display: grid;
  justify-items: end;
  gap: 10px;
}

.identityRow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.identityChip {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-size: 12px;
  line-height: 1.35;
  max-width: 100%;
  word-break: break-word;
}

.memberBadge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 18px;
  background:
    radial-gradient(circle at left center, rgba(212, 154, 58, 0.12), transparent 34%),
    rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  max-width: 48%;
  width: max-content;
}

.memberBadgeIcon {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  object-fit: cover;
  flex-shrink: 0;
}

.fundStageGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.fundTile {
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.fundTile.primary {
  background:
    radial-gradient(circle at top right, rgba(212, 154, 58, 0.12), transparent 30%),
    rgba(255, 255, 255, 0.035);
  border-color: rgba(212, 154, 58, 0.16);
}

.fundLabel {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.fundValue {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  word-break: break-word;
}

.fundTile.profit .fundValue {
  color: var(--color-up);
}

.visibilityToggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background:
    radial-gradient(circle at left center, rgba(212, 154, 58, 0.12), transparent 36%),
    rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  font-size: 12px;
  appearance: none;
  transition:
    transform var(--motion-fast) ease,
    border-color var(--motion-fast) ease,
    background-color var(--motion-fast) ease;
}

.actionCard,
.menuSection {
  background: rgba(255, 255, 255, 0.025);
  box-shadow: none;
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
  gap: 10px;
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

.panelEyebrow {
  color: var(--brand-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
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
