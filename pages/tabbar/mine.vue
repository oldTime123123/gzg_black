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
    { name: t('mine.m3'), icon: 'solar:card-2-linear', url: '/setting/bankList' },
    { name: t('mine.m4'), icon: 'solar:shield-user-linear', url: '/setting/identify' },
    { name: t('mine.m5'), icon: 'solar:key-linear', url: '/setting/password?type=1' },
    { name: t('mine.m6'), icon: 'solar:headphones-round-sound-linear', url: '/service' },
    { name: t('mine.m7'), icon: 'solar:bill-list-linear', url: '/record/userBalanceRecord' },
    { name: t('mine.m8'), icon: 'solar:lock-password-linear', url: '/setting/password?type=0' },
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
          <div class="pageTopBar px-4 py-3 tabbarPageTopNav flex justify-between items-center" :class="isSticky ? 'topStickyEl' : ''">
            <div class="w-[40px]"></div>
            <div class="flex-1 text-center pageTitle">
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
          <div class="mineShell">
            <section class="profileStage sectionCard">
              <div class="profileStage__head">
                <div>
                  <div class="profileStage__eyebrow">{{ $t('theme.idLabel') }}</div>
                  <div class="profileStage__meta">{{ userStore.data.id }}</div>
                  <div class="profileStage__sub">{{ $t('login.l6') }} {{ userStore.data.phone }}</div>
                </div>
                <button type="button" class="visibilitySwitch" @click="showID = !showID" :aria-pressed="showID">
                  <Icon :name="showID ? 'solar:eye-closed-linear' : 'solar:eye-linear'" size="16" />
                  <span>{{ showID ? $t('theme.hideBalance') : $t('theme.showBalance') }}</span>
                </button>
              </div>

              <div class="profileStage__assetLabel">{{ $t('mine.m14') }}</div>
              <div class="profileStage__assetValue">
                <span class="profileStage__currency">{{ getCurrency() }}</span>
                <span class="profileStage__amount">{{ formatMoney(account.totalAsset) }}</span>
              </div>

              <div v-if="userStore.data.vip?.name" class="memberBadge">
                <img :src="userStore.data.vip?.pic" :alt="userStore.data.vip?.name || 'member badge'" class="memberBadge__avatar" decoding="async">
                <span>{{ userStore.data.vip?.name }}</span>
              </div>

              <div class="profileStage__stats">
                <div v-for="(item, index) in accountFocusStats" :key="index" class="assetPanel" :class="index === 0 ? 'assetPanelWide' : ''">
                  <div class="assetPanel__label">{{ item.label }}</div>
                  <div class="assetPanel__value" :class="item.tone === 'profit' ? 'assetPanel__valueProfit' : ''">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </section>

            <section class="actionCard sectionCard">
              <div class="sectionHeading">
                <div>
                  <div class="sectionTitle">{{ $t('theme.accountActions') }}</div>
                </div>
              </div>
              <div class="quickActions">
                <button type="button" class="actionButton actionButtonPrimary" @click="goDeposit('/pay/deposit')">
                  <div class="iconFrame">
                    <Icon name="solar:card-recive-linear" size="22" />
                  </div>
                  <div class="actionCopy">
                    <div class="actionLabel">{{ $t('mine.m18') }}</div>
                  </div>
                </button>

                <button type="button" class="actionButton" @click="changePage('/pay/withdraw')">
                  <div class="iconFrame">
                    <Icon name="solar:card-send-linear" size="22" />
                  </div>
                  <div class="actionCopy">
                    <div class="actionLabel">{{ $t('mine.m19') }}</div>
                  </div>
                </button>
              </div>
            </section>

            <section class="menuSection sectionCard">
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
            </section>

            <section class="logoutSection sectionCard">
              <button type="button" class="contentBtn" @click="handleLogout">
                {{ $t('mine.m20') }}
              </button>
            </section>
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

.mineShell {
  display: grid;
  gap: 14px;
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
}

.profileStage,
.actionCard,
.menuSection,
.logoutSection {
  background: rgba(8, 18, 31, 0.9);
  border: 1px solid rgba(125, 211, 252, 0.1);
}

.profileStage {
  display: grid;
  gap: 16px;
  background:
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.14), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.018));
}

.profileStage__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.profileStage__eyebrow {
  color: var(--brand-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.profileStage__meta {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 700;
}

.profileStage__sub {
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.45;
  word-break: break-all;
}

.visibilitySwitch {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 0 12px;
  border: 1px solid rgba(125, 211, 252, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  flex-shrink: 0;
}

.profileStage__assetLabel {
  color: var(--text-muted);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.profileStage__assetValue {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.profileStage__currency,
.profileStage__amount {
  color: var(--text-primary);
  font-size: 28px;
  font-weight: 800;
  line-height: 0.92;
  letter-spacing: -0.04em;
}

.profileStage__amount {
  min-width: 0;
  flex: 1;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.memberBadge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  width: fit-content;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(125, 211, 252, 0.12);
  color: var(--text-primary);
  font-size: 12px;
  font-weight: 600;
}

.memberBadge__avatar {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  object-fit: cover;
}

.profileStage__stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.assetPanel {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.assetPanelWide {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(37, 99, 235, 0.08));
  border-color: rgba(125, 211, 252, 0.16);
}

.assetPanel__label {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.assetPanel__value {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  word-break: break-word;
}

.assetPanel__valueProfit {
  color: var(--color-up);
}

.actionCard,
.menuSection,
.logoutSection {
  box-shadow: none;
}

.quickActions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
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
}

.actionButtonPrimary {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.12), rgba(37, 99, 235, 0.08));
  border-color: rgba(125, 211, 252, 0.16);
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

.dialogCard {
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

@media (max-width: 360px) {
  .profileStage__head,
  .quickActions,
  .profileStage__stats {
    grid-template-columns: 1fr;
  }

  .profileStage__head {
    display: grid;
  }
}
</style>
