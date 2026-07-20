<script setup lang="ts">
import BEP20Icon from '~/assets/images/pay/BEP20.png';
import TRC20Icon from '~/assets/images/pay/TRC20.png';

const selectPayInd = ref(0);
const payList = [
  {
    name: 'USDT-BEP20',
    icon: BEP20Icon,
  },
  {
    name: 'USDT-TRC20',
    icon: TRC20Icon,
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
      <div class="heroCard">
        <div>
          <div class="sectionSubtext">{{ $t('theme.depositChannel') }}</div>
          <div class="heroDesc">{{ $t('theme.depositChannelCopy') }}</div>
        </div>
        <div class="heroIcon">
          <Icon name="lucide:arrow-down-to-line" size="24" />
        </div>
      </div>

      <div class="sectionCard optionCard mt-4">
        <div class="optionList">
          <div
            class="payOption"
            :class="selectPayInd == index ? 'isActive' : ''"
            v-for="(item,index) in payList"
            :key="index"
            @click="selectPayInd = index"
          >
            <div class="optionLeft">
              <img :src="item.icon" :alt="item.name" class="optionIcon">
              <div class="optionName">{{ item.name }}</div>
            </div>
            <Icon
              :name="selectPayInd == index ? 'lucide:circle-check' : 'lucide:chevron-right'"
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

.heroCard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
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

.heroIcon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(95, 224, 179, 0.14);
  color: var(--brand-primary);
}

.optionCard {
  padding: 18px;
}

.optionList {
  display: grid;
  gap: 12px;
}

.payOption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
}

.payOption.isActive {
  background: rgba(95, 224, 179, 0.12);
  border-color: var(--brand-primary-border);
}

.optionLeft {
  display: flex;
  align-items: center;
  gap: 12px;
}

.optionIcon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
}

.optionName {
  color: var(--text-primary);
  font-weight: 700;
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
  margin-top: 18px;
}
</style>
