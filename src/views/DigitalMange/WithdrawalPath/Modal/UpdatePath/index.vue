<template>
    <a-modal :open="visible" title="新增路径" :mask-closable="false" :footer="null" @cancel="handleCancel">
        <a-form ref="formRef" :model="formState" :rules="rules">
            <a-form-item label="名称" name="name">
                <a-input v-model:value="formState.name" placeholder="请输入名称" />
            </a-form-item>
            <a-form-item label="链" name="chainId">
                <SChain v-model="formState.chainId" :pure="true" :status="1" @onChange="ChangeChainId" />
            </a-form-item>
            <a-form-item name="coinId" label="币种" v-if="formState.chainId">
                <SCoin v-model="formState.coinId" :pure="true" :status="1" :chain-id="formState.chainId" />
            </a-form-item>
            <a-form-item label="目标地址" name="address">
                <a-input v-model:value="formState.address" placeholder="请输入目标地址" />
            </a-form-item>
            <a-form-item label="支付密码" name="opPassword">
                <a-input-password v-model:value="formState.opPassword" placeholder="请输入支付密码" />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 16 }" class="mt-10 mb-0">
                <div class="flex">
                    <a-button @click="handleCancel" class="mr-2">取消</a-button>
                    <a-button type="primary" :loading="loading" @click="handelSubmit">确定</a-button>
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import api from '@/newApi/digitAsset/withdrawPath/index';
import { FormInstance, message } from 'ant-design-vue/es';
const props = withDefaults(
    defineProps<{
        visible: boolean;
    }>(),
    {
        visible: false,
    }
);
const emit = defineEmits(['update:visible', 'onSuccess']);

const formRef = ref<FormInstance>();
const formState = ref({
    address: '',
    chainId: '',
    coinId: '',
    name: '',
    opPassword: '',
});
const rules = {
    address: [{ required: true, message: '请输入目标地址', trigger: 'change' }],
    opPassword: [{ required: true, message: '请输入支付密码', trigger: 'change' }],
    chainId: [{ required: true, message: '请选择链', trigger: 'change' }],
    coinId: [{ required: true, message: '请选择币种', trigger: 'change' }],
    name: [{ required: true, message: '请输入名称', trigger: 'change' }],
};
const loading = ref<boolean>(false);
const handleCancel = () => {
    emit('update:visible', false);
};
const ChangeChainId = () => {
    formState.value.coinId = '';
};
const handelSubmit = async () => {
    await formRef.value?.validate();
    loading.value = true;
    api.addWithdraPath(formState.value)
        .then((res) => {
            message.success('新增配置路径成功');
            emit('onSuccess');
            handleCancel();
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
