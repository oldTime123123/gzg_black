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
        <div class="heroPanel">
          <div class="sectionSubtext">{{ $t('theme.intelligenceHub') }}</div>
          <div class="heroTitle">{{ $t('theme.newsHeroTitle') }}</div>
          <div class="heroDesc">{{ $t('theme.intelligenceHubCopy') }}</div>
        </div>

        <div v-if="showSkeleton" class="mt-4">
          <div class="skeletonCard" v-for="(item, index) in 6" :key="index"></div>
        </div>

        <div v-else>
          <div v-if="featuredNews" class="featuredCard mt-4" @click="goNewsDetail(featuredNews)">
            <div class="featuredTop">
              <div class="featuredLabel">{{ $t('theme.featured') }}</div>
              <div class="featuredTypeWrap">
                <span class="featuredType" v-if="featuredNews.article_type == 2">{{ $t('news.n2') }}</span>
                <span class="featuredType" v-else-if="featuredNews.article_type == 1">{{ $t('news.n3') }}</span>
              </div>
            </div>
            <div class="featuredTitle">{{ featuredNews.name }}</div>
            <div class="featuredDesc">{{ $t('theme.intelligenceHubCopy') }}</div>
            <div class="featuredMeta">
              <span>{{ featuredNews.show_time_format }}</span>
            </div>
          </div>

          <div class="sectionCard mt-4 p-4">
            <div class="sectionHeading">
              <div>
                <div class="sectionTitle">{{ $t('theme.latestCoverage') }}</div>
                <div class="sectionSubtext">{{ $t('theme.chronologicalNewsFlow') }}</div>
              </div>
            </div>

            <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '"
              :finished-text="' '" @load="getRecordList">
              <div class="newsFlow mt-4">
                <div class="newsItem" v-for="item in restNews" :key="item.id || item.name" @click="goNewsDetail(item)">
                  <div class="newsTime">
                    <span class="newsDot"></span>
                    <span>{{ item.show_time_format }}</span>
                  </div>
                  <div class="newsBody">
                    <div class="newsTitle">{{ item.name }}</div>
                    <div class="newsTypeWrap">
                      <span class="newsType" v-if="item.article_type == 2">{{ $t('news.n2') }}</span>
                      <span class="newsType" v-else-if="item.article_type == 1">{{ $t('news.n3') }}</span>
                    </div>
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

.heroPanel {
  padding: 22px 18px;
  border-radius: 26px;
  background: var(--gradient-hero);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-float);
}

.heroTitle {
  margin-top: 8px;
  color: var(--text-primary);
  font-size: 24px;
  line-height: 1.2;
  font-weight: 700;
}

.heroDesc {
  margin-top: 10px;
  color: var(--text-secondary);
  font-size: 13px;
}

.featuredCard {
  padding: 20px;
  border-radius: 26px;
  background:
    radial-gradient(circle at top right, rgba(95, 224, 179, 0.14), transparent 30%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-card);
}

.featuredTop {
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
  background: rgba(95, 224, 179, 0.12);
  color: var(--brand-primary);
  font-size: 12px;
  font-weight: 700;
}

.featuredTitle {
  margin-top: 14px;
  color: var(--text-primary);
  font-size: 22px;
  line-height: 1.35;
  font-weight: 700;
}

.featuredDesc {
  margin-top: 12px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.featuredMeta {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 12px;
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

.newsFlow {
  display: grid;
  gap: 14px;
}

.newsItem {
  display: block;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
}

.newsTime {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.45;
}

.newsDot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--brand-primary);
  box-shadow: 0 0 0 4px rgba(95, 224, 179, 0.12);
  flex-shrink: 0;
}

.newsBody {
  min-width: 0;
  margin-top: 12px;
}

.newsTitle {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.6;
  font-weight: 600;
  word-break: break-word;
}

.newsTypeWrap {
  margin-top: 12px;
}

.skeletonCard {
  height: 92px;
  margin-bottom: 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-soft);
}

@media (max-width: 380px) {
  .newsTime {
    gap: 8px;
  }

  .newsTitle {
    font-size: 14px;
  }
}
</style>
