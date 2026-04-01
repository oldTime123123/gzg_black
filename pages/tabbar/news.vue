<script lang="ts" setup>
import { computed, ref } from "vue";
import { getNewsList } from "~/api/home/home";

type NewsRecord = {
  id?: number | string;
  name: string;
  type: number;
  url?: string;
  show_time_format: string;
  article_type: number;
};

const pages = ref({
  page: 1,
  size: 20,
  pos: 1,
});

const showSkeleton = ref(true);
const recordList = ref<NewsRecord[]>([]);
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

const goNewsDetail = (item: NewsRecord) => {
  if (item.type !== 2) {
    pub.selectNews = item;
    router.push('/mine/newsDetail');
  } else if (import.meta.client && item.url) {
    globalThis.open?.(item.url, '_blank');
  }
};

onBeforeMount(() => {
  getRecordList();
});
</script>

<template>
  <section>
    <div class="hasNormalBg pageShell">
      <TabbarTopNavBar />

      <div class="pageContainer pageStack mt-3 min-h-[calc(100vh-130px)] px-3 pb-6">
        <div v-if="showSkeleton" class="grid gap-3 pt-1">
          <div class="h-[96px] rounded-[22px] border border-white/10 bg-[rgba(255,255,255,0.04)]" v-for="(item, index) in 6" :key="index"></div>
        </div>

        <template v-else>
          <div v-if="recordList.length" class="pt-1">
            <van-list v-model:loading="loading" :finished="finished" :error-text="' '" :loading-text="' '"
              :finished-text="' '" @load="getRecordList">
              <div class="grid gap-0 renderBudget">
                <button
                  type="button"
                  class="grid w-full grid-cols-[20px_minmax(0,1fr)] gap-3.5 bg-transparent pb-4 text-left transition-transform duration-200 ease-out"
                  v-for="(item, index) in recordList"
                  :key="item.id || item.name"
                  @click="goNewsDetail(item)"
                >
                  <div class="flex flex-col items-center gap-2 pt-1">
                    <span class="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--brand-primary)] shadow-[0_0_0_4px_rgba(56,189,248,0.12)]"></span>
                    <span class="w-px flex-1 bg-white/10" :class="index === recordList.length - 1 ? 'opacity-0' : 'opacity-100'"></span>
                  </div>
                  <div class="border-b border-white/10 pb-4">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                      <span class="text-[13px] leading-[1.5] text-[var(--text-secondary)]">{{ item.show_time_format }}</span>
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-if="item.article_type == 2"
                          class="inline-flex min-h-7 items-center justify-center rounded-full bg-white/10 px-2.5 text-[12px] font-semibold text-[var(--text-primary)]"
                        >
                          {{ $t('news.n2') }}
                        </span>
                        <span
                          v-else-if="item.article_type == 1"
                          class="inline-flex min-h-7 items-center justify-center rounded-full bg-white/10 px-2.5 text-[12px] font-semibold text-[var(--text-primary)]"
                        >
                          {{ $t('news.n3') }}
                        </span>
                      </div>
                    </div>
                    <div class="mt-2.5 text-[1rem] font-semibold leading-[1.62] text-[var(--text-primary)]">{{ item.name }}</div>
                  </div>
                </button>
              </div>
            </van-list>
          </div>
        </template>
      </div>
    </div>

    <Tabbar />
  </section>
</template>
