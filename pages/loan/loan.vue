<script setup lang="ts">
import { showToast } from 'vant';
import { getLoanInfo, subLoanhandle } from '~/api/pay/realse';

const { t } = useI18n();
const pub = usePublicStore();
const showPop = ref(false);
const inpVal = ref<string | number>('');
type LoanInfo = {
  credit_limit: number | string;
};

const confirmHandle = () => {
  if (inpVal.value < 1 || Number(inpVal.value) > Number(loanInfo.value.credit_limit)) {
    showToast(t('loan.l10'));
    return;
  }
  const data = { amount: inpVal.value, type: 1 };
  showPop.value = false;
  pub.showLoading = true;
  subLoanhandle(data).then(() => {
    showToast(t('loan.l11'));
    getData();
    inpVal.value = '';
  });
};

const loanInfo = ref<LoanInfo>({ credit_limit: 0 });
const getData = () => {
  getLoanInfo().then((res) => {
    loanInfo.value = res;
  });
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let value = target.value;
  value = value.replace(/[^\d.]/g, '');
  if (value.indexOf('.') === 0) value = '0' + value;
  value = value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
  inpVal.value = value;
  target.value = value;
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('loan.l12')" />

    <div class="pageWrap px-3 pb-6">
      <div class="heroCard mt-4">
        <div class="heroEyebrow">{{ $t('theme.loanApply') }}</div>
        <div class="heroValue">{{ UseExchangeNumber(loanInfo.credit_limit) }}</div>
        <div class="heroLabel">{{ $t('loan.l13') }}</div>
      </div>

      <div class="sectionCard mt-4 copyCard">
        <div class="copyText">{{ $t('loan.l14') }}</div>
        <button type="button" class="contentBtn mt-5" @click="showPop = true">{{ $t('loan.l15') }}</button>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false">
      <div class="overlayWrap">
        <div class="dialogCard" @click.stop>
          <div class="dialogHead">
            <div class="dialogTitle">{{ $t('loan.l16') }}</div>
            <button type="button" class="closeBtn" :aria-label="$t('comm.c56')" @click="showPop = false">
              <Icon name="solar:close-circle-linear" size="20" />
            </button>
          </div>
          <div class="dialogBody">
            <div class="fieldLabel">{{ $t('loan.l17') }}</div>
            <van-field type="text" v-model="inpVal" :placeholder="$t('loan.l18')" class="authInput mt-3" :border="false" input-align="left" @input="handleInput" />
            <div class="dialogActions mt-5">
              <button type="button" class="borderContentBtn" @click="showPop = false">{{ $t('loan.l19') }}</button>
              <button type="button" class="contentBtn" @click="confirmHandle">{{ $t('loan.l20') }}</button>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}
.heroEyebrow{color:var(--brand-primary);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.heroValue{margin-top:20px;color:var(--text-primary);font-size:30px;font-weight:800;line-height:1.08;word-break:break-word;overflow-wrap:anywhere}.heroLabel{margin-top:8px;color:var(--text-secondary);font-size:13px;line-height:1.45}
.copyCard{padding:20px}.copyText{min-height:72px;color:var(--text-secondary);font-size:14px;line-height:1.75}
.overlayWrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:16px}.dialogCard{width:min(350px,100%);border-radius:24px;background:radial-gradient(circle at top right, rgba(56,189,248,.12), transparent 30%),linear-gradient(180deg, rgba(24,33,43,.98), rgba(13,17,23,.98));border:1px solid var(--border-soft);box-shadow:var(--shadow-float)}
.dialogHead{position:relative;padding:20px 20px 12px}.dialogTitle{color:var(--text-primary);font-size:20px;font-weight:800}.closeBtn{position:absolute;right:14px;top:14px;width:40px;height:40px;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;color:var(--text-secondary);appearance:none;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);transition:transform .18s ease,border-color .18s ease,color .18s ease}
.closeBtn:hover{border-color:rgba(56,189,248,.18);color:var(--brand-primary)}
.closeBtn:active{transform:scale(.96)}
.dialogBody{padding:0 20px 20px}.fieldLabel{color:var(--text-primary);font-size:15px;font-weight:700;line-height:1.4}.authInput{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px}.authInput :deep(.van-field__body){min-height:52px}.authInput :deep(.van-field__control){color:var(--text-primary)}
.dialogActions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
</style>
