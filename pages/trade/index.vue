<script setup lang="ts">
import { showToast } from 'vant';
import { getProductInfo } from '~/api/home/home';
import { subBuyStockHandle } from '~/api/trade';
import socket from "~/utils/socket.ts";
import { stockCollect } from '../../api/home/home';
import { computed } from 'vue';

const { t } = useI18n();

const useSocketStore = socketStore();
const selectCurrentStock = computed(() => {
  return useSocketStore.currentCoin;
});

const priceVal = ref(1);
const numVal = ref(1);
const actTimeEl = ref(0);

const normalizeTradeNumber = (value: unknown, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const getSafeExchangeNumber = (value: unknown, fallback = 0) => {
  return UseExchangeNumber(normalizeTradeNumber(value, fallback));
};

const selectTimeList = [
  { name: t('trade.t39'), value: '1d_1m', type: 'second' },
  { name: t('trade.t40'), value: '5d_2m', type: 'day' },
  { name: t('trade.t41'), value: '1y_1d', type: 'hour' },
  { name: t('trade.t42'), value: '2y_1wk', type: 'week' },
  { name: t('trade.t43'), value: '15y_1mo', type: 'month' },
  { name: t('trade.t44'), value: '30y_3mo', type: 'year' },
];
type TradeRequestPayload = {
  pid: number | string;
  num: number;
  deal_type: '1' | '2';
  type: number;
  limit_price?: number;
};

type YahooMessage = {
  info?: {
    chart?: {
      result?: Array<{
        is_rise: number;
        rise: number;
        rise_rate: number;
      }>;
    };
  };
};

const pub = usePublicStore();
const socketParams = ref({
  pro_code: "",
  range: "1d_1m",
});

const changeActTimeType = (index: number) => {
  pub.showLoading = true;
  actTimeEl.value = index;
  TradeKlineRef.value.showSkeletonLoading = true;
  socketParams.value.range = selectTimeList[actTimeEl.value].value;
  socket.emit('yahoo', {
    ...socketParams.value,
  });
};

const buyType = ref(0);
const productInfo = ref({});
const isCollect = ref(0);
const getData = () => {
  getProductInfo({ pid: selectCurrentStock.value.id }).then((res) => {
    productInfo.value = res;
    userBalance.value = res.balance;
    selfData.value.high = res.pro_info.high;
    selfData.value.low = res.pro_info.low;
    isCollect.value = res.pro_info.isCollect;
  });
};

const TradeKlineRef = ref("");
const socketTimer = ref<ReturnType<typeof setInterval> | null>(null);
const selfData = ref({
  high: 0,
  low: 0,
});
const topStockData = ref({
  price: 0,
  rise: 0,
  is_rise: 0,
  rise_rate: 0,
});

const startSocketTimerHandle = () => {
  if (import.meta.client && globalThis.document?.hidden) {
    return;
  }
  if (socketTimer.value) {
    clearInterval(socketTimer.value);
    socketTimer.value = null;
  }
  socketTimer.value = setInterval(() => {
    socketParams.value.range = selectTimeList[actTimeEl.value].value;
    socket.emit('yahoo', {
      ...socketParams.value,
    });
  }, 1500);
};
const stopSocketTimerHandle = () => {
  if (socketTimer.value) {
    clearInterval(socketTimer.value);
    socketTimer.value = null;
  }
};
const handleVisibilityChange = () => {
  if (!import.meta.client) {
    return;
  }
  if (globalThis.document?.hidden) {
    stopSocketTimerHandle();
    return;
  }
  if (stockStatus.value == 1) {
    startSocketTimerHandle();
  }
};

const topData = ref({
  open: '0',
  close: '0',
  high: '0',
  low: '0',
});

const isChangeType = ref(false);
const updateHomeKlineTopData = (data: typeof topData.value) => {
  topData.value = data;
  const closePrice = normalizeTradeNumber(data.close, topStockData.value.price || 0);
  topStockData.value.price = closePrice;
  if (!isChangeType.value) {
    priceVal.value = closePrice;
    isChangeType.value = true;
  }
};

const changeActTradeType = (index: number) => {
  actTradeType.value = index;
  isChangeType.value = false;
};

const handleYahooMessage = (data: YahooMessage) => {
  pub.showLoading = false;
  const chartResult = data.info?.chart?.result?.[0];
  if (TradeKlineRef.value && chartResult) {
    topStockData.value.is_rise = chartResult.is_rise;
    topStockData.value.rise = chartResult.rise;
    topStockData.value.rise_rate = chartResult.rise_rate;
    TradeKlineRef.value.updateKlineData(chartResult, selectTimeList[actTimeEl.value].type);
  }
};

const stockStatus = computed(() => {
  return pub.stockStatus;
});

onBeforeMount(() => {
  socketParams.value.pro_code = selectCurrentStock.value.pro_code;
  socket.emit('yahoo', {
    ...socketParams.value,
  });
  if (stockStatus.value == 1) {
    startSocketTimerHandle();
  } else if (socketTimer.value) {
    stopSocketTimerHandle();
  }
});

watch(stockStatus, (val) => {
  if (val == 1) {
    startSocketTimerHandle();
  } else if (socketTimer.value) {
    stopSocketTimerHandle();
  }
});

onMounted(() => {
  socket.off('yahoo', handleYahooMessage);
  socket.on('yahoo', handleYahooMessage);
  if (import.meta.client) {
    globalThis.document?.addEventListener('visibilitychange', handleVisibilityChange);
  }
  getData();
});

onUnmounted(() => {
  if (socketTimer.value) {
    stopSocketTimerHandle();
  }
  if (import.meta.client) {
    globalThis.document?.removeEventListener('visibilitychange', handleVisibilityChange);
  }
  socket.off('yahoo', handleYahooMessage);
});

const actTradeType = ref(0);
const tradeType = [t('trade.t45'), t('trade.t46')];
const showBottom = ref(false);
const userBalance = ref(0);

const confirmHandle = () => {
  showBottom.value = false;
  const safePrice = normalizeTradeNumber(priceVal.value, topStockData.value.price || 0);
  const safeNum = normalizeTradeNumber(numVal.value, 1);

  const buyData: TradeRequestPayload = {
    pid: selectCurrentStock.value.id,
    num: safeNum,
    deal_type: actTradeType.value < 1 ? '2' : '1',
    type: Number(buyType.value) + 1,
  };
  if (buyData.deal_type == 2) {
    buyData.limit_price = safePrice;
  }
  pub.showLoading = true;
  subBuyStockHandle(buyData).then(() => {
    showToast(t('trade.t47'));
    numVal.value = 1;
    priceVal.value = normalizeTradeNumber(topStockData.value.price, 0);
  });
};

const subPriceVal = () => {
  const currentPrice = normalizeTradeNumber(priceVal.value, topStockData.value.price || 0);
  if (currentPrice > 1) {
    priceVal.value = normalizeTradeNumber((currentPrice - 1), 0);
  } else if (currentPrice > 0) {
    priceVal.value = normalizeTradeNumber(UseExchangeNumber(currentPrice - 0.1), 0);
    if (priceVal.value < 0) {
      priceVal.value = 0;
    }
  }
};

const addPriceVal = () => {
  const currentPrice = normalizeTradeNumber(priceVal.value, topStockData.value.price || 0);
  priceVal.value = normalizeTradeNumber(UseExchangeNumber(currentPrice + 1), currentPrice + 1);
};

const subNumVal = () => {
  const currentNum = normalizeTradeNumber(numVal.value, 1);
  if (currentNum > 1) {
    numVal.value = Number(currentNum) - 1;
  }
};

const addNumVal = () => {
  const currentNum = normalizeTradeNumber(numVal.value, 1);
  numVal.value = currentNum + 1;
};

const handlePriceInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const sanitized = input.value.replace(/[^\d.]/g, '');
  priceVal.value = sanitized === '' ? '' : sanitized;
};

const handleNumInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const sanitized = input.value.replace(/[^\d]/g, '');
  numVal.value = sanitized === '' ? '' : sanitized;
};

const handlePriceBlur = () => {
  priceVal.value = normalizeTradeNumber(priceVal.value, topStockData.value.price || 0);
};

const handleNumBlur = () => {
  numVal.value = Math.max(1, normalizeTradeNumber(numVal.value, 1));
};

const safePriceValue = computed(() => normalizeTradeNumber(priceVal.value, topStockData.value.price || 0));
const safeNumValue = computed(() => Math.max(1, normalizeTradeNumber(numVal.value, 1)));
const tradeDirectionClass = computed(() => (topStockData.value.is_rise > 1 ? 'colorUp' : 'colorDown'));

const feeVal = computed(() => {
  let val = 0;
  if (productInfo.value.fee_rate) {
    val = Number(safePriceValue.value * safeNumValue.value * productInfo.value.fee_rate).toFixed(2);
  }
  return val;
});

const collectHandle = () => {
  isCollect.value = !isCollect.value;
  stockCollect({
    pid: selectCurrentStock.value.id,
    status: isCollect.value ? 1 : 2,
  }).then(() => {
    showToast(isCollect.value ? t('comm.c67') : t('xx.a2'));
  });
};
</script>

<template>
  <div class="pageShell">
    <ClientOnly>
      <SecondPageNavBar :title="selectCurrentStock.pro_name">
        <button type="button" class="collectToggle" :aria-pressed="Boolean(isCollect)" :aria-label="$t('comm.c67')" @click="collectHandle">
          <Icon
            name="tabler:star-filled"
            size="22"
            :class="isCollect ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'"
          />
        </button>
      </SecondPageNavBar>

      <div class="pageWrap px-3 pb-6">
        <div class="marketStage mt-4">
          <div class="stageHeader">
            <div class="heroMain">
              <div class="heroEyebrow">{{ $t('theme.marketBoardSubtext') }}</div>
              <div class="codeText">{{ selectCurrentStock.pro_code }}</div>
              <div class="priceText">{{ getSafeExchangeNumber(topStockData.price) }}</div>
            </div>
            <div class="deltaBox" :class="tradeDirectionClass">
              <div>{{ getNumberType(true, selectCurrentStock.is_rise) + getSafeExchangeNumber(topStockData.rise) }}</div>
              <div>{{ getNumberType(true, selectCurrentStock.is_rise) + normalizeTradeNumber(topStockData.rise_rate) }}%</div>
            </div>
          </div>

          <div class="stageStatsGrid mt-4">
            <div class="statItem">
              <span>{{ $t('trade.t49') }}</span>
              <strong>{{ UseExchangeNumber(topData.open) }}</strong>
            </div>
            <div class="statItem">
              <span>{{ $t('trade.t50') }}</span>
              <strong>{{ UseExchangeNumber(topData.close) }}</strong>
            </div>
            <div class="statItem">
              <span>{{ $t('trade.t51') }}</span>
              <strong>{{ UseExchangeNumber(selfData.high) }}</strong>
            </div>
            <div class="statItem">
              <span>{{ $t('trade.t52') }}</span>
              <strong>{{ UseExchangeNumber(selfData.low) }}</strong>
            </div>
          </div>

          <div class="timeRail mt-4">
            <button
              type="button"
              v-for="(item, index) in selectTimeList"
              class="timeChip"
              :class="index == actTimeEl ? 'active' : ''"
              :key="index"
              :aria-pressed="index == actTimeEl"
              @click="changeActTimeType(index)"
            >
              {{ item.name }}
            </button>
          </div>

          <div class="chartCard mt-4">
            <TradeKline ref="TradeKlineRef" @updateHomeKlineTopData="updateHomeKlineTopData" />
          </div>
        </div>

        <div class="executionDesk mt-4">
          <div class="deskHeader">
            <div class="tradeTitleGroup">
              <div class="sectionTitle">{{ $t('trade.t53') }}</div>
            </div>
            <div class="deskCaption">{{ $t('theme.marketBoardSubtext') }}</div>
          </div>

          <div class="typeRail mt-4">
            <button
              type="button"
              v-for="(item, index) in tradeType"
              :key="index"
              class="typeChip"
              :class="index == actTradeType ? 'active' : ''"
              :aria-pressed="index == actTradeType"
              @click="changeActTradeType(index)"
            >
              {{ item }}
            </button>
          </div>

          <div class="tradeForm mt-4">
            <div v-if="actTradeType == 0" class="fieldCard">
              <div class="fieldHead">
                <div class="fieldLabel">{{ $t('trade.t54') }}</div>
                <div class="fieldValuePreview">{{ getSafeExchangeNumber(safePriceValue) }}</div>
              </div>
              <div class="stepperRow inputShell">
                <button type="button" class="stepperBtn" :class="safePriceValue > 0 ? 'enabled' : ''" :disabled="safePriceValue <= 0" @click="subPriceVal">
                  <Icon name="solar:minus-square-linear" size="20" />
                </button>
                <input
                  type="text"
                  inputmode="decimal"
                  class="stepperInput"
                  :value="priceVal"
                  @input="handlePriceInput"
                  @blur="handlePriceBlur"
                />
                <button type="button" class="stepperBtn enabled" @click="addPriceVal">
                  <Icon name="solar:add-square-linear" size="20" />
                </button>
              </div>
            </div>

            <div class="fieldCard">
              <div class="fieldHead">
                <div class="fieldLabel">{{ $t('trade.t55') }}</div>
                <div class="fieldValuePreview">{{ safeNumValue }}</div>
              </div>
              <div class="stepperRow inputShell">
                <button type="button" class="stepperBtn" :class="safeNumValue > 1 ? 'enabled' : ''" :disabled="safeNumValue <= 1" @click="subNumVal">
                  <Icon name="solar:minus-square-linear" size="20" />
                </button>
                <input
                  type="text"
                  inputmode="numeric"
                  class="stepperInput"
                  :value="numVal"
                  @input="handleNumInput"
                  @blur="handleNumBlur"
                />
                <button type="button" class="stepperBtn enabled" @click="addNumVal">
                  <Icon name="solar:add-square-linear" size="20" />
                </button>
              </div>
            </div>
          </div>

          <button type="button" class="tradeAction mt-4 contentBtn" @click="showBottom = true">
            {{ $t('trade.t58') }}
          </button>

          <div class="hintBlock mt-4">
            <div class="hintTitle">{{ $t('trade.t59') }}</div>
            <div class="hintCopy">{{ $t('trade.t60') }}</div>
          </div>
        </div>
      </div>

      <van-popup v-model:show="showBottom" round position="bottom" class="confirmPopup">
        <div class="popupWrap">
          <div class="popupTitle">{{ $t('trade.t61') }}</div>
          <div class="popupSubline">{{ selectCurrentStock.pro_name }}</div>

          <div class="summaryList">
            <div class="summaryRow">
              <span>{{ $t('trade.t62') }}</span>
              <strong :class="getNumberClass(true, buyType == 0 ? 2 : 1)">
                {{ actTradeType == 0 ? $t('trade.t45') : $t('trade.t46') }}{{ buyType < 1 ? '--' + $t('trade.t56') : '--' + $t('trade.t57') }}
              </strong>
            </div>
            <div class="summaryRow">
              <span>{{ $t('trade.t63') }}</span>
              <strong>{{ safeNumValue }} {{ $t('trade.t64') }}</strong>
            </div>
            <div class="summaryRow">
              <span>{{ $t('trade.t65') }}</span>
              <strong>X1</strong>
            </div>
            <div class="summaryRow">
              <span>{{ $t('trade.t67') }}/{{ t('x.a9') }}</span>
              <strong>{{ getSafeExchangeNumber(safePriceValue) }}</strong>
            </div>
            <div class="summaryRow">
              <span>{{ $t('trade.t68') }}</span>
              <strong>{{ getSafeExchangeNumber(safePriceValue * safeNumValue) }}</strong>
            </div>
            <div class="summaryRow">
              <span>{{ $t('trade.t69') }}</span>
              <strong>{{ feeVal }}</strong>
            </div>
            <div class="summaryRow">
              <span>{{ $t('trade.t70') }}</span>
              <strong>{{ getSafeExchangeNumber(safePriceValue * safeNumValue + Number(feeVal - 0)) }}</strong>
            </div>
            <div class="summaryRow">
              <span>{{ $t('trade.t71') }}</span>
              <strong>{{ userBalance }}</strong>
            </div>
          </div>

          <button type="button" class="contentBtn mt-4" @click="confirmHandle">{{ $t('trade.t72') }}</button>
        </div>
      </van-popup>
    </ClientOnly>
  </div>
</template>

<style scoped>
.pageWrap {
  min-height: calc(100vh - 60px);
}

.marketStage {
  padding: 18px 16px 16px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.stageHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.heroMain {
  flex: 1;
  min-width: 0;
}

.heroEyebrow {
  color: var(--brand-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.codeText {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
  word-break: break-word;
}

.priceText {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 26px;
  font-weight: 800;
  line-height: 1.12;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.deltaBox {
  padding: 10px 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(56, 189, 248, 0.12);
  text-align: right;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
  flex-shrink: 0;
}

.stageStatsGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.statItem {
  padding: 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
}

.statItem span {
  display: block;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
}

.statItem strong {
  display: block;
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.35;
}

.timeRail {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.timeChip {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  font-size: 12px;
  white-space: nowrap;
  border: 1px solid transparent;
  appearance: none;
  transition: transform .18s ease, background .18s ease, color .18s ease, border-color .18s ease;
}

.timeChip.active {
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
  border-color: var(--brand-primary-border);
}

.timeChip:active {
  transform: scale(.97);
}

.chartCard {
  overflow: hidden;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
}

.executionDesk {
  padding: 4px 2px 0;
}

.deskHeader {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.tradeTitleGroup {
  min-width: 0;
}

.deskCaption {
  max-width: 108px;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.45;
  text-align: right;
}

.typeRail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 6px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
}

.typeChip {
  min-height: 42px;
  padding: 0 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 600;
  appearance: none;
  border: 0;
  transition: transform .18s ease, background .18s ease, color .18s ease;
}

.typeChip.active {
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
}

.typeChip:active {
  transform: scale(.97);
}

.tradeForm {
  display: grid;
  gap: 14px;
}

.fieldCard {
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
}

.fieldHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.fieldLabel {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.fieldValuePreview {
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
  text-align: right;
  line-height: 1.4;
}

.stepperRow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.inputShell {
  min-height: 64px;
  padding: 10px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(31, 55, 82, 0.78), rgba(24, 43, 66, 0.72));
  border: 1px solid var(--border-soft);
}

.stepperBtn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  border: 1px solid var(--border-soft);
  appearance: none;
  transition: transform .18s ease, color .18s ease, border-color .18s ease, background .18s ease;
}

.stepperBtn.enabled {
  color: var(--brand-primary);
}

.stepperBtn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.stepperBtn:not(:disabled):active {
  transform: scale(.96);
}

.stepperInput {
  flex: 1;
  min-width: 0;
  width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  text-align: center;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.01em;
}

.tradeAction {
  min-height: 50px;
}

.collectToggle {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  appearance: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.025);
  transition: transform .18s ease, border-color .18s ease, background .18s ease;
}

.collectToggle:hover {
  border-color: rgba(56, 189, 248, 0.2);
}

.collectToggle:active {
  transform: scale(.96);
}

.hintBlock {
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
}

.hintTitle {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
}

.hintCopy {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.confirmPopup {
  background: transparent;
}

.popupWrap {
  position: relative;
  overflow: hidden;
  padding: 20px 20px calc(env(safe-area-inset-bottom, 0px) + 20px);
  background: transparent;
  color: var(--text-primary);
}

.popupWrap::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at top right, var(--overlay-panel-highlight), transparent 30%),
    linear-gradient(180deg, var(--overlay-panel-top), var(--overlay-panel-bottom));
  pointer-events: none;
}

.popupWrap > * {
  position: relative;
  z-index: 1;
}

.popupTitle {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
}

.popupSubline {
  margin-top: 8px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.summaryList {
  display: grid;
  gap: 12px;
  margin-top: 20px;
}

.summaryRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  font-size: 13px;
}

.summaryRow strong {
  color: var(--text-primary);
  text-align: right;
  max-width: 56%;
  word-break: break-word;
}

::-webkit-scrollbar {
  display: none;
}
</style>
