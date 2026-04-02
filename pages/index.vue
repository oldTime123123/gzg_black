<script lang="ts" setup>
import { storage } from '~/stores/storage';

const pub = usePublicStore();
const router = useRouter();
const loginStore = useLoginStore();

onBeforeMount(() => {
  const search = import.meta.client ? globalThis.location?.search || '' : '';
  if (search.includes("?t=")) {
    const token = search.split("?t=")[1];
    storage.setItem("token", token);
    globalThis.location?.replace("/tabbar/home");
    return;
  }
  pub.showLoading = false;
});

onMounted(() => {
  if (import.meta.client && storage.getItem('token')) {
  loginStore.loading = true

    setTimeout(() => {
      loginStore.loading = false
    }, 2000);
    router.push('/tabbar/home');
  } else {

    loginStore.showLoadingText = "";
  loginStore.loading = true
    router.push('/auth/beforeLogin');

    setTimeout(() => {
      loginStore.loading = false

    }, 2000);
  }
});


</script>

<template>
  <div class="bootPage">

  </div>
</template>

<style scoped>

</style>
