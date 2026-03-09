<template>
    <div class="table-container">
        <a-tabs v-if="fetchShowTabs.length" v-model:activeKey="activeKey">
            <a-tab-pane v-for="item of fetchShowTabs" :key="item.code" :tab="item.name" />
        </a-tabs>
        <component :is="activeKey" v-if="fetchShowTabs.length" />
        <Error v-else />
    </div>
</template>

<script lang="ts">
import AgentAddressManage from './conponents/AgentAddressManage.vue';
import Address from './conponents/Address.vue';
import useTabsRole from "@/use/useTabsRole";

export default defineComponent({
    components: { Address, AgentAddressManage },
    setup() {
        const tabs = [
            { name: '地址管理', code: 'Address', role: 'address-manage' }, // 授权表
            { name: '代理商地址管理', code: 'AgentAddressManage', role: 'agent-address-manage' }, // 结算表
        ];
        const { activeKey, fetchShowTabs } = useTabsRole(tabs, 'Account');
        return {
            activeKey,
            fetchShowTabs
        };
    }
})
</script>

<style scoped lang="scss">

</style>
