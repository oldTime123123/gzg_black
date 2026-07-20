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

const pub = usePublicStore();
const socketParams = ref({
  pro_code: "",
  range: "1d_1m",
});

const changeActTimeType = (index) => {
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
const socketTimer = ref("");
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

const topData = ref({
  open: '0',
  close: '0',
  high: '0',
  low: '0',
});

const isChangeType = ref(false);
const updateHomeKlineTopData = (data) => {
  topData.value = data;
  const closePrice = normalizeTradeNumber(data.close, topStockData.value.price || 0);
  topStockData.value.price = closePrice;
  if (!isChangeType.value) {
    priceVal.value = closePrice;
    isChangeType.value = true;
  }
};

const changeActTradeType = (index) => {
  actTradeType.value = index;
  isChangeType.value = false;
};

socket.on('yahoo', (data: any) => {
  pub.showLoading = false;
  if (TradeKlineRef.value && data.info.chart && data.info.chart.result[0]) {
    topStockData.value.is_rise = data.info.chart.result[0].is_rise;
    topStockData.value.rise = data.info.chart.result[0].rise;
    topStockData.value.rise_rate = data.info.chart.result[0].rise_rate;
    TradeKlineRef.value.updateKlineData(data.info.chart.result[0], selectTimeList[actTimeEl.value].type);
  }
});

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
    clearInterval(socketTimer.value);
    socketTimer.value = null;
  }
});

watch(stockStatus, (val) => {
  if (val == 1) {
    startSocketTimerHandle();
  } else if (socketTimer.value) {
    clearInterval(socketTimer.value);
    socketTimer.value = null;
  }
});

onMounted(() => {
  getData();
});

onUnmounted(() => {
  if (socketTimer.value) {
    clearInterval(socketTimer.value);
  }
});

const actTradeType = ref(0);
const tradeType = [t('trade.t45'), t('trade.t46')];
const showBottom = ref(false);
const userBalance = ref(0);

const confirmHandle = () => {
  showBottom.value = false;
  const safePrice = normalizeTradeNumber(priceVal.value, topStockData.value.price || 0);
  const safeNum = normalizeTradeNumber(numVal.value, 1);

  const buyData: any = {
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
const tradeModeText = computed(() => (actTradeType.value == 0 ? t('trade.t45') : t('trade.t46')));

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
        <Icon
          name="lucide:star"
          size="22"
          :class="isCollect ? 'text-[var(--brand-primary)]' : 'text-[var(--text-muted)]'"
          @click="collectHandle"
        />
      </SecondPageNavBar>

      <div class="pageWrap px-3 pb-6">
        <div class="heroCard mt-4">
          <div class="heroTop">
            <div class="heroMain">
              <div class="codeText">{{ selectCurrentStock.pro_code }}</div>
              <div class="priceText">{{ getSafeExchangeNumber(topStockData.price) }}</div>
            </div>
            <div class="deltaBox" :class="tradeDirectionClass">
              <div>{{ getNumberType(true, selectCurrentStock.is_rise) + getSafeExchangeNumber(topStockData.rise) }}</div>
              <div>{{ getNumberType(true, selectCurrentStock.is_rise) + normalizeTradeNumber(topStockData.rise_rate) }}%</div>
            </div>
          </div>

          <div class="statsGrid mt-4">
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
            <div
              v-for="(item, index) in selectTimeList"
              class="timeChip"
              :class="index == actTimeEl ? 'active' : ''"
              :key="index"
              @click="changeActTimeType(index)"
            >
              {{ item.name }}
            </div>
          </div>

          <div class="chartCard mt-4">
            <TradeKline ref="TradeKlineRef" @updateHomeKlineTopData="updateHomeKlineTopData" />
          </div>
        </div>

        <div class="sectionCard tradeCard mt-4">
          <div class="tradeHeader">
            <div class="tradeIntro">
              <div class="sectionTitle">{{ $t('trade.t53') }}</div>
              <div class="tradeSubline">{{ tradeModeText }}</div>
            </div>
            <div class="typeRail">
              <div
                v-for="(item, index) in tradeType"
                :key="index"
                class="typeChip"
                :class="index == actTradeType ? 'active' : ''"
                @click="changeActTradeType(index)"
              >
                {{ item }}
              </div>
            </div>
          </div>

          <div class="formGrid mt-4">
            <div v-if="actTradeType == 0" class="fieldCard">
              <div class="fieldHead">
                <div class="fieldLabel">{{ $t('trade.t54') }}</div>
              </div>
              <div class="stepperRow inputShell">
                <div class="stepperBtn" :class="safePriceValue > 0 ? 'enabled' : ''" @click="subPriceVal">
                  <Icon name="lucide:square-minus" size="20" />
                </div>
                <input
                  type="text"
                  inputmode="decimal"
                  class="stepperInput"
                  :value="priceVal"
                  @input="handlePriceInput"
                  @blur="handlePriceBlur"
                />
                <div class="stepperBtn enabled" @click="addPriceVal">
                  <Icon name="lucide:square-plus" size="20" />
                </div>
              </div>
            </div>

            <div class="fieldCard">
              <div class="fieldHead">
                <div class="fieldLabel">{{ $t('trade.t55') }}</div>
              </div>
              <div class="stepperRow inputShell">
                <div class="stepperBtn" :class="safeNumValue > 1 ? 'enabled' : ''" @click="subNumVal">
                  <Icon name="lucide:square-minus" size="20" />
                </div>
                <input
                  type="text"
                  inputmode="numeric"
                  class="stepperInput"
                  :value="numVal"
                  @input="handleNumInput"
                  @blur="handleNumBlur"
                />
                <div class="stepperBtn enabled" @click="addNumVal">
                  <Icon name="lucide:square-plus" size="20" />
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 contentBtn" @click="showBottom = true">
            {{ $t('trade.t58') }}
          </div>

          <div class="hintBlock mt-4">
            <div>{{ $t('trade.t59') }}</div>
            <div class="mt-2">{{ $t('trade.t60') }}</div>
          </div>
        </div>
      </div>

      <van-popup v-model:show="showBottom" round position="bottom" class="confirmPopup">
        <div class="popupWrap">
          <div class="popupTitle">{{ $t('trade.t61') }}</div>

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

          <div class="contentBtn mt-4" @click="confirmHandle">{{ $t('trade.t72') }}</div>
        </div>
      </van-popup>
    </ClientOnly>
  </div>
</template>

<style scoped>
.pageWrap {
  min-height: calc(100vh - 60px);
}

.heroCard {
  padding: 20px;
  border-radius: 24px;
  background: var(--gradient-hero);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
}

.heroTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.heroMain {
  flex: 1;
  min-width: 0;
}

.codeText {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.4;
  word-break: break-word;
}

.priceText {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 30px;
  font-weight: 800;
  line-height: 1.2;
}

.deltaBox {
  padding: 10px 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
  text-align: right;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
  flex-shrink: 0;
}

.statsGrid {
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
}

.timeChip.active {
  background: rgba(95, 224, 179, 0.12);
  color: var(--brand-primary);
  border-color: var(--brand-primary-border);
}

.chartCard {
  overflow: hidden;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
}

.tradeCard {
  padding: 20px;
}

.tradeHeader {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tradeIntro {
  min-width: 0;
}

.tradeSubline {
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.typeRail {
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  flex-wrap: wrap;
}

.typeChip {
  min-height: 38px;
  padding: 0 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 13px;
}

.typeChip.active {
  background: rgba(95, 224, 179, 0.12);
  color: var(--brand-primary);
}

.formGrid {
  display: grid;
  gap: 14px;
}

.fieldCard {
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--border-soft);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.fieldHead {
  display: flex;
  align-items: flex-start;
  min-width: 0;
}

.fieldLabel {
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 700;
  line-height: 1.4;
}

.fieldMeta {
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.4;
  text-align: right;
  min-width: 0;
  max-width: 100%;
  word-break: break-word;
}

.stepperRow {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.inputShell {
  min-height: 72px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(13, 20, 27, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stepperBtn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  border: 1px solid var(--border-soft);
}

.stepperBtn.enabled {
  color: var(--brand-primary);
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
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.01em;
}

.hintBlock {
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.7;
}

.confirmPopup {
  background: transparent;
}

.popupWrap {
  padding: 20px;
  background:
    radial-gradient(circle at top right, rgba(95, 224, 179, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(24, 33, 43, 0.98), rgba(13, 17, 23, 0.98));
  color: var(--text-primary);
}

.popupTitle {
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
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
