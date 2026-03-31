// plugins/apexcharts.client.ts
import { defineAsyncComponent } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
  // 按需异步加载图表组件，避免所有页面都提前打入 ApexCharts
  nuxtApp.vueApp.component(
    "apexchart",
    defineAsyncComponent(() => import("vue3-apexcharts"))
  );
});
