<script setup lang="ts">
import { getUserPaymentRecord } from '~/api/home/home';
const { t } = useI18n();
const statusText: any = { 0: t('fund.a2'), 1: t('fund.a3'), 2: t('fund.a4'), 3: t('fund.a5'), 4: t('xx.a1') };
const params = reactive({ page: 1, limit: 10 });
const items = ref<any[]>([]);
const error = ref(false);
const loading = ref(false);
const finished = ref(false);

const fetchItemsList = () => {
  loading.value = true;
  finished.value = true;
  getUserPaymentRecord(params.page++, params.limit).then((res: any) => {
    items.value = items.value.concat(res.data);
    const bool = params.page > res.last_page;
    nextTick(() => { finished.value = bool; });
  }).catch(() => {
    error.value = true;
  }).finally(() => {
    loading.value = false;
  });
};
</script>

<template>
  <div v-if="finished && items.length == 0">
    <div class="nullData mt-10"></div>
    <div class="emptyText">{{ $t('comm.c65') }}</div>
  </div>
  <div v-else class="mt-4">
    <van-list v-model:loading="loading" v-model:error="error" :finished="finished" @load="fetchItemsList">
      <div class="historyCard" v-for="(item, index) in items" :key="index">
        <div class="detailList">
          <div class="detailRow"><span>{{ $t('comm.c71') }}</span><strong>{{ item.order_no }}</strong></div>
          <div class="detailRow"><span>{{ $t('comm.c73') }}</span><strong>{{ UseExchangeNumber(item.amount) }}{{ item.currency }}</strong></div>
          <div class="detailRow"><span>{{ $t('comm.c74') }}</span><strong>{{ UseExchangeNumber(item.arrive_amount) }}</strong></div>
          <div class="detailRow" v-if="item.arrive_time && item.arrive_time !== '--'"><span>{{ $t('comm.c75') }}</span><strong>{{ item.arrive_time }}</strong></div>
          <div class="detailRow">
            <span>{{ $t('comm.c76') }}</span>
            <strong :class="{ 'statusSuccess': item.status == 1, 'statusWarning': item.status == 0, 'statusDanger': item.status > 1 }">{{ statusText[item.status] }}</strong>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<style scoped>
.emptyText{margin-top:10px;text-align:center;color:var(--text-secondary)}.historyCard{padding:14px;border-radius:18px;background:rgba(255,255,255,.03);border:1px solid var(--border-soft)}.historyCard + .historyCard{margin-top:12px}
.detailList{display:grid;gap:8px}.detailRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.03);color:var(--text-secondary);font-size:13px}.detailRow strong{text-align:right;color:var(--text-primary)}
.detailRow strong.statusSuccess{color:#18c37e}.detailRow strong.statusWarning{color:#f4b740}.detailRow strong.statusDanger{color:#f04452}
</style>
