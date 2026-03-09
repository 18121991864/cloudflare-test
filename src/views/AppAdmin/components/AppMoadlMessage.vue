<template>
    <a-modal :open="visible" :footer="null" :mask-closable="false" @ok="handleOk" @cancel="handelCancel">
        <template #title>{{ title }}页面</template>
        <a-spin :spinning="spinning">
            <a-form ref="formRef" :model="formData" name="form" :rules="fromRules">
                <a-form-item label="推送对象" name="transmission">
                    <a-select v-model:value="formData.transmission" class="user-select" :disabled="messageTyep !== 1">
                        <a-select-option v-for="item in transmissionList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item v-if="formData.transmission == 0" label="用户UID" name="accId">
                    <a-input v-model:value="formData.accId" placeholder="请输入用户ID" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="活动简述" name="overview">
                    <a-input v-model:value="formData.overview" placeholder="请输入活动简述" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="通知标题(中文简体)" name="title">
                    <a-input v-model:value="formData.title" placeholder="请输入活动标题" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="通知标题(中文繁体)" name="titleTw">
                    <a-input v-model:value="formData.titleTw" placeholder="请输入活动标题" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="通知标题(英文)" name="titleEn">
                    <a-input v-model:value="formData.titleEn" placeholder="请输入活通知标题(英文)" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="通知标题(俄语)" name="titleRu">
                    <a-input v-model:value="formData.titleRu" placeholder="请输入通知标题(俄语)" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="通知标题(阿拉伯)" name="titleAr">
                    <a-input v-model:value="formData.titleAr" placeholder="请输入通知标题(阿拉伯)" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="内容详情(中文简体)" name="body">
                    <a-textarea v-model:value="formData.body" placeholder="请输入内容详情" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="内容详情(中文繁体)" name="bodyTw">
                    <a-textarea v-model:value="formData.bodyTw" placeholder="请输入内容详情(中文繁体)" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="内容详情(英文)" name="bodyEn">
                    <a-textarea v-model:value="formData.bodyEn" placeholder="请输入内容详情(英文)" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="内容详情(俄语)" name="bodyRu">
                    <a-textarea v-model:value="formData.bodyRu" placeholder="请输入内容详情(俄语)" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="内容详情(阿拉伯)" name="bodyAr">
                    <a-textarea v-model:value="formData.bodyAr" placeholder="请输入内容详情(阿拉伯)" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="URL(中文简体)" name="url">
                    <a-input v-model:value="formData.url" placeholder="请输入URL" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="URL(中文繁体)" name="urlTw">
                    <a-input v-model:value="formData.urlTw" placeholder="请输入URL(中文繁体)" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="URL(英文)" name="urlEn">
                    <a-input v-model:value="formData.urlEn" placeholder="请输入URL(英文)" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="URL(俄语)" name="urlRu">
                    <a-input v-model:value="formData.urlRu" placeholder="请输入URL(俄语)" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="URL(阿拉伯)" name="urlAr">
                    <a-input v-model:value="formData.urlAr" placeholder="请输入URL(阿拉伯)" :disabled="disabled" />
                </a-form-item>
                <a-form-item label="推送时间" name="send">
                    <a-radio-group v-model:value="formData.send" :disabled="disabled">
                        <a-radio :value="0">草稿箱</a-radio>
                        <a-radio :value="1">立即发送</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
            <div v-if="!disabled" class="footer-btn">
                <a-button type="primary" @click="handleOk">{{ configmText }}</a-button>
                <a-button @click="handelCancel">取消</a-button>
            </div>
        </a-spin>
    </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { AppMessagePush } from '@/api/appAdmin/types.d.ts';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import api from '@/api/appAdmin/index';
import _ from 'lodash';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    messageTyep: {
        type: Number,
        default: 1,
    },
    appDataFrom: {
        type: Object,
        default: () => ({}),
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
const title = computed(() => {
    const titles = ['消息添加', '消息编辑', '消息查看'];

    return titles[props.messageTyep - 1];
});
const configmText = computed(() => {
    const texts = ['确定', '立即发送'];
    return texts[formData.value.send];
});
watch(
    () => props.appDataFrom,
    (data) => {
        Object.keys(data).forEach((key) => {
            // @ts-ignore
            formData.value[key] = data[key];
        });
    },
    {
        deep: true,
    }
);
const transmissionList = [
    { id: 2, title: '全局' },
    { id: 0, title: '局部' },
];
const formRef = ref<FormInstance | null>(null);
const formData = ref<AppMessagePush>({
    body: '',
    bodyEn: '',
    bodyAr: '',
    bodyRu: '',
    bodyTw: '',
    overview: '',
    send: 0,
    title: '',
    titleEn: '',
    titleAr: '',
    titleRu: '',
    titleTw: '',
    url: '',
    urlTw: '',
    urlEn: '',
    urlAr: '',
    urlRu: '',
    transmission: 2,
    accId: '',
});

const deepFormData = ref(_.cloneDeep(formData.value));
const spinning = ref(false);
const fromRules = {
    transmission: [{ required: true, message: '请选择推送对象!', trigger: 'blur' }],
    accId: [{ required: true, message: '请输入用户ID!', trigger: 'blur' }],
    overview: [{ required: true, message: '请输入活动简述!', trigger: 'blur' }],
    body: [{ required: true, message: '请输入内容详情!', trigger: 'blur' }],
    bodyTw: [{ required: true, message: '请输入内容详情(中文繁体)!', trigger: 'blur' }],
    bodyEn: [{ required: true, message: '请输入内容详情(英文)!', trigger: 'blur' }],
    bodyAr: [{ required: true, message: '请输入内容详情(阿拉伯)!', trigger: 'blur' }],
    bodyRu: [{ required: true, message: '请输入内容详情(俄语)!', trigger: 'blur' }],
    title: [{ required: true, message: '请输入通知标题!', trigger: 'blur' }],
    titleEn: [{ required: true, message: '请输入通知标题(英文)!', trigger: 'blur' }],
    titleAr: [{ required: true, message: '请输入通知标题(阿拉伯)!', trigger: 'blur' }],
    titleRu: [{ required: true, message: '请输入通知标题(俄语)!', trigger: 'blur' }],
    titleTw: [{ required: true, message: '请输入通知标题(中文繁体)!', trigger: 'blur' }],
    send: [{ required: true, message: '请选择推送时间!', trigger: 'blur' }],
};
const emit = defineEmits(['update:visible', 'handleOk']);
const handelCancel = () => {
    formRef.value?.resetFields();
    formData.value = _.cloneDeep(deepFormData.value);
    emit('update:visible', false);
};
const handleOk = async () => {
    await formRef.value?.validate();
    spinning.value = true;
    const apis = ['fetchAppEventAddList', 'fetchAppEventUpdateList'];
    const fetch = props.messageTyep == 1 ? apis[0] : apis[1];
    // @ts-ignore
    api[fetch](formData.value)
        .then(() => {
            spinning.value = false;
            message.success(`${title.value}成功`);
            emit('handleOk');
            handelCancel();
        })
        .finally(() => {
            spinning.value = false;
        });
};
</script>

<style lang="scss" scoped>
.user-select {
    width: 382px;
}

:deep(.ant-form-item-label) {
    min-width: 90px;
    text-align: right;
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

.footer-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
        &:nth-child(1) {
            margin-right: 20px;
        }
    }
}
</style>
