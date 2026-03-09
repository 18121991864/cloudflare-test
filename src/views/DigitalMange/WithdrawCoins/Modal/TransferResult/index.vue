<template>
    <a-modal :open="visible" title="提交转账结果" :mask-closable="false" :footer="null">
        <a-form ref="formRef" :model="formState" :rules="rules">
            <a-form-item label="转账结果" name="state">
                <a-radio-group v-model:value="formState.state" name="address">
                    <a-radio :value="1">成功</a-radio>
                    <a-radio :value="2">失败</a-radio>
                </a-radio-group>
            </a-form-item>
            <template v-if="Number(formState.state) === 1">
                <a-form-item label="from地址" name="formAddress">
                    <a-input v-model:value="formState.formAddress" placeholder="请输入from地址" />
                </a-form-item>
                <a-form-item label="hash" name="txHash">
                    <a-input v-model:value="formState.txHash" placeholder="请输入交易Hash" />
                </a-form-item>
            </template>
            <template v-if="Number(formState.state) === 2">
                <a-form-item label="失败原因" name="remark">
                    <a-input v-model:value="formState.remark" placeholder="请输入失败原因" />
                </a-form-item>
            </template>

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
import api from '@/newApi/digitAsset/withdraw/index';
import { FormInstance, message } from 'ant-design-vue/es';
const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData: PromiseReturnType<typeof api.getWithdrawList>['list'][0];
    }>(),
    {
        visible: false,
        editData: () => Object.create(null),
    }
);
const emit = defineEmits(['update:visible', 'onSuccess']);
const formState = ref({
    state: '',
    txHash: '',
    formAddress: '',
    remark: '',
});
const rules = {
    state: [{ required: true, message: '请选择转账结果', trigger: ['change', 'blur'] }],
    txHash: [{ required: true, message: '请输入交易Hash', trigger: ['change', 'blur'] }],
    formAddress: [{ required: true, message: '请输入from地址', trigger: ['change', 'blur'] }],
    remark: [{ required: true, message: '请输入失败原因', trigger: ['change', 'blur'] }],
};
const formRef = ref<FormInstance>();
const handleCancel = () => {
    emit('update:visible', false);
};
const loading = ref<boolean>(false);
const handelSubmit = async () => {
    await formRef?.value?.validate?.();
    loading.value = true;
    const data =
        Number(formState.value.state) === 2
            ? {
                  remark: formState.value.remark,
              }
            : {
                  formAddress: formState.value.formAddress,
                  txHash: formState.value.txHash,
              };
    api.submitTransferResult({
        id: props.editData.id,
        state: formState.value.state,
        ...data,
    })
        .then(() => {
            emit('onSuccess');
            handleCancel();
            message.success('提交转账结果成功');
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
