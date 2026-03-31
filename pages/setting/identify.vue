<script setup lang="ts">
import { uploadFile } from '~/utils';
import * as v from 'valibot';
import { getUserRealInfo, realNameService } from '~/api/setting';
import { showToast } from 'vant';

const { t } = useI18n();
const publicStore = usePublicStore();

const schema = v.object({
  name: v.pipe(v.string(), v.nonEmpty(t('setting.s28'))),
  title: v.pipe(v.string(), v.nonEmpty(t('setting.s29'))),
});

type UploadFileItem = {
  url?: string;
  file?: File | null;
};

type RealNamePayload = {
  name: string;
  title: string;
  type: number;
  id_front: string;
  id_back: string;
};

type UploadResponse = {
  code: number;
  message?: string;
  data: string;
};

type RealInfoItem = {
  status?: number;
  name?: string;
  title?: string;
  full_id_front?: string;
  full_id_back?: string;
  upload_host?: string;
  id_front?: string;
  id_back?: string;
};

const state = reactive({
  name: "",
  title: "",
});

const fileFront = ref<UploadFileItem[]>([]);
const fileBack = ref<UploadFileItem[]>([]);
const uploadHost = ref("");
const userRealStatus = ref(0);

const valibotValidator = (fieldKey: keyof typeof schema.entries) => {
  return () => {
    const result = v.safeParse(schema, state);
    if (result.success) return true;
    const issue = result.issues.find((i) => i.path?.[0].key === fieldKey);
    return issue ? issue.message : true;
  };
};

const handleSubmit = async () => {
  const hasFront = fileFront.value.length > 0 && (fileFront.value[0].url || fileFront.value[0].file);
  const hasBack = fileBack.value.length > 0 && (fileBack.value[0].url || fileBack.value[0].file);

  if (!hasFront) {
    showToast(t('x.a2'));
    return;
  }

  if (!hasBack) {
    showToast(t('x.a3'));
    return;
  }

  publicStore.showLoading = true;

  const data: RealNamePayload = {
    name: state.name,
    title: state.title,
    type: 1,
    id_front: "",
    id_back: "",
  };

  try {
    if (fileFront.value[0].file) {
      const res1 = await uploadFile(uploadHost.value + '/api/uploads', {
        cert: fileFront.value[0].file,
      }) as UploadResponse;
      if (res1.code == 200) {
        data.id_front = res1.data;
      } else {
        throw new Error(res1.message || t('xx.a3'));
      }
    } else {
      data.id_front = realUserInfo.value.id_front;
    }

    if (fileBack.value[0].file) {
      const res2 = await uploadFile(uploadHost.value + '/api/uploads', {
        cert: fileBack.value[0].file,
      }) as UploadResponse;
      if (res2.code == 200) {
        data.id_back = res2.data;
      } else {
        throw new Error(res2.message || t('xx.a4'));
      }
    } else {
      data.id_back = realUserInfo.value.id_back;
    }

    await realNameService(data);
    showToast(t('setting.s30'));
    getData();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : t('xx.a5');
    showToast(message || t('xx.a5'));
  } finally {
    publicStore.showLoading = false;
  }
};

const realUserInfo = ref<RealInfoItem>({
  id_front: "",
  id_back: "",
});

const getData = () => {
  getUserRealInfo().then((res: RealInfoItem[]) => {
    if (res[0]) {
      userRealStatus.value = res[0].status || 0;
      state.name = res[0].name || '';
      state.title = res[0].title || '';
      if (userRealStatus.value > 0) {
        fileFront.value = [
          {
            url: res[0].full_id_front || '',
            file: null,
          },
        ];
        fileBack.value = [
          {
            url: res[0].full_id_back || '',
            file: null,
          },
        ];
      }

      uploadHost.value = res[0].upload_host || '';
      realUserInfo.value = res[0];
    }
  });
};

onMounted(() => {
  getData();
});

const userRealText = ref<Record<number, { text: string; icon: string; tone: string }>>({
  0: { text: t('setting.s31'), icon: 'solar:clock-circle-linear', tone: 'pending' },
  1: { text: t('setting.s32'), icon: 'solar:clock-circle-linear', tone: 'pending' },
  2: { text: t('setting.s33'), icon: 'solar:verified-check-linear', tone: 'success' },
  3: { text: t('setting.s34'), icon: 'solar:danger-triangle-linear', tone: 'danger' },
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('setting.s35')" :hasNoBg="true" />

    <div class="pageWrap px-3 pb-6">
      <div class="sectionCard formCard mt-4">
        <van-form :disabled="userRealStatus > 0 && userRealStatus < 3" @submit="handleSubmit">
          <div class="formBlock">
            <div class="formLabel">{{ $t('setting.s36') }}</div>
            <van-field v-model="state.name" name="name" :placeholder="$t('setting.s37')" :border="false"
              input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('name') }]">
              <template #left-icon>
                <Icon name="solar:user-circle-linear" size="18" class="fieldIcon" />
              </template>
            </van-field>
          </div>

          <div class="formBlock mt-4">
            <div class="formLabel">{{ $t('setting.s38') }}</div>
            <van-field v-model="state.title" name="title" :placeholder="$t('setting.s39')" :border="false"
              input-align="left" class="authInput mt-2" :rules="[{ validator: valibotValidator('title') }]">
              <template #left-icon>
                <Icon name="solar:card-linear" size="18" class="fieldIcon" />
              </template>
            </van-field>
          </div>

          <div class="formBlock mt-5">
            <div class="formLabel">{{ $t('setting.s40') }}</div>
            <div class="uploadGrid mt-3">
              <van-uploader v-model="fileFront" :deletable="userRealStatus == 0 || userRealStatus == 3" :max-count="1"
                :disabled="[1, 2].includes(userRealStatus)">
                <template #default>
                  <div class="uploadSlot">
                    <div v-if="[0, 3].includes(userRealStatus)" class="uploadPlaceholder">
                      <Icon name="solar:cloud-upload-linear" size="28" class="uploadIcon" />
                      <div class="uploadText">{{ $t('setting.s41') }}</div>
                    </div>
                  </div>
                </template>
              </van-uploader>

              <van-uploader v-model="fileBack" :deletable="userRealStatus == 0 || userRealStatus == 3" :max-count="1"
                :disabled="[1, 2].includes(userRealStatus)">
                <template #default>
                  <div class="uploadSlot">
                    <div v-if="[0, 3].includes(userRealStatus)" class="uploadPlaceholder">
                      <Icon name="solar:cloud-upload-linear" size="28" class="uploadIcon" />
                      <div class="uploadText">{{ $t('setting.s42') }}</div>
                    </div>
                  </div>
                </template>
              </van-uploader>
            </div>
          </div>

          <div v-if="userRealStatus !== 1 && userRealStatus !== 2" class="actionDock">
            <button type="submit" class="contentBtn">{{ $t('setting.s43') }}</button>
          </div>
        </van-form>
      </div>

      <div class="tipsCard mt-4">
        <div class="tipItem">{{ $t('setting.s44') }}</div>
        <div class="tipItem">{{ $t('setting.s45') }}</div>
        <div class="tipItem">{{ $t('setting.s46') }}</div>
      </div>
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

.heroTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.15;
}

.heroStatusIcon {
  width: 88px;
  height: 88px;
  max-width: 40%;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
}

.heroStatusIcon.pending {
  color: var(--color-warning);
}

.heroStatusIcon.success {
  color: var(--brand-primary);
}

.heroStatusIcon.danger {
  color: var(--color-down);
}

.formCard {
  padding: 18px;
}

.formBlock {
  display: grid;
  gap: 10px;
}

.formLabel {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.authInput {
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}

.authInput:focus-within {
  border-color: rgba(212, 154, 58, 0.42);
  box-shadow: 0 0 0 3px rgba(212, 154, 58, 0.12);
  background: rgba(255, 255, 255, 0.05);
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
  font-size: 12px;
  line-height: 1.4;
}

.uploadGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.uploadSlot {
  width: 150px;
  height: 150px;
  max-width: 100%;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.16);
  overflow: hidden;
}

.uploadPlaceholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.uploadIcon {
  color: var(--brand-primary);
}

.uploadText {
  color: var(--text-secondary);
  font-size: 12px;
  text-align: center;
  padding: 0 10px;
}

.actionDock {
  position: sticky;
  bottom: 12px;
  margin-top: 20px;
}

.tipsCard {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
}

.tipItem {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.55;
}

.tipItem + .tipItem {
  margin-top: 8px;
}

:deep(.van-uploader__wrapper),
:deep(.van-uploader__preview-image) {
  display: block !important;
  width: 150px !important;
  height: 150px !important;
  border-radius: 18px;
}
</style>
