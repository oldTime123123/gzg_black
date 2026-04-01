<script setup lang="ts">
import * as v from 'valibot';
import { showToast } from 'vant';
import { updatePwdApi } from "~/api/setting/index";

const publicStore = usePublicStore();
const { t } = useI18n();
const route = useRoute();
const formRef = ref();

const schema = v.pipe(
  v.object({
    val1: v.pipe(v.string(), v.nonEmpty(t('setting.s47'))),
    val2: v.pipe(v.string(), v.nonEmpty(t('setting.s48'))),
    val3: v.pipe(v.string(), v.nonEmpty(t('setting.s49'))),
  }),
  v.forward(v.check((input) => input.val2 === input.val3, t('setting.s50')), ['val3'])
);

const state = reactive({
  val1: '',
  val2: '',
  val3: '',
});

const passwordState = reactive({
  showPwd1: false,
  showPwd2: false,
  showPwd3: false,
});

const curType = route.query.type;

const valibotValidator = (fieldKey: keyof typeof state) => {
  return () => {
    const result = v.safeParse(schema, state);
    if (result.success) return true;
    const issue = result.issues.find((i) => i.path?.[0].key === fieldKey);
    return issue ? issue.message : true;
  };
};

watch(() => state.val2, () => {
  if (state.val3) {
    formRef.value?.validate('val3');
  }
});

const handleSubmit = () => {
  publicStore.showLoading = true;
  const { val1, val2, val3 } = state;

  updatePwdApi({
    old_password: val1,
    password: val2,
    password2: val3,
    type: route.query.type,
  })
    .then(() => {
      showToast(t('setting.s51'));
      Object.assign(state, {
        val1: '',
        val2: '',
        val3: '',
      });
    })
    .finally(() => {
      publicStore.showLoading = false;
    });
};

onMounted(() => {
  publicStore.showLoading = false;
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="curType > 0 ? $t('setting.s52') : $t('setting.s53')" />

    <div class="settingWrap px-3 pb-6">
      <van-form ref="formRef" class="mt-4" @submit="handleSubmit">
        <div class="sectionCard formCard">
          <div class="formBlock">
            <div class="formLabel">{{ $t('setting.s54') }}</div>
            <van-field name="val1" :type="passwordState.showPwd1 ? 'text' : 'password'" v-model="state.val1"
              :placeholder="$t('setting.s55')" :border="false" input-align="left" class="authInput mt-2"
              :rules="[{ validator: valibotValidator('val1') }]">
              <template #left-icon>
                <Icon name="solar:shield-keyhole-linear" size="18" class="fieldIcon" />
              </template>
              <template #right-icon>
                <button type="button" class="fieldAction" :aria-pressed="passwordState.showPwd1" @click="passwordState.showPwd1 = !passwordState.showPwd1">
                  <Icon :name="passwordState.showPwd1 ? 'solar:eye-linear' : 'solar:eye-closed-linear'" size="18" />
                </button>
              </template>
            </van-field>
          </div>

          <div class="formBlock">
            <div class="formLabel">{{ $t('setting.s56') }}</div>
            <van-field name="val2" :type="passwordState.showPwd2 ? 'text' : 'password'" v-model="state.val2"
              :placeholder="$t('setting.s57')" :border="false" input-align="left" class="authInput mt-2"
              :rules="[{ validator: valibotValidator('val2') }]">
              <template #left-icon>
                <Icon name="solar:lock-password-linear" size="18" class="fieldIcon" />
              </template>
              <template #right-icon>
                <button type="button" class="fieldAction" :aria-pressed="passwordState.showPwd2" @click="passwordState.showPwd2 = !passwordState.showPwd2">
                  <Icon :name="passwordState.showPwd2 ? 'solar:eye-linear' : 'solar:eye-closed-linear'" size="18" />
                </button>
              </template>
            </van-field>
          </div>

          <div class="formBlock">
            <div class="formLabel">{{ $t('setting.s58') }}</div>
            <van-field name="val3" :type="passwordState.showPwd3 ? 'text' : 'password'" v-model="state.val3"
              :placeholder="$t('setting.s59')" :border="false" input-align="left" class="authInput mt-2"
              :rules="[{ validator: valibotValidator('val3') }]">
              <template #left-icon>
                <Icon name="solar:shield-check-linear" size="18" class="fieldIcon" />
              </template>
              <template #right-icon>
                <button type="button" class="fieldAction" :aria-pressed="passwordState.showPwd3" @click="passwordState.showPwd3 = !passwordState.showPwd3">
                  <Icon :name="passwordState.showPwd3 ? 'solar:eye-linear' : 'solar:eye-closed-linear'" size="18" />
                </button>
              </template>
            </van-field>
          </div>
        </div>

        <div class="actionDock">
          <button type="submit" class="contentBtn actionBtn">
            {{ $t('setting.s60') }}
          </button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<style scoped>
.settingWrap {
  min-height: calc(100vh - 60px);
}

.formBlock {
  display: grid;
  gap: 10px;
}

.formCard {
  padding: 18px;
}

.heroEyebrow {
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.heroDesc {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.55;
}

.formCard {
  display: grid;
  gap: 16px;
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

.fieldAction {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  appearance: none;
  border: 0;
  background: transparent;
  border-radius: 12px;
  transition: transform .18s ease, color .18s ease, background .18s ease;
}

.fieldAction:active {
  transform: scale(.96);
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
  margin-top: 18px;
}

.actionBtn {
  width: 100%;
}
</style>
