<template>
    <a-modal :open="visible" title="编辑币种" :width="600" :mask-closable="false" :footer="null" @cancel="handleCancel">
        <a-form ref="formRef" :model="formState" :rules="rules" layout="inline">
            <a-form-item label="币种" class="w-1/2">
                {{ props.editData.symbol }}
            </a-form-item>

            <a-form-item label="币全称">
                {{ props.editData.name }}
            </a-form-item>

            <a-form-item label="链" class="w-1/2">
                {{ props.editData.chainSymbol || '--' }}
            </a-form-item>

            <a-form-item label="小数位（精度）">
                {{ props.editData.decimals || '--' }}
            </a-form-item>

            <a-form-item label="最小提币数量" name="withdrawMin" class="w-full">
                <a-input v-model:value="formState.withdrawMin" placeholder="请输入最小提币数量" />
            </a-form-item>

            <a-form-item label="平台提币手续费" name="platformFee" class="w-full">
                <a-input v-model:value="formState.platformFee" placeholder="请输入平台提币手续费" />
            </a-form-item>

            <a-form-item label="链充币状态" name="rechargeStatus" class="w-full">
                <a-radio-group v-model:value="formState.rechargeStatus">
                    <a-radio :value="1">启用</a-radio>
                    <a-radio :value="2">禁用</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item label="链提币状态" name="withdrawStatus">
                <a-radio-group v-model:value="formState.withdrawStatus">
                    <a-radio :value="1">启用</a-radio>
                    <a-radio :value="2">禁用</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 20 }" class="mt-10 mb-0">
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
import api from '@/newApi/digitAsset/coin/index';
import { IS_NUMBER_OR_DECIMAL, MAX_VAKUE_DECIMALS } from '@/utils/constant';

const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData: PromiseReturnType<typeof api.getCoinlList>['list'][0];
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

// 表单数据
const formState = reactive<any>({
    platformFee: '',
    rechargeStatus: null,
    withdrawMin: '',
    withdrawStatus: null,
});
const validatData = (type: 1 | 2) => (_: any, value: string) => {
    const context = type === 1 ? '最小提币数量' : '平台提币手续费';
    if (!value) return Promise.reject(`请输入${context}`);
    if (!IS_NUMBER_OR_DECIMAL.test(value)) return Promise.reject(`只能输入数字且不能输入负数`);
    if (!MAX_VAKUE_DECIMALS(Number(props.editData.decimals)).test(value)) {
        return Promise.reject(`${context}不能超过${props.editData.decimals}位小数`);
    }
    if (Number(value) > 100000000) return Promise.reject(`${context}不能超过1亿`);
    return Promise.resolve();
};
// 表单验证规则
const rules = {
    withdrawMin: [{ required: true, validator: validatData(1), trigger: 'blur' }],
    platformFee: [{ required: true, validator: validatData(2), trigger: 'blur' }],
    rechargeStatus: [{ required: true, message: '请选择链充币状态', trigger: 'change' }],
    withdrawStatus: [{ required: true, message: '请选择链提币状态', trigger: 'change' }],
};

// 监听编辑数据变化
watch(
    () => props.editData,
    (newVal) => {
        if (newVal && Object.keys(newVal).length > 0) {
            // 填充表单数据
            Object.keys(formState).forEach((key) => {
                // @ts-ignore
                if (newVal[key] !== undefined) {
                    // 确保类型安全的赋值
                    // @ts-ignore
                    const value = newVal[key];
                    if (value !== undefined) {
                        formState[key] = value as string | number;
                    }
                }
            });
        }
    },
    { immediate: true, deep: true }
);

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
        api.updateCoin({
            id: props.editData.id,
            ...formState,
        })
            .then(() => {
                emit('success');
                handleCancel();
                message.success('编辑币种成功');
            })
            .finally(() => {
                loading.value = false;
            });
    });
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
    }
}
</style>
