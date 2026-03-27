<script setup lang="ts">
import * as v from 'valibot';
import { showToast } from 'vant';
import { getUserBankcardInfo, postUserBankcard } from '~/api/home/home';

const { t } = useI18n();
const route = useRoute();
const pub = usePublicStore();
const formRef = ref();
const balanceTypeList = ref<any[]>([]);
const showBalanceTypePicker = ref(false);

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

const balanceTypeColumns = computed(() => balanceTypeList.value.map((i: any) => ({ text: i.name, value: i.type })));

const selectedBalanceTypeName = computed(() => {
  const cur = balanceTypeList.value.find((i: any) => i.type === state.balance_type);
  return cur ? cur.name : '';
});

const onBalanceTypeConfirm = (...args: any[]) => {
  if (args.length >= 2 && typeof args[1] === 'number') {
    const index = args[1];
    const item = balanceTypeList.value[index];
    if (item) state.balance_type = item.type;
  } else {
    const opt = args[0]?.selectedOptions?.[0];
    if (opt && Object.prototype.hasOwnProperty.call(opt, 'value')) {
      state.balance_type = opt.value;
    }
  }
  showBalanceTypePicker.value = false;
  formRef.value?.validate('balance_type');
};

const router = useRouter();
const handleSubmit = () => {
  const data: any = Object.assign({}, state);
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
    .then((res: any) => {
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
      <div class="heroCard">
        <div class="heroIcon">
          <Icon name="solar:card-edit-linear" size="24" />
        </div>
        <div class="heroCopy">
          <div class="sectionSubtext">{{ $t('theme.bankDetails') }}</div>
        </div>
      </div>

      <van-form ref="formRef" class="mt-4" @submit="handleSubmit">
        <div class="sectionCard formCard">
          <div v-if="balanceTypeList.length > 0" class="formBlock">
            <div class="formLabel">{{ $t('setting.s20') }}</div>
            <van-field :model-value="selectedBalanceTypeName" name="balance_type" readonly is-link
              :placeholder="$t('setting.s20')" :border="false" input-align="left" class="authInput mt-2"
              @click="showBalanceTypePicker = true"
              :rules="[{ validator: valibotValidator('balance_type'), trigger: 'onChange' }]" />
          </div>

          <div class="formBlock">
            <div class="formLabel">{{ $t('xx.a4') }}</div>
            <van-field v-model="state.account_holder" name="account_holder" :placeholder="$t('xx.a4')" :border="false"
              input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('account_holder') }]" />
          </div>

          <div class="formBlock">
            <div class="formLabel">{{ $t('xx.a6') }}</div>
            <van-field v-model="state.bank_name" name="bank_name" :placeholder="$t('xx.a6')" :border="false"
              input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('bank_name') }]" />
          </div>

          <div class="formBlock">
            <div class="formLabel">{{ $t('xx.a3') }}</div>
            <van-field v-model="state.bank_num" name="bank_num" :placeholder="$t('setting.s17')" :border="false"
              input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('bank_num') }]" />
          </div>

          <div class="formBlock">
            <div class="formLabel">{{ $t('setting.s21') }}</div>
            <van-field v-model="state.other_param_2" name="other_param_2" :placeholder="$t('setting.s21')" :border="false"
              input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('other_param_2') }]" />
          </div>

          <div class="formBlock">
            <div class="formLabel">{{ $t('xx.a5') }}</div>
            <van-field v-model="state.other_param_1" name="other_param_1" :placeholder="$t('xx.a5')" :border="false"
              input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('other_param_1') }]" />
          </div>
        </div>

        <div class="actionDock">
          <button class="contentBtn" type="submit">{{ $t('setting.s25') }}</button>
        </div>
      </van-form>

      <van-popup v-model:show="showBalanceTypePicker" position="bottom" round>
        <van-picker :confirm-button-text="$t('mine.m10')" :cancel-button-text="$t('mine.m11')"
          :columns="balanceTypeColumns" @confirm="onBalanceTypeConfirm" @cancel="showBalanceTypePicker = false" />
      </van-popup>
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
  gap: 14px;
  margin-top: 14px;
  padding: 18px;
  border-radius: 24px;
  background: var(--gradient-hero);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
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

.formCard {
  padding: 18px;
  display: grid;
  gap: 16px;
}

.formLabel {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}

.authInput {
  background: rgba(255, 255, 255, 0.04);
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

.actionDock {
  position: sticky;
  bottom: 12px;
  margin-top: 18px;
}
</style>
