<script setup lang="ts">
import * as v from 'valibot';
import { showToast } from 'vant';
import { getUserBankcardInfo, postUserBankcard } from '~/api/home/home';

const { t } = useI18n();
const route = useRoute();
const pub = usePublicStore();
const formRef = ref();
type BalanceTypeOption = {
  type: number;
  name: string;
};

type BankcardForm = {
  id: number;
  balance_type: number;
  bank_num: string;
  bank_name: string;
  account_holder: string;
  other_param_1: string;
  other_param_2: string;
};

type BankcardInfoResponse = {
  bankcard?: Partial<BankcardForm>;
  balanceList?: BalanceTypeOption[];
};

const balanceTypeList = ref<BalanceTypeOption[]>([]);
const showBalanceTypePicker = ref(false);
const draftBalanceType = ref(0);

const state = reactive({
  id: Number.isNaN(Number(route.query.bankId)) ? 0 : Number(route.query.bankId),
  balance_type: 0,
  bank_num: '',
  bank_name: '',
  account_holder: '',
  other_param_1: '',
  other_param_2: '',
});

const schema = v.object({
  bank_num: v.pipe(v.string(), v.nonEmpty(t('setting.s7'))),
  bank_name: v.pipe(v.string(), v.nonEmpty(t('setting.s8'))),
  account_holder: v.pipe(v.string(), v.nonEmpty(t('setting.s9'))),
  other_param_1: v.pipe(v.string(), v.nonEmpty(t('setting.s10'))),
  other_param_2: v.pipe(v.string(), v.nonEmpty(t('setting.s21'))),
  balance_type: v.pipe(
    v.number(),
    v.check((input) => balanceTypeList.value.length === 0 || !!input, t('setting.s11'))
  ),
});

const valibotValidator = (fieldKey: keyof typeof schema.entries) => {
  return () => {
    const result = v.safeParse(schema, state);
    if (result.success) return true;
    const issue = result.issues.find((i) => i.path?.[0].key === fieldKey);
    return issue ? issue.message : true;
  };
};

const selectedBalanceTypeName = computed(() => {
  const cur = balanceTypeList.value.find((i) => i.type === state.balance_type);
  return cur ? cur.name : '';
});

const openBalanceTypePicker = () => {
  draftBalanceType.value = state.balance_type || balanceTypeList.value[0]?.type || 0;
  showBalanceTypePicker.value = true;
};

const closeBalanceTypePicker = () => {
  showBalanceTypePicker.value = false;
};

const confirmBalanceTypePicker = () => {
  const target = balanceTypeList.value.find((i) => i.type === draftBalanceType.value) || balanceTypeList.value[0];
  if (target) state.balance_type = target.type;
  closeBalanceTypePicker();
  formRef.value?.validate('balance_type');
};

const router = useRouter();
const handleSubmit = () => {
  const data: BankcardForm = Object.assign({}, state);
  pub.showLoading = true;
  postUserBankcard(data)
    .then(() => {
      showToast(data.id ? t('setting.s12') : t('setting.s13'));
      router.back();
    })
    .finally(() => {
      pub.showLoading = false;
    });
};

onMounted(() => {
  const bankId = Number(route.query.bankId);

  getUserBankcardInfo(bankId)
    .then((res: BankcardInfoResponse) => {
      const { bankcard, balanceList } = res;
      balanceTypeList.value = balanceList || [];

      if (bankcard) {
        Object.assign(state, bankcard);
      } else if (balanceList && balanceList.length > 0) {
        state.balance_type = balanceList[0].type;
      }
    })
    .finally(() => {
      pub.showLoading = false;
    });
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('setting.s14')" />

    <div class="pageWrap px-3 pb-6">

      <van-form ref="formRef"  @submit="handleSubmit">
        <div class="editorDesk">
          <div class="formCard ">
            <div v-if="balanceTypeList.length > 0" class="formBlock">
              <div class="formLabel">{{ $t('setting.s20') }}</div>
              <van-field :model-value="selectedBalanceTypeName" name="balance_type" readonly is-link
                :placeholder="$t('setting.s20')" :border="false" input-align="left" class="authInput mt-2"
                @click="openBalanceTypePicker"
                :rules="[{ validator: valibotValidator('balance_type'), trigger: 'onChange' }]">
                <template #left-icon>
                  <Icon name="solar:card-2-linear" size="18" class="fieldIcon" />
                </template>
              </van-field>
            </div>

            <div class="formBlock">
              <div class="formLabel">{{ $t('xx.a4') }}</div>
              <van-field v-model="state.account_holder" name="account_holder" :placeholder="$t('xx.a4')" :border="false"
                input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('account_holder') }]">
                <template #left-icon>
                  <Icon name="solar:user-circle-linear" size="18" class="fieldIcon" />
                </template>
              </van-field>
            </div>

            <div class="formBlock">
              <div class="formLabel">{{ $t('xx.a6') }}</div>
              <van-field v-model="state.bank_name" name="bank_name" :placeholder="$t('xx.a6')" :border="false"
                input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('bank_name') }]">
                <template #left-icon>
                  <Icon name="solar:buildings-linear" size="18" class="fieldIcon" />
                </template>
              </van-field>
            </div>

            <div class="formBlock">
              <div class="formLabel">{{ $t('xx.a3') }}</div>
              <van-field v-model="state.bank_num" name="bank_num" :placeholder="$t('setting.s17')" :border="false"
                input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('bank_num') }]">
                <template #left-icon>
                  <Icon name="solar:card-recive-linear" size="18" class="fieldIcon" />
                </template>
              </van-field>
            </div>

            <div class="formBlock">
              <div class="formLabel">{{ $t('setting.s21') }}</div>
              <van-field v-model="state.other_param_2" name="other_param_2" :placeholder="$t('setting.s21')" :border="false"
                input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('other_param_2') }]">
                <template #left-icon>
                  <Icon name="solar:hashtag-chat-linear" size="18" class="fieldIcon" />
                </template>
              </van-field>
            </div>

            <div class="formBlock">
              <div class="formLabel">{{ $t('xx.a5') }}</div>
              <van-field v-model="state.other_param_1" name="other_param_1" :placeholder="$t('xx.a5')" :border="false"
                input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('other_param_1') }]">
                <template #left-icon>
                  <Icon name="solar:buildings-2-linear" size="18" class="fieldIcon" />
                </template>
              </van-field>
            </div>
          </div>
        </div>

        <div class="actionDock">
          <button class="contentBtn" type="submit">{{ $t('setting.s25') }}</button>
        </div>
      </van-form>

      <van-popup v-model:show="showBalanceTypePicker" position="bottom" round class="balanceTypePopup">
        <div class="balanceTypeSheet">
          <div class="balanceTypeToolbar">
            <button class="balanceTypeAction balanceTypeActionMuted" type="button" @click="closeBalanceTypePicker">
              {{ $t('mine.m11') }}
            </button>
            <div class="balanceTypeTitle">{{ $t('setting.s20') }}</div>
            <button class="balanceTypeAction" type="button" @click="confirmBalanceTypePicker">
              {{ $t('mine.m10') }}
            </button>
          </div>

          <van-radio-group v-model="draftBalanceType" class="balanceTypeList">
            <div class="balanceTypeListInner">
              <div
                v-for="item in balanceTypeList"
                :key="item.type"
                class="balanceTypeCell"
                role="button"
                tabindex="0"
                @click="draftBalanceType = item.type"
                @keydown.enter.prevent="draftBalanceType = item.type"
                @keydown.space.prevent="draftBalanceType = item.type"
              >
                <div class="balanceTypeCellLabel">{{ item.name }}</div>
                <van-radio :name="item.type" checked-color="var(--brand-primary)" />
              </div>
            </div>
          </van-radio-group>
        </div>
      </van-popup>
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

.editorStage {
  padding: 2px 2px 8px;
}

.stageTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 22px;
  line-height: 1.15;
  font-weight: 700;
}

.editorDesk {
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

.formBlock {
  display: grid;
  gap: 10px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border-soft);
}

.formBlock:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.formLabel {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.authInput {
  padding: 14px 16px;
  background: var(--surface-interactive-soft);
  border: 1px solid var(--border-default);
  border-radius: 18px;
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}

.authInput:focus-within {
  border-color: rgba(125, 211, 252, 0.46);
  box-shadow: 0 0 0 3px rgba(125, 211, 252, 0.14);
  background: var(--surface-interactive-strong);
}

.authInput :deep(.van-cell__value) {
  overflow: visible;
}

.authInput :deep(.van-field__body) {
  min-height: 24px;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.authInput :deep(.van-field__control) {
  min-width: 0;
  flex: 1 1 auto;
  width: 100%;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.4;
}

.authInput :deep(.van-field__control::placeholder) {
  color: var(--text-placeholder);
}

.authInput :deep(.van-field__left-icon),
.authInput :deep(.van-field__right-icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
  margin: 0;
}

.authInput :deep(.van-field__left-icon) {
  margin-right: 12px;
}

.authInput :deep(.van-field__right-icon) {
  margin-left: auto;
}

.authInput :deep(.van-field__value) {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
}

.fieldIcon {
  color: var(--brand-primary);
  margin-right: 0;
}

.authInput :deep(.van-field__error-message) {
  display: block;
  width: 100%;
  margin-top: 10px;
  color: var(--color-up);
  font-size: 11px;
  line-height: 1.35;
}

.actionDock {
  position: sticky;
  bottom: 12px;
  margin-top: 22px;
}

.balanceTypeSheet {
  display: flex;
  flex-direction: column;
  height: 420px;
  max-height: calc(100vh - 96px);
}

.balanceTypeList {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
}

.balanceTypeToolbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
  border-bottom: 1px solid var(--border-soft);
}

.balanceTypeTitle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 700;
}

.balanceTypeAction {
  min-width: 72px;
  padding: 0;
  color: var(--brand-primary);
  font-size: 15px;
  font-weight: 700;
  background: transparent;
  border: 0;
}

.balanceTypeActionMuted {
  color: var(--text-secondary);
}

.balanceTypeListInner {
  padding: 14px 12px 0;
  display: grid;
  gap: 12px;
}

.balanceTypeCell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 52px;
  width: 100%;
  padding: 0 16px;
  background: var(--surface-interactive-soft);
  border: 1px solid var(--border-default);
  border-radius: 18px;
  appearance: none;
  text-align: left;
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
}

.balanceTypeCell:active {
  transform: scale(.99);
}

.balanceTypeCellLabel {
  position: absolute;
  left: 16px;
  right: 16px;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  pointer-events: none;
}

.balanceTypePopup :deep(.van-radio) {
  z-index: 1;
}

.balanceTypePopup :deep(.van-radio__icon) {
  font-size: 18px;
}

.balanceTypePopup :deep(.van-radio__label) {
  display: none;
}
</style>
