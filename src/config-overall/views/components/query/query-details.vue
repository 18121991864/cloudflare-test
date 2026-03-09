<template>
    <a-spin :spinning="spinning">
        <a-tabs v-model:activeKey="activeKey" centered v-if="tabs.length">
            <a-tab-pane :tab="item.name" v-for="(item, index) in tabs" :key="index">
                <query-details-from-item
                    :formState="formState"
                    :fieldNames="item.fieldNames"
                    :lable-slots="(configInfoBnts.lableSlots as string[])"
                    :customSlots="configInfoBnts.customSlots"
                >
                    <template #lable="{ data, dataIndex }">
                        <slot name="lable" :dataIndex="dataIndex" :data="{ ...data }"></slot>
                    </template>
                    <template #customSlots="{ data, dataIndex }">
                        <slot name="customSlots" :data="{ ...data }" :dataIndex="dataIndex"></slot>
                    </template>
                </query-details-from-item>
            </a-tab-pane>
        </a-tabs>
        <query-details-from-item
            v-else
            :formState="formState"
            :fieldNames="fieldNames"
            :lable-slots="(configInfoBnts.lableSlots as string[])"
            :customSlots="configInfoBnts.customSlots"
        >
            <template #lable="{ data, dataIndex }">
                <slot name="lable" :dataIndex="dataIndex" :data="{ ...data }"></slot>
            </template>
            <template #customSlots="{ data, dataIndex }">
                <slot name="customSlots" :data="{ ...data }" :dataIndex="dataIndex"></slot>
            </template>
        </query-details-from-item>
    </a-spin>
</template>

<script lang="ts" setup>
import type { InfoDataConstType, InfoDataeConstructionItem, TabsDataConstType } from '@/config-overall/interface/info';

const formState = ref({});
const activeKey = ref(0);
const fieldNames = ref<InfoDataeConstructionItem[]>([]);
const tabs = ref<TabsDataConstType[]>([]);
const spinning = ref(false);
const configInfoBnts = ref<InfoDataConstType>({
    show: true,
    titleName: '详情',
    fieldNames: [],
    handelInfoData: () => {
        return new Promise((resolve) => {
            // @ts-ignore
            resolve({});
        });
    },
    tabs: [],
    formState: {},
    customSlots: [],
});
const dataInfo = ref({});
const initConfigInfo = (config: InfoDataConstType, data: any) => {
    configInfoBnts.value = config;
    if ('fieldNames' in configInfoBnts.value) {
        fieldNames.value = configInfoBnts.value.fieldNames as InfoDataeConstructionItem[];
    } else if ('tabs' in configInfoBnts.value) {
        tabs.value = configInfoBnts.value.tabs as TabsDataConstType[];
    }
    dataInfo.value = data;
    getHandelInfoData();
};

const getDataInfo = () => {
    Object.keys(dataInfo.value).forEach((key) => {
        // @ts-ignore
        formState.value[key] = props.dataInfo[key];
    });
};
const getHandelInfoData = () => {
    const handelInfoData = configInfoBnts.value.handelInfoData;
    if (!handelInfoData || typeof handelInfoData !== 'function') {
        return getDataInfo();
    }
    let data = configInfoBnts.value.formState;
    if (!data) {
        data = {};
    }
    Object.keys(data).forEach((key) => {
        // @ts-ignore
        data[key] = dataInfo.value[key];
    });
    spinning.value = true;
    formState.value = {};
    handelInfoData(data)
        .then((res) => {
            formState.value = res;
        })
        .finally(() => {
            spinning.value = false;
        });
};
const setActiveKey = () => {
    activeKey.value = 0;
};
defineExpose({
    initConfigInfo,
    setActiveKey,
});
</script>

<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
    margin-bottom: 20px !important;
    &::before {
        border-bottom: 0 !important;
    }
}
</style>
