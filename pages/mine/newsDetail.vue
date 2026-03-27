<script setup lang="ts">
import { getNewsDetail } from '~/api/home/home'

const pub = usePublicStore()
const selectNews = ref({})

const getData = () => {

    getNewsDetail({
        id: pub.selectNews.id
    }).then(res => {
        selectNews.value = res
    })
}
onMounted(() => {
    pub.showLoading = false
    getData()
}) 
</script>

<template>
    <div class="pageShell">
        <SecondPageNavBar :title="$t('mine.m1')"></SecondPageNavBar>

        <div class="pageWrap px-3 pb-6">
            <div class="heroCard mt-4">
                <div class="sectionSubtext">{{ $t('theme.intelligenceHub') }}</div>
                <div class="heroTitle">{{ selectNews.name }}</div>
                <div class="metaRow">
                    <div class="typeBadge">{{ $t('mine.m2') }}</div>
                    <div class="metaTime">{{ selectNews.show_time_format }}</div>
                </div>
            </div>

        <div class="sectionCard mt-4 articleCard">
            <ClientOnly>
                <div class="articleInner">
                    <div class="articleBody text-sm" v-html="selectNews.contents"></div>
                </div>
            </ClientOnly>
        </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
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

.heroTitle {
    margin-top: 8px;
    color: var(--text-primary);
    font-size: 22px;
    font-weight: 800;
    line-height: 1.4;
}

.metaRow {
    margin-top: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.typeBadge {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    background: rgba(95, 224, 179, 0.12);
    color: var(--brand-primary);
    font-size: 12px;
    font-weight: 700;
}

.metaTime {
    color: var(--text-secondary);
    font-size: 12px;
}

.articleCard {
    padding: 18px;
}

.articleInner {
    padding: 18px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-soft);
}

.articleBody {
    color: var(--text-secondary);
    line-height: 1.8;
    word-break: break-word;
}

.articleBody:deep(p) {
    margin: 0 0 14px;
}

.articleBody:deep(img) {
    max-width: 100%;
    border-radius: 16px;
}

.articleBody:deep(h1),
.articleBody:deep(h2),
.articleBody:deep(h3),
.articleBody:deep(h4) {
    color: var(--text-primary);
    margin: 0 0 14px;
    line-height: 1.4;
}

.articleBody:deep(ul),
.articleBody:deep(ol) {
    padding-left: 20px;
    margin: 0 0 14px;
}

.articleBody:deep(li) {
    margin-bottom: 8px;
}
</style>
