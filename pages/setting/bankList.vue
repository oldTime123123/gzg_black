<script setup lang="ts">
import { getUserBankcardList, delUserBankcard } from '~/api/home/home';

const { t } = useI18n();
const router = useRouter();
const changePage = (url: string) => {
  router.push(url);
};

const showSkeleton = ref(true);
const pub = usePublicStore();
const items = ref(new Array());

const fetchItemData = () => {
  pub.showLoading = true;
  getUserBankcardList()
    .then((list: any) => {
      items.value = list;
    })
    .finally(() => {
      pub.showLoading = false;
      showSkeleton.value = false;
    });
};

const showPop = ref(false);
const delId = ref(0);
const openPop = (id) => {
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
      <div class="heroCard">
        <div class="sectionSubtext">{{ $t('theme.linkedAccounts') }}</div>
        <div class="heroDesc">{{ $t('theme.linkedAccountsCopy') }}</div>
      </div>

      <div class="mt-4" v-if="showSkeleton">
        <div class="listSkeleton" v-for="(item, index) in 2" :key="index"></div>
      </div>

      <div v-else-if="items.length == 0 && !showSkeleton" class="sectionCard emptyCard mt-4">
        <div class="nullData"></div>
        <div class="emptyText">{{ $t('comm.c65') }}</div>
      </div>

      <div v-else class="cardGrid mt-4">
        <div class="bankCard" v-for="(item, index) in items" :key="index">
          <div class="bankCardMain" @click="changePage(`./editBank?bankId=${item.id}`)">
            <div class="bankTop">
              <div class="bankBadge">
                <Icon name="solar:card-2-linear" size="18" />
              </div>
              <div class="bankMeta">
                <div class="bankName">{{ item.bank_name }}</div>
                <div class="bankSub">{{ item.other_param_2 }}</div>
              </div>
            </div>

            <div class="bankNumber">**** **** **** {{ item.bank_num }}</div>
          </div>

          <div class="bankActions">
            <div class="smallAction" @click="changePage(`./editBank?bankId=${item.id}`)">
              <Icon name="solar:pen-linear" size="18" />
            </div>
            <div class="smallAction danger" @click="openPop(item.id)">
              <Icon name="solar:trash-bin-trash-linear" size="18" />
            </div>
          </div>
        </div>
      </div>

      <div class="actionDock">
        <div class="contentBtn" @click="changePage('./editBank')">
          {{ $t('setting.s6') }}
        </div>
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
            <div class="borderContentBtn" @click="showPop = false">{{ $t('comm.c56') }}</div>
            <div class="contentBtn" @click="handleDelItem">
              {{ t('setting.s2') }}
            </div>
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

.listSkeleton {
  height: 140px;
  border-radius: 22px;
  margin-bottom: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-soft);
}

.emptyCard {
  padding: 18px;
  text-align: center;
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
  padding: 16px;
  border-radius: 22px;
  background: var(--gradient-panel);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
}

.bankCardMain {
  cursor: pointer;
}

.bankTop {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bankBadge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(95, 224, 179, 0.12);
  color: var(--brand-primary);
}

.bankMeta {
  min-width: 0;
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

.bankNumber {
  margin-top: 20px;
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.bankActions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 14px;
}

.smallAction {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
  color: var(--text-primary);
}

.smallAction.danger {
  color: var(--color-down);
}

.actionDock {
  position: sticky;
  bottom: 12px;
  margin-top: 18px;
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
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
  text-align: center;
  color: var(--text-secondary);
}
</style>
