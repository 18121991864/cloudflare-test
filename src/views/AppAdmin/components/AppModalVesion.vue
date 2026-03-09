<template>
    <a-modal :open="visible" :mask-closable="false" :footer="isExamine ? null : undefined" @ok="handleOk" @cancel="handelCancel">
        <template #title>{{ title }}</template>
        <a-form ref="formRef" :model="formState" name="form" autocomplete="off">
            <a-form-item label="应用类型" v-bind="validateInfos.type">
                <a-select v-model:value="formState.type" class="user-select" :disabled="isDisabled" @blur="validateType('type')">
                    <a-select-option v-for="item in typeList" :key="item.id" :value="item.id">{{ item.name }} </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="市场来源" name="marketType" v-bind="validateInfos.marketType">
                <a-select v-model:value="formState.marketType" class="user-select" :disabled="isExamine" @blur="validateType('marketType')">
                    <template v-for="item in marketTypeList" :key="item.id">
                        <a-select-option v-if="item.show" :value="item.id">{{ item.value }}</a-select-option>
                    </template>
                </a-select>
            </a-form-item>
            <a-form-item label="版本号" name="versionNo" v-bind="validateInfos.versionNo">
                <a-input
                    v-model:value="formState.versionNo"
                    :disabled="isDisabled"
                    placeholder="请输入版本号"
                    class="user-select"
                    @blur="validateType('versionNo')"
                />
            </a-form-item>
            <a-form-item label="构建号" name="constructNo" v-bind="validateInfos.constructNo">
                <a-input
                    v-model:value="formState.constructNo"
                    :disabled="isDisabled"
                    placeholder="请输入构建号"
                    class="user-select"
                    @blur="validateType('constructNo')"
                />
            </a-form-item>
            <a-form-item :label="messageRef" name="url" v-bind="validateInfos.url">
                <a-input
                    v-model:value="formState.url"
                    placeholder="请输入APP下载URL"
                    :disabled="isExamine"
                    :class="formState.marketType == 3 ? 'user-dowload' : 'user-select'"
                    @blur="validateType('url')"
                />
                <UploadFile v-if="formState.marketType == 3" ref="uploadFileRef" v-model:fullUrl="formState.url" :disabled="isExamine" />
            </a-form-item>
            <a-form-item label="更新类型" name="force" v-bind="validateInfos.force" @blur="validateType('force')">
                <a-radio-group v-model:value="formState.force" class="user-select" :disabled="isExamine || formState.upUserType.range === 1">
                    <a-radio v-for="(item, index) in forceList" :key="item.id" :value="item.id">{{ item.name }} </a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="针对用户" name="upUserType" v-bind="validateInfos.upUserType">
                <UserType
                    :isExamine="isExamine"
                    v-model:value="formState.upUserType"
                    :isEdit="props.type === 'edit'"
                    @blur="validateType('upUserType')"
                />
            </a-form-item>

            <a-form-item label="升级方案(简体中文)" v-bind="validateInfos['content.zh-CN']">
                <a-textarea
                    v-model:value="formState.content['zh-CN']"
                    placeholder="请输入升级方案(简体中文)"
                    style="min-height: 100px"
                    :disabled="isExamine"
                    @blur="validateType('content.zh-CN')"
                />
            </a-form-item>
            <a-form-item label="升级方案(繁体中文)" v-bind="validateInfos['content.zh-TW']">
                <a-textarea
                    v-model:value="formState.content['zh-TW']"
                    placeholder="请输入升级方案(繁体中文)"
                    style="min-height: 100px"
                    :disabled="isExamine"
                    @blur="validateType('content.zh-TW')"
                />
            </a-form-item>
            <a-form-item label="升级方案(英文)" v-bind="validateInfos['content.en-US']">
                <a-textarea
                    v-model:value="formState.content['en-US']"
                    placeholder="请输入升级方案(英文)"
                    style="min-height: 100px"
                    :disabled="isExamine"
                    @blur="validateType('content.en-US')"
                />
            </a-form-item>
            <a-form-item label="升级方案(俄文)" v-bind="validateInfos['content.ru-RU']">
                <a-textarea
                    v-model:value="formState.content['ru-RU']"
                    placeholder="请输入升级方案(俄文)"
                    style="min-height: 100px"
                    :disabled="isExamine"
                    @blur="validateType('content.ru-RU')"
                />
            </a-form-item>
            <a-form-item label="升级方案(阿拉伯)" v-bind="validateInfos['content.ar-AE']">
                <a-textarea
                    v-model:value="formState.content['ar-AE']"
                    placeholder="请输入升级方案(阿拉伯)"
                    style="min-height: 100px"
                    :disabled="isExamine"
                    @blur="validateType('content.ar-AE')"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { message, Form } from 'ant-design-vue';
import type { VersionAdd } from '@/api/appAdmin/types.d';
import UploadFile from '@/components/UploaFile.vue';
import api from '@/api/appAdmin/index';
import UserType from './UserType.vue';
import { cloneDeep, isNil, merge, omit, pick } from 'lodash-es';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        default: 'add',
    },

    mItem: {
        type: Object,
        default: () => ({}),
    },
});
const { useForm } = Form;
const messageRef = ref('下载URL');
const formRef = ref<FormInstance | null>(null);
const uploadFileRef = ref<InstanceType<typeof UploadFile>>();

const formState = ref<VersionAdd>({
    type: 1,
    versionNo: '',
    constructNo: '',
    force: 1,
    url: '',
    content: {
        'zh-CN': '',
        'en-US': '',
        'ar-AE': '',
        'ru-RU': '',
        'zh-TW': '',
    },
    marketType: 2,
    upUserType: {
        range: 0,
    },
});

function isENil(value: any) {
    return isNil(value) || value === '';
}

const { resetFields, validate, validateInfos } = useForm(
    formState,
    reactive({
        type: [{ required: true, trigger: 'blur', message: '请选择应用类型' }],
        marketType: [{ required: true, trigger: 'blur', message: '请选择市场来源' }],
        constructNo: [
            { required: true, trigger: 'blur', message: '请输入构建号' },
            { pattern: /^[0-9]+$/, message: '请输入有效的整数', trigger: 'blur' },
        ],
        versionNo: [
            { required: true, trigger: 'blur', message: '请输入版本号' },
            {
                pattern: /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/,
                message: '请输入有效的版本号，例如：1.0.0',
                trigger: 'blur',
            },
        ],
        url: [
            {
                required: true,
                trigger: 'blur',
                message: '请输入APP下载URL',
            },
        ],
        force: [{ required: true, trigger: 'blur', message: '请选择更新类型' }],
        'content.zh-CN': [{ required: true, trigger: 'blur', message: '请输入升级方案(简体中文)' }],
        'content.en-US': [{ required: true, trigger: 'blur', message: '请输入升级方案(英文)' }],
        'content.ar-AE': [{ required: true, trigger: 'blur', message: '请输入升级方案(阿拉伯文)' }],
        'content.ru-RU': [{ required: true, trigger: 'blur', message: '请输入升级方案(俄文)' }],
        'content.zh-TW': [{ required: true, trigger: 'blur', message: '请输入升级方案(繁体中文)' }],
        upUserType: [
            { required: true, trigger: 'blur', message: '请选择针对用户' },
            {
                // @ts-ignore
                validator: async (rule, value) => {
                    if (value.range === 1) {
                        if (isNil(value.migratedUserType)) {
                            return Promise.reject('请选择迁移类型');
                        } else {
                            if (value.migratedUserType === 1 && isENil(value.uids) && isENil(value.importBatchNo)) {
                                return Promise.reject('请输入或导入用户UID');
                            }
                        }

                        if (!isENil(value.uids) && !/^[0-9,]*$/.test(value.uids)) {
                            return Promise.reject('请输入有效的UID以逗号分隔');
                        }
                    }

                    return Promise.resolve();
                },
                trigger: 'blur',
            },
        ],
    })
);
const marketTypeList = reactive([
    { id: 1, value: '苹果商店', show: false },
    { id: 2, value: '谷歌商店', show: true },
    { id: 3, value: 'Apk安装包', show: true },
    { id: 4, value: '华为商店', show: true },
]);
const typeList = [
    { id: 1, name: 'Android' },
    { id: 2, name: 'iOS' },
];
const forceList = [
    { id: 1, name: '强制更新' },
    { id: 2, name: '普通更新' },
];
const title = computed(() => {
    const titles = [
        { title: '新增App版本', id: 'add' },
        { title: '编辑App版本', id: 'edit' },
        { title: '查看App版本', id: 'examine' },
    ];

    return titles.find((item) => item.id === props.type)?.title;
});
const isDisabled = computed(() => props.type !== 'add');
const isExamine = computed(() => props.type === 'examine');

watch(
    () => formState.value.type,
    (val) => {
        marketTypeList.forEach((item) => {
            if (val === 2) {
                item.show = item.id === 1;
                formState.value.marketType = 1;
            } else {
                item.show = item.id > 1;
                formState.value.marketType = 2;
            }
        });
    }
);

watch(
    () => formState.value.marketType,
    (val) => {
        messageRef.value = val === 3 ? '上传安装包' : '下载URL';
    }
);

watch(
    () => props.type,
    (type) => {
        if (type !== 'add') {
            props.mItem.content = JSON.parse(props.mItem.content);

            const upUserTypeKeys = ['importBatchNo', 'uids', 'migratedUserType', 'range'];
            // @ts-ignore
            formState.value = merge({}, omit(props.mItem, upUserTypeKeys), { upUserType: pick(props.mItem, upUserTypeKeys) });
            if (formState.value.marketType !== 3) return false;
            nextTick(() => {
                const match = props.mItem.url.match(/\/([^\/]+)$/)[1];
                uploadFileRef.value?.fileList.push({
                    name: match || '未命名',
                    linkProps: '111',
                    uid: props.mItem.id,
                    response: '111',
                    status: 'done',
                    xhr: '111',
                });
            });
        }
    }
);
const emit = defineEmits(['update:visible']);

const handelCancel = () => {
    resetFields();
    formState.value.upUserType = { range: 0 };
    emit('update:visible', false);
    uploadFileRef.value?.cancelToken?.();
    uploadFileRef.value?.fileList.splice(uploadFileRef.value?.fileList.length);
};

const handleOk = async () => {
    await validate();

    const omitKeys = [];

    const values = cloneDeep(unref(formState));

    const upUserType = values.upUserType;

    if (upUserType.range === 0) {
        omitKeys.push('migratedUserType', 'uids', 'importBatchNo');
    } else {
        if (upUserType.migratedUserType === 0) {
            omitKeys.push('uids', 'importBatchNo');
        }
    }

    const sendParams = merge(omit(values, 'upUserType'), omit(upUserType, omitKeys));

    await api[props.type === 'add' ? 'fetchVersionAdd' : 'fetchVersionUpdate'](sendParams as any);
    message.success(`${title.value}成功`);
    handelCancel();
};

const validateType = (type: string) => {
    validate(type, { trigger: 'blur' }).catch(() => {});
};

watch(
    () => unref(formState).upUserType.range,
    (val) => {
        if (props.type === 'add' && val === 1 && formState.value.force !== 1) {
            formState.value.force = 1;
        }
    }
);
</script>

<style lang="scss" scoped>
.user-select {
    width: 300px;
}

:deep(.ant-form-item-label) {
    min-width: 90px;
    text-align: left;
}

.user-dowload {
    width: 240px;
    margin-right: 10px;
}

.ant-input[disabled] {
    background-color: #f5f5f5;
}

.ant-select-disabled {
    :deep(.ant-select-selector) {
        background-color: #f5f5f5 !important;
    }
}
</style>
