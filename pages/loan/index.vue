<script setup lang="ts">
import { showToast } from 'vant';
import { getLoanInfo, subLoanhandle } from '~/api/pay/realse';

const { t } = useI18n();
const pub = usePublicStore();

const loanCom = computed(() => [
  { name: t('loan.l1'), icon: 'lucide:shield-check' },
  { name: t('loan.l2'), icon: 'lucide:wallet-cards' },
  { name: t('loan.l3'), icon: 'lucide:chart-no-axes-combined' },
]);

const loanInfo = ref<any>({
  credit_limit: 0,
  loan_status: 0,
  loanInfo: { total_loan: 0, loan_amount: 0 },
});

const getData = () => {
  getLoanInfo().then((res) => {
    loanInfo.value = res;
  });
};

const router = useRouter();
const changePage = (url: string) => {
  router.push(url);
};

const showPop = ref(false);
const inpVal = ref<any>(0);

const goBackLoan = () => {
  if (loanInfo.value.user_loan < 2) {
    if (Number(loanInfo.value.loanInfo.loan_amount) == 0) {
      return showToast(t('x.a18'));
    }
    showPop.value = true;
    inpVal.value = loanInfo.value.loanInfo.loan_amount;
  } else {
    showToast(t('x.a14'));
  }
};

const confirmHandle = () => {
  if (inpVal.value < 1 || Number(inpVal.value) > Number(loanInfo.value.loanInfo.loan_amount)) {
    showToast(t('loan.l10'));
    return;
  }
  const data = { amount: inpVal.value, type: 2 };
  showPop.value = false;
  pub.showLoading = true;
  subLoanhandle(data).then(() => {
    showToast(t('x.a19'));
    getData();
    inpVal.value = '';
  });
};

onBeforeMount(() => {
  getData();
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('loan.l4')" />

    <div class="pageWrap px-3 pb-6">
      <div class="heroCard mt-4">
        <div class="heroTop">
          <div>
            <div class="sectionSubtext">{{ $t('theme.loanCenter') }}</div>
          </div>
          <div class="ghostAction" @click="changePage('/record/loanRecord')">
            <span>{{ $t('loan.l5') }}</span>
            <Icon name="lucide:arrow-right" size="16" />
          </div>
        </div>

        <div class="heroValue">{{ UseExchangeNumber(loanInfo.credit_limit) }}</div>
        <div class="heroLabel">{{ $t('loan.l6') }}</div>

        <div class="featureGrid">
          <div class="featureCard" v-for="(item, index) in loanCom" :key="index">
            <div class="featureIcon">
              <Icon :name="item.icon" size="18" />
            </div>
            <div class="featureName">{{ item.name }}</div>
          </div>
        </div>

        <div class="contentBtn mt-5" @click="loanInfo.loan_status > 0 ? changePage('/loan/loan') : ''" :class="loanInfo.loan_status < 1 ? 'disBtn' : ''">
          {{ $t('loan.l7') }}
        </div>
      </div>

      <div class="sectionCard mt-4 repayCard" @click="goBackLoan">
        <div class="repayLeft">
          <div class="repayIcon">
            <Icon name="lucide:arrow-down-to-line" size="18" />
          </div>
          <div>
            <div class="repayTitle">{{ $t('loan.l8') }}</div>
            <div class="repayDesc">{{ $t('loan.l9') }}</div>
          </div>
        </div>
        <Icon class="repayArrow" name="lucide:arrow-right" size="18" />
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false">
      <div class="overlayWrap">
        <div class="dialogCard" @click.stop>
          <div class="dialogHead">
            <div class="dialogTitle">{{ $t('loan.l16') }}</div>
            <div class="closeBtn" @click="showPop = false">
              <Icon name="lucide:circle-x" size="20" />
            </div>
          </div>
          <div class="dialogBody">
            <div class="detailRow"><span>{{ $t('x.a15') }}</span><strong>{{ loanInfo.loanInfo.loan_amount }}</strong></div>
            <div class="fieldLabel mt-4">{{ $t('x.a16') }}</div>
            <van-field type="digit" v-model="inpVal" :placeholder="$t('x.a17')" class="authInput mt-2" :border="false" input-align="left" />
            <div class="dialogActions mt-5">
              <div class="borderContentBtn" @click="showPop = false">{{ $t('loan.l19') }}</div>
              <div v-if="loanInfo.loan_status > 0" class="contentBtn" @click="confirmHandle">{{ $t('loan.l20') }}</div>
              <div v-else class="contentBtn disBtn">{{ $t('loan.l20') }}</div>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}
.heroCard{padding:20px;border-radius:24px;background:var(--gradient-hero);border:1px solid var(--border-soft);box-shadow:var(--shadow-float)}
.heroTop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.heroTitle{margin-top:8px;color:var(--text-primary);font-size:24px;font-weight:800;line-height:1.25}
.ghostAction{display:inline-flex;align-items:center;gap:6px;padding:10px 12px;border-radius:999px;background:rgba(255,255,255,.04);border:1px solid var(--border-soft);color:var(--text-secondary);font-size:12px}
.heroValue{margin-top:22px;color:var(--text-primary);font-size:34px;font-weight:800;line-height:1.2}
.heroLabel{margin-top:8px;color:var(--text-secondary);font-size:13px;line-height:1.45}
.featureGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:22px}
.featureCard{padding:16px 12px;border-radius:18px;background:rgba(255,255,255,.03);text-align:center}
.featureIcon{width:36px;height:36px;margin:0 auto;display:flex;align-items:center;justify-content:center;border-radius:12px;background:rgba(95,224,179,.12);color:var(--brand-primary)}
.featureName{margin-top:12px;color:var(--text-secondary);font-size:12px;line-height:1.45}
.repayCard{padding:18px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.repayLeft{display:flex;align-items:center;gap:12px}.repayIcon{width:40px;height:40px;border-radius:14px;background:rgba(95,224,179,.12);display:flex;align-items:center;justify-content:center;color:var(--brand-primary)}
.repayTitle{color:var(--text-primary);font-weight:700;line-height:1.35}.repayDesc{margin-top:6px;color:var(--text-secondary);font-size:12px;line-height:1.45}.repayArrow{color:var(--text-secondary)}
.overlayWrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:16px}
.dialogCard{width:min(350px,100%);border-radius:24px;background:radial-gradient(circle at top right, rgba(95,224,179,.12), transparent 30%),linear-gradient(180deg, rgba(24,33,43,.98), rgba(13,17,23,.98));border:1px solid var(--border-soft);box-shadow:var(--shadow-float)}
.dialogHead{position:relative;padding:20px 20px 12px}.dialogTitle{color:var(--text-primary);font-size:20px;font-weight:800}.closeBtn{position:absolute;right:14px;top:14px;color:var(--text-secondary)}
.dialogBody{padding:0 20px 20px}.detailRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.03);color:var(--text-secondary);font-size:13px}.detailRow strong{color:var(--text-primary)}
.fieldLabel{color:var(--text-primary);font-size:15px;font-weight:700;line-height:1.4}.authInput{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px}.authInput :deep(.van-field__body){min-height:52px}.authInput :deep(.van-field__control){color:var(--text-primary)}
.dialogActions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.disBtn{background:#6b7280!important;color:#d1d5db!important}
</style>
