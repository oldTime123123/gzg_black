<script setup lang="ts">
import { showToast } from 'vant';
import { getTradeList, getTradeLog, subTradeHandle } from '~/api/trade';

const { t } = useI18n();
const actRecordType = ref(0);
const recordTypeTabs = ref([
  { text: t('trade.t20'), type: 0 },
  { text: t('trade.t21'), type: 1 },
]);

const pages = ref({
  page: 1,
  type: 2,
  size: 10,
});

const showPwd = ref(false);
const recordList = ref<any[]>([]);
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

const selectPopObj = ref<any>({});
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
    id: selectPopObj.value.id,
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
    <SecondPageNavBar :title="$t('trade.t26')" />

    <div class="pageWrap px-3 pb-6">
      <div class="heroCard mt-4">
        <div class="heroEyebrow">{{ $t('theme.tradingModule') }}</div>
        <div class="heroDesc">{{ $t('theme.dailyRecordCopy') }}</div>
      </div>

      <div class="sectionCard mt-4 contentCard">
        <div class="tabRail">
          <div
            class="tabChip"
            v-for="(tab, index) in recordTypeTabs"
            :class="tab.type == actRecordType ? 'active' : ''"
            :key="index"
            @click="changeActType(tab.type)"
          >
            {{ tab.text }}
          </div>
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
                <div
                  class="applyCard"
                  :class="actApplyInd == index ? 'active' : ''"
                  v-for="(item, index) in recordList"
                  :key="index"
                  @click="actApplyInd = index"
                >
                  <div class="itemTitle">{{ item.stock?.pro_name }}</div>
                  <div class="itemCode">{{ item.stock?.pro_code }}</div>
                  <div class="applyPrice">{{ UseExchangeNumber(item.buy_price) }}</div>
                </div>
              </div>

              <div class="contentBtn mt-4" @click="openTradePop">
                {{ $t('trade.t12') }}
              </div>
            </template>
          </van-list>
        </div>
      </div>
    </div>

    <van-overlay :show="showPop" @click="showPop = false">
      <div class="overlayWrap">
        <div class="dialogCard" @click.stop>
          <div class="dialogHead">
            <div class="dialogTitle">{{ selectPopObj.stock?.pro_name }}</div>
            <div class="dialogCode">{{ "(" + selectPopObj.stock?.pro_code + ")" }}</div>
            <div class="closeBtn" @click="showPop = false">
              <Icon name="solar:close-circle-linear" size="20" />
            </div>
          </div>

          <div class="dialogBody">
            <div class="detailRow">
              <span>{{ $t('trade.t32') }}</span>
              <strong>{{ UseExchangeNumber(selectPopObj.buy_price) }}</strong>
            </div>
            <div class="detailRow">
              <span>{{ $t('trade.t33') }}</span>
              <strong>{{ UseExchangeNumber(selectPopObj.buy_price * buyNum) }}</strong>
            </div>

            <div class="fieldLabel mt-4">{{ $t('trade.t34') }}</div>
            <van-field type="digit" v-model="buyNum" class="authInput mt-2" :placeholder="$t('trade.t38')" :maxlength="10" :border="false" input-align="left" />

            <div class="mt-4" :class="selectPopObj.need_sn > 0 ? '' : 'invisible'">
              <div class="fieldLabel">{{ $t('trade.t35') }}</div>
              <van-field :type="showPwd ? 'text' : 'password'" v-model="fundPwd" class="authInput mt-2" :placeholder="$t('trade.t36')" :border="false" input-align="left">
                <template #right-icon>
                  <div class="fieldAction" @click="showPwd = !showPwd">
                    <Icon :name="showPwd ? 'solar:eye-linear' : 'solar:eye-closed-linear'" size="18" />
                  </div>
                </template>
              </van-field>
            </div>

            <div class="contentBtn mt-5" @click="confirmHandle">{{ $t('trade.t37') }}</div>
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
.tabChip {
  min-height: 38px;
  padding: 0 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 13px;
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
  padding: 14px;
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
  padding: 14px 10px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
  text-align: center;
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
  width: min(350px, 100%);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(212, 154, 58, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(24, 33, 43, 0.98), rgba(13, 17, 23, 0.98));
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
}
.dialogHead {
  position: relative;
  padding: 18px 18px 10px;
}
.dialogTitle {
  color: var(--text-primary);
  font-size: 20px;
  font-weight: 800;
}
.dialogCode {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}
.closeBtn {
  position: absolute;
  right: 14px;
  top: 14px;
  color: var(--text-secondary);
}
.dialogBody {
  padding: 0 18px 18px;
}
.fieldLabel {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 600;
}
.authInput {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
}
.authInput :deep(.van-field__body) {
  min-height: 48px;
}
.authInput :deep(.van-field__control) {
  color: var(--text-primary);
}
.fieldAction {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}
</style>
