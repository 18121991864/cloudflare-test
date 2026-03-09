<template>
    <a-upload
        v-model:file-list="fileList"
        name="file"
        :custom-request="customRequest"
        :progress="progress"
        :max-count="1"
        accept=".apk,.obb,.aab"
        :disabled="disabled"
        @change="handleChange"
        @remove="handleRemove"
        v-bind="$attrs"
    >
        <a-button type="primary" :disabled="disabled">
            <upload-outlined></upload-outlined>
            上传
        </a-button>
    </a-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import type { CustomRequestType, FileList } from '@/utils/upload.d';
import api from '@/api/fetchTest/index';
const props = defineProps({
    fileType: {
        type: Number,
        default: 5,
    },
    fullUrl: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
const fileList = ref<FileList[]>([]);

const handleChange = (info: UploadChangeParam) => {
    if (info.file.status == 'removed') {
        const index = fileList.value.findIndex((item) => item.uid == info.file.uid);
        fileList.value.splice(index, 0);
    }
};
const progress: UploadProps['progress'] = {
    strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
    },
    strokeWidth: 3,
    format: (percent: any) => {
        console.log('percent', percent);

        return `${parseFloat(percent.toFixed(2))}%`;
    },
    class: 'test',
};
const cancelToken = ref();
const emit = defineEmits(['update:fullUrl']);
const customRequest = (file: CustomRequestType) => {
    const { promise, cancel } = api.userUploadFile({ file: file.file, fileType: props.fileType }, (event: { loaded: number; total: number }) => {
        // 上传进度回调
        const percent = Math.round((event.loaded * 100) / event.total);
        file.onProgress({ percent });
    });
    cancelToken.value = cancel;
    promise
        .then((res) => {
            // 上传成功回调
            fileList.value[0].status = 'done';
            emit('update:fullUrl', res.fullUrl);
            message.success('文件上传成功');
        })
        .catch((error) => {
            // 上传失败回调
            fileList.value[0].status = 'error';
            emit('update:fullUrl', '');
            // message.error('文件上传失败');
        });
};
const handleRemove = () => {
    if (cancelToken.value) {
        cancelToken.value();
    }
};
defineExpose({
    cancelToken: cancelToken.value,
    fileList,
});
</script>
<style lang="scss" scoped>
:deep(.ant-upload-list-item) {
    &:hover {
        .ant-btn-sm:not(.original) {
            background: #f5f5f5 !important;
            height: fit-content;
        }
    }
    .ant-btn-sm:not(.original) {
        background: #fff !important;
        height: fit-content;
    }
}
:deep(.ant-upload-list-text-container) {
    margin-bottom: 10px;
}
.ant-upload-wrapper {
    :deep(.ant-motion-collapse) {
        height: 45px !important;
        .ant-upload-list-item-progress {
            bottom: -15px !important;
            left: -13px;
        }
    }
}
</style>
