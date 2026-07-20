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
      icon: 'lucide:credit-card',
      url: '/setting/bankList',
    },
    {
      name: t('mine.m4'),
      icon: 'lucide:shield-user',
      url: '/setting/identify',
    },
    {
      name: t('mine.m5'),
      icon: 'lucide:key-round',
      url: '/setting/password?type=1',
    },
    {
      name: t('mine.m6'),
      icon: 'lucide:headset',
      url: '/service',
    },
    {
      name: t('mine.m7'),
      icon: 'lucide:clipboard-list',
      url: '/record/userBalanceRecord',
    },
    {
      name: t('mine.m8'),
      icon: 'lucide:lock-keyhole',
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

const account = ref<Record<string, any>>({
  totalAsset: 0,
  balance: 0,
  frozenAmount: 0,
  profit: 0,
});

const fetchPageData = () => {
  getUserAccountBalance().then((data: any) => {
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
              <div class="topAction" :aria-label="$t('mine.m21')" @click="changePage('/mine/language')">
                <Icon name="lucide:globe" size="18" />
              </div>
              <div class="topAction" @click="changePage('/service')">
                <Icon name="lucide:headset" size="18" />
              </div>
            </div>
          </div>
        </van-sticky>

        <div class="pageContainer px-3 pt-3 pb-6">
          <div class="heroCard">
            <div class="heroGlow"></div>
            <div class="sectionHeading">
              <div>
                <div class="sectionSubtext">{{ $t('mine.m13') }}</div>
                <div class="identityRow">
                  <div class="identityChip">{{ $t('theme.idLabel') }}:{{ userStore.data.id }}</div>
                  <div class="identityChip">{{ $t('login.l6') }}:{{ userStore.data.phone }}</div>
                </div>
              </div>
              <div class="memberBadge">
                <img :src="userStore.data.vip?.pic" class="memberBadgeIcon">
                <span>{{ userStore.data.vip?.name }}</span>
              </div>
            </div>
            <div class="fundMatrix">
              <div class="fundTile" v-for="(item, index) in fundStats" :key="index" :class="item.tone">
                <div class="fundLabel">{{ item.label }}</div>
                <div class="fundValue">{{ item.value }}</div>
              </div>
            </div>

            <div class="visibilityToggle" @click="showID = !showID">
              <Icon :name="!showID ? 'lucide:eye-off' : 'lucide:eye'" size="16" />
              <span>{{ showID ? $t('theme.hideBalance') : $t('theme.showBalance') }}</span>
            </div>
          </div>

          <div class="actionCard sectionCard mt-4 p-3">
            <div class="sectionHeading">
              <div>
                <div class="sectionTitle">{{ $t('theme.accountActions') }}</div>
                <div class="sectionSubtext">{{ $t('theme.accountActionsCopy') }}</div>
              </div>
            </div>
            <div class="grid grid-cols-2 cursor-pointer gap-3 mt-4">
              <div class="actionButton actionDeposit" @click="goDeposit('/pay/deposit')">
                <div class="iconFrame">
                  <Icon name="lucide:arrow-down-to-line" size="22" />
                </div>
                <div class="actionCopy">
                  <div class="actionLabel">
                    {{ $t('mine.m18') }}
                  </div>
                  <div class="actionHint">{{ $t('theme.depositHint') }}</div>
                </div>
              </div>

              <div class="actionButton actionWithdraw" @click="changePage('/pay/withdraw')">
                <div class="iconFrame">
                  <Icon name="lucide:arrow-up-from-line" size="22" />
                </div>
                <div class="actionCopy">
                  <div class="actionLabel">
                    {{ $t('mine.m19') }}
                  </div>
                  <div class="actionHint">{{ $t('theme.withdrawHint') }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="menuSection sectionCard mt-4 p-4">
            <div class="sectionHeading">
              <div>
                <div class="sectionTitle">{{ $t('theme.toolsSettings') }}</div>
                <div class="sectionSubtext">{{ $t('theme.manageAccountVerificationAccess') }}</div>
              </div>
            </div>
            <div class="menuGrid mt-4">
              <div class="menuItem" v-for="(item, index) in myItemList" :key="index" @click="changePage(item.url)">
                <div class="iconFrame">
                  <Icon :name="item.icon" size="20" />
                </div>
                <div class="menuContent">
                  <div class="menuName">{{ item.name }}</div>
                  <div class="menuHint">{{ $t('theme.openAndManage') }}</div>
                </div>
                <Icon name="lucide:chevron-right" size="18" class="menuArrow" />
              </div>
            </div>
          </div>

          <div class="logoutSection mt-6">
            <div class="sectionCard p-3">
              <div class="contentBtn" @click="handleLogout">
                {{ $t('mine.m20') }}
              </div>
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
              <div class="borderContentBtn" @click="showPop = false">{{ $t('comm.c56') }}</div>
              <div class="contentBtn" @click="confirmClosePositionHandle">
                {{ $t('comm.c57') }}
              </div>
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
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
  color: var(--text-primary);
}

.heroCard {
  position: relative;
  overflow: hidden;
  padding: 20px;
  border-radius: 28px;
  background: var(--gradient-hero);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
}

.heroGlow {
  position: absolute;
  right: -40px;
  top: -40px;
  width: 140px;
  height: 140px;
  border-radius: 999px;
  background: rgba(95, 224, 179, 0.14);
  filter: blur(12px);
}

.identityRow {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.identityChip {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  font-size: 12px;
}

.memberBadge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  color: var(--text-primary);
  font-size: 12px;
}

.memberBadgeIcon {
  width: 16px;
  height: 16px;
}

.heroIntro {
  margin-top: 14px;
  color: var(--text-secondary);
  font-size: 13px;
}

.fundMatrix {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.fundTile {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-soft);

  &.primary {
    background: rgba(95, 224, 179, 0.12);
    border-color: var(--brand-primary-border);
  }

  &.profit .fundValue {
    color: var(--brand-primary);
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
  cursor: pointer;
}

.actionButton {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  min-height: 82px;
  border: 1px solid var(--border-soft);
}

.actionDeposit {
  background: rgba(95, 224, 179, 0.1);
}

.actionWithdraw {
  background: rgba(255, 255, 255, 0.04);
}

.actionCopy {
  min-width: 0;
}

.actionLabel {
  color: var(--text-primary);
  font-weight: 700;
}

.actionHint {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.menuGrid {
  display: grid;
  gap: 12px;
}

.menuItem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
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

.menuHint {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.menuArrow {
  color: var(--text-muted);
}

.dialogCard {
  background:
    radial-gradient(circle at top right, rgba(95, 224, 179, 0.12), transparent 30%),
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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
  color: var(--text-secondary);
  text-align: center;
}
</style>
