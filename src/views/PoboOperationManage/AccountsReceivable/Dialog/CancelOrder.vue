<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { ref, reactive, computed } from 'vue';
import type { UploadProps } from 'ant-design-vue';
import cookies from 'cookies-js';
import { message } from 'ant-design-vue';
import useUpload from '@/use/useUpload';
import api from '@/api/poboAPI/poboPayeeAccount';

const emits = defineEmits(['updateTable']);

const formRef = ref();
const curId = ref(0);
const visible = ref(false);
const isLoading = ref(false);
const isType = ref<'DISABLE' | 'ENABLE'>('ENABLE');
const formState = reactive<{
    remark: string;
    fileList: string[];
}>({
    remark: '',
    fileList: [],
});
const previewImage = ref('');
const previewTitle = ref('');
const previewVisible = ref(false);

const { beforeUpload } = useUpload();

const handleOk = (): void => {
    formRef.value.validate().then(() => {
        isLoading.value = true;
        api[isType.value === 'DISABLE' ? 'disable' : 'atob']({
            id: curId.value,
            url: getUrl.value,
            remark: formState.remark,
        })
            .then(() => {
                message.success('操作成功!');
                visible.value = false;
                emits('updateTable');
            })
            .finally(() => {
                isLoading.value = false;
            });
    });
};

const getBase64 = (file: File) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};

const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};

const onShowDialog = (val = false, data: { type: 'ENABLE' | 'DISABLE'; id: number }): void => {
    visible.value = val;
    curId.value = data.id;
    isType.value = data.type;
};

const getUrl = computed(() => formState.fileList[0].response.data.uri);

defineExpose({ onShowDialog });
</script>

<template>
    <a-modal v-model:open="visible" :title="isType === 'DISABLE' ? '禁用' : '启用'" :confirm-loading="isLoading" @ok="handleOk">
        <a-form ref="formRef" :model="formState" name="basic" :label-col="{ span: 4 }" autocomplete="off">
            <a-form-item label="备注" name="remark" :rules="[{ required: true, message: '请输入' }]">
                <a-textarea v-model:value="formState.remark" />
            </a-form-item>
            <a-form-item label="上传材料" name="username" :rules="[{ required: true, message: '请上传文件' }]">
                <a-upload
                    v-model:file-list="formState.fileList"
                    accept="image/png, image/jpeg, image/jpg"
                    action="/api/v1/file/upload"
                    list-type="picture-card"
                    :max-count="1"
                    :before-upload="beforeUpload"
                    :data="(file) => ({ ...file, fileType: '1' })"
                    :headers="{ Token: cookies.get('walletToken') }"
                    @preview="handlePreview"
                >
                    <div v-if="formState.fileList?.length < 2">
                        <plus-outlined />
                        <div style="margin-top: 8px">上传</div>
                    </div>
                    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
                        <img alt="example" style="width: 100%" :src="previewImage" />
                    </a-modal>
                </a-upload>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped lang="scss"></style>
