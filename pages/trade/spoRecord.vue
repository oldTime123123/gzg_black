<script setup lang="ts">
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n';
import { getIpoRecordList, submitIpoBuyApi, ipoApplyDataApi, ipoApplyPayApi } from '~/api/ipo';
import { UseExchangeNumber } from '~/utils';

const { t } = useI18n();
const router = useRouter();
const rightClickHandle = () => {
  router.push('/record/spoSuccessRecord');
};

const pub = usePublicStore();
const actRecordType = computed(() => pub.spoActRecordType);
const recordTypeList = ref([
  t('trade.t73'),
  t('trade.t74'),
  t('trade.t75'),
]);

type RecordPageState = {
  page: number;
  size: number;
  type: number;
  status?: number;
};

type SpoRecordItem = {
  id: number | string;
  number_type?: number;
  stock?: number | string;
  min_number?: number | string;
  number?: number | string;
  exchange_name?: string;
  start_time_format?: string;
  product?: {
    pro_name?: string;
  };
  pro_code?: string;
  [key: string]: unknown;
};

type PaginatedResponse<T> = {
  data: T[];
  total: number;
};

const pages = ref<RecordPageState>({
  page: 1,
  size: 10,
  type: 2,
});

const recordList = ref<SpoRecordItem[]>([]);
const loading = ref(true);
const finished = ref(false);
const totalSize = ref(0);

const getRecordList = () => {
  if (actRecordType.value < 1) {
    getIpoRecordList(pages.value).then((res: PaginatedResponse<SpoRecordItem>) => {
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
  } else {
    const data = pages.value;
    if (actRecordType.value > 1) {
      data.status = 1;
    }
    ipoApplyDataApi(data).then((res: PaginatedResponse<SpoRecordItem>) => {
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
  }
};

const buyNum = ref(1);
const showPop = ref(false);
const selectData = ref<SpoRecordItem | null>(null);
const openSelectHandle = (item: SpoRecordItem) => {
  selectData.value = item;
  if (item.number_type > 1) {
    buyNum.value = Number(item.stock || 0);
  } else {
    buyNum.value = Number(item.min_number || 0);
  }
  showPop.value = true;
};

const changeRecordTypeHandle = (index: number) => {
  if (pages.value.status) delete pages.value.status;
  pub.showLoading = true;
  recordList.value = [];
  loading.value = true;
  finished.value = false;
  totalSize.value = 0;
  pub.spoActRecordType = index;
  pages.value.page = 1;
  getRecordList();
};

const confirmBuyHandle = () => {
  if (Number(buyNum.value) < Number(selectData.value.min_number)) {
    showToast(t('x.a13'));
    return;
  }
  const data = {
    ipoId: selectData.value.id,
    number: buyNum.value,
  };
  showPop.value = false;
  pub.showLoading = true;
  submitIpoBuyApi(data).then(() => {
    changeRecordTypeHandle(0);
    buyNum.value = 1;
    showToast(t('trade.t76'));
  });
};

const payHandle = (item: SpoRecordItem) => {
  ipoApplyPayApi({
    applyId: item.id,
  }).then(() => {
    showToast(t('trade.t77'));
    changeRecordTypeHandle(2);
  });
};

onMounted(() => {
  getRecordList();
});
</script>

<template>
  <div class="pageShell">
    <ClientOnly>
      <SecondPageNavBar :title="t('index.i11')">
        <button type="button" class="navActionIcon" @click="rightClickHandle" :aria-label="$t('record.r34') || 'Open SPO records'">
          <Icon name="solar:bill-list-linear" size="18" />
        </button>
      </SecondPageNavBar>

      <div class="pageWrap px-3 pb-6">
        <div class="heroCard mt-4">
          <div class="heroEyebrow">{{ $t('theme.subscriptionModule') }}</div>
          <div class="heroDesc">{{ $t('theme.spoModuleCopy') }}</div>
        </div>

        <div class="sectionCard mt-4 contentCard">
          <div class="tabRail tabRailWide">
            <button
              type="button"
              v-for="(item, index) in recordTypeList"
              class="tabChip flex-1"
              :class="index == actRecordType ? 'active' : ''"
              :key="index"
              :aria-pressed="index == actRecordType"
              @click="changeRecordTypeHandle(index)"
            >
              {{ item }}
            </button>
          </div>

          <div class="mt-4" v-if="recordList.length == 0">
            <div class="nullData mt-10"></div>
            <div class="emptyText">{{ $t('trade.t79') }}</div>
          </div>

          <div v-else class="mt-4">
            <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '" :finished-text="' '" @load="getRecordList">
              <div class="recordCard" v-for="(item, index) in recordList" :key="index">
                <div class="recordHead" :class="actRecordType == 1 ? 'space-between' : 'centered'">
                  <div class="recordIdentity">
                    <div class="itemTitle">{{ item.product?.pro_name }}</div>
                    <div class="itemCode" :class="actRecordType !== 1?'text-center':''">{{ item.pro_code }}</div>
                  </div>
                  <div v-if="actRecordType == 1" class="statusPill">{{ $t('trade.t80') }}</div>
                </div>

                <div v-if="actRecordType == 0" class="detailList">
                  <div class="detailRow">
                    <span>{{ $t('trade.t81') }}</span>
                    <strong>{{ item.number }}</strong>
                  </div>
                  <div class="detailRow" v-if="item.exchange_name">
                    <span>{{ $t('trade.t82') }}</span>
                    <strong>{{ item.exchange_name }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t83') }}</span>
                    <strong>{{ item.start_time_format }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t84') }}</span>
                    <strong>{{ item.end_time_format }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t85') }}</span>
                    <strong>{{ item.open_time_format }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t86') }}</span>
                    <strong>{{ item.show_time_format }}</strong>
                  </div>
                  <button type="button" class="contentBtn mt-4" @click="openSelectHandle(item)">{{ $t('trade.t87') }}</button>
                </div>

                <div v-if="actRecordType == 1" class="detailList">
                  <div class="detailRow">
                    <span>{{ $t('trade.t88') }}</span>
                    <strong>{{ item.ipo?.show_time_format }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t89') }}</span>
                    <strong>{{ UseExchangeNumber(item.price) }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t90') }}</span>
                    <strong>{{ item.buy_number }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t92') }}</span>
                    <strong>{{ UseExchangeNumber(item.price * item.buy_number) }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t93') }}</span>
                    <strong>{{ UseExchangeNumber(item.wait_price) }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t94') }}</span>
                    <strong>{{ item.create_time }}</strong>
                  </div>
                </div>

                <div v-if="actRecordType == 2" class="detailList">
                  <div class="detailRow">
                    <span>{{ $t('trade.t95') }}</span>
                    <strong>{{ item.create_time }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t96') }}</span>
                    <strong class="statusText">
                      {{ item.status == 1 ? $t('trade.t111')
                        : item.status == 2 ? t('trade.t112') : item.status == 3 ? $t('trade.t146')
                        : item.status == 4 ? $t('trade.t147') : $t('trade.t148') }}
                    </strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t98') }}</span>
                    <strong>{{ item.number }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t99') }}</span>
                    <strong>{{ UseExchangeNumber(item.price) }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t101') }}</span>
                    <strong>{{ UseExchangeNumber(item.price * item.number) }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t145') }}</span>
                    <strong>{{ item.use_price }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t102') }}</span>
                    <strong>{{ item.paid_time }}</strong>
                  </div>
                  <button type="button" class="contentBtn mt-4" v-if="item.pay_type == 1 && item.status == 1" @click="payHandle(item)">
                    {{ $t('trade.t103') }}
                  </button>
                </div>
              </div>
            </van-list>
          </div>
        </div>
      </div>

      <van-overlay :show="showPop" @click="showPop = false">
        <div class="overlayWrap">
          <div class="dialogCard" @click.stop>
            <div class="dialogHead">
              <button type="button" class="closeBtn" @click="showPop = false" :aria-label="$t('comm.c56') || 'Close dialog'">
                <Icon name="solar:close-circle-linear" size="20" />
              </button>
              <div class="dialogTitle">{{ selectData.product?.pro_name }}</div>
              <div class="dialogCode">({{ selectData.product?.pro_code }})</div>
            </div>
            <div class="dialogBody">
              <div class="dialogSummary">
                <div class="dialogStatCard">
                  <span class="dialogStatLabel">{{ $t('trade.t105') }}</span>
                  <strong class="dialogStatValue">{{ selectData.price }}</strong>
                </div>
                <div class="dialogStatCard">
                  <span class="dialogStatLabel">{{ $t('trade.t106') }}</span>
                  <strong class="dialogStatValue">{{ selectData.price * buyNum }}</strong>
                </div>
              </div>
              <div class="fieldGroup">
                <div class="fieldLabel">{{ $t('trade.t107') }}</div>
                <van-field
                  type="digit"
                  v-model="buyNum"
                  :disabled="selectData.number_type > 1"
                  class="authInput mt-2"
                  :placeholder="$t('trade.t107')"
                  :border="false"
                  input-align="left"
                />
              </div>
              <div class="dialogFooter">
                <button type="button" class="contentBtn dialogSubmitBtn" @click="confirmBuyHandle">{{ $t('trade.t109') }}</button>
              </div>
            </div>
          </div>
        </div>
      </van-overlay>
    </ClientOnly>
  </div>
</template>

<style scoped>
.pageWrap {
  min-height: calc(100vh - 60px);
}
.navActionIcon {
  appearance: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
  color: var(--text-primary);
  cursor: pointer;
  transition: transform var(--motion-fast), border-color var(--motion-fast), background-color var(--motion-fast);
}
.heroEyebrow {
  color: var(--brand-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.heroDesc {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.55;
}
.contentCard {
  padding: 18px;
}
.tabRail {
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.025);
}
.tabRailWide {
  width: 100%;
}
.tabChip {
  appearance: none;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 13px;
  text-align: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  transition: transform var(--motion-fast), background-color var(--motion-fast), color var(--motion-fast);
}
.tabChip.active {
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
}
.emptyText {
  margin-top: 10px;
  text-align: center;
  color: var(--text-secondary);
}
.recordCard {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
}
.recordCard + .recordCard {
  margin-top: 12px;
}
.recordHead {
  display: flex;
  gap: 12px;
  align-items: center;
}
.recordHead.space-between {
  justify-content: space-between;
}
.recordHead.centered {
  justify-content: center;
}
.recordIdentity {
  min-width: 0;
}
.itemTitle {
  color: var(--text-primary);
  font-weight: 700;
}
.itemCode {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}
.statusPill {
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
}
.detailList {
  display: grid;
  gap: 8px;
  margin-top: 14px;
}
.detailRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
  color: var(--text-secondary);
  font-size: 13px;
}
.detailRow strong {
  color: var(--text-primary);
  text-align: right;
}
.statusText {
  color: var(--brand-primary);
}
.overlayWrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 16px;
}
.dialogCard {
  width: min(100%, 400px);
  border-radius: 30px;
  background:
    radial-gradient(circle at top, rgba(56, 189, 248, 0.14), transparent 42%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02)),
    linear-gradient(180deg, #17212c 0%, #121922 100%);
  border: 1px solid var(--border-soft);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.48);
}
.dialogHead {
  position: relative;
  padding: 22px 22px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.dialogTitle {
  color: var(--text-primary);
  padding-right: 34px;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.25;
}
.dialogCode {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 13px;
}
.closeBtn {
  position: absolute;
  right: 16px;
  top: 16px;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: transform var(--motion-fast), border-color var(--motion-fast), background-color var(--motion-fast);
}
.dialogBody {
  padding: 18px 22px 22px;
}
.dialogSummary {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.dialogStatCard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
.dialogStatLabel {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.4;
}
.dialogStatValue {
  color: var(--text-primary);
  font-size: 19px;
  font-weight: 800;
  line-height: 1.2;
  text-align: right;
}
.fieldGroup {
  margin-top: 18px;
}
.fieldLabel {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
}
.authInput {
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
}
.authInput :deep(.van-field__body) {
  min-height: 56px;
  padding: 0 2px;
}
.authInput :deep(.van-field__control) {
  color: var(--text-primary);
  font-size: 16px;
}
.dialogFooter {
  margin-top: 20px;
}
.dialogSubmitBtn {
  margin-top: 0 !important;
}
.navActionIcon:active,
.tabChip:active,
.closeBtn:active {
  transform: scale(0.98);
}
</style>
