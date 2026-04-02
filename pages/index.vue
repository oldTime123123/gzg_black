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
  loginStore.loading = true

});

onMounted(() => {
  if (import.meta.client && storage.getItem('token')) {

    router.push('/tabbar/home');
    setTimeout(() => {
      loginStore.loading = false

    }, 2000);


  } else {
    loginStore.showLoadingText = "";
    setTimeout(() => {
      router.push('/auth/beforeLogin');
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
