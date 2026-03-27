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
      <div class="heroCard">
        <div class="sectionSubtext">{{ $t('theme.supportAccess') }}</div>
        <div class="heroDesc">{{ $t('service.s1') }}</div>
      </div>

      <div class="serviceGrid mt-4">
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

.heroCard {
  margin-top: 14px;
  padding: 18px;
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
}

.heroDesc {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.55;
}

.serviceGrid {
  display: grid;
  gap: 12px;
}

.serviceCard {
  padding: 16px;
  border-radius: 22px;
  background: var(--gradient-panel);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
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
  margin-top: 14px;
  color: var(--text-secondary);
  font-size: 13px;
}
</style>
