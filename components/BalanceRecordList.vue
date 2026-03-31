<script setup lang="ts">
import { getUserBalanceRecord } from '~/api/home/home';

const params = reactive({ page: 1, limit: 10 });
const items = ref<any[]>([]);
const error = ref(false);
const loading = ref(false);
const finished = ref(false);

const fetchItemsList = () => {
  loading.value = true;
  finished.value = true;
  getUserBalanceRecord(params.page++, params.limit, 1).then((res: any) => {
    items.value = items.value.concat(res.data);
    const bool = params.page > res.last_page;
    nextTick(() => {
      finished.value = bool;
    });
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
    <div class="emptyText">{{ $t('comm.c4') }}</div>
  </div>
  <div v-else class="mt-4">
    <van-list v-model:loading="loading" v-model:error="error" :finished="finished" @load="fetchItemsList">
      <div class="historyCard" v-for="(item, index) in items" :key="index">
        <div class="historyTop">
          <div class="itemTitle">{{ item.change_reason }}</div>
          <div class="itemTime">{{ item.createTime }}</div>
        </div>
        <div class="historyBottom">
          <div class="itemMeta">
            <span v-if="item.info_type == 1">{{ $t('comm.c98') }}{{ item.info.pro_code }},{{ $t('comm.c99') }}{{ item.info.pro_name }}</span>
          </div>
          <div :class="item.change_type == 1 ? 'colorUp' : 'colorDown'">
            {{ item.change_type == 1 ? '+' : '-' }}{{ UseExchangeNumber(item.amount) }}
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<style scoped>
.emptyText{margin-top:10px;text-align:center;color:var(--text-secondary)}
.historyCard{padding:14px;border-radius:18px;background:rgba(255,255,255,.025);border:1px solid var(--border-soft)}
.historyCard + .historyCard{margin-top:12px}.historyTop,.historyBottom{display:flex;align-items:center;justify-content:space-between;gap:12px}
.itemTitle{color:var(--text-primary);font-weight:700}.itemTime,.itemMeta{color:var(--text-secondary);font-size:12px}.historyBottom{margin-top:10px}.historyBottom>div:last-child{font-size:14px;line-height:1.34;word-break:break-word;overflow-wrap:anywhere}
</style>
