<script setup lang="ts">
const router = useRouter();
const state = reactive({
  account: '',
});

const changePage = (url: string) => {
  router.push(url);
};
</script>

<template>
  <AuthShell :title="$t('theme.accountRecovery')" :subtitle="$t('theme.accountRecoveryCopy')"
    :eyebrow="$t('theme.recoveryAccess')" back-path="/auth/login">
    <template #hero>
      <div class="heroPanel">
        <div class="heroMetric">
          <span>{{ $t('theme.authPath') }}</span>
          <strong>{{ $t('theme.supportFirst') }}</strong>
        </div>
      </div>
    </template>

    <div class="formStack">
      <div class="formLabel">{{ $t('login.l6') }}</div>
      <van-field v-model="state.account" name="account" :placeholder="$t('login.l7')" :border="false"
        input-align="left" class="authInput">
        <template #left-icon>
          <Icon name="solar:user-circle-linear" size="18" class="fieldIcon" />
        </template>
      </van-field>

      <div class="infoCard">
        <div class="infoTitle">{{ $t('theme.recoveryRoute') }}</div>
        <div class="infoText">{{ $t('theme.recoveryCopy') }}</div>
      </div>

      <div class="contentBtn" @click="changePage('/service')">{{ $t('theme.onlineCustomerService') }}</div>

      <div class="switchPanel">
        <span>{{ $t('theme.rememberedPassword') }}</span>
        <span class="textLink" @click="changePage('/auth/login')">{{ $t('x.a7') }}</span>
      </div>
    </div>
  </AuthShell>
</template>

<style scoped>
.heroPanel {
  margin-top: 18px;
}

.heroMetric {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.heroMetric span {
  color: var(--text-secondary);
  font-size: 12px;
}

.heroMetric strong {
  display: block;
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 18px;
}

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
}

.authInput :deep(.van-field__control::placeholder) {
  color: var(--text-placeholder);
}

.fieldIcon {
  color: var(--text-secondary);
  margin-right: 8px;
}

.infoCard {
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.infoTitle {
  color: var(--text-primary);
  font-weight: 700;
}

.infoText {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.55;
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
