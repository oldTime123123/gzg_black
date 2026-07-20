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
      <div class="heroCard">
        <div class="sectionSubtext">{{ $t('theme.securityUpdate') }}</div>
        <div class="heroDesc">{{ $t('theme.securityUpdateCopy') }}</div>
      </div>

      <van-form ref="formRef" class="mt-4" @submit="handleSubmit">
        <div class="sectionCard formCard">
          <div class="formBlock">
            <div class="formLabel">{{ $t('setting.s54') }}</div>
            <van-field name="val1" :type="passwordState.showPwd1 ? 'text' : 'password'" v-model="state.val1"
              :placeholder="$t('setting.s55')" :border="false" input-align="left" class="authInput mt-2"
              :rules="[{ validator: valibotValidator('val1') }]">
              <template #left-icon>
                <Icon name="lucide:key-round" size="18" class="fieldIcon" />
              </template>
              <template #right-icon>
                <div class="fieldAction" @click="passwordState.showPwd1 = !passwordState.showPwd1">
                  <Icon :name="passwordState.showPwd1 ? 'lucide:eye' : 'lucide:eye-off'" size="18" />
                </div>
              </template>
            </van-field>
          </div>

          <div class="formBlock">
            <div class="formLabel">{{ $t('setting.s56') }}</div>
            <van-field name="val2" :type="passwordState.showPwd2 ? 'text' : 'password'" v-model="state.val2"
              :placeholder="$t('setting.s57')" :border="false" input-align="left" class="authInput mt-2"
              :rules="[{ validator: valibotValidator('val2') }]">
              <template #left-icon>
                <Icon name="lucide:lock-keyhole" size="18" class="fieldIcon" />
              </template>
              <template #right-icon>
                <div class="fieldAction" @click="passwordState.showPwd2 = !passwordState.showPwd2">
                  <Icon :name="passwordState.showPwd2 ? 'lucide:eye' : 'lucide:eye-off'" size="18" />
                </div>
              </template>
            </van-field>
          </div>

          <div class="formBlock">
            <div class="formLabel">{{ $t('setting.s58') }}</div>
            <van-field name="val3" :type="passwordState.showPwd3 ? 'text' : 'password'" v-model="state.val3"
              :placeholder="$t('setting.s59')" :border="false" input-align="left" class="authInput mt-2"
              :rules="[{ validator: valibotValidator('val3') }]">
              <template #left-icon>
                <Icon name="lucide:shield-check" size="18" class="fieldIcon" />
              </template>
              <template #right-icon>
                <div class="fieldAction" @click="passwordState.showPwd3 = !passwordState.showPwd3">
                  <Icon :name="passwordState.showPwd3 ? 'lucide:eye' : 'lucide:eye-off'" size="18" />
                </div>
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

.heroCard,
.formCard {
  padding: 18px;
}

.heroCard {
  margin-top: 14px;
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
  line-height: 1.15;
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

.fieldIcon {
  color: var(--text-secondary);
  margin-right: 8px;
}

.fieldAction {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
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
