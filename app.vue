<template>
  <div>
    <NuxtPage class="pageContent" :transition="pageTransition" />
    <Loading1 />
    <RealPop />
    <IPOactSign/>
    <login-loading   />
  <!-- <NuxtLoadingIndicator
    color="repeating-linear-gradient(to right, #00dc82 0%, #34cdfe 50%, #0047e1 100%)"
    :height="4"
    :throttle="200"
  /> -->
    <van-backTop :bottom="90" :right="10"></van-backTop>
  </div>
</template>
<script setup lang="ts">
import socket from "~/utils/socket.ts";
import { storage } from "~/stores/storage";

import { useHead, useSeoMeta, useRequestURL } from 'nuxt/app'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
const pub = usePublicStore()
const pageTransition = {
  name: 'page-shell',
  mode: 'out-in' as const,
}

const url = useRequestURL()
// const siteConfig = computed(() => {
//   return pub.siteConfig
// })
import icon from '~/public/ico.png?v=1'
const siteName = 'QSoe Pro'
const description = `
QSoe Pro証券は機関投資家向けのサービスに特化しています。 QSoe Proは、投資学習、市場調査、戦略交流に特化した総合型プラットフォームです。異なる段階の投資家に対して、明確で理解しやすく、検証可能な投資参考情報を提供することを目指しております。プラットフォームは、理性的な投資とリスク管理を核心理念とし、体系的な市場分析、
戦略の分解、実戦の振り返りを通じて、利用者が自分自身の投資判断体系を徐々に構築できるようサポートいたします
`

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: icon },
    { rel: 'apple-touch-icon', href: icon },
    { rel: 'canonical', href: url.href }
  ],
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover',
    },
    { name: 'application-name', content: siteName },
    { name: 'theme-color', content: '#06111f' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
  ]
})

useSeoMeta({
  title: siteName,
  ogTitle: siteName,
  description: description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: url.href,
  ogSiteName: siteName,
  ogImage: icon,
  twitterCard: 'summary_large_image',
  twitterImage: icon,
  twitterTitle: siteName,
  twitterDescription: description,
  robots: 'index,follow'
})
const { setLocale, locale } = useI18n()

const user = useUserStore();

const notifyTimer = ref<ReturnType<typeof setInterval> | null>(null)
const handleWindowFailure = () => {
  pub.showLoading = false
}
const handleIpoNotice = (data: any) => {
  if (data?.id) {
    pub.showIPONoticePop = true
    pub.ipoNoticeData = data
  }
}
const handleStockStatus = (data: any) => {
  pub.stockStatus = data?.status
}
const stopNotifyTimer = () => {
  if (notifyTimer.value) {
    clearInterval(notifyTimer.value)
    notifyTimer.value = null
  }
}
const emitStockSignals = (params: { token: string }) => {
  socket.emit('ipoNotice', params)
  socket.emit('stock_status')
}
const startNotifyTimer = (token: string) => {
  if (document.hidden) return
  stopNotifyTimer()
  const params = { token }
  emitStockSignals(params)
  notifyTimer.value = setInterval(() => {
    emitStockSignals(params)
  }, 5000)
}
const handleVisibilityChange = () => {
  if (!import.meta.client) return
  const token = localStorage.getItem('token')
  if (!token) {
    stopNotifyTimer()
    return
  }
  if (document.hidden) {
    stopNotifyTimer()
    return
  }
  startNotifyTimer(token)
}

onBeforeMount(() => {
  if (user.isLogined()) {
    user.flush();
  }
  stopNotifyTimer()
  if (pub.showIPONoticePop) {
    pub.showIPONoticePop = false
  }
  if (pub.show209PopFlag) {
    pub.show209PopFlag = false
  }
  pub.initPlantformData()
})

onMounted(() => {
  const savedLang =
    storage.get?.('lang', '') ||
    ''

  if (savedLang) {
    setLocale(savedLang)
    pub.setLang = true
  } else if (!pub.setLang && !locale.value) {
    setLocale('ja')
  }

  if (import.meta.client) {
    window.addEventListener('error', handleWindowFailure)
    window.addEventListener('unhandledrejection', handleWindowFailure)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const token = localStorage.getItem('token')
    if (token) {
      socket.connect()
      socket.off('ipoNotice', handleIpoNotice)
      socket.off('stock_status', handleStockStatus)
      socket.on('ipoNotice', handleIpoNotice)
      socket.on('stock_status', handleStockStatus)
      startNotifyTimer(token)
    }
  }
})

onUnmounted(() => {
  stopNotifyTimer()
  if (import.meta.client) {
    window.removeEventListener('error', handleWindowFailure)
    window.removeEventListener('unhandledrejection', handleWindowFailure)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
  socket.off('ipoNotice', handleIpoNotice)
  socket.off('stock_status', handleStockStatus)
})

</script>


<style>
.van-toast {
  background: rgba(19, 26, 34, 0.92) !important;
  color: #f3f7fb !important;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
}
html{
  min-height: 100vh;
  background: #06111f;
}
body,
#__nuxt {
  min-height: 100vh;
}
</style>
