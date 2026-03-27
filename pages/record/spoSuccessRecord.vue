<script setup lang="ts">
import { ipoApplyDataApi } from '~/api/ipo';
const { t } = useI18n();

const pages = ref({
  page: 1,
  size: 10,
  status: 2,
  type: 2,
});

const recordList = ref<any[]>([]);
const loading = ref(true);
const finished = ref(false);
const totalSize = ref(0);

const getRecordList = () => {
  ipoApplyDataApi(pages.value).then((res) => {
    totalSize.value = res.total;
    recordList.value = recordList.value.concat(res.data);
  }).finally(() => {
    loading.value = false;
    if (recordList.value.length == totalSize.value) {
      finished.value = true;
    } else {
      pages.value.page++;
    }
  });
};

onMounted(() => {
  getRecordList();
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('record.a1')" />
    <div class="pageWrap px-3 pb-6">
      <div class="heroCard mt-4">
        <div class="sectionSubtext">{{ $t('theme.recordCenter') }}</div>
        <div class="heroDesc">{{ $t('theme.spoRecordCopy') }}</div>
      </div>

      <div class="sectionCard mt-4 contentCard">
        <div v-if="recordList.length == 0">
          <div class="nullData mt-10"></div>
          <div class="emptyText">{{ $t('record.r2') }}</div>
        </div>
        <div v-else>
          <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '" :finished-text="' '" @load="getRecordList">
            <div class="historyCard" v-for="(item, index) in recordList" :key="index">
              <div>
                <div class="itemTitle">{{ item.product?.pro_name }}</div>
                <div class="itemCode">{{ item.pro_code }}</div>
              </div>
              <div class="detailList">
                <div class="detailRow"><span>{{ $t('record.a2') }}</span><strong>{{ item.number }}</strong></div>
                <div class="detailRow"><span>{{ $t('record.r4') }}</span><strong>{{ UseExchangeNumber(item.price) }}</strong></div>
                <div class="detailRow"><span>{{ $t('record.r5') }}</span><strong>{{ UseExchangeNumber(item.ipo?.show_price) }}</strong></div>
                <div class="detailRow"><span>{{ $t('record.r6') }}</span><strong :class="item.income_formart > 0 ? 'colorUp' : 'colorDown'">{{ item.income_formart }}</strong></div>
                <div class="detailRow"><span>{{ $t('record.r7') }}</span><strong :class="item.income_formart > 0 ? 'colorUp' : 'colorDown'">{{ item.income_100_formart }}</strong></div>
                <div class="detailRow"><span>{{ $t('record.r8') }}</span><strong>{{ item.create_time }}</strong></div>
                <div class="detailRow">
                  <span>{{ $t('record.r9') }}</span>
                  <strong class="colorDown">
                    {{ item.status == 1 ? $t('trade.t111') : item.status == 2 ? t('trade.t112') : item.status == 3 ? $t('trade.t146') : item.status == 4 ? $t('trade.t147') : $t('trade.t148') }}
                  </strong>
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}.heroCard{padding:18px;border-radius:24px;background:var(--gradient-hero);border:1px solid var(--border-soft);box-shadow:var(--shadow-float)}
.heroTitle{margin-top:8px;color:var(--text-primary);font-size:24px;font-weight:800}.heroDesc{margin-top:10px;color:var(--text-secondary);font-size:13px;line-height:1.55}
.contentCard{padding:16px}.emptyText{margin-top:10px;text-align:center;color:var(--text-secondary)}
.historyCard{padding:14px;border-radius:18px;background:rgba(255,255,255,.03);border:1px solid var(--border-soft)}
.historyCard + .historyCard{margin-top:12px}.itemTitle{color:var(--text-primary);font-weight:700}.itemCode{margin-top:4px;color:var(--text-secondary);font-size:12px}
.detailList{display:grid;gap:8px;margin-top:14px}.detailRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.03);color:var(--text-secondary);font-size:13px}.detailRow strong{text-align:right}
</style>
