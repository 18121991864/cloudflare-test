<template>
    <a-modal v-model:open="open" :footer="null" :width="1000" @ok="handleOk">
        <template #title>
            <div>{{ title }}</div>
        </template>
        <table-config
            :data-source="tableData"
            :tabel-config="configTable"
            :pagination-config="paginationConfig"
            :is-loading="isLoading"
            :handle-size-change="handleSizeChange"
        >
            <template #operate="{ data: { column, text, record } }">
                <slot name="operate" :data="{ column, text, record }"></slot>
            </template>
            <template #customDataIndex="{ data: { column, text, record } }">
                <slot name="customDataIndex" :data="{ column, text, record }"> </slot>
            </template>
        </table-config>
    </a-modal>
</template>

<script lang="ts" setup>
import useTableConf from '@/use/useTableConf';

import { tabelConfigType } from '@/config-overall/interface/table';
import nProgress from 'nprogress';
import { ButtonTypes } from '@/config-overall/interface/button';
interface ConfingType {
    ConfigData: tabelConfigType;
    queryConfigBtns: ButtonTypes<any, any>;
}
const open = ref(false);
const handleOk = () => {};
const queryConfig = ref<ButtonTypes<any, any>>(Object.create({}));
const configTable = ref<tabelConfigType>(Object.create({}));
const tableData = ref(Object.create([]));
const formState = ref({});
const handelSubmit = () => {
    tableData.value = [];
    isLoading.value = true;
    nProgress.start();

    const { current, pageSize } = paginationConfig;
    const { handelSubmit } = queryConfig.value.queryBtns;
    handelSubmit({
        ...formState.value,
        pageNo: current,
        pageSize,
    })
        .then(({ list, totalSize, pageSize, pageNo }) => {
            updatePagination(pageNo, pageSize, totalSize);
            tableData.value = list.map((item) => ({ ...item, isLoading: false }));
        })
        .finally(() => {
            isLoading.value = false;
            nProgress.done();
        });
};

const { isLoading, onSearch, paginationConfig, formReset, handleSizeChange, updatePagination, handelRest } = useTableConf(handelSubmit);
const setOpenCallback = async (params: any, { ConfigData, queryConfigBtns }: ConfingType) => {
    open.value = true;
    Object.keys(params).forEach((key) => {
        // @ts-ignore
        formState.value[key] = params[key];
    });
    console.log(ConfigData, queryConfigBtns);

    configTable.value = ConfigData;
    queryConfig.value = queryConfigBtns;

    await handelSubmit();
};
const route = useRoute();
const title = computed(() => {
    return queryConfig.value.queryBtns.title || route.meta.title;
});
defineExpose({
    setOpenCallback,
});
</script>

<style lang="scss" scoped></style>
