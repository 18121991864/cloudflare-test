<template>
    <a-modal :open="visible" :mask-closable="false" @ok="handleOk" @cancel="handelCancel">
        <template #title>{{ title }}</template>
        <a-form ref="formRef" :model="formState" name="form" autocomplete="off" :rules="fromRules">
            <a-form-item label="语言" name="language">
                <a-select v-model:value="formState.language" placeholder="请选择语言" :options="langArr" />
            </a-form-item>
            <a-form-item label="按钮文案" name="btnText">
                <a-input v-model:value="formState.btnText" :placeholder="btnTextPlaceholder" />
            </a-form-item>
            <a-form-item label="按钮跳转链接" name="url">
                <a-input v-model:value="formState.url" placeholder="请输入按钮跳转链接" class="user-select" />
            </a-form-item>
            <a-form-item label="广告位图片背景" name="image">
                <div class="icon-flex">
                    <a-input v-model:value="formState.image" placeholder="广告位图片背景" class="user-select" />
                    <!-- :proportion="4 / 3" -->
                    <Upload
                        v-model:suffixUrl="formState.image"
                        v-model:fullUrl="formState.image"
                        :limit-size="true"
                        :custom-size="true"
                        platform="app"
                        :max-file-size="5"
                    >
                        <a-button type="primary" size="small" class="ml-5 mr-5 upload-btm">上传</a-button>
                    </Upload>
                    <PreviewImgBtm :url="formState.image" />
                </div>
                <div class="info-circle">
                    <info-circle-outlined class="info-icon" />
                    <span>图片规定尺寸为375*125pt，最大上传大小不超过5M</span>
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { message, Form } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import type { AppMenuList, ContentType, AdvertisingSpaceList } from '@/api/appAdmin/types.d';
import UploadImg from '@/components/UploadImg.vue';
import api from '@/api/appAdmin/index';
import { langArr } from "@/utils/constant";

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    messageTyep: {
        type: Number,
        default: 1,
    },

    mItem: {
        type: Object,
        default: () => ({}),
    },
});
const btnTextPlaceholder = ref('');
watch(
    () => props.messageTyep,
    (val) => {
        if (val == 2) {
            Object.keys(props.mItem).forEach((key) => {
                // @ts-ignore
                formState.value[key] = props.mItem[key];
            });
        }
    },
    {
        deep: true,
    }
);
const formRef = ref<FormInstance | null>(null);
const uploadFileRef = ref<InstanceType<typeof UploadImg>>();
const formState = ref<AdvertisingSpaceList>({
    btnText: '',
    image: '',
    language: 'en-US',
    state: 2,
    url: '',
    id: null,
});
watch(
    () => formState.value.language,
    (val) => {
        if (val == 'zh-CN') {
            btnTextPlaceholder.value = '按钮文案中文最多5个字';
        } else {
            btnTextPlaceholder.value = '按钮文案英文最多10个字';
        }
    },
    {
        immediate: true,
    }
);
const copyformState = ref(JSON.parse(JSON.stringify(formState.value)));
const validateBtnText = async (_rule: Rule, value: string) => {
    if (formState.value.language == 'zh-CN') {
        console.log(value.length);
        if (value.length > 5) {
            return Promise.reject('按钮文案中文最多5个字');
        }
    } else if (formState.value.language == 'en-US') {
        if (value.length > 10) {
            return Promise.reject('按钮文案英文最多10个字');
        }
    } else {
        return Promise.resolve();
    }
};
const fromRules = {
    btnText: [
        { required: true, trigger: 'blur', message: '请填写按钮文案' },
        { required: true, validator: validateBtnText, trigger: 'blur' },
    ],
    url: [
        {
            required: true,
            trigger: 'blur',
            message: '请输入菜单外部链接',
        },
    ],
    image: [{ required: true, trigger: 'blur', message: '请上传广告位图片' }],
    language: [{ required: true, trigger: 'blur', message: '请选择语言' }],
};

const title = computed(() => `${props.messageTyep == 1 ? '新增' : '编辑'}广告位`);

const emit = defineEmits(['update:visible', 'handleOk']);
const handelCancel = () => {
    formRef.value?.resetFields();
    emit('update:visible', false);
    uploadFileRef.value?.fileList.splice(uploadFileRef.value?.fileList.length);
};
const handleOk = async () => {
    await formRef.value?.validate();
    const fetch = ['fetchAdvertisingSpaceAdd', 'fetchAdvertisingSpaceEdit'][props.messageTyep - 1];
    // @ts-ignore
    await api[fetch](formState.value);
    message.success(`${title.value}成功`);
    handelCancel();
    formState.value = JSON.parse(JSON.stringify(copyformState.value));
    emit('handleOk');
};
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

.icon-flex {
    display: flex;
}

.info-circle {
    margin-top: 10px;

    .info-icon {
        color: red;

        margin-right: 5px;
    }

    span {
        font-size: 12px;
    }
}
</style>
