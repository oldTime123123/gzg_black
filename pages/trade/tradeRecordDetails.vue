<script setup lang="ts">
import { getRecordDetails } from "~/api/trade";

const route = useRoute();
const curId = route.query.id;

const orderInfo = ref({
  product: {
    id: "-",
  },
  expected_profit_rate: 0,
  expected_profit: 0,
});

const getData = () => {
  getRecordDetails({
    id: curId,
  }).then((res) => {
    orderInfo.value = res;
  });
};

onBeforeMount(() => {
  getData();
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('trade.t129')" />

    <div class="pageWrap px-3 pb-6">
      <div class="heroCard mt-4">
        <div class="heroTop">
          <div class="heroMain">
            <div class="heroCode">{{ orderInfo.product?.pro_code }}</div>
            <div class="heroTitle">{{ orderInfo.product?.pro_name }}</div>
          </div>
          <div class="heroBadge">
            {{ orderInfo.buy_type > 1 ? $t('trade.t130') : $t('trade.t131') }}
          </div>
        </div>

        <div class="profitGrid mt-4">
          <div class="profitItem">
            <span>{{ $t('trade.t125') }}</span>
            <strong :class="getNumberClass(true, orderInfo.profit_type)">
              {{ getNumberType(true, orderInfo.profit_type) + orderInfo.expected_profit }}
            </strong>
          </div>
          <div class="profitItem">
            <span>{{ $t('trade.t132') }}</span>
            <strong :class="getNumberClass(true, orderInfo.profit_type)">
              {{ getNumberType(true, orderInfo.profit_type) + orderInfo.expected_profit_rate }}%
            </strong>
          </div>
        </div>
      </div>

      <div class="sectionCard detailCard mt-4">
        <div class="sectionTitle">{{ $t('trade.t133') }}</div>
        <div class="detailList mt-4">
          <div class="detailRow">
            <span>{{ $t('trade.t134') }}</span>
            <strong>{{ orderInfo.number }}</strong>
          </div>
          <div class="detailRow">
            <span>{{ $t('trade.t135') }}</span>
            <strong>{{ orderInfo.money }}</strong>
          </div>
          <div class="detailRow">
            <span>{{ $t('trade.t136') }}</span>
            <strong>{{ orderInfo.close_status > 1 ? $t('trade.t137') : $t('trade.t138') }}</strong>
          </div>
          <div class="detailRow">
            <span>{{ $t('trade.t142') }}</span>
            <strong>{{ orderInfo.create_time }}</strong>
          </div>
          <div class="detailRow" v-if="orderInfo.fee > 0">
            <span>{{ $t('x.a10') }}</span>
            <strong>{{ orderInfo.fee }}</strong>
          </div>
          <div class="detailRow" v-if="orderInfo.close_fee > 0">
            <span>{{ $t('x.a11') }}</span>
            <strong>{{ orderInfo.close_fee }}</strong>
          </div>
          <template v-if="orderInfo.close_price > 0">
            <div class="detailRow">
              <span>{{ $t('trade.t143') }}</span>
              <strong>{{ orderInfo.close_price }}</strong>
            </div>
            <div class="detailRow">
              <span>{{ $t('trade.t144') }}</span>
              <strong>{{ orderInfo.close_time }}</strong>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pageWrap {
  min-height: calc(100vh - 60px);
}

.heroCard {
  padding: 18px;
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

.heroCode {
  color: var(--text-secondary);
  font-size: 12px;
}

.heroTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 800;
  line-height: 1.15;
  word-break: break-word;
}

.heroBadge {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(95, 224, 179, 0.12);
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
}

.profitGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.profitItem {
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
}

.profitItem span {
  display: block;
  color: var(--text-secondary);
  font-size: 12px;
}

.profitItem strong {
  display: block;
  margin-top: 8px;
  font-size: 18px;
}

.detailCard {
  padding: 18px;
}

.detailList {
  display: grid;
  gap: 10px;
}

.detailRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
  color: var(--text-secondary);
  font-size: 13px;
}

.detailRow strong {
  color: var(--text-primary);
  text-align: right;
  min-width: 0;
  max-width: 56%;
  word-break: break-word;
}

@media (max-width: 430px) {
  .heroTop {
    flex-wrap: wrap;
  }

  .heroBadge {
    margin-top: 4px;
  }

  .profitGrid {
    grid-template-columns: 1fr;
  }

  .detailRow {
    align-items: flex-start;
  }

  .detailRow strong {
    max-width: 52%;
    font-size: 13px;
  }
}
</style>
