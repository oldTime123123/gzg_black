<script setup lang="ts">
import * as v from 'valibot';
import { getBankWithdrawInfo, submitBankWithdraw } from '~/api/pay/realse';
import { getUserBankcardList } from '~/api/home/home';
import { showToast } from 'vant';

const { t } = useI18n();

const schema = v.object({
  amount: v.pipe(v.string(), v.minLength(1, t('pay.p5'))),
  password: v.pipe(v.string(), v.minLength(6, t('pay.p6'))),
  bank: v.pipe(v.union([v.string(), v.number()]), v.nonEmpty(t('pay.p7'))),
});

const state = reactive({
  amount: '',
  password: '',
  bank: '',
});

const bankList = ref([]);
const showBankPicker = ref(false);
const bankColumns = computed(() => bankList.value.map((i: any) => ({ text: i.bank_name, value: i.id })));
const selectedBankName = computed(() => {
  const cur = bankList.value.find((i: any) => i.id == state.bank);
  return cur ? cur.bank_name : '';
});

const onBankConfirm = (...args: any[]) => {
  if (args.length >= 2 && typeof args[1] === 'number') {
    const index = args[1];
    const item = bankList.value[index];
    if (item) state.bank = item.id;
  } else {
    const opt = args[0]?.selectedOptions?.[0];
    if (opt && Object.prototype.hasOwnProperty.call(opt, 'value')) {
      state.bank = opt.value;
    }
  }
  showBankPicker.value = false;
};

const selectBankHandle = (item: any) => {
  state.bank = item.id;
  showBankPicker.value = false;
};

const withdrawInfo = ref({
  balance_max: 0,
  min: 0,
  max: 0,
});

const getData = () => {
  getBankWithdrawInfo().then((res) => {
    withdrawInfo.value = res;
  });
  getUserBankcardList().then((res) => {
    bankList.value = res;
  });
};

const pub = usePublicStore();
const showPwd = ref(false);

const handleSubmit = () => {
  const data = {
    amount: state.amount,
    password: state.password,
    bankId: state.bank,
  };

  pub.showLoading = true;
  submitBankWithdraw(data).then(() => {
    state.amount = '';
    state.password = '';
    state.bank = '';
    showToast($t('pay.p8'));
    getData();
  });
};

const router = useRouter();
const changePage = (url: string) => {
  if (url) {
    router.push(url);
  }
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  let value = target.value;
  value = value.replace(/[^\d.]/g, "");
  if (value.indexOf('.') === 0) {
    value = '0' + value;
  }
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  state.amount = value;
  target.value = value;
};

onBeforeMount(() => {
  getData();
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('pay.p9')" />

    <div class="pageWrap px-3 pb-6">
      <div class="capitalStage mt-4">
        <div class="stageTop">
          <div>
            <div class="heroEyebrow">{{ $t('theme.linkedAccounts') }}</div>
            <div class="stageTitle">{{ $t('pay.p9') }}</div>
          </div>
          <div class="stageIcon">
            <Icon name="solar:wallet-money-linear" size="22" />
          </div>
        </div>
        <div class="stageValue">{{ UseExchangeNumber(withdrawInfo.balance_max) }}</div>
        <div class="stageDesc">{{ $t('theme.linkedAccountsCopy') }}</div>
      </div>

      <van-form class="mt-4" @submit="handleSubmit">
        <div class="fundDesk">
          <div class="deskTop">
            <div>
              <div class="heroEyebrow">{{ $t('theme.latestCoverage') }}</div>
              <div class="deskTitle">{{ $t('pay.p20') }}</div>
            </div>
          </div>

          <div class="formCard mt-4">
            <div class="formBlock">
              <div class="formRow">
                <div class="formLabel">{{ $t('pay.p11') }}</div>
                <div class="textLink" @click="state.amount = String(withdrawInfo.balance_max)">{{ $t('pay.p12') }}</div>
              </div>

              <van-field
                type="text"
                v-model="state.amount"
                :placeholder="$t('pay.p13')"
                :border="false"
                input-align="left"
                class="authInput mt-2"
                @input="handleInput"
              >
                <template #left-icon>
                  <Icon name="solar:wallet-money-linear" size="18" class="fieldIcon" />
                </template>
              </van-field>

              <div class="rangeHint">{{ $t('pay.p14') }}: {{ withdrawInfo.min + ' ~ ' + withdrawInfo.max }}</div>
            </div>

            <div class="formBlock">
              <div class="formLabel">{{ $t('pay.p15') }}</div>
              <van-field :type="showPwd ? 'text' : 'password'" v-model="state.password" :placeholder="$t('pay.p16')"
                :border="false" input-align="left" class="authInput mt-2">
                <template #left-icon>
                  <Icon name="solar:lock-password-linear" size="18" class="fieldIcon" />
                </template>
                <template #right-icon>
                  <div class="fieldAction" @click="showPwd = !showPwd">
                    <Icon :name="showPwd ? 'solar:eye-linear' : 'solar:eye-closed-linear'" size="18" />
                  </div>
                </template>
              </van-field>
            </div>

            <div class="formBlock">
              <div class="formLabel">{{ $t('pay.p17') }}</div>
              <div v-if="bankColumns.length > 0">
                <van-field
                  v-if="bankList.length > 0"
                  :model-value="selectedBankName"
                  readonly
                  is-link
                  :placeholder="$t('pay.p18')"
                  :border="false"
                  input-align="left"
                  class="authInput mt-2 items-center"
                  @click="showBankPicker = true"
                />
                <van-popup v-model:show="showBankPicker" position="bottom" round>
                  <div class="bankPickerPanel">
                    <div class="bankPickerToolbar">
                      <button type="button" class="bankPickerAction bankPickerAction--cancel" @click="showBankPicker = false">
                        {{ $t('mine.m11') }}
                      </button>
                      <div class="bankPickerTitle">{{ $t('pay.p17') }}</div>
                      <button type="button" class="bankPickerAction bankPickerAction--confirm" @click="showBankPicker = false">
                        {{ $t('mine.m10') }}
                      </button>
                    </div>

                    <div class="bankPickerList">
                      <button
                        v-for="item in bankList"
                        :key="item.id"
                        type="button"
                        class="bankPickerItem"
                        :class="{ isActive: item.id == state.bank }"
                        @click="selectBankHandle(item)"
                      >
                        <div class="bankPickerName">{{ item.bank_name }}</div>
                        <div v-if="item.bank_num" class="bankPickerCode">{{ item.bank_num }}</div>
                      </button>
                    </div>
                  </div>
                </van-popup>
              </div>

              <div v-else @click="changePage('/setting/bankList')" class="emptyBank ">
                <span>{{ $t('pay.p19') }}</span>
                <Icon class="w-5 h-5" name="solar:alt-arrow-right-linear" />
              </div>
            </div>
          </div>
        </div>

        <div class="actionDock">
          <div class="contentBtn" @click="handleSubmit">{{ $t('pay.p20') }}</div>
        </div>
      </van-form>
    </div>
  </div>
</template>

<style scoped>
.pageWrap {
  min-height: calc(100vh - 60px);
}

.capitalStage {
  padding: 18px 16px 16px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(212, 154, 58, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.stageTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.heroEyebrow {
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.stageTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
}

.stageValue {
  margin-top: 12px;
  color: var(--text-primary);
  font-size: 30px;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.stageDesc {
  margin-top: 10px;
  max-width: 248px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.stageIcon {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 154, 58, 0.14);
  color: var(--brand-primary);
}

.fundDesk {
  padding: 4px 2px 0;
}

.deskTop {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.deskTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
}

.formCard {
  padding: 0;
  display: grid;
  gap: 18px;
  background: transparent;
  box-shadow: none;
}

.formRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.formLabel {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.formBlock {
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.formBlock:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.authInput {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;

}

.authInput :deep(.van-field__body) {
  min-height: 52px;
}

.authInput :deep(.van-field__control) {
  color: var(--text-primary);
}

.authInput :deep(.van-field__control::placeholder) {
  color: var(--text-placeholder);
}

.fieldIcon {
  color: var(--brand-primary);
  margin-right: 8px;
}

.fieldAction {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
}

.rangeHint {
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.45;
}

.emptyBank {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 54px;
  padding: 0 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
  color: var(--text-secondary);
}

.actionDock {
  position: sticky;
  bottom: 12px;
  margin-top: 22px;
}

.bankPickerPanel {
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 14px);
}

.bankPickerToolbar {
  display: grid;
  grid-template-columns: 72px 1fr 72px;
  align-items: center;
  padding: 14px 16px 12px;
  border-bottom: 1px solid var(--border-soft);
}

.bankPickerTitle {
  text-align: center;
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 700;
}

.bankPickerAction {
  border: 0;
  background: transparent;
  padding: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
}

.bankPickerAction--cancel {
  color: var(--text-secondary);
  text-align: left;
}

.bankPickerAction--confirm {
  color: var(--brand-primary);
  text-align: right;
}

.bankPickerList {
  display: grid;
  gap: 12px;
  padding: 16px;
  max-height: min(52vh, 420px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.bankPickerItem {
  position: relative;
  display: grid;
  gap: 6px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border-soft);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  text-align: center;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.bankPickerItem.isActive {
  background:
    radial-gradient(circle at top left, rgba(212, 154, 58, 0.12), transparent 42%),
    rgba(255, 255, 255, 0.06);
  border-color: rgba(212, 154, 58, 0.34);
  box-shadow:
    inset 0 0 0 1px rgba(212, 154, 58, 0.14),
    0 8px 24px rgba(212, 154, 58, 0.12);
  transform: translateY(-1px);
}

.bankPickerItem.isActive::after {
  content: "";
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--brand-primary);
  box-shadow: 0 0 0 4px rgba(212, 154, 58, 0.14);
}

.bankPickerName {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
}

.bankPickerItem.isActive .bankPickerName {
  color: var(--brand-primary);
}

.bankPickerCode {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.4;
}

.bankPickerItem.isActive .bankPickerCode {
  color: var(--text-primary);
}
</style>
