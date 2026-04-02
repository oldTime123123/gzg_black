<script setup lang="ts">
import { getUserBankcardList, delUserBankcard } from '~/api/home/home';

const { t } = useI18n();
const router = useRouter();
const changePage = (url: string) => {
  router.push(url);
};

type BankCardItem = {
  id: number | string;
  bank_name: string;
  bank_num: string;
  other_param_2?: string;
};

const showSkeleton = ref(true);
const pub = usePublicStore();
const items = ref<BankCardItem[]>([]);

const fetchItemData = () => {
  pub.showLoading = true;
  getUserBankcardList()
    .then((list: BankCardItem[]) => {
      items.value = list;
    })
    .finally(() => {
      pub.showLoading = false;
      showSkeleton.value = false;
    });
};

const showPop = ref(false);
const delId = ref<number | string>(0);
const openPop = (id: number | string) => {
  delId.value = id;
  showPop.value = true;
};

const handleDelItem = () => {
  pub.showLoading = true;
  delUserBankcard(delId.value)
    .then(() => {
      fetchItemData();
      showPop.value = false;
    })
    .finally(() => {
      pub.showLoading = false;
    });
};

onMounted(() => {
  fetchItemData();
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('setting.s5')" />

    <div class="pageWrap px-3 pb-6">
      <div class="directoryStage mt-4">
        <div class="heroEyebrow">{{ $t('theme.linkedAccounts') }}</div>
        <div class="stageTitle">{{ $t('setting.s5') }}</div>
      </div>

      <div class="mt-4" v-if="showSkeleton">
        <div class="listSkeleton" v-for="(item, index) in 2" :key="index"></div>
      </div>

      <div v-else-if="items.length == 0 && !showSkeleton" class="emptyCard mt-4">
        <div class="nullData"></div>
        <div class="emptyText">{{ $t('comm.c65') }}</div>
      </div>

      <div v-else class="cardGrid mt-4">
        <div class="bankCard" v-for="(item, index) in items" :key="index">
          <div class="bankHead">
            <button type="button" class="bankTop" @click="changePage(`./editBank?bankId=${item.id}`)">
              <div class="bankBadge">
                <Icon name="solar:card-2-linear" size="18" />
              </div>
              <div class="bankMeta">
                <div class="bankName">{{ item.bank_name }}</div>
                <div class="bankSub">{{ item.other_param_2 }}</div>
              </div>
            </button>

            <div class="bankActions">
              <button type="button" class="smallAction" @click="changePage(`./editBank?bankId=${item.id}`)">
                <Icon name="solar:pen-linear" size="18" />
              </button>
              <button type="button" class="smallAction danger" @click="openPop(item.id)">
                <Icon name="solar:trash-bin-trash-linear" size="18" />
              </button>
            </div>
          </div>

          <button type="button" class="bankNumberStrip" @click="changePage(`./editBank?bankId=${item.id}`)">
            <div class="bankNumberLabel">{{ $t('theme.bankDetails') }}</div>
            <div class="bankNumber">**** **** **** {{ item.bank_num }}</div>
          </button>
        </div>
      </div>

      <div class="actionDock">
        <button type="button" class="contentBtn addBtn" @click="changePage('./editBank')">
          <span>{{ $t('setting.s6') }}</span>
          <Icon name="material-symbols:add-circle-rounded" size="20" class="addBtnIcon" />
        </button>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false" z-index="999">
      <div class="overlayWrap">
        <div class="dialogCard w-full max-w-[350px] rounded-3xl p-4" @click.stop>
          <div class="text-center font-bold title">{{ $t('mine.m9') }}</div>
          <div class="dialogBody">
            <span class="font-bold">{{ t('setting.s4') }}</span>
          </div>
          <div class="dialogActions mt-4 grid grid-cols-2 gap-2">
            <button type="button" class="borderContentBtn" @click="showPop = false">{{ $t('comm.c56') }}</button>
            <button type="button" class="contentBtn" @click="handleDelItem">
              {{ t('setting.s2') }}
            </button>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style scoped>
.pageWrap {
  min-height: calc(100vh - 60px);
}

.heroEyebrow {
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.directoryStage {
  padding: 2px 2px 8px;
}

.stageTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 22px;
  line-height: 1.15;
  font-weight: 700;
}

.listSkeleton {
  height: 140px;
  border-radius: 22px;
  margin-bottom: 12px;
  background: var(--surface-interactive-soft);
  border: 1px solid var(--border-soft);
}

.emptyCard {
  padding: 18px;
  text-align: center;
  border-radius: 24px;
  background: var(--surface-interactive-soft);
  border: 1px solid var(--border-soft);
}

.emptyText {
  margin-top: 10px;
  color: var(--text-secondary);
}

.cardGrid {
  display: grid;
  gap: 12px;
}

.bankCard {
  padding: 18px 16px 14px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(48, 82, 119, 0.92), rgba(35, 63, 92, 0.88));
  border: 1px solid var(--border-soft);
  box-shadow: none;
}

.bankHead {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.bankTop {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
  cursor: pointer;
  text-align: left;
  background: transparent;
  border: 0;
}

.bankBadge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
}

.bankMeta {
  min-width: 0;
  flex: 1;
}

.bankName {
  color: var(--text-primary);
  font-weight: 700;
}

.bankSub {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.bankNumberStrip {
  appearance: none;
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 18px;
  background: transparent;
  border: 0;
  border-top: 1px solid var(--border-soft);
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: transform var(--motion-fast), border-color var(--motion-fast);
}

.addBtn {
  min-height: 50px;
  height: auto;
  padding: 12px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
}

.addBtnIcon {
  color: rgba(125, 211, 252, 0.92);
  flex-shrink: 0;
}

.bankNumberLabel {
  color: var(--text-secondary);
  font-size: 12px;
}

.bankNumber {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.06em;
  line-height: 1.2;
}

.bankActions {
  display: flex;
  gap: 8px;
}

.smallAction {
  width: 40px;
  height: 40px;
  appearance: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-interactive-soft);
  border: 1px solid var(--border-soft);
  color: var(--text-primary);
  cursor: pointer;
  transition: transform var(--motion-fast), border-color var(--motion-fast), background-color var(--motion-fast);
}

.smallAction.danger {
  color: var(--color-down);
}

.actionDock {
  position: sticky;
  bottom: 12px;
  margin-top: 22px;
}

.dialogCard {
  background:
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(48, 80, 116, 0.98), rgba(34, 62, 91, 0.96));
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
  color: var(--text-primary);
}

.overlayWrap {
  display: flex;
  justify-content: center;
  align-items: center;
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
  background: var(--surface-interactive-soft);
  border: 1px solid var(--border-soft);
  text-align: center;
  color: var(--text-secondary);
}
.smallAction:active,
.bankTop:active,
.bankNumberStrip:active,
.addBtn:active {
  transform: scale(0.98);
}
</style>
