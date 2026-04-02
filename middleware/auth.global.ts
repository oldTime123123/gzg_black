import { cancelAllPendingRequests } from "../api/request";

export default defineNuxtRouteMiddleware((to, from) => {
  // if (window && !to.path.startsWith("/auth/")) {
  //   const user = useUserStore(); // 你用 pinia
  //   //   console.log('全局路由守卫：auth.nuxt.ts');
  //   // // 需要登录才能访问的页面
  //   if (!user.isLogined()) {
  //     return navigateTo("/auth/login?redirect=" + to.path);
  //   }
  // }
  const pub = usePublicStore();

  if (import.meta.client) {
    cancelAllPendingRequests();
  }
  pub.showLoading = true;
  if (import.meta.client) {
    if (to.path !== "/") {
      pub.isLoginFlag = false;
    } else {
      if (!localStorage.getItem("token")) {
        pub.isLoginFlag = true;
      }
    }
    const isRefresh = localStorage.getItem("NEED_REFRESH") === "1";
    if (isRefresh) {
      localStorage.setItem("NEED_REFRESH", "0");
      window.location.reload();
      return;
    }
  pub.showLoading = true;
    setTimeout(() => {
      pub.showLoading = false;
    }, 5000);
  }  {
    pub.showLoading = false;
  }
});
