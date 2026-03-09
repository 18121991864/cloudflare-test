<template>
    <a-upload
        name="file"
        :file-list="props.fileList"
        :multiple="false"
        class="user-dowload"
        :before-upload="beforeUpload"
        accept=".zip"
        v-bind="$attrs"
        type="line"
    >
        <a-button>上传zip文件</a-button>
        <template #itemRender="{ file }">
            <div class="flex justify-between items-center w-full">
                <span :style="file.status === 'error' ? 'color: red' : ''">{{ file.name }}</span>
                <a-button type="link" @click="handleRemove(file)" class="text-red-500" v-if="percent >= 100">删除</a-button>
            </div>
            <a-progress
                :stroke-color="{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                }"
                :percent="percent"
            />
        </template>
    </a-upload>
</template>
<script lang="ts" setup>
import { message, type UploadFile as UploadFileType } from 'ant-design-vue';
import { defineProps } from 'vue';
import type { UploadProps } from 'ant-design-vue';
const props = defineProps<{
    uploadStatus: {
        color: string;
        text: string;
    };
    fileList: UploadFileType[];
    folderName: string;
    percent: number;
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
    (e: 'update:folderName', value: string): void;
    (e: 'update:percent', value: number): void;
}>();
const beforeUpload = (file: UploadFileType) => {
    // const isZip = file.type === 'application/x-zip-compressed' || file.type === 'application/zip';
    const isZipMIME = ['application/zip', 'application/x-zip', 'application/x-zip-compressed', 'multipart/x-zip'].includes(file.type as string);
    const isZipExtension = /\.zip$/i.test(file.name);
    const isZip = isZipMIME || isZipExtension;
    if (!isZip) {
        message.error('只能上传zip文件!');
        emit('update:uploadStatus', {
            color: 'error',
            text: '上传失败',
        });
        return false;
    }
    emit('update:fileList', [file]);
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
    emit('update:folderName', '');
    emit('update:percent', 0);
};
</script>
<style lang="scss" scoped></style>
