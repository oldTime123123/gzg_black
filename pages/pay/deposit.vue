<script setup lang="ts">
const selectPayInd = ref(0);
const payList = [
  {
    name: 'USDT-BEP20',
    icon: 'cryptocurrency-color:usdt',
  },
  {
    name: 'USDT-TRC20',
    icon: 'cryptocurrency-color:trx',
  },
];

const pub = usePublicStore();

onMounted(() => {
  pub.showLoading = false;
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('pay.p1')" />

    <div class="pageWrap px-3 pb-6">
      <div class="routeStage mt-4">
        <div class="heroEyebrow">{{ $t('theme.linkedAccounts') }}</div>
        <div class="stageTitle">{{ $t('pay.p1') }}</div>
      </div>

      <div class="routeLedger mt-5">
        <div class="ledgerTop">
          <div class="ledgerTitle">{{ $t('pay.p2') }}</div>
        </div>

        <div class="optionList mt-4">
          <div
            class="payOption"
            :class="selectPayInd == index ? 'isActive' : ''"
            v-for="(item,index) in payList"
            :key="index"
            @click="selectPayInd = index"
          >
            <div class="optionLeft">
              <Icon :name="item.icon" size="28" class="optionIcon" />
              <div class="optionName">{{ item.name }}</div>
            </div>
            <Icon
              :name="selectPayInd == index ? 'solar:check-circle-bold' : 'solar:alt-arrow-right-linear'"
              size="20"
              class="optionArrow"
            />
          </div>
        </div>

        <div class="actionDock">
          <div class="contentBtn">{{ $t('pay.p2') }}</div>
        </div>
      </div>
    </div>
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

.routeStage {
  padding: 2px 2px 8px;
}

.stageTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.1;
}

.ledgerTop {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.ledgerTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
}

.routeLedger {
  padding: 4px 2px 0;
}

.optionList {
  display: grid;
  gap: 10px;
}

.payOption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.payOption.isActive {
  background:
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.1), transparent 28%),
    rgba(255, 255, 255, 0.03);
  border-color: rgba(56, 189, 248, 0.18);
}

.optionLeft {
  display: flex;
  align-items: center;
  gap: 12px;
}

.optionIcon {
  flex-shrink: 0;
}

.optionName {
  color: var(--text-primary);
  font-weight: 700;
}

.payOption.isActive .optionName {
  color: var(--brand-primary);
}

.optionArrow {
  color: var(--text-secondary);
}

.payOption.isActive .optionArrow {
  color: var(--brand-primary);
}

.actionDock {
  position: sticky;
  bottom: 12px;
  margin-top: 22px;
}
</style>
