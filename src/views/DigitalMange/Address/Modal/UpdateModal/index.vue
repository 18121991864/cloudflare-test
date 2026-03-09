<template>
    <a-modal :open="visible" :title="modalTitle" :width="600" :mask-closable="false" :footer="null" @cancel="handleCancel">
        <a-form ref="formRef" :model="formState" :rules="rules">
            <template v-if="type == 1">
                <a-form-item label="代理商" name="agentId">
                    <a-select v-model:value="formState.agentId" placeholder="请选择">
                        <a-select-option :value="item.id" v-for="item in agetOption" :key="item.id">{{ item.name }}</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="钱包名称" name="walletSiteId">
                    <a-select v-model:value="formState.walletSiteId" placeholder="请选择">
                        <a-select-option :value="item.id" v-for="item in walletOption" :key="item.id">{{ item.name }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="数量" name="number">
                    <a-input v-model:value="formState.number" placeholder="请输入数量" />
                </a-form-item>
                <a-form-item label="链 " name="chainId">
                    <SChain v-model="formState.chainId" :status="1" :pure="true" />
                </a-form-item>
            </template>
            <template v-if="type == 2">
                <a-form-item label="弃用原因" name="discontinueReason" class="mb-0">
                    <a-textarea v-model:value="formState.discontinueReason" placeholder="请输入弃用原因" showCount />
                </a-form-item>
            </template>
            <template v-if="type == 3">
                <a-form-item label="备注" name="remarks" class="mb-0">
                    <a-textarea v-model:value="formState.remarks" placeholder="请输入备注" showCount />
                </a-form-item>
            </template>

            <a-form-item :wrapper-col="{ offset: 20 }">
                <div class="form-buttons">
                    <a-button @click="handleCancel">取消</a-button>
                    <a-button type="primary" :loading="loading" @click="handelSubmit">确定</a-button>
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue';
import api from '@/newApi/digitAsset/address/index';
import walletApi from '@/newApi/wallet/index';
import agentApi from '@/newApi/agent//index';
import { NOT_ZERPO_INTER_NUMBER } from '@/utils/constant';

const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData: PromiseReturnType<typeof api.getAddressPage>['list'][0];
        type: 1 | 2 | 3;
    }>(),
    {
        visible: false,
        editData: () => Object.create(null),
        type: 1,
    }
);
const emit = defineEmits(['update:visible', 'success']);
const formRef = ref();
const loading = ref<boolean>(false);
const walletOption = ref<PromiseReturnType<typeof walletApi.getwalletChoose>>([]);
const agetOption = ref<PromiseReturnType<typeof agentApi.getAgentChoose>>([]);
// 表单数据
const formState = reactive({
    agentId: null,
    chainId: '',
    number: '',
    walletSiteId: null,
    remarks: '',
    discontinueReason: '',
});
const modalTitle = computed(() => {
    return ['添加地址', '弃用地址', '备注'][props.type - 1];
});
const validatData = (_: any, value: string) => {
    const context = '数量';
    if (!value) return Promise.reject(`请输入${context}`);
    if (!NOT_ZERPO_INTER_NUMBER.test(value)) return Promise.reject(`只能输入正整数`);
    if (Number(value) > 5) return Promise.reject(`${context}不能超过5`);
    return Promise.resolve();
};
// 表单验证规则
const rules = {
    number: [{ required: true, validator: validatData, trigger: 'blur' }],
    agentId: [{ required: true, message: '请选择代理商', trigger: 'change' }],
    walletSiteId: [{ required: true, message: '请选择钱包品牌', trigger: 'change' }],
    chainId: [{ required: true, message: '请选择链', trigger: 'change' }],
    discontinueReason: [{ required: true, message: '请输入弃用原因', trigger: 'change' }],
    remarks: [{ required: true, message: '请输入备注', trigger: 'change' }],
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
const handelSuccess = () => {
    handleCancel();
    emit('success');
};
// 提交表单
const handelSubmit = () => {
    formRef.value.validate().then(() => {
        loading.value = true;
        const { remarks, discontinueReason, ...params } = formState;
        if (props.type === 2) {
            api.updateStatusAddress({
                status: 3,
                id: props.editData.id,
                discontinueReason,
            })
                .then((res) => {
                    message.success('弃用地址成功');
                    handelSuccess();
                })
                .finally(() => {
                    loading.value = false;
                });
        }
        if (props.type === 1) {
            api.addAddress(params)
                .then((res) => {
                    message.success('新增地址成功');
                    handelSuccess();
                })
                .finally(() => {
                    loading.value = false;
                });
        }
        if (props.type === 3) {
            api.updateRemarkAddress({
                id: props.editData.id,
                remarks,
            })
                .then((res) => {
                    message.success('更新备注成功');
                    handelSuccess();
                })
                .finally(() => {
                    loading.value = false;
                });
        }
    });
};
const getAgentChoose = async () => {
    agetOption.value = await agentApi.getAgentChoose();
};
const getwalletChoose = async () => {
    walletOption.value = await walletApi.getwalletChoose({
        state: 1,
    });
};
watch(
    () => props.visible,
    (value) => {
        if (!value) return;
        if (props.type === 3) {
            formState.remarks = props.editData.remarks;
            return;
        }
        if (props.type !== 1) return;
        getwalletChoose();
        getAgentChoose();
    }
);
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
        &.mb-0 {
            margin-bottom: 0 !important;
        }
    }
}
</style>
