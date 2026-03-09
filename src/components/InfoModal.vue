<template>
    <a-modal v-model:open="open" :width="width" :title="titleInfo" @ok="handleOk">
        <a-form :model="formState">
            <a-form-item v-for="(item, index) in infoDataInfo" :key="index" :label="item.label">
                <a-tooltip placement="topLeft">
                    <template #title>
                        <div>{{ item.value !== 'labelList' ? data(item.value) : getLabelNames }}</div>
                    </template>
                    <template v-if="item.value === 'labelList'">
                        <div style="display: flex; flex-wrap: wrap; gap: 4px">
                            <template v-for="(item, index) of formState.labelList?.slice(0,9)" :key="item">
                                <a-tag :color="item.color">{{ item.name }}</a-tag>
                                <template v-if="index === 8 && formState.labelList.length > 9">
                                    <span>...</span>
                                </template>
                            </template>
                        </div>
                    </template>
                    <div v-else-if="item.value === 'state'" style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                        <span>{{ formState.state === 1 ? '正常' : '冻结' }}</span>
                        <CopyOutlined v-if="item.isCopy" class="ml-5 text-xl text-sky-400" @click="copyText(data(item.value), true)" />
                    </div>
                    <div v-else style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                        <span>{{ data(item.value) }}</span>
                        <CopyOutlined v-if="item.isCopy" class="ml-5 text-xl text-sky-400" @click="copyText(data(item.value), true)" />
                    </div>
                </a-tooltip>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import type { PlatformAssetListType } from '@/api/asset/types.d';
import { copyText } from '@/utils/common';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { CopyOutlined } from '@ant-design/icons-vue';
interface InfoDataType {
    label: string;
    value: string;
    isCopy?: boolean;
}
const props = defineProps({
    width: {
        type: Number,
        default: 700,
    },
});

const formState = ref<any>({});
const isShowInfoText = ref(true);
const infoDataInfo = ref<InfoDataType[]>();
const handleOk = () => {
    open.value = false;
};
const titleInfo = computed(() => {
    return isShowInfoText.value ? `${title.value}详情` : title.value;
});
const route = useRoute();
const open = ref(false);

const openModel = <T>(item: T, infoHeader: InfoDataType[], titleText?: string, showInfoText?: boolean) => {
    open.value = true;
    formState.value = item;
    title.value = titleText || (route.meta.title as string);
    isShowInfoText.value = showInfoText;
    infoDataInfo.value = infoHeader;
    console.log(infoHeader, '===');
};
const title = ref('');
const data = computed(() => {
    return (value: string) => {
        return formState.value[value as keyof PlatformAssetListType];
    };
});

const getLabelNames = computed(() => formState.value?.labelList?.map((item) => item.name)?.join(','));

defineExpose({
    openModel,
});
</script>

<style lang="scss" scoped></style>
