<script lang="ts" setup>
import { computed, ref } from "vue";
import { getNewsList } from "~/api/home/home";

const pages = ref({
  page: 1,
  size: 20,
  pos: 1,
});

const showSkeleton = ref(true);
const recordList = ref([]);
const loading = ref(true);
const finished = ref(false);
const totalSize = ref(0);

const getRecordList = () => {
  getNewsList(pages.value)
    .then((res) => {
      totalSize.value = res.total;
      recordList.value = recordList.value.concat(res.list);
    })
    .finally(() => {
      loading.value = false;
      if (recordList.value.length == totalSize.value) {
        finished.value = true;
      } else {
        pages.value.page++;
      }
      showSkeleton.value = false;
    });
};

const router = useRouter();
const pub = usePublicStore();

const goNewsDetail = (item) => {
  if (item.type !== 2) {
    pub.selectNews = item;
    router.push('/mine/newsDetail');
  } else if (import.meta.client && item.url) {
    globalThis.open?.(item.url, '_blank');
  }
};

const featuredNews = computed(() => recordList.value[0]);
const restNews = computed(() => recordList.value.slice(1));

onBeforeMount(() => {
  getRecordList();
});
</script>

<template>
  <section>
    <div class="hasNormalBg pageShell">
      <TabbarTopNavBar />

      <div class="pageContainer pageStack px-3 mt-3 pb-6">
        <div v-if="showSkeleton" class="mt-4">
          <div class="skeletonCard" v-for="(item, index) in 6" :key="index"></div>
        </div>

        <div v-else>
          <div class="digestStage" v-if="featuredNews">
            <div class="digestHeader">
              <div>
                <div class="heroEyebrow">{{ $t('theme.intelligenceHub') }}</div>
                <div class="digestTitle">{{ $t('theme.latestCoverage') }}</div>
              </div>
              <div class="digestMeta">{{ featuredNews.show_time_format }}</div>
            </div>

            <button type="button" class="headlineCard" @click="goNewsDetail(featuredNews)">
              <div class="headlineTop">
                <div class="featuredLabel">{{ $t('theme.featured') }}</div>
                <div class="featuredTypeWrap">
                  <span class="featuredType" v-if="featuredNews.article_type == 2">{{ $t('news.n2') }}</span>
                  <span class="featuredType" v-else-if="featuredNews.article_type == 1">{{ $t('news.n3') }}</span>
                </div>
              </div>
              <div class="headlineTitle">{{ featuredNews.name }}</div>
              <div class="headlineSummary">{{ $t('theme.intelligenceHubCopy') }}</div>
            </button>

            <div class="briefTicker renderBudgetDense" v-if="restNews.length">
              <button type="button" class="tickerRow" v-for="item in restNews.slice(0, 3)" :key="item.id || item.name"
                @click="goNewsDetail(item)">
                <div class="tickerStamp">{{ item.show_time_format }}</div>
                <div class="tickerHeadline">{{ item.name }}</div>
              </button>
            </div>
          </div>

          <div class="newsSection">
            <div class="sectionHeading">
              <div>
                <div class="sectionTitle">{{ $t('theme.intelligenceHub') }}</div>
              </div>
              <div class="sectionCaption">{{ $t('theme.intelligenceHubCopy') }}</div>
            </div>

            <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '"
              :finished-text="' '" @load="getRecordList">
              <div class="newsTimeline renderBudget">
                <button type="button" class="timelineItem" v-for="item in restNews" :key="item.id || item.name" @click="goNewsDetail(item)">
                  <div class="timelineRail">
                    <span class="newsDot"></span>
                    <span class="timelineLine"></span>
                  </div>
                  <div class="timelineBody">
                    <div class="timelineTop">
                      <span class="newsTime">{{ item.show_time_format }}</span>
                      <div class="newsTypeWrap">
                        <span class="newsType" v-if="item.article_type == 2">{{ $t('news.n2') }}</span>
                        <span class="newsType" v-else-if="item.article_type == 1">{{ $t('news.n3') }}</span>
                      </div>
                    </div>
                    <div class="newsTitle">{{ item.name }}</div>
                  </div>
                </button>
              </div>
            </van-list>
          </div>
        </div>
      </div>
    </div>

    <Tabbar />
  </section>
</template>

<style lang="less" scoped>
.pageContainer {
  min-height: calc(100vh - 130px);
}

.heroEyebrow {
  color: var(--brand-primary);
  font-size: var(--text-caption);
  font-weight: var(--weight-bold);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
}

.digestStage {
  display: grid;
  gap: var(--space-s);
  padding-top: 6px;
}

.digestHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-s);
}

.digestTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-family: var(--font-family-display);
  font-size: 1.625rem;
  line-height: 1.08;
  font-weight: var(--weight-heavy);
  letter-spacing: var(--tracking-tight);
}

.digestMeta {
  color: var(--text-secondary);
  font-size: var(--text-label);
  line-height: 1.5;
  text-align: right;
}

.headlineCard {
  appearance: none;
  width: 100%;
  padding: 20px 18px 18px;
  border-radius: 26px;
  background:
    radial-gradient(circle at top right, rgba(212, 154, 58, 0.1), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-align: left;
  cursor: pointer;
  transition:
    transform var(--motion-fast),
    border-color var(--motion-fast),
    background-color var(--motion-fast);
}

.headlineTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.featuredLabel {
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
  font-size: var(--text-caption);
  font-weight: var(--weight-bold);
  letter-spacing: 0.04em;
}

.headlineTitle {
  margin-top: 14px;
  color: var(--text-primary);
  font-family: var(--font-family-display);
  font-size: 1.375rem;
  line-height: 1.34;
  font-weight: var(--weight-heavy);
  letter-spacing: var(--tracking-dense);
  max-width: 24ch;
}

.headlineSummary {
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: var(--leading-relaxed);
  max-width: 28ch;
}

.briefTicker {
  display: grid;
  gap: 0;
}

.tickerRow {
  appearance: none;
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  width: 100%;
  padding: 14px 0;
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  border-left: 0;
  border-right: 0;
  border-top: 0;
  text-align: left;
  cursor: pointer;
  transition:
    transform var(--motion-fast),
    border-color var(--motion-fast);
}

.tickerStamp {
  color: var(--text-secondary);
  font-size: var(--text-label);
  line-height: 1.5;
}

.tickerHeadline {
  color: var(--text-primary);
  font-size: 1rem;
  line-height: var(--leading-body);
  font-weight: var(--weight-semibold);
  word-break: break-word;
}

.newsSection {
  display: grid;
  gap: var(--space-s);
  padding: 4px 2px 0;
}

.featuredType,
.newsType {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary);
  font-size: var(--text-caption);
  font-weight: var(--weight-semibold);
}

.sectionHeading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-s);
}

.sectionTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-family: var(--font-family-display);
  font-size: 1.375rem;
  line-height: 1.18;
  font-weight: var(--weight-heavy);
  letter-spacing: var(--tracking-dense);
}

.sectionCaption {
  max-width: 152px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
  text-align: right;
}

.newsDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--brand-primary);
  box-shadow: 0 0 0 4px rgba(212, 154, 58, 0.12);
  flex-shrink: 0;
}

.newsTimeline {
  display: grid;
  gap: 0;
}

.timelineItem {
  appearance: none;
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  gap: 14px;
  width: 100%;
  padding: 0 0 var(--space-s);
  background: transparent;
  border: 0;
  text-align: left;
  cursor: pointer;
  transition: transform var(--motion-fast);
}

.timelineRail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
}

.timelineLine {
  flex: 1;
  width: 1px;
  min-height: 72px;
  background: rgba(255, 255, 255, 0.08);
}

.timelineBody {
  padding-bottom: var(--space-s);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.timelineTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.newsTime {
  color: var(--text-secondary);
  font-size: var(--text-label);
  line-height: 1.5;
}

.newsTitle {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 1rem;
  line-height: var(--leading-body);
  font-weight: var(--weight-semibold);
  word-break: break-word;
}

.newsTypeWrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skeletonCard {
  height: 108px;
  margin-bottom: 12px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-soft);
}

.headlineCard:hover {
  background:
    radial-gradient(circle at top right, rgba(212, 154, 58, 0.12), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.025));
  border-color: rgba(212, 154, 58, 0.2);
}

.headlineCard:active,
.tickerRow:active,
.timelineItem:active {
  transform: scale(0.99);
}
</style>
