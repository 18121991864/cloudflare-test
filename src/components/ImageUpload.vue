<template>
    <a-upload
        v-model:file-list="_fileList"
        list-type="picture-card"
        :accept="accept"
        :action="action"
        :before-upload="beforeUpload"
        :data="(data:Record<string, any>) => ({ ...data, fileType })"
        :headers="{ Token: cookies.get('walletToken') }"
        :max-count="maxCount"
        @change="handleChange"
        @preview="handlePreview"
    >
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { FileItem } from '@/interface/TableType';
import { message } from 'ant-design-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import cookies from 'cookies-js';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    fileList: {
        type: Array as PropType<UploadProps['fileList']>,
        default: () => [],
    },
    fileType: {
        type: [String, Number] as PropType<number | string>,
        default: '4',
    },
    limit: {
        type: Number as PropType<number>,
        default: 4,
    },
    maxCount: {
        type: Number as PropType<number>,
        default: 1,
    },
    accept: {
        type: String as PropType<string>,
        default: 'image/png, image/jpeg, image/jpg',
    },
    action: {
        type: String as PropType<string>,
        default: '/api/v1/file/upload',
    },
    previewTitle: {
        type: Boolean as PropType<boolean>,
        default: true,
    },
});

const emit = defineEmits(['update:fileList']);

const _fileList = ref<UploadProps['fileList']>([]);

watchEffect(() => {
    _fileList.value = props.fileList || [];
});

function handleSetFileList(fileList?: UploadProps['fileList']) {
    const list = fileList || props.fileList || [];
    _fileList.value = list;
    emit('update:fileList', list);
}

const loading = ref(false);

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const beforeUpload = (file: FileItem) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
        message.error('请上传jpg或png格式文件');
    }
    const isLt2M = file.size / 1024 / 1024 < props.limit;

    if (!isLt2M) {
        message.error(`支持JPG/PNG格式，大小不超过${props.limit}M。`);
    }

    return isJpgOrPng && isLt2M;
};

const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};

function getBase64(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

// @ts-ignore
const handlePreview = async (file: UploadProps['fileList'][number]) => {
    if (!file.url && !file.preview) {
        file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    if (props.previewTitle) {
        previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
    }
};

function handleChange(info: UploadChangeParam) {
    if (!Reflect.has(info.file, 'status')) {
        handleSetFileList();
        return;
    } else if (info.file.status === 'uploading') {
        loading.value = true;
        return;
    } else if (info.file.status === 'done') {
        if (info.file.response && !info.file.response.success) {
            message.error(info.file.response.msg || 'upload error');
        }
        handleSetFileList(info.fileList.filter((file) => file.status === 'done' && file.response && file.response.success));
        loading.value = false;
    } else if (info.file.status === 'error') {
        loading.value = false;
        message.error(info.file?.response.success ?? 'upload error');
        handleSetFileList(info.fileList.filter((file) => file.status === 'error'));
    } else if (info.file.status === 'removed') {
        handleSetFileList(info.fileList);
    }
}
</script>

<style scoped></style>
