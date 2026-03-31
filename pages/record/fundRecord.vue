<script setup lang="ts">
import { getLixibaoLog, interruptLixibaoHandle } from '../../api/trade';
import { showToast } from 'vant';

const { t } = useI18n();
const pub = usePublicStore();

const actRecordType = ref(1);
const recordTypeTabs = ref([
  { text: t('fund.f19'), type: 1 },
  { text: t('fund.f20'), type: 2 },
]);

type RecordPageState = {
  page: number;
  size: number;
  status?: number;
};

type FundRecordItem = {
  id: number;
  order_no: string;
  status: number;
  num: number | string;
  yuji_num: number | string;
  actual_num: number | string;
  createTime: string;
  expire_time: string;
};

const pages = ref<RecordPageState>({
  page: 1,
  size: 10,
});

const recordList = ref<FundRecordItem[]>([]);
const loading = ref(true);
const finished = ref(false);
const totalSize = ref(0);

const getRecordList = () => {
  pages.value.status = actRecordType.value;
  getLixibaoLog(pages.value).then((res) => {
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

const changeActType = (type: number) => {
  actRecordType.value = type;
  pub.showLoading = true;
  recordList.value = [];
  pages.value.page = 1;
  totalSize.value = 0;
  finished.value = false;
  loading.value = true;
  getRecordList();
};

const statusEnum: Record<number, string> = {
  1: t('fund.f21'),
  2: t('fund.f22'),
  3: t('fund.f23'),
};

const delId = ref(0);
const showPop = ref(false);
const openPop = (id: number) => {
  delId.value = id;
  showPop.value = true;
};

const showCancelConfirm = () => {
  pub.showLoading = true;
  interruptLixibaoHandle({ id: delId.value }).then(() => {
    changeActType(actRecordType.value);
    showToast(t('fund.f25'));
  });
};
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="t('fund.f26')" />

    <div class="pageWrap px-3 pb-6">
      <div class="heroCard mt-4">
        <div class="heroEyebrow">{{ $t('theme.fundRecord') }}</div>
        <div class="heroDesc">{{ $t('theme.fundRecordCopy') }}</div>
      </div>

      <div class="sectionCard mt-4 contentCard">
        <div class="tabRail">
          <button
            type="button"
            class="tabChip"
            v-for="(tab, index) in recordTypeTabs"
            :class="tab.type == actRecordType ? 'active' : ''"
            :key="index"
            :aria-pressed="tab.type == actRecordType"
            @click="changeActType(tab.type)"
          >
            {{ tab.text }}
          </button>
        </div>

        <div class="mt-4" v-if="recordList.length == 0">
          <div class="nullData mt-10"></div>
          <div class="emptyText">{{ $t('trade.t8') }}</div>
        </div>

        <div v-else class="mt-4">
          <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '" :finished-text="' '" @load="getRecordList">
            <div class="historyCard" v-for="(item, index) in recordList" :key="index">
              <div class="historyTop">
                <div class="itemTitle">{{ item.order_no }}</div>
                <div class="statusBadge gold">{{ statusEnum[item.status] }}</div>
              </div>

              <div class="detailList">
                <div class="detailRow">
                  <span>{{ t('fund.f27') }}</span>
                  <strong>{{ UseExchangeNumber(item.num) + getCurrency() }}</strong>
                </div>
                <div class="detailRow">
                  <span>{{ t('fund.f28') }}</span>
                  <strong>{{ UseExchangeNumber(item.yuji_num) + getCurrency() }}</strong>
                </div>
                <div class="detailRow">
                  <span>{{ t('fund.f29') }}</span>
                  <strong>{{ UseExchangeNumber(item.actual_num) + getCurrency() }}</strong>
                </div>
                <div class="detailRow">
                  <span>{{ t('fund.f30') }}</span>
                  <strong>{{ item.createTime }}</strong>
                </div>
                <div class="detailRow">
                  <span>{{ t('fund.f31') }}</span>
                  <strong>{{ item.expire_time }}</strong>
                </div>
              </div>

              <button type="button" class="contentBtn mt-4" v-if="pub.cancelLixibaoFlag && actRecordType < 2" @click="openPop(item.id)">
                {{ t('fund.f23') }}
              </button>
            </div>
          </van-list>
        </div>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false" z-index="999">
      <div class="overlayWrap">
        <div class="dialogCard" @click.stop>
          <div class="dialogHead">
            <div class="dialogTitle">{{ $t('mine.m9') }}</div>
            <button type="button" class="closeBtn" :aria-label="$t('comm.c56')" @click="showPop = false">
              <Icon name="solar:close-circle-linear" size="20" />
            </button>
          </div>
          <div class="dialogBody">
            <div class="dialogMessage">{{ t('fund.f24') }}</div>
            <div class="dialogActions">
              <button type="button" class="borderContentBtn" @click="showPop = false">{{ $t('comm.c56') }}</button>
              <button type="button" class="contentBtn" @click="showCancelConfirm">{{ $t('comm.c57') }}</button>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style scoped>
.pageWrap { min-height: calc(100vh - 60px); }
.heroEyebrow {
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.heroDesc { margin-top: 10px; color: var(--text-secondary); font-size: 13px; line-height: 1.55; }
.contentCard { padding: 16px; }
.tabRail {
  display: inline-flex; gap: 8px; padding: 6px; border-radius: 999px;
  background: rgba(255,255,255,0.025);
}
.tabChip {
  min-height: 44px; padding: 0 16px; border-radius: 999px; display: inline-flex;
  align-items: center; justify-content: center; color: var(--text-secondary); font-size: 13px;
  appearance: none; border: 0; transition: transform .18s ease, background .18s ease, color .18s ease;
}
.tabChip.active { background: var(--brand-primary-soft); color: var(--brand-primary); }
.tabChip:active { transform: scale(.97); }
.emptyText { margin-top: 10px; text-align: center; color: var(--text-secondary); }
.historyCard {
  padding: 14px; border-radius: 18px; background: rgba(255,255,255,0.025);
  border: 1px solid var(--border-soft);
}
.historyCard + .historyCard { margin-top: 12px; }
.historyTop { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.itemTitle { color: var(--text-primary); font-weight: 700; }
.statusBadge {
  padding: 8px 12px; border-radius: 999px; font-size: 12px; font-weight: 700;
}
.statusBadge.gold { background: rgba(244,183,64,0.16); color: var(--color-warning); }
.detailList { display: grid; gap: 8px; margin-top: 14px; }
.detailRow {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 10px 12px; border-radius: 14px; background: rgba(255,255,255,0.025);
  color: var(--text-secondary); font-size: 13px;
}
.detailRow strong { color: var(--text-primary); text-align: right; }
.overlayWrap {
  display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 16px;
}
.dialogCard {
  width: min(350px, 100%); border-radius: 24px; background: radial-gradient(circle at top right, rgba(212, 154, 58, 0.12), transparent 30%), linear-gradient(180deg, rgba(24, 33, 43, 0.98), rgba(13, 17, 23, 0.98));
  border: 1px solid var(--border-soft); box-shadow: var(--shadow-float);
}
.dialogHead { position: relative; padding: 18px 18px 10px; }
.dialogTitle { color: var(--text-primary); font-size: 18px; font-weight: 800; }
.closeBtn { position: absolute; right: 14px; top: 14px; width: 40px; height: 40px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; color: var(--text-secondary); appearance: none; background: rgba(255,255,255,.025); border: 1px solid rgba(255,255,255,.08); transition: transform .18s ease, border-color .18s ease, color .18s ease; }
.closeBtn:hover { border-color: rgba(212,154,58,.18); color: var(--brand-primary); }
.closeBtn:active { transform: scale(.96); }
.dialogBody { padding: 0 18px 18px; }
.dialogMessage {
  padding: 18px 0; color: var(--text-primary); text-align: center; font-weight: 600;
}
.dialogActions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
</style>
