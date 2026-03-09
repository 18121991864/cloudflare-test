<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { ref, reactive, computed } from 'vue';
import { message } from 'ant-design-vue';
import cookies from 'cookies-js';
import api from '@/api/poboAPI/poboRemitterAccount';
import { FileItem } from '@/interface/StateType';

const emits = defineEmits(['updateTable']);

const formRef = ref();
const curId = ref(0);
const isLoading = ref(false);
const visible = ref(false);
const formState = reactive<{
    fileList: string[];
}>({
    fileList: [],
});

const handleOk = (): void => {
    formRef.value.validate().then(() => {
        isLoading.value = true;
        api.updateApplyFormUrl({ id: curId.value, applyFormUrl: getUrl.value })
            .then(() => {
                message.success('操作成功');
                visible.value = false;
                emits('updateTable');
                formRef.value.resetFields();
            })
            .finally(() => {
                isLoading.value = false;
            });
    });
};

const onCancel = (): void => {
    isLoading.value = false;
};

const onShowDialog = (val = false, id: number): void => {
    formState.fileList = [];
    visible.value = val;
    curId.value = id;
};

const beforeUpload = (file: FileItem) => {
    const isPDF = file.type === 'application/pdf'; // 检查文件类型是否为 PDF
    if (!isPDF) message.error('请上传pdf文件!');
    return isPDF;
};

const getUrl = computed(() => formState.fileList[0].response.data.uri);

defineExpose({ onShowDialog });
</script>

<template>
    <a-modal v-model:open="visible" title="上传文件" :confirm-loading="isLoading" @ok="handleOk" @cancel="onCancel">
        <a-form ref="formRef" :model="formState" name="basic" :label-col="{ span: 4 }" autocomplete="off">
            <a-form-item label="上传文件" name="fileList" :rules="[{ required: true, message: '请上传pdf文件' }]">
                <a-upload
                    v-model:file-list="formState.fileList"
                    accept="application/pdf"
                    action="/api/v1/file/upload"
                    :max-count="1"
                    :before-upload="beforeUpload"
                    :data="(file) => ({ ...file, fileType: '8' })"
                    :headers="{ Token: cookies.get('walletToken') }"
                >
                    <a-button v-if="formState.fileList?.length < 2">
                        <template #icon>
                            <plus-outlined />
                        </template>
                        上传文件
                    </a-button>
                </a-upload>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped lang="scss"></style>
