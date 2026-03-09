<template>
    <a-upload
        name="file"
        :file-list="props.fileList"
        :multiple="false"
        class="user-dowload"
        :before-upload="beforeUpload"
        accept=".xlsx,.xls"
        v-bind="$attrs"
    >
        <a-button>上传Excel文件</a-button>
        <template #itemRender="{ file }">
            <div class="flex justify-between items-center w-full">
                <span :style="file.status === 'error' ? 'color: red' : ''">{{ file.name }}</span>
                <a-button type="link" @click="handleRemove(file)" class="text-red-500">删除</a-button>
            </div>
        </template>
    </a-upload>
</template>
<script lang="ts" setup>
import { message, type UploadFile as UploadFileType } from 'ant-design-vue';
import { defineProps } from 'vue';

const props = defineProps<{
    uploadStatus: {
        color: string;
        text: string;
    };
    fileList: UploadFileType[];
    file: UploadFileType | null;
}>();
// const fileList = ref<UploadFileType[]>([]);
const emit = defineEmits<{
    (
        e: 'update:uploadStatus',
        value: {
            color: string;
            text: string;
        }
    ): void;
    (e: 'update:fileList', value: UploadFileType[]): void;
    (e: 'update:file', value: UploadFileType | null): void;
}>();
const beforeUpload = (file: UploadFileType) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
    emit('update:fileList', [file]);
    if (!isExcel) {
        message.error('只能上传Excel文件!');
        emit('update:uploadStatus', {
            color: 'error',
            text: '上传失败',
        });
        return false;
    }
    emit('update:uploadStatus', {
        color: 'success',
        text: '上传成功',
    });
};
const handleRemove = (file: UploadFileType) => {
    emit(
        'update:fileList',
        props.fileList.filter((item) => item.uid !== file.uid)
    );
    emit('update:file', null);
};
</script>
<style lang="scss" scoped></style>
