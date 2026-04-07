<script setup lang="ts">
import { showToast } from 'vant';
import { getLoanInfo, subLoanhandle } from '~/api/pay/realse';

const { t } = useI18n();
const pub = usePublicStore();

const loanCom = computed(() => [
  { name: t('loan.l1'), icon: 'solar:shield-check-linear' },
  { name: t('loan.l2'), icon: 'solar:wallet-money-linear' },
  { name: t('loan.l3'), icon: 'solar:chart-square-linear' },
]);

type LoanOverview = {
  credit_limit: number | string;
  loan_status: number;
  user_loan?: number;
  loanInfo: {
    total_loan: number | string;
    loan_amount: number | string;
  };
};

const loanInfo = ref<LoanOverview>({
  credit_limit: 0,
  loan_status: 0,
  loanInfo: { total_loan: 0, loan_amount: 0 },
});

const getData = () => {
  getLoanInfo().then((res: LoanOverview) => {
    loanInfo.value = res;
  });
};

const router = useRouter();
const changePage = (url: string) => {
  router.push(url);
};

const showPop = ref(false);
const inpVal = ref<string | number>(0);

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
            <div class="heroEyebrow">{{ $t('theme.loanCenter') }}</div>
          </div>
          <button type="button" class="ghostAction" @click="changePage('/record/loanRecord')">
            <span>{{ $t('loan.l5') }}</span>
            <Icon name="solar:arrow-right-linear" size="16" />
          </button>
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

        <div class="loanActionStack">
          <button type="button" class="contentBtn" @click="loanInfo.loan_status > 0 ? changePage('/loan/loan') : ''" :class="loanInfo.loan_status < 1 ? 'disBtn' : ''" :disabled="loanInfo.loan_status < 1">
            {{ $t('loan.l7') }}
          </button>

          <button type="button" class="repayCard" @click="goBackLoan">
            <div class="repayLeft">
              <div class="repayIcon">
                <Icon name="solar:card-recive-linear" size="18" />
              </div>
              <div>
                <div class="repayTitle">{{ $t('loan.l8') }}</div>
                <div class="repayDesc">{{ $t('loan.l9') }}</div>
              </div>
            </div>
            <Icon class="repayArrow" name="solar:arrow-right-linear" size="18" />
          </button>
        </div>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false">
      <div class="overlayWrap">
        <div class="dialogCard" @click.stop>
          <div class="dialogHead">
            <div class="dialogTitle">{{ $t('loan.l16') }}</div>
            <button type="button" class="closeBtn" @click="showPop = false" :aria-label="$t('comm.c56') || 'Close dialog'">
              <Icon name="solar:close-circle-linear" size="20" />
            </button>
          </div>
          <div class="dialogBody">
            <div class="detailRow"><span>{{ $t('x.a15') }}</span><strong>{{ loanInfo.loanInfo.loan_amount }}</strong></div>
            <div class="fieldLabel mt-4">{{ $t('x.a16') }}</div>
            <van-field type="digit" v-model="inpVal" :placeholder="$t('x.a17')" class="authInput mt-2" :border="false" input-align="left" />
            <div class="dialogActions mt-5">
              <button type="button" class="borderContentBtn" @click="showPop = false">{{ $t('loan.l19') }}</button>
              <button type="button" v-if="loanInfo.loan_status > 0" class="contentBtn" @click="confirmHandle">{{ $t('loan.l20') }}</button>
              <button type="button" v-else class="contentBtn disBtn" disabled>{{ $t('loan.l20') }}</button>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}
.heroCard{display:grid;gap:18px;padding:22px 18px}
.heroTop{display:flex;align-items:center;justify-content:space-between;gap:12px}
.heroEyebrow{color:var(--brand-primary);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.ghostAction{appearance:none;display:inline-flex;align-items:center;gap:6px;padding:10px 12px;border-radius:999px;background:rgba(255,255,255,.04);border:1px solid var(--border-soft);color:var(--text-secondary);font-size:12px;cursor:pointer;transition:transform var(--motion-fast),border-color var(--motion-fast),background-color var(--motion-fast)}
.heroValue{color:var(--text-primary);font-size:clamp(1.9rem,6.1vw,2.45rem);font-weight:800;line-height:1.06;}
.heroLabel{color:var(--text-secondary);font-size:13px;line-height:1.45}
.featureGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;padding:14px;border-radius:20px;background:rgba(255,255,255,.018);border:1px solid rgba(255,255,255,.05)}
.featureCard{padding:10px 8px;border-radius:16px;background:rgba(255,255,255,.02);text-align:center}
.featureIcon{width:32px;height:32px;margin:0 auto;display:flex;align-items:center;justify-content:center;border-radius:10px;background:var(--brand-primary-soft);color:var(--brand-primary)}
.featureName{margin-top:10px;color:var(--text-secondary);font-size:12px;line-height:1.4}
.loanActionStack{display:grid;gap:12px;padding-top:6px}
.repayCard{padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;cursor:pointer;transition:transform var(--motion-fast),border-color var(--motion-fast),background-color var(--motion-fast);border-radius:20px;background:rgba(255,255,255,.022);border:1px solid rgba(255,255,255,.06)}
.repayLeft{display:flex;align-items:center;gap:12px}.repayIcon{width:40px;height:40px;border-radius:14px;background:var(--brand-primary-soft);display:flex;align-items:center;justify-content:center;color:var(--brand-primary)}
.repayTitle{color:var(--text-primary);font-weight:700;line-height:1.35}.repayDesc{margin-top:6px;color:var(--text-secondary);font-size:12px;line-height:1.45}.repayArrow{color:var(--text-secondary)}
.overlayWrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:16px}
.dialogCard{width:min(350px,100%);border-radius:24px;background:radial-gradient(circle at top right, rgba(212,154,58,.12), transparent 30%),linear-gradient(180deg, rgba(24,33,43,.98), rgba(13,17,23,.98));border:1px solid var(--border-soft);box-shadow:var(--shadow-float)}
.dialogHead{position:relative;padding:20px 20px 12px}.dialogTitle{color:var(--text-primary);font-size:20px;font-weight:800}.closeBtn{position:absolute;right:14px;top:14px;width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06);color:var(--text-secondary);cursor:pointer;transition:transform var(--motion-fast),border-color var(--motion-fast),background-color var(--motion-fast)}
.dialogBody{padding:0 20px 20px}.detailRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.025);color:var(--text-secondary);font-size:13px}.detailRow strong{color:var(--text-primary)}
.fieldLabel{color:var(--text-primary);font-size:15px;font-weight:700;line-height:1.4}.authInput{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px}.authInput :deep(.van-field__body){min-height:52px}.authInput :deep(.van-field__control){color:var(--text-primary)}
.dialogActions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.disBtn{background:#6b7280!important;color:#d1d5db!important}
.ghostAction:active,.repayCard:active,.closeBtn:active{transform:scale(.98)}

</style>
