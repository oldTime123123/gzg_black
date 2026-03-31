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
  } else {
    window.open(item.url);
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

      <div class="pageContainer px-3 mt-3 pb-6">
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

            <div class="headlineCard mt-4" @click="goNewsDetail(featuredNews)">
              <div class="headlineTop">
                <div class="featuredLabel">{{ $t('theme.featured') }}</div>
                <div class="featuredTypeWrap">
                  <span class="featuredType" v-if="featuredNews.article_type == 2">{{ $t('news.n2') }}</span>
                  <span class="featuredType" v-else-if="featuredNews.article_type == 1">{{ $t('news.n3') }}</span>
                </div>
              </div>
              <div class="headlineTitle">{{ featuredNews.name }}</div>
              <div class="headlineSummary">{{ $t('theme.intelligenceHubCopy') }}</div>
            </div>

            <div class="briefTicker mt-4" v-if="restNews.length">
              <div class="tickerRow" v-for="item in restNews.slice(0, 3)" :key="item.id || item.name"
                @click="goNewsDetail(item)">
                <div class="tickerStamp">{{ item.show_time_format }}</div>
                <div class="tickerHeadline">{{ item.name }}</div>
              </div>
            </div>
          </div>

          <div class="newsSection mt-4">
            <div class="sectionHeading">
              <div>
                <div class="heroEyebrow">{{ $t('theme.chronologicalNewsFlow') }}</div>
                <div class="sectionTitle">{{ $t('theme.intelligenceHub') }}</div>
              </div>
              <div class="sectionCaption">{{ $t('theme.intelligenceHubCopy') }}</div>
            </div>

            <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '"
              :finished-text="' '" @load="getRecordList">
              <div class="newsTimeline mt-4">
                <div class="timelineItem" v-for="item in restNews" :key="item.id || item.name" @click="goNewsDetail(item)">
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
                </div>
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
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.digestStage {
  padding-top: 6px;
}

.digestHeader {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.digestTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 22px;
  line-height: 1.15;
  font-weight: 700;
}

.digestMeta {
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.45;
  text-align: right;
}

.headlineCard {
  padding: 20px 18px 18px;
  border-radius: 26px;
  background:
    radial-gradient(circle at top right, rgba(212, 154, 58, 0.1), transparent 26%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.06);
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
  font-size: 12px;
  font-weight: 700;
}

.headlineTitle {
  margin-top: 12px;
  color: var(--text-primary);
  font-size: 20px;
  line-height: 1.45;
  font-weight: 700;
}

.headlineSummary {
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.briefTicker {
  display: grid;
  gap: 12px;
}

.tickerRow {
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.tickerStamp {
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.5;
}

.tickerHeadline {
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.55;
  font-weight: 600;
  word-break: break-word;
}

.newsSection {
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
  font-size: 12px;
}

.sectionHeading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.sectionTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 20px;
  line-height: 1.2;
  font-weight: 700;
}

.sectionCaption {
  max-width: 132px;
  color: var(--text-secondary);
  font-size: 11px;
  line-height: 1.45;
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
  gap: 16px;
}

.timelineItem {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr);
  gap: 14px;
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
  padding-bottom: 16px;
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
  font-size: 12px;
  line-height: 1.45;
}

.newsTitle {
  margin-top: 10px;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.55;
  font-weight: 600;
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
</style>
