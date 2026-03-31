<script lang="ts" setup>
import { getSettingService } from '~/api/pay/realse';


const serviceList = ref([])
const getData = () => {
    getSettingService({
        type:2
    }).then(res => {
        serviceList.value = res.list
    })
}
const jumpPage = item => {
    if (window) {
        window.open(item.contact_link)
    }
}
onBeforeMount(() => {
    getData()
})
</script>

<template>
    <div class="pageShell">
        <second-page-nav-bar :title="$t('pay.p4')"></second-page-nav-bar>

        <div class="pageWrap px-3 pb-6">
            <div class="heroCard mt-4">
                <div class="heroEyebrow">{{ $t('theme.rechargeService') }}</div>
                <div class="heroDesc">{{ $t('theme.depositChannelCopy') }}</div>
            </div>

            <div class="serviceList mt-4">
                <div class="serviceCard"
                    v-for="item in serviceList" :key="item" @click="jumpPage(item)">
                    <div class="serviceLeft">
                        <div class="serviceAvatar">
                            <img :src="item.avatar" class="w-10 h-10 rounded-[14px] object-cover">
                        </div>
                        <div class="serviceCopy">
                            <div class="serviceName">{{ item.service_name }}</div>
                            <div class="serviceTime">
                               {{ item.start_working_time + '-' + item.end_working_time }}
                            </div>
                        </div>
                    </div>
                    <Icon class="serviceArrow" name="solar:arrow-right-linear" size="18" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pageWrap{min-height:calc(100vh - 60px)}
.heroEyebrow{color:var(--brand-primary);font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.heroDesc{margin-top:8px;color:var(--text-secondary);font-size:13px;line-height:1.55}
.serviceList{display:grid;gap:14px}
.serviceCard{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 18px;border-radius:20px;background:rgba(255,255,255,.025);border:1px solid var(--border-soft);box-shadow:none;cursor:pointer}
.serviceLeft{display:flex;align-items:center;gap:12px;min-width:0}
.serviceAvatar{width:44px;height:44px;border-radius:16px;overflow:hidden;background:rgba(255,255,255,.04);border:1px solid var(--border-soft)}
.serviceCopy{min-width:0}
.serviceName{color:var(--text-primary);font-size:15px;font-weight:700;line-height:1.35}
.serviceTime{margin-top:6px;color:var(--text-secondary);font-size:12px;line-height:1.45}
.serviceArrow{color:var(--text-secondary)}
</style>
