<script lang="ts" setup>
import { getSettingService } from '~/api/pay/realse';

const serviceList = ref([]);

const getData = () => {
  getSettingService().then((res) => {
    serviceList.value = res.list;
  });
};

const jumpPage = (item) => {
  if (window) {
    window.open(item.contact_link);
  }
};

onBeforeMount(() => {
  getData();
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('pay.p4')" />

    <div class="pageWrap px-3 pb-6">
      <div class="directoryStage mt-4">
        <div class="heroEyebrow">{{ $t('theme.openContact') }}</div>
        <div class="stageTitle">{{ $t('pay.p4') }}</div>
        <div class="stageDesc">{{ $t('theme.openContact') }}</div>
      </div>

      <div class="serviceGrid mt-5">
        <div class="serviceCard" v-for="item in serviceList" :key="item.id || item.service_name" @click="jumpPage(item)">
          <div class="serviceTop">
            <img :src="item.avatar" class="serviceAvatar">
            <div class="serviceMeta">
              <div class="serviceName">{{ item.service_name }}</div>
              <div class="serviceTime">
                {{ item.start_working_time + '-' + item.end_working_time }}
              </div>
            </div>
            <div class="iconFrame iconFrame--small">
              <Icon name="solar:chat-round-linear" size="18" />
            </div>
          </div>

          <div class="serviceBottom">
            <span>{{ $t('theme.openContact') }}</span>
            <Icon name="solar:alt-arrow-right-linear" size="18" />
          </div>
        </div>
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

.directoryStage {
  padding: 2px 2px 10px;
}

.stageTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 22px;
  line-height: 1.15;
  font-weight: 700;
}

.stageDesc {
  margin-top: 10px;
  max-width: 240px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.serviceGrid {
  display: grid;
  gap: 14px;
}

.serviceCard {
  padding: 18px 16px 14px;
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(212, 154, 58, 0.09), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--border-soft);
  box-shadow: none;
}

.serviceTop {
  display: flex;
  align-items: center;
  gap: 12px;
}

.serviceAvatar {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  object-fit: cover;
}

.serviceMeta {
  flex: 1;
  min-width: 0;
}

.serviceName {
  color: var(--text-primary);
  font-weight: 700;
}

.serviceTime {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.serviceBottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
  font-size: 13px;
}
</style>
