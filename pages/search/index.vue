<script setup lang="ts">
import { stockSearch } from '~/api/home/home';

const pub = usePublicStore();
const searchHistory = computed(() => {
  return pub.searchHistory;
});

const list = ref([]);
const searchVal = ref("");

const searchHandle = () => {
  pub.showLoading = true;
  stockSearch({ keyword: searchVal.value }).then((res) => {
    if (pub.searchHistory.length > 10) {
      pub.searchHistory.pop();
    }
    if (!pub.searchHistory.includes(searchVal.value)) {
      pub.searchHistory = [searchVal.value, ...pub.searchHistory];
    }
    list.value = res;
  });
};

const clickItemHandle = (item) => {
  searchVal.value = item;
  searchHandle();
};

const deletingItem = ref<string | null>(null);
const delSearchHandle = (item: string) => {
  deletingItem.value = item;
  setTimeout(() => {
    const index = pub.searchHistory.indexOf(item);
    if (index > -1) {
      pub.searchHistory.splice(index, 1);
    }
    deletingItem.value = null;
  }, 500);
};

const router = useRouter();
const useSocketStore = socketStore();

const selectHandle = (item) => {
  useSocketStore.currentCoin = item;
  router.push('/trade');
};

onMounted(() => {
  pub.showLoading = false;
});
</script>

<template>
  <div class="pageShell">
    <SecondPageNavBar :title="$t('search.s1')" />

    <clientOnly>
      <div class="pageWrap px-3 pb-6">
        <div class="searchHero mt-4">
          <div class="searchBox">
            <button type="button" class="searchIcon" @click="searchHandle" :aria-label="$t('search.s2')">
              <Icon name="solar:magnifer-linear" size="18" />
            </button>
            <div class="searchField">
              <input type="text" v-model="searchVal" :placeholder="$t('search.s2')" @keydown.enter="searchHandle">
            </div>
            <button type="button" class="clearIcon" v-if="searchVal" @click="searchVal = ''" :aria-label="$t('comm.c56') || 'Clear search'">
              <Icon name="pajamas:clear" width="18" height="18" />
            </button>
          </div>

          <div class="historyCard mt-4">
            <div class="sectionHeading">
              <div class="sectionTitle">{{ $t('search.s3') }}</div>
            </div>
            <div class="historyWrap mt-3">
              <div
                class="historyItem"
                v-for="item in searchHistory"
                :key="item"
                :class="{ 'gridItemElDelete': deletingItem === item }"
                role="button"
                tabindex="0"
                @click="clickItemHandle(item)"
                @keydown.enter.prevent="clickItemHandle(item)"
                @keydown.space.prevent="clickItemHandle(item)"
              >
                <span>{{ item }}</span>
                <button type="button" class="delIcon" @click.stop="delSearchHandle(item)" :aria-label="$t('comm.c56') || 'Delete history item'">
                  <Icon name="mingcute:close-fill" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="sectionCard resultCard mt-4">
          <div v-if="list.length == 0" class="emptyState">
            <div class="nullData mt-6"></div>
            <div class="emptyText">{{ $t('search.s4') }}</div>
          </div>
          <div v-else class="resultList">
            <button type="button" class="resultItem" v-for="(item, index) in list" :key="index" @click="selectHandle(item)">
              <div class="rankBadge">{{ index + 1 }}</div>
              <div class="resultMeta">
                <div class="resultName">{{ item.pro_name }}</div>
                <div class="resultCode">{{ item.pro_code }}</div>
              </div>
              <div class="resultPrice">
                <div class="priceTop" :class="item.is_rise > 1 ? 'isUp' : 'isDown'">
                  <Icon
                    v-if="item.is_rise > 1"
                    name="solar:alt-arrow-up-bold"
                    class="trendIcon"
                  />
                  <Icon
                    v-else
                    name="solar:alt-arrow-down-bold"
                    class="trendIcon"
                  />
                  {{ UseExchangeNumber(item.price) }}
                </div>
                <div class="priceDelta" :class="item.is_rise > 1 ? 'isUp' : 'isDown'">
                  {{ item.is_rise > 1 ? '+' : '-' }} {{ item.rise_rate1 }}%
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </clientOnly>
  </div>
</template>

<style scoped>
.pageWrap {
  min-height: calc(100vh - 60px);
}

.searchHero {
  padding: 18px;
  border-radius: 24px;
  background: var(--gradient-hero);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
}

.searchBox {
  min-height: 54px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border-radius: 18px;
  background: var(--surface-overlay-soft);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.searchIcon {
  width: 40px;
  height: 40px;
  appearance: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
  flex-shrink: 0;
  border: 0;
  cursor: pointer;
  transition: transform var(--motion-fast), background-color var(--motion-fast), color var(--motion-fast);
}

.searchField {
  flex: 1;
}

.searchField input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font-size: 14px;
}

.searchField input::placeholder {
  color: var(--text-placeholder);
}

.clearIcon {
  appearance: none;
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 0;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
}

.historyCard {
  padding: 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-soft);
}

.historyWrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.historyItem {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--brand-primary-soft);
  color: var(--text-primary);
  font-size: 12px;
  cursor: pointer;
  transition: transform var(--motion-fast), background-color var(--motion-fast);
}

.gridItemElDelete {
  opacity: 0;
  transform: scale(0);
  margin: 0;
  padding: 0;
  width: 0;
  overflow: hidden;
}

.delIcon {
  appearance: none;
  color: var(--text-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 0;
  background: transparent;
  border-radius: 999px;
  cursor: pointer;
}

.resultCard {
  padding: 14px;
}

.emptyState {
  padding: 10px 0 18px;
}

.emptyText {
  margin-top: 10px;
  color: var(--text-secondary);
  text-align: center;
}

.resultList {
  display: grid;
  gap: 12px;
}

.resultItem {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border-soft);
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: transform var(--motion-fast), border-color var(--motion-fast), background-color var(--motion-fast);
}

.rankBadge {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
  font-weight: 700;
  flex-shrink: 0;
}

.resultMeta {
  flex: 1;
  min-width: 0;
}

.resultName {
  color: var(--text-primary);
  font-weight: 700;
}

.resultCode {
  margin-top: 4px;
  color: var(--text-secondary);
  font-size: 12px;
}

.resultPrice {
  text-align: right;
  font-size: 12px;
}

.priceTop {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  color: var(--text-primary);
  font-weight: 700;
}

.priceTop.isUp {
  color: var(--color-up);
}

.priceTop.isDown {
  color: var(--color-down);
}

.trendIcon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.priceDelta {
  margin-top: 6px;
  padding: 4px 8px;
  border-radius: 999px;
}

.priceDelta.isUp {
  background: rgba(240, 68, 82, 0.12);
  color: var(--color-up);
}

.priceDelta.isDown {
  background: rgba(24, 195, 126, 0.12);
  color: var(--color-down);
}

.searchIcon:active,
.clearIcon:active,
.historyItem:active,
.resultItem:active {
  transform: scale(0.98);
}
</style>
