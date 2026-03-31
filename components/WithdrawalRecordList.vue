<script setup lang="ts">
import { getUserWithdrawalRecord } from '~/api/home/home';
const { t } = useI18n();

const statusText: any = { 1: t('comm.c83'), 2: t('comm.c84'), 3: t('comm.c85'), 4: t('comm.c86') };
const payStatusText: any = { 1: t('comm.c87'), 2: t('comm.c88'), 3: t('comm.c89') };
const params = reactive({ page: 1, limit: 10 });
const items = ref<any[]>([]);
const error = ref(false);
const loading = ref(false);
const finished = ref(false);

const fetchItemsList = () => {
  loading.value = true;
  finished.value = true;
  getUserWithdrawalRecord(params.page++, params.limit).then((res: any) => {
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
    <div class="emptyText">{{ $t('comm.c90') }}</div>
  </div>
  <div v-else class="mt-4">
    <van-list v-model:loading="loading" v-model:error="error" :finished="finished" @load="fetchItemsList">
      <div class="historyCard" v-for="(item, index) in items" :key="index">
        <div class="detailList">
          <div class="detailRow"><span>{{ $t('comm.c91') }}</span><strong>{{ item.order_no }}</strong></div>
          <div class="detailRow"><span>{{ $t('comm.c93') }}</span><strong>{{ UseExchangeNumber(item.amount) }}</strong></div>
          <div class="detailRow"><span>{{ $t('comm.c94') }}</span><strong>{{ UseExchangeNumber(item.actual_amount) }}</strong></div>
          <div class="detailRow" v-if="item.arrive_time !== '--' && !item.arrive_time"><span>{{ $t('comm.c95') }}</span><strong>{{ item.arrive_time }}</strong></div>
          <div class="detailRow"><span>{{ $t('trade.t69') }}</span><strong>{{ item.fee }}</strong></div>
          <div class="detailRow" v-if="item.remark"><span>{{ $t('x.a23') }}</span><strong>{{ item.remark }}</strong></div>
          <div class="detailRow"><span>{{ $t('comm.c96') }}</span><strong :class="{ 'statusWarning': item.status < 3, 'statusDanger': item.status > 2 }">{{ statusText[item.status] }}</strong></div>
          <div class="detailRow"><span>{{ $t('comm.c97') }}</span><strong :class="{ 'statusSuccess': item.pay_status == 1, 'statusWarning': item.pay_status == 2, 'statusDanger': item.pay_status > 2 }">{{ payStatusText[item.pay_status] }}</strong></div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<style scoped>
.emptyText{margin-top:10px;text-align:center;color:var(--text-secondary)}.historyCard{padding:14px;border-radius:18px;background:rgba(255,255,255,.025);border:1px solid var(--border-soft)}.historyCard + .historyCard{margin-top:12px}
.detailList{display:grid;gap:8px}.detailRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.025);color:var(--text-secondary);font-size:13px}.detailRow strong{text-align:right;color:var(--text-primary);font-size:14px;line-height:1.34;word-break:break-word;overflow-wrap:anywhere}
.detailRow strong.statusSuccess{color:#18c37e}.detailRow strong.statusWarning{color:#f4b740}.detailRow strong.statusDanger{color:#f04452}
</style>
