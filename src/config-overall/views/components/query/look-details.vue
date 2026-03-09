<template>
    <a-modal v-model:open="open" :title="title" :maskClosable="false" @ok="handleOk">
        <a-spin :spinning="spinning">
            <a-form :model="formState">
                <template v-for="(item, index) in labelList" :key="index">
                    <a-form-item :label="item.label">
                        <span v-if="formState[item.value]">{{ formState[item.value] }}</span>
                        <span v-else-if="formState[item.value] === 0">0</span>
                        <span v-else>--</span>
                    </a-form-item>
                </template>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script lang="ts" setup>
import type { CallbackInfo, detailLabel, queryDetailConfig } from '@/config-overall/interface/detail';
import { message } from 'ant-design-vue';

const open = ref(false);
const title = ref('详情');
const emits = defineEmits<{
    handleOk: [formState: any];
}>();
const spinning = ref(false);
const formState = ref<any>({});
const handleOk = async () => {
    const callback = Headerconfig.value?.callback;
    const config = callback?.CallbackConfig;
    const handelCallback = config?.handelCallback;
    if (handelCallback) {
        await handelCallback(config.params);
        message.success(config.success || '操作成功');
        open.value = false;
    } else {
        open.value = false;
    }

    emits('handleOk', formState.value);
};
const labelList = ref<detailLabel[]>([]);
const Headerconfig = ref<queryDetailConfig>();
const setParams = (configHeader: queryDetailConfig, params1: any) => {
    const config = configHeader?.callback?.CallbackConfig;
    if (config?.params) {
        config.params = params1;
    }

    Headerconfig.value = configHeader;
};
const openCallback = (configHeader: queryDetailConfig, params?: any, params1?: any) => {
    open.value = true;
    const detailData = configHeader.detailConfig.detailData;
    labelList.value = configHeader.detailConfig.detailLabel;
    setParams(configHeader, params1);

    if (detailData) {
        SetformState(detailData);
    } else {
        getCallbackInfo(configHeader.callback, params);
    }
};
const getCallbackInfo = async (callback?: CallbackInfo, params?: any) => {
    const handelDetailInfo = callback?.handelDetailInfo;
    if (!handelDetailInfo || (handelDetailInfo && typeof handelDetailInfo !== 'function')) {
        throw new Error('请传入详情的函数');
    }
    spinning.value = true;
    handelDetailInfo(params)
        .then((res) => {
            SetformState(res);
        })
        .finally(() => {
            spinning.value = false;
        });
};
const SetformState = (detailData: any) => {
    Object.keys(detailData).forEach((key) => {
        // @ts-ignore
        formState.value[key] = detailData[key];
    });
};
const setTitle = (t: string) => {
    title.value = t;
};
defineExpose({
    openCallback,
    setTitle,
});
</script>

<style lang="less" scoped></style>
