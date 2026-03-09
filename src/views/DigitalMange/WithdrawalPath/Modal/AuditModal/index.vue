<template>
    <a-modal :open="visible" title="审核" :mask-closable="false" :footer="null">
        <a-form ref="formRef" :model="formState" :rules="rules">
            <a-form-item label="审核结果" name="status">
                <a-radio-group v-model:value="formState.status" name="status">
                    <a-radio :value="1">审核通过</a-radio>
                    <a-radio :value="2">审核拒绝</a-radio>
                </a-radio-group>
            </a-form-item>
            <!-- <a-form-item label="拒绝理由" name="opPassword" v-if="Number(formState.status) === 2">
                <a-textarea v-model:value="formState.reason" placeholder="请输入拒绝理由" />
            </a-form-item> -->
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
        editData: PromiseReturnType<typeof api.getaddressWithdrawPage>['list'][0];
    }>(),
    {
        visible: false,
        editData: () => Object.create(null),
    }
);
const emit = defineEmits(['update:visible', 'onSuccess']);

const formState = ref({
    opPassword: '',
    status: '',
    // reason: '',
});
const rules = {
    status: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
    opPassword: [{ required: true, message: '请输入支付密码', trigger: 'change' }],
    reason: [{ required: true, message: '请输入拒绝理由', trigger: 'change' }],
};
const formRef = ref<FormInstance>();
const handleCancel = () => {
    emit('update:visible', false);
};
const loading = ref<boolean>(false);
const handelSubmit = async () => {
    await formRef.value?.validate();
    loading.value = true;
    api.AuditWithdraPath({
        id: props.editData.id,
        ...formState.value,
    })
        .then(() => {
            emit('onSuccess');
            handleCancel();
            message.success(`审核成功`);
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
