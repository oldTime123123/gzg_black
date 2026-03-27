<script lang="ts" setup>
import * as v from 'valibot';
import { computed } from 'vue';
import { decryptData, encryptData } from '../../utils/loginEncrypt';
import { showToast } from 'vant';

const { t } = useI18n();
const publicStore = usePublicStore();
const userStore = useUserStore();
const loginStore = useLoginStore();

const schema = v.object({
  account: v.pipe(v.string(), v.minLength(1, t('login.l7'))),
  password: v.pipe(v.string(), v.minLength(6, t('login.l9'))),
});

const state = reactive({
  account: '',
  password: '',
});

const showPwd = ref(false);
const rememberPwd = ref(false);

const router = useRouter();
const changePage = (link: string) => {
  router.push(link);
};

const handleSubmit = async (values: any) => {
  if (!showBtnStatus.value) return;
  publicStore.showLoading = true;
  const { account, password } = Object.assign({}, state, values);
  userStore
    .phoneLogin(account, password)
    .then(() => {
      loginStore.loadingText = t('login.l15');
      if (rememberPwd.value) {
        loginStore.rememberPwd = rememberPwd.value;
        const userLoginInfo = {
          account,
          password,
        };
        const data = encryptData(JSON.stringify(userLoginInfo));
        loginStore.accInfo = data;
      }
      router.push('/');
    })
    .catch((e) => {
     showToast(e.message );
    }).finally(() => {
  // publicStore.showLoading = false;

    });
};

const showBtnStatus = computed(() => {
  const result = v.safeParse(schema, state);
  return result.success;
});

onMounted(() => {
  loginStore.initLoginData();

  if (loginStore.rememberPwd) {
    rememberPwd.value = loginStore.rememberPwd;
    if (loginStore.accInfo) {
      const data = JSON.parse(decryptData(loginStore.accInfo));
      state.account = data.account;
      state.password = data.password;
    }
  }
});
</script>

<template>
  <AuthShell :title="$t('login.l4')" :subtitle="$t('login.l5')" :eyebrow="$t('theme.tradingAccess')" back-path="/auth/beforeLogin">
    <ClientOnly>
      <van-form @submit="handleSubmit">
        <div class="formStack">
          <div class="formBlock">
            <div class="formLabel">{{ $t('login.l6') }}</div>
            <van-field v-model="state.account" name="account" :placeholder="$t('login.l7')" :border="false"
              input-align="left" class="authInput mt-2" :rules="[{ required: true, message: $t('login.l7') }]">
              <template #left-icon>
                <Icon name="solar:user-circle-linear" size="18" class="fieldIcon" />
              </template>
            </van-field>
          </div>

          <div class="formBlock">
            <div class="formLabel">{{ $t('login.l8') }}</div>
            <van-field :type="showPwd ? 'text' : 'password'" v-model="state.password" name="password"
              :placeholder="$t('login.l9')" :border="false" input-align="left" class="authInput mt-2" :rules="[
                { required: true, message: $t('login.l9') },
                { pattern: /.{6,}/, message: $t('login.l9') }
              ]">
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

          <div class="utilityRow">
            <div class="rememberWrap">
              <van-checkbox v-model="rememberPwd" icon-size="18" class="rememberCheck" />
              <span>{{ $t('login.l11') }}</span>
            </div>
            <div class="textLink" @click="changePage('/auth/forgot-password')">{{ $t('theme.forgotPassword') }}</div>
          </div>

          <button native-type="submit" class="contentBtn" :class="!showBtnStatus ? 'disAbledBtn' : ''">
            {{ $t('login.l12') }}
          </button>

          <div class="switchPanel">
            <span>{{ $t('login.l13') }}</span>
            <span class="textLink" @click="changePage('/auth/register')">{{ $t('login.l14') }}</span>
          </div>
        </div>
      </van-form>
    </ClientOnly>
  </AuthShell>
</template>

<style scoped>
.formStack {
  display: grid;
  gap: 18px;
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
  font-size: 14px;
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

.utilityRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 13px;
}

.rememberWrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.rememberCheck :deep(.van-checkbox__icon--checked .van-icon) {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.switchPanel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 13px;
}

.textLink {
  color: var(--brand-primary);
  font-weight: 700;
}
</style>
