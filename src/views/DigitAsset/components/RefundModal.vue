<template>
    <a-modal :open="visible" title="退款" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
        <a-form ref="formRef" :model="formState" :rules="formRules">
            <a-form-item label="退款(提币)地址" name="address">
                <a-input v-model:value="formState.address" placeholder="请输入退款(提币)地址" />
            </a-form-item>
            <div style="transform: translateX(104px) translateY(-4px); color: #aaa">提示:退款前，请跟用户确认正确退款地址</div>
            <a-form-item label="登录密码" name="loginPassword">
                <a-input v-model:value="formState.loginPassword" placeholder="请输入登录密码" type="password" autocomplete="new-password" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import api from '@/api/asset/index';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';

const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    refundId: {
        type: String,
        default: '',
    },
    handleOk: {
        type: Function,
        default: () => {},
    },
});
const confirmLoading = ref(false);
const formState = ref({
    loginPassword: '',
    id: '',
    address: '',
});
const formRef = ref<FormInstance>();
const formRules = {
    address: [{ required: true, message: '请输入退款地址', trigger: 'blur' }],
    loginPassword: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
};
const emit = defineEmits(['update:visible', 'handleOk']);
const handleCancel = () => {
    emit('update:visible', false);
    formRef.value?.resetFields();
};
const handleOk = async () => {
    await formRef.value?.validate();
    formState.value.id = props.refundId;
    api.fetchDepositRefund(formState.value).then(() => {
        message.success('退款成功');
        handleCancel();
        props.handleOk();
        emit('handleOk');
    });
};
</script>

<style lang="less" scoped></style>
