<template>
    <a-modal :open="visible" title="退款" :mask-closable="false" :footer="null" @cancel="handleCancel">
        <a-form ref="formRef" :model="formState" :rules="rules">
            <a-form-item label="退款(提币)地址" name="address">
                <a-textarea v-model:value="formState.address" placeholder="请输入退款(提币)地址" />
            </a-form-item>
            <a-form-item label="支付密码" name="payPassword">
                <a-input-password v-model:value="formState.payPassword" placeholder="请输入支付密码" />
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
import api from '@/newApi/digitAsset/deposit/index';
import { FormInstance } from 'ant-design-vue/es';
const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData: PromiseReturnType<typeof api.getDepositList>['list'][0];
    }>(),
    {
        visible: false,
        editData: () => Object.create(null),
    }
);
const emit = defineEmits(['update:visible', 'onSuccess']);
const formState = ref({
    address: '',
    payPassword: '',
});
const rules = {
    address: [{ required: true, message: '请输入退款(提币)地址', trigger: 'change' }],
    payPassword: [{ required: true, message: '请输入支付密码', trigger: 'change' }],
};
const formRef = ref<FormInstance>();
const handleCancel = () => {
    emit('update:visible', false);
    formRef.value?.resetFields();
};
const loading = ref<boolean>(false);
const handelSubmit = async () => {
    await formRef.value?.validate();
    loading.value = true;
    api.getDepositApplyReturn({
        ...formState.value,
        orderNo: props.editData.orderNo,
    })
        .then(() => {
            emit('onSuccess');
            handleCancel();
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
