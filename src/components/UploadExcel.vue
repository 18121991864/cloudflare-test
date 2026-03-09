<template>
    <div class="display-flex">
        <a-upload-dragger
            name="file"
            :show-upload-list="false"
            :custom-request="uploadImage"
            :before-upload="beforeUpload"
            :accept="accept"
            :disabled="disabled"
        >
            <slot></slot>
            <div v-if="loading" class="loading display-flex flex-justify-content-center flex-align-items-center">
                <loading-outlined style="color: white"></loading-outlined>
                <!--<div class="ml-5 ant-upload-text">上传中...</div>-->
            </div>
        </a-upload-dragger>
        <a-popconfirm ok-type="danger" :title="`${$t('确认删除')}？`" @confirm="clearImage">
            <template #icon><question-circle-outlined :style="{ color: 'red' }" /></template>
            <a-button v-if="fileName" class="mr-5 red" size="small" :disabled="loading" danger>{{ $t('删除') }}</a-button>
        </a-popconfirm>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { message } from 'ant-design-vue';
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import ExcelJS from 'exceljs';
interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    url?: string;
    type?: string;
    size: number;
    originFileObj: any;
}

export default defineComponent({
    name: 'UploadExcel',
    components: {
        LoadingOutlined,
        QuestionCircleOutlined,
    },
    props: {
        disabled: { type: Boolean, default: false },
        fileType: { type: Number, default: 3 },
        accept: { type: String, default: '.xlsx,.xls' },
        suffixUrl: { type: String, default: '' },
        file: { type: String, default: '' },
        fileName: { type: String, default: '' },
        totalRef: { type: Number, default: 0 },
    },
    setup(props, context) {
        const beforeUpload = (file: FileItem) => {
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (!isLt2M) {
                message.error(`${props.accept === '.xlsx' ? '' : ''}${'文件不得大于5MB'}!`);
            }
            return isLt2M;
        };

        const loading = ref<boolean>(false);

        const uploadImage = async (file: any) => {
            loading.value = true;

            context.emit('update:file', file.file); // 传递文件
            context.emit('update:fileName', file.file.name); // 传递文件名称

            // 读取文件并解析
            let dataBinary = await readFile(file.file);
            let workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(dataBinary);

            // 获取第一个工作表
            let worksheet = workbook.worksheets[0];

            // 将工作表转换为 JSON
            let jsonData: any[] = [];
            worksheet.eachRow((row, rowNumber) => {
                jsonData.push(row.values.slice(1)); // 去除第一列为空的数据（ExcelJS row.values 以 1 开始）
            });

            // 计算数据总条数（去除标题行）
            context.emit('update:totalRef', jsonData.length - 1);

            loading.value = false;
        };

        const readFile = (file: any) => {
            return new Promise((resolve) => {
                let reader = new FileReader();
                reader.readAsBinaryString(file);
                reader.onload = (ev) => {
                    resolve(ev.target?.result);
                };
            });
        };

        const clearImage = () => {
            context.emit('update:file', '');
            context.emit('update:fileName', '');
            context.emit('update:totalRef', 0);
            context.emit('update:del', 0);
        };
        return {
            beforeUpload,
            loading,
            uploadImage,

            clearImage,
        };
    },
});
</script>

<style lang="scss" scoped>
.loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgb(0 0 0 / 70%);
}

.ant-upload-text {
    color: white;
    font-size: 12px;
}

::v-deep(.ant-upload) {
    border: none !important;
}

::v-deep(.ant-upload-btn) {
    padding: 0 !important;
}
</style>
