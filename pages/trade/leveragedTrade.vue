<script setup lang="ts">
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n';
import { getTradeList, getTradeLog, subTradeHandle } from '~/api/trade';

const { t } = useI18n();
const actRecordType = ref(0);
const recordTypeTabs = ref([
  { text: t('trade.t20'), type: 0 },
  { text: t('trade.t21'), type: 1 },
]);

const pages = ref({
  page: 1,
  type: 4,
  size: 10,
});

const showPwd = ref(false);
type TradeRecordItem = {
  id: number | string;
  buy_min_num: number | string;
  status?: number;
  stock?: {
    pro_name?: string;
    pro_code?: string;
  };
  [key: string]: unknown;
};

const recordList = ref<TradeRecordItem[]>([]);
const loading = ref(true);
const finished = ref(false);
const totalSize = ref(0);

const getRecordList = () => {
  if (actRecordType.value < 1) {
    getTradeList(pages.value).then((res) => {
      totalSize.value = res.total;
      if (pages.value.page == 1) {
        recordList.value = res.data;
      } else {
        recordList.value = recordList.value.concat(res.data);
      }
    }).finally(() => {
      loading.value = false;
      if (recordList.value.length == totalSize.value) {
        finished.value = true;
      } else {
        pages.value.page++;
      }
    });
  } else {
    getTradeLog(pages.value).then((res) => {
      totalSize.value = res.total;
      if (pages.value.page == 1) {
        recordList.value = res.data;
      } else {
        recordList.value = recordList.value.concat(res.data);
      }
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

const actApplyInd = ref(0);

onMounted(() => {
  getRecordList();
});

const showPop = ref(false);
const publicStore = usePublicStore();
const changeActType = (type: number) => {
  if (actRecordType.value == type) return;
  publicStore.showLoading = true;
  actRecordType.value = type;
  pages.value.page = 1;
  totalSize.value = 0;
  recordList.value = [];
  finished.value = false;
  loading.value = true;
  getRecordList();
};

const selectPopObj = ref<TradeRecordItem | null>(null);
const buyNum = ref(0);
const openTradePop = () => {
  buyNum.value = recordList.value[actApplyInd.value].buy_min_num;
  selectPopObj.value = recordList.value[actApplyInd.value];
  showPop.value = true;
};

const fundPwd = ref('');
const confirmHandle = () => {
  if (Number(buyNum.value) < Number(recordList.value[actApplyInd.value].buy_min_num)) {
    return showToast(t('x.a20') + ': ' + recordList.value[actApplyInd.value].buy_min_num);
  }
  publicStore.showLoading = true;
  showPop.value = false;
  subTradeHandle({
    id: selectPopObj.value?.id,
    num: buyNum.value,
    sn: fundPwd.value,
  }).then(() => {
    showToast(t('trade.t22'));
  }).finally(() => {
    publicStore.showLoading = false;
  });
};

const statusEnum = {
  1: t('trade.t23'),
  2: t('trade.t24'),
  3: t('trade.t25'),
};
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('index.i13')" />

    <div class="pageWrap px-3 pb-6">


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
            <template v-if="actRecordType == 1">
              <div class="historyCard" v-for="(item, index) in recordList" :key="index">
                <div class="historyTop">
                  <div>
                    <div class="itemTitle">{{ item.stock?.pro_name }}</div>
                    <div class="itemCode">{{ item.stock?.pro_code }}</div>
                  </div>
                  <div class="statusBadge" :class="item.status == 1 ? 'blue' : item.status == 2 ? 'green' : 'red'">
                    {{ statusEnum[item.status] }}
                  </div>
                </div>

                <div class="detailList">
                  <div class="detailRow">
                    <span>{{ $t('trade.t9') }}</span>
                    <strong>{{ item.buy_price }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t10') }}</span>
                    <strong>{{ item.apply_num }}</strong>
                  </div>
                  <div class="detailRow">
                    <span>{{ $t('trade.t11') }}</span>
                    <strong>{{ item.buy_num }}</strong>
                  </div>
                </div>
              </div>
            </template>

            <template v-else>
              <div class="applyGrid">
                <button
                  type="button"
                  class="applyCard"
                  :class="actApplyInd == index ? 'active' : ''"
                  v-for="(item, index) in recordList"
                  :key="index"
                  @click="actApplyInd = index"
                >
                  <div class="itemTitle">{{ item.stock?.pro_name }}</div>
                  <div class="itemCode">{{ item.stock?.pro_code }}</div>
                  <div class="applyPrice">{{ UseExchangeNumber(item.buy_price) }}</div>
                </button>
              </div>

              <button type="button" class="contentBtn mt-4" @click="openTradePop">
                {{ $t('trade.t12') }}
              </button>
            </template>
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
            <div class="dialogTitle">{{ selectPopObj.stock?.pro_name }}</div>
            <div class="dialogCode">{{ "(" + selectPopObj.stock?.pro_code + ")" }}</div>
          </div>

          <div class="dialogBody">
            <div class="dialogSummary">
              <div class="dialogStatCard">
                <span class="dialogStatLabel">{{ $t('trade.t32') }}</span>
                <strong class="dialogStatValue">{{ UseExchangeNumber(selectPopObj.buy_price) }}</strong>
              </div>
              <div class="dialogStatCard">
                <span class="dialogStatLabel">{{ $t('trade.t33') }}</span>
                <strong class="dialogStatValue">{{ UseExchangeNumber(selectPopObj.buy_price * buyNum) }}</strong>
              </div>
            </div>

            <div class="fieldGroup">
              <div class="fieldLabel">{{ $t('trade.t34') }}</div>
              <van-field type="digit" v-model="buyNum" class="authInput mt-2" :placeholder="$t('trade.t38')" :maxlength="10" :border="false" input-align="left" />
            </div>

            <div class="fieldGroup" v-if="selectPopObj.need_sn > 0">
              <div class="fieldLabel">{{ $t('trade.t35') }}</div>
              <van-field :type="showPwd ? 'text' : 'password'" v-model="fundPwd" class="authInput mt-2" :placeholder="$t('trade.t36')" :border="false" input-align="left">
                <template #right-icon>
                  <button type="button" class="fieldAction" @click="showPwd = !showPwd" :aria-pressed="showPwd">
                    <Icon :name="showPwd ? 'solar:eye-linear' : 'solar:eye-closed-linear'" size="18" />
                  </button>
                </template>
              </van-field>
            </div>

            <div class="dialogFooter">
              <button type="button" class="contentBtn dialogSubmitBtn" @click="confirmHandle">{{ $t('trade.t37') }}</button>
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<style scoped>
.pageWrap {
  min-height: calc(100vh - 60px);
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
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 6px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
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
  font-weight: 600;
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
.historyCard {
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
}
.historyCard + .historyCard {
  margin-top: 12px;
}
.historyTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
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
.statusBadge {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}
.statusBadge.blue { background: var(--brand-primary); }
.statusBadge.green { background: #18c37e; }
.statusBadge.red { background: #ce4040; }
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
}
.applyGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.applyCard {
  appearance: none;
  padding: 16px 12px;
  width: 100%;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
  text-align: center;
  cursor: pointer;
  transition: transform var(--motion-fast), border-color var(--motion-fast), background-color var(--motion-fast);
}
.applyCard.active {
  background: var(--brand-primary-soft);
  border-color: var(--brand-primary-border);
}
.applyPrice {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 18px;
  font-weight: 800;
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
    radial-gradient(circle at top, rgba(212, 154, 58, 0.14), transparent 42%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02)),
    linear-gradient(180deg, #17212c 0%, #121922 100%);
  border: 1px solid var(--border-soft);
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.48);
}
.dialogHead {
  position: relative;
  padding: 22px 22px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.dialogTitle {
  color: var(--text-primary);
  padding-right: 34px;
  font-size: 24px;
  line-height: 1.25;
  font-weight: 800;
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
  padding: 20px 22px 22px;
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
.fieldAction {
  width: 40px;
  height: 40px;
  appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  transition: transform var(--motion-fast), color var(--motion-fast), background-color var(--motion-fast);
}
.dialogFooter {
  margin-top: 20px;
}
.dialogSubmitBtn {
  margin-top: 0 !important;
}
.tabChip:active,
.applyCard:active,
.closeBtn:active,
.fieldAction:active {
  transform: scale(0.98);
}
</style>
