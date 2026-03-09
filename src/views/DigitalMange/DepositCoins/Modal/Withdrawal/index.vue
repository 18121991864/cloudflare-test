<template>
    <a-modal :open="visible" title="申请提币" :width="650" :mask-closable="false" :footer="null" @cancel="handleCancel">
        <a-form ref="formRef" :model="formState" :rules="rules" layout="inline">
            <a-form-item label="链充币订单号" class="w-full">
                {{ props.editData.orderNo }}
            </a-form-item>

            <a-form-item label="出币钱包" class="w-1/2">
                {{ props.editData.walletSiteName }}
            </a-form-item>

            <a-form-item label="金额">
                {{ props.editData.amount || '--' }}
            </a-form-item>

            <a-form-item label="币种" class="w-1/2">
                {{ props.editData.coinSymbol || '--' }}
            </a-form-item>
            <a-form-item label="链">
                {{ props.editData.chainSymbol || '--' }}
            </a-form-item>
            <a-form-item label="To 地址" class="w-full" v-if="toAddress">
                {{ toAddress }}
            </a-form-item>
            <a-form-item label="提币路径" name="withdrawConfigId" class="w-full">
                <a-select v-model:value="formState.withdrawConfigId" placeholder="请选择" @change="handleWithdrawConfigChange">
                    <a-select-option v-for="item in withdrawConfigList" :key="item.value" :value="item.value">{{ item.label }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="支付密码" name="payPassword" class="w-full">
                <a-input-password v-model:value="formState.payPassword" placeholder="请输入支付密码" />
            </a-form-item>

            <a-form-item class="w-full buttton-form-item" :wrapper-col="{ offset: 16 }">
                <div class="form-buttons">
                    <a-button @click="handleCancel" class="mr-2">取消</a-button>
                    <a-button type="primary" :loading="loading" @click="handelSubmit">确定</a-button>
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import api from '@/newApi/digitAsset/deposit/index';
import apiWithdrawPath from '@/newApi/digitAsset/withdrawPath/index';
import { IS_NUMBER_OR_DECIMAL, MAX_VAKUE_DECIMALS } from '@/utils/constant';

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
const emit = defineEmits(['update:visible', 'success']);
const formRef = ref();
const loading = ref<boolean>(false);
const modalTitle = ref<string>('编辑币种');
const withdrawConfigList = ref<PromiseReturnType<typeof apiWithdrawPath.getAddressConfigSelect>>([]);

// 表单数据
const formState = reactive({
    payPassword: '',
    withdrawConfigId: null,
});
const toAddress = ref('');
// 表单验证规则
const rules = {
    payPassword: [{ required: true, message: '请输入支付密码', trigger: 'change' }],
    withdrawConfigId: [{ required: true, message: '请选择提币路径', trigger: 'change' }],
};

// 重置表单
const resetForm = () => {
    // 重置表单验证状态
    formRef.value?.resetFields();
};

// 取消操作
const handleCancel = () => {
    emit('update:visible', false);
    resetForm();
};

// 提交表单
const handelSubmit = () => {
    formRef.value.validate().then(() => {
        loading.value = true;

        // 构建提交的数据
        api.getDepositApplyWithdraw({
            ...formState,
            withdrawConfigId: formState.withdrawConfigId || '',
            orderNo: props.editData.orderNo,
        })
            .then(() => {
                emit('success');
                handleCancel();
                message.success('申请提币成功');
            })
            .finally(() => {
                loading.value = false;
            });
    });
};
watchEffect(() => {
    if (Object.keys(props.editData).length && props.visible) {
        console.log(props.editData);

        apiWithdrawPath
            .getAddressConfigSelect({
                chainId: props.editData.chainId.toString(),
                coinId: props.editData.coinId.toString(),
                status: 1,
            })
            .then((res) => {
                withdrawConfigList.value = res;
            });
    }
});
const handleWithdrawConfigChange = (value: string) => {
    console.log(value);
    const item = withdrawConfigList.value.find((item) => item.value === value);
    toAddress.value = item ? item.extend.address : '';
};
</script>

<style lang="scss" scoped>
.form-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}
.ant-form {
    .ant-form-item {
        margin-bottom: 20px;
        &.buttton-form-item {
            margin-top: 0 !important;
        }
    }
}
</style>
