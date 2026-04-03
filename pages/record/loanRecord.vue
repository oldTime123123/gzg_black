<script setup lang="ts">
import { getLoanLogs } from '~/api/pay/realse';
const { t } = useI18n();
const actRecordType = ref(0);
const recordTypeList = ref([t('record.r10'), t('record.r11'), t('record.r12')]);
const pub = usePublicStore();
const pages = ref({ page: 1, type: 1, size: 10 });

type LoanRecordItem = {
  type: number;
  status: number;
  amount: number | string;
  createTime: string;
};

type PaginatedResponse<T> = {
  data: T[];
  total: number;
};

const recordList = ref<LoanRecordItem[]>([]);
const loading = ref(true);
const finished = ref(false);
const totalSize = ref(0);
const getRecordList = () => {
  getLoanLogs(pages.value).then((res: PaginatedResponse<LoanRecordItem>) => {
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

const changeActType = (index: number) => {
  if (actRecordType.value == index) return;
  pages.value.type = index + 1;
  pub.showLoading = true;
  actRecordType.value = index;
  pages.value.page = 1;
  totalSize.value = 0;
  recordList.value = [];
  finished.value = false;
  loading.value = true;
  getRecordList();
};
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('record.r13')" />

    <div class="pageWrap px-3 pb-6">

      <div class="sectionCard mt-4 contentCard">
        <div class="tabRail tabRailWide">
          <button type="button" class="tabChip flex-1" v-for="(item, index) in recordTypeList" :class="index == actRecordType ? 'active' : ''" :key="index" :aria-pressed="index == actRecordType" @click="changeActType(index)">
            {{ item }}
          </button>
        </div>

        <div class="mt-4" v-if="recordList.length == 0">
          <div class="nullData mt-10"></div>
          <div class="emptyText">{{ $t('record.r14') }}</div>
        </div>

        <div v-else class="mt-4">
          <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '" :finished-text="' '" @load="getRecordList">
            <div class="historyCard" v-for="(item, index) in recordList" :key="index">
              <div class="detailList">
                <div class="detailRow">
                  <span>{{ $t('record.r15') }}</span>
                  <strong :class="item.type == 1 ? 'colorUp' : item.type == 2 ? 'colorDown' : 'brandText'">
                    {{ item.type == 1 ? $t('record.r10') : item.type == 2 ? $t('record.r11') : $t('record.r12') }}
                  </strong>
                </div>
                <div class="detailRow" v-if="actRecordType < 1">
                  <span>{{ $t('record.r9') }}</span>
                  <strong :class="item.status == 1 ? 'colorUp' : item.status == 2 ? 'colorDown' : 'brandText'">
                    {{ item.status == 1 ? $t('setting.s32') : item.status == 2 ? $t('setting.s33') : $t('comm.c85') }}
                  </strong>
                </div>
                <div class="detailRow"><span>{{ $t('record.r16') }}</span><strong>{{ item.amount }}</strong></div>
                <div class="detailRow"><span>{{ $t('record.r17') }}</span><strong>{{ item.createTime }}</strong></div>
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}
.heroEyebrow{color:var(--brand-primary);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}.heroDesc{margin-top:10px;color:var(--text-secondary);font-size:13px;line-height:1.55}
.contentCard{padding:16px}.tabRail{display:inline-flex;gap:8px;padding:6px;border-radius:999px;background:rgba(255,255,255,.025)}.tabRailWide{width:100%}
.tabChip{appearance:none;min-height:40px;padding:0 16px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;color:var(--text-secondary);font-size:13px;text-align:center;background:transparent;border:0;transition:transform var(--motion-fast),background-color var(--motion-fast),color var(--motion-fast)}.tabChip.active{background:var(--brand-primary-soft);color:var(--brand-primary)}.tabChip:active{transform:scale(.98)}
.emptyText{margin-top:10px;text-align:center;color:var(--text-secondary)}.historyCard{padding:14px;border-radius:18px;background:rgba(255,255,255,.025);border:1px solid var(--border-soft)}.historyCard + .historyCard{margin-top:12px}
.detailList{display:grid;gap:8px}.detailRow{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.025);color:var(--text-secondary);font-size:13px}.detailRow strong{text-align:right}.brandText{color:var(--brand-primary)}
</style>
