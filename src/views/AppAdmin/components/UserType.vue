<template>
    <div>
        <a-radio-group v-model:value="_value.range" :disabled="isExamine || isEdit">
            <a-radio :value="1">迁移用户</a-radio>
            <a-radio :value="0">全局用户(不包含已迁移的用户)</a-radio>
        </a-radio-group>

        <template v-if="_value.range === 1">
            <a-radio-group class="mt-1" v-model:value="_value.migratedUserType" :disabled="isExamine">
                <a-radio :value="0">所有迁移用户</a-radio>
                <a-radio :value="1">指定UID用户</a-radio>
            </a-radio-group>
            <template v-if="isExamine">
                <template v-if="!!_value.importBatchNo">
                    <a-button type="link" class="p-0" :loading="exportLoading" @click="handleExportUids">{{ _value.importBatchNo }}.xlsx</a-button>
                </template>
                <template v-if="!!_value.uids">
                    <a-textarea class="mt-2" disabled :value="_value.uids"></a-textarea>
                </template>
            </template>
            <template v-if="!isExamine && _value.migratedUserType === 1">
                <div></div>
                <div class="flex gap-x-2 mt-1">
                    <div class="flex-1">
                        <a-input
                            :value="getUids"
                            :disabled="isExamine"
                            :readonly="!!_value.importBatchNo"
                            @change="handleUidChange"
                            placeholder="请输入或导入UID"
                            @blur="handleBlur"
                        />
                    </div>
                    <a-button v-if="isEdit && !!_value.importBatchNo" :loading="exportLoading" @click="handleExportUids">
                        <DownloadOutlined />
                    </a-button>
                    <a-upload
                        name="file"
                        :show-upload-list="false"
                        accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        action="/api/v1/app/version/importUid"
                        :headers="{ Token: cookies.get('walletToken') }"
                        @change="handleUploadChange"
                    >
                        <a-button :loading="uploadLoading" type="primary">导入</a-button>
                    </a-upload>
                    <a-popconfirm title="是否删除已导入文件？" ok-text="是" cancel-text="否" @confirm="handleDeleteImport">
                        <a-button v-if="_value.importBatchNo" type="primary" danger>删除</a-button>
                    </a-popconfirm>
                </div>

                <div class="text-right text-xs mt-1 text-[#165DFF]">
                    <a href="https://wallet-pub.s3.ap-northeast-1.amazonaws.com/avatar/2025/05/13/1922200009006931970.xlsx" download="UID导入模板.xlxs">
                        UID导入模板.xlxs
                    </a>
                </div>
            </template>
        </template>
    </div>
</template>

<script setup lang="ts">
import cookies from 'cookies-js';
import type { UploadChangeParam } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { cloneDeep, isNil, merge } from 'lodash-es';
import { useInjectFormItemContext } from 'ant-design-vue/es/form';
import api from '@/api/appAdmin/index';
import { useRequest } from 'vue-request';
import { downloadExcel } from '@/utils/common';
import { DownloadOutlined } from '@ant-design/icons-vue';

const props = defineProps({
    isExamine: {
        type: Boolean,
    },
    isEdit: {
        type: Boolean,
    },
    value: {
        type: Object,
    },
});

const formItem = useInjectFormItemContext();

const uploadLoading = ref<boolean>(false);

const emit = defineEmits(['update:value', 'blur']);

const file = ref<UploadChangeParam['file']>();

const _value = reactive<Record<string, any>>(cloneDeep(props.value || {}));

const { run: runExport, loading: exportLoading } = useRequest(() => api.fetchExportUids(_value.importBatchNo), {
    manual: true,
    onSuccess: (res) => {
        downloadExcel(res, _value.importBatchNo);
    },
});

function changeValue(v: Record<string, any>) {
    const _v = merge({}, _value, v);
    merge(_value, _v);
    emit('update:value', _v);
    formItem.onFieldChange();
}

const handleUploadChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
        uploadLoading.value = true;
        return;
    }
    if (info.file.status === 'done') {
        // Get this url from response in real world.
        if (info.file.response.code === 200) {
            file.value = info.file;
            _value.uids = null;
            _value.importBatchNo = info.file.response.data;
        } else {
            message.error(info.file.response.msg);
        }

        uploadLoading.value = false;
    }
    if (info.file.status === 'error') {
        uploadLoading.value = false;
        message.error('上传失败');
    }
};

function handleBlur() {
    formItem.onFieldBlur();
    emit('blur');
}

const getUids = computed(() => {
    if (!isNil(_value.importBatchNo)) {
        return unref(file)?.name || _value.importBatchNo;
    }
    return _value.uids;
});

function handleDeleteImport() {
    _value.importBatchNo = null;
    file.value = undefined;
}

function handleUidChange(e: Event) {
    const target = e.target as HTMLInputElement;
    _value.uids = target.value;
}

function handleExportUids() {
    runExport();
}

watch(
    () => props.value,
    (v) => {
        merge(_value, { uids: null, importBatchNo: null, range: null, migratedUserType: null, ...v });
    }
);

watch(
    () => _value.range,
    async (v) => {
        if (v === 1 && isNil(_value.migratedUserType)) {
            _value.migratedUserType = 0;
        }
    },
    { immediate: true }
);

watch(_value, async (v) => {
    await nextTick();

    changeValue(v);
});
</script>

<style scoped>
.ant-input[disabled] {
    background-color: #f5f5f5;
}
</style>
