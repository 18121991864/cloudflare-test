<template>
    <a-modal :open="visible" :title="title" :mask-closable="false" @cancel="handleCancel" @ok="handelSubmit" width="600px" :confirm-loading="loading">
        <a-table :columns="tableColumns" :data-source="tableData" v-if="type === 1" :pagination="false" />
        <a-form ref="formRef" :model="formState" :rules="rules" v-else-if="type === 2">
            <a-form-item label="AML结果" name="handleResult">
                <a-radio-group v-model:value="formState.handleResult" name="handleResult">
                    <a-radio :value="1">检测通过</a-radio>
                    <a-radio :value="2">检测不通过</a-radio>
                </a-radio-group>
                <div class="mt-2 text-color-red" v-if="formState.handleResult">
                    {{ formState.handleResult === 1 ? '通过后，将进行上账等处理' : '检测不通过，将需要进行退款等处理' }}
                </div>
            </a-form-item>
            <a-form-item label="支付密码" name="payPassword">
                <a-input-password v-model:value="formState.payPassword" placeholder="请输入支付密码" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import api from '@/newApi/digitAsset/deposit/index';
import { FormInstance, message } from 'ant-design-vue/es';
const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData: PromiseReturnType<typeof api.getDepositList>['list'][0];
        type: 1 | 2;
    }>(),
    {
        visible: false,
        editData: () => Object.create(null),
        type: 1,
    }
);
const emit = defineEmits(['update:visible', 'onSuccess']);
const tableColumns = [
    { title: '渠道名称', dataIndex: 'ditchName' },
    { title: '风控等级', dataIndex: 'riskLevel' },
    { title: '检测类型', dataIndex: 'typeName' },
    { title: '风控描述', dataIndex: 'riskReason' },
];
const tableData = ref<PromiseReturnType<typeof api.getRiskInfo>>([]);
const formRef = ref<FormInstance>();
const formState = ref({
    handleResult: null,
    payPassword: '',
});
const rules = {
    handleResult: [{ required: true, message: '请选择AML结果', trigger: 'change' }],
    payPassword: [{ required: true, message: '请输入支付密码', trigger: 'change' }],
};
const handleCancel = () => {
    emit('update:visible', false);
};
const title = computed(() => {
    return props.type === 2 ? '提交AML结果' : 'AML结果详情';
});
const handelSubmit = async () => {
    const { type } = props;
    if (type === 2) {
        await formRef.value?.validate();
        loading.value = true;
        api.getDepositSubmitAML({
            orderNo: props.editData.orderNo,
            ...formState.value,
        })
            .then(() => {
                emit('onSuccess');
                handleCancel();
                message.success('提交AML结果成功');
            })
            .finally(() => {
                loading.value = false;
            });
        return false;
    }
    handleCancel();
};
const loading = ref<boolean>(false);
watchEffect(() => {
    if (props.visible && props.type === 1) {
        api.getRiskInfo({ orderNo: props.editData.orderNo }).then((res) => {
            tableData.value = res;
        });
    }
});
</script>
