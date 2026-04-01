<script setup lang="ts">
import { getCollectList } from '~/api/home/home';

type CollectStockItemData = {
  pid: number | string;
  [key: string]: unknown;
};

type CollectListResponse = {
  data: CollectStockItemData[];
  total: number;
};

const params = reactive({
  page: 1,
  limit: 10,
});

const showSkeleton = ref(true)
const items = ref<CollectStockItemData[]>([])
const error = ref(false);
const loading = ref(false);
const finished = ref(false);
const totalSize = ref(0)
const fetchItemsList = () => {
  loading.value = true;
  finished.value = true;

  getCollectList(params.page, params.limit).then((res: CollectListResponse) => {
    if (params.page == 1) {
      items.value = res.data
    } else {
      items.value = items.value.concat(res.data);
    }
    totalSize.value = res.total
    // const bool = params.page > res.last_page;
    // nextTick(() => {
    //     finished.value = bool;
    // });
  }).finally(() => {
    loading.value = false
    if (items.value.length == totalSize.value) {
      finished.value = true
    } else {
      params.page++;
    }
    showSkeleton.value = false
  })
}

const deleteStock = (data: CollectStockItemData) => {
  const index = items.value.findIndex(item => item.pid === data.pid)
  if (index !== -1) {
    items.value.splice(index, 1)
  }
}
const emit = defineEmits()
const changeDataType = () => {
  emit('changeDataType', '0')
}
</script>

<template>
  <div>
    <div v-if="finished && items.length == 0 && !showSkeleton">
      <div class="nullData mt-10"></div>
      <div class="text-lg mt-2 emptyText text-center">
        {{ $t('comm.c4') }}
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4" v-else-if="showSkeleton">
        <div class="listSkeleton h-[112px] rounded-[18px] mb-2" v-for="(item, index) in 4" :key="index">
        </div>
    </div>
    <div >
      <van-list v-model:loading="loading" v-model:error="error" :finished="finished" @load="fetchItemsList">
        <div class="grid grid-cols-2 gap-4">
          <CollectStockItem v-for="(item, index) in items" :key="item.pid" :data="item" @deleteStock="deleteStock" />
        </div>
      </van-list>
    </div>

    <button type="button" class="contentBtn addBtn mt-3" @click="changeDataType">
      <span>{{ $t('comm.c5') }}</span>
      <Icon name="material-symbols:add-circle-rounded" size="20" class="addBtnIcon" />
    </button>
  </div>
</template>

<style scoped>
.emptyText {
  color: var(--text-secondary);
}

.listSkeleton {
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--border-soft);
}

.addBtn {
  min-height: 50px;
  height: auto;
  padding: 12px 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 700;
  transition: transform var(--motion-fast);
}

.addBtnIcon {
  color: rgba(125, 211, 252, 0.92);
  flex-shrink: 0;
}

.addBtn:active {
  transform: scale(0.98);
}
</style>
