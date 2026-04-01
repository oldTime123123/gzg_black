<script setup lang="ts">
import * as v from 'valibot';
import { showToast } from 'vant';

const { t } = useI18n();
const loginStore = useLoginStore();
const userStore = useUserStore();
const showPwd = ref(false);
const showFundPwd = ref(false);
const rememberPwd = ref(false);
const publicStore = usePublicStore();
const formRef = ref();

const router = useRouter();
const changePage = (link: string) => {
  router.push(link);
};

const schema = v.object({
  account: v.pipe(v.string(), v.minLength(1, t('login.l31'))),
  password: v.pipe(v.string(), v.minLength(6, t('login.l32'))),
  fundPwd: v.pipe(v.string(), v.minLength(6, t('login.l33'))),
  inviteCode: v.pipe(v.string(), v.minLength(6, t('login.l34'))),
});

const state = reactive({
  account: '',
  password: '',
  fundPwd: '',
  inviteCode: '',
});

onMounted(() => {
  loginStore.initLoginData();
});

watch(
  () => state.password,
  () => {
    if (state.fundPwd) {
      formRef.value?.validate('fundPwd');
    }
  }
);

const handleSubmit = async () => {
  if (!rememberPwd.value) {
    showToast(t('x.a24'));
    return;
  }
  // publicStore.showLoading = true;
  const { account, password, fundPwd, inviteCode } = state;
  userStore
    .accountRegister(account, password, fundPwd, inviteCode)
    .then(() => {
      loginStore.loadingText = t('login.l30');
      router.push('/');
    })
    .catch(() => {
      loginStore.loading = false;
    });
};
</script>

<template>
  <AuthShell :title="$t('login.l16')" :subtitle="$t('login.l17')" :eyebrow="$t('theme.createAccess')" back-path="/auth/login">
    <ClientOnly>
      <van-form @submit="handleSubmit" ref="formRef">
        <div class="grid gap-5">
          <div class="grid gap-4">
            <div class="grid gap-2.5">
              <div class="text-[13px] font-bold tracking-[0.02em] text-[var(--text-primary)]">{{ $t('login.l18') }}</div>
              <van-field v-model="state.account" name="account" :placeholder="$t('login.l19')" :border="false"
                input-align="left" class="authInput" :rules="[{ required: true, message: $t('login.l31') }]">
                <template #left-icon>
                  <Icon name="solar:user-circle-linear" size="18" class="fieldIcon" />
                </template>
              </van-field>
            </div>

            <div class="grid gap-2.5">
              <div class="text-[13px] font-bold tracking-[0.02em] text-[var(--text-primary)]">{{ $t('login.l20') }}</div>
              <van-field :type="showPwd ? 'text' : 'password'" v-model="state.password" name="password"
                :placeholder="$t('login.l21')" :border="false" input-align="left" class="authInput" :rules="[
                  { required: true, message: $t('login.l32') },
                  { pattern: /.{6,}/, message: $t('login.l32') }
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

            <div class="grid gap-2.5">
              <div class="text-[13px] font-bold tracking-[0.02em] text-[var(--text-primary)]">{{ $t('login.l22') }}</div>
              <van-field :type="showFundPwd ? 'text' : 'password'" v-model="state.fundPwd" name="fundPwd"
                :placeholder="$t('login.l22')" :border="false" input-align="left" class="authInput" :rules="[
                  { required: true, message: $t('login.l33') },
                  { pattern: /.{6,}/, message: $t('login.l33') },
                  { validator: (val) => val === state.password, message: $t('setting.s50') }
                ]">
                <template #left-icon>
                  <Icon name="solar:shield-keyhole-linear" size="18" class="fieldIcon" />
                </template>
                <template #right-icon>
                  <button type="button" class="fieldAction" :aria-pressed="showFundPwd" @click="showFundPwd = !showFundPwd">
                    <Icon :name="showFundPwd ? 'solar:eye-linear' : 'solar:eye-closed-linear'" size="18" />
                  </button>
                </template>
              </van-field>
            </div>

            <template v-if="loginStore.registerInviteCode">
              <div class="grid gap-2.5">
                <div class="text-[13px] font-bold tracking-[0.02em] text-[var(--text-primary)]">{{ $t('login.l23') }}</div>
                <van-field v-model="state.inviteCode" name="inviteCode" :placeholder="$t('login.l24')" :border="false"
                  input-align="left" class="authInput" :rules="[
                    { required: true, message: $t('login.l34') },
                    { pattern: /.{6,}/, message: $t('login.l34') }
                  ]">
                  <template #left-icon>
                    <Icon name="solar:ticket-linear" size="18" class="fieldIcon" />
                  </template>
                </van-field>
              </div>
            </template>
          </div>

          <div class="pt-1">
            <div class="flex items-start gap-2.5">
              <van-checkbox v-model="rememberPwd" icon-size="18" class="rememberCheck shrink-0" />
              <div class="text-[13px] leading-[1.55] text-[var(--text-secondary)]">
                {{ $t('login.l25') }}
                <button type="button" class="textLink" @click="changePage('/mine/xieyi')">{{ $t('login.l26') }}</button>
                {{ $t('login.l27') }}
              </div>
            </div>
          </div>

          <button native-type="submit" class="contentBtn">
            {{ $t('login.l28') }}
          </button>

          <div class="flex items-center justify-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
            <span>{{ $t('login.l29') }}</span>
            <button type="button" class="textLink" @click="changePage('/auth/login')">{{ $t('x.a7') }}</button>
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
  font-size: 12px;
  line-height: 1.4;
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
