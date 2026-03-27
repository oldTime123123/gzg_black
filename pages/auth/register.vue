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
        <div class="formStack">
          <div class="formLabel">{{ $t('login.l18') }}</div>
          <van-field v-model="state.account" name="account" :placeholder="$t('login.l19')" :border="false"
            input-align="left" class="authInput" :rules="[{ required: true, message: $t('login.l31') }]">
            <template #left-icon>
              <Icon name="solar:user-circle-linear" size="18" class="fieldIcon" />
            </template>
          </van-field>

          <div class="formLabel">{{ $t('login.l20') }}</div>
          <van-field :type="showPwd ? 'text' : 'password'" v-model="state.password" name="password"
            :placeholder="$t('login.l21')" :border="false" input-align="left" class="authInput" :rules="[
              { required: true, message: $t('login.l32') },
              { pattern: /.{6,}/, message: $t('login.l32') }
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

          <div class="formLabel">{{ $t('login.l22') }}</div>
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
              <div class="fieldAction" @click="showFundPwd = !showFundPwd">
                <Icon :name="showFundPwd ? 'solar:eye-linear' : 'solar:eye-closed-linear'" size="18" />
              </div>
            </template>
          </van-field>

          <template v-if="loginStore.registerInviteCode">
            <div class="formLabel">{{ $t('login.l23') }}</div>
            <van-field v-model="state.inviteCode" name="inviteCode" :placeholder="$t('login.l24')" :border="false"
              input-align="left" class="authInput" :rules="[
                { required: true, message: $t('login.l34') },
                { pattern: /.{6,}/, message: $t('login.l34') }
              ]">
              <template #left-icon>
                <Icon name="solar:ticket-linear" size="18" class="fieldIcon" />
              </template>
            </van-field>
          </template>

          <div class="agreementPanel">
            <div class="agreementWrap">
              <van-checkbox v-model="rememberPwd" icon-size="18" class="rememberCheck shrink-0" />
              <div class="agreementText">
                {{ $t('login.l25') }}
                <span class="textLink" @click="changePage('/mine/xieyi')">{{ $t('login.l26') }}</span>
                {{ $t('login.l27') }}
              </div>
            </div>
          </div>

          <button native-type="submit" class="contentBtn">
            {{ $t('login.l28') }}
          </button>

          <div class="switchPanel">
            <span>{{ $t('login.l29') }}</span>
            <span class="textLink" @click="changePage('/auth/login')">{{ $t('x.a7') }}</span>
          </div>
        </div>
      </van-form>
    </ClientOnly>
  </AuthShell>
</template>

<style scoped>
.formStack {
  display: grid;
  gap: 14px;
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

.agreementPanel {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.agreementWrap {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.agreementText {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.55;
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
