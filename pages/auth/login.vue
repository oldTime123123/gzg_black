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
type LoginFormState = typeof state;

const showPwd = ref(false);
const rememberPwd = ref(false);

const router = useRouter();
const changePage = (link: string) => {
  router.push(link);
};

const handleSubmit = async (values: Partial<LoginFormState>) => {
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
        <div class="grid gap-5">
          <div class="grid gap-4">
            <div class="grid gap-2.5">
              <div class="text-[13px] font-bold tracking-[0.02em] text-[var(--text-primary)]">{{ $t('login.l6') }}</div>
              <van-field v-model="state.account" name="account" :placeholder="$t('login.l7')" :border="false"
                input-align="left" class="authInput" :rules="[{ required: true, message: $t('login.l7') }]">
                <template #left-icon>
                  <Icon name="solar:user-circle-linear" size="18" class="fieldIcon" />
                </template>
              </van-field>
            </div>

            <div class="grid gap-2.5">
              <div class="text-[13px] font-bold tracking-[0.02em] text-[var(--text-primary)]">{{ $t('login.l8') }}</div>
              <van-field :type="showPwd ? 'text' : 'password'" v-model="state.password" name="password"
                :placeholder="$t('login.l9')" :border="false" input-align="left" class="authInput" :rules="[
                  { required: true, message: $t('login.l9') },
                  { pattern: /.{6,}/, message: $t('login.l9') }
                ]">
                <template #left-icon>
                  <Icon name="solar:lock-password-linear" size="18" class="fieldIcon" />
                </template>
                <template #right-icon>
                  <button type="button" class="fieldAction" :aria-pressed="showPwd" @click="showPwd = !showPwd">
                    <Icon :name="showPwd ? 'solar:eye-linear' : 'solar:eye-closed-linear'" size="18" />
                  </button>
                </template>
              </van-field>
            </div>

            <div class="flex items-center justify-between gap-3 pt-1 text-[13px] text-[var(--text-secondary)]">
              <div class="inline-flex items-center gap-2">
                <van-checkbox v-model="rememberPwd" icon-size="18" class="rememberCheck" />
                <span>{{ $t('login.l11') }}</span>
              </div>
            </div>
          </div>

          <button type="submit" class="contentBtn" :class="!showBtnStatus ? 'disAbledBtn' : ''">
            {{ $t('login.l12') }}
          </button>

          <div class="flex items-center justify-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
            <span>{{ $t('login.l13') }}</span>
            <button type="button" class="textLink" @click="changePage('/auth/register')">{{ $t('login.l14') }}</button>
          </div>
        </div>
      </van-form>
    </ClientOnly>
  </AuthShell>
</template>

<style scoped>
.authInput {
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
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

.authInput:focus-within {
  border-color: rgba(56, 189, 248, 0.42);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.12);
  background: rgba(255, 255, 255, 0.05);
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
  opacity: 1;
  appearance: none;
  border: 0;
  background: transparent;
  border-radius: 12px;
  transition: transform 0.18s ease, color 0.18s ease, background 0.18s ease;
}

.fieldAction:active {
  transform: scale(0.96);
}

.authInput :deep(.van-field__error-message) {
  display: block;
  width: 100%;
  margin-top: 10px;
  color: var(--color-up);
  font-size: 11px;
  line-height: 1.35;
}

.rememberCheck :deep(.van-checkbox__icon--checked .van-icon) {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
}

.textLink {
  color: var(--brand-primary);
  font-weight: 700;
  appearance: none;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
}
</style>
