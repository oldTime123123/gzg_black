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
  <AuthShell :title="$t('theme.accountRecovery')"
     back-path="/auth/login">
    <div class="grid gap-4">
      <div class="grid gap-4">
        <div class="grid gap-2.5">
          <van-field v-model="state.account" name="account" :placeholder="$t('login.l7')" :border="false"
            input-align="left" class="authInput">
            <template #left-icon>
              <Icon name="solar:user-circle-linear" size="18" class="fieldIcon" />
            </template>
          </van-field>
        </div>


      </div>

      <button type="button" class="contentBtn" @click="changePage('/service')">{{ $t('theme.onlineCustomerService') }}</button>

      <div class="flex items-center justify-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
        <span>{{ $t('theme.rememberedPassword') }}</span>
        <button type="button" class="textLink" @click="changePage('/auth/login')">{{ $t('x.a7') }}</button>
      </div>
    </div>
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
  line-height: 1.4;
}

.authInput :deep(.van-field__control::placeholder) {
  color: var(--text-placeholder);
}

.authInput:focus-within {
  border-color: rgba(212, 154, 58, 0.42);
  box-shadow: 0 0 0 3px rgba(212, 154, 58, 0.12);
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

.infoCard {
  padding: 2px 0 0 14px;
  border-left: 2px solid rgba(212, 154, 58, 0.28);
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
