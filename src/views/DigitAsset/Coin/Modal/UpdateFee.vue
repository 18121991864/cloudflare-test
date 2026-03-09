<script setup lang="ts">
import { computed, reactive, ref, watch, PropType } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import api from '@/api/coin';

const emits = defineEmits(['onClose', 'onSuccess']);

const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: {
        type: Object as PropType<PromiseReturnType<typeof api.fetchCoinList>['list']>,
        default: () => Object.create(null),
    },
});

const FormParams = {
    balance: '',
    chainId: '',
    chainTag: '',
    decimals: 1,
    id: '',
    inStatus: 1,
    name: '',
    outStatus: 1,
    status: 1,
    symbol: '',
    walletCoinId: '',
    withdrawFee: '',
    walletFee: '',
};
const formState = reactive({ ...FormParams });

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    num: [{ required: true, trigger: 'blur', message: '请输入' }],
    agentId: [{ required: true, trigger: 'blur', message: '请选择' }],
    coinId: [{ required: true, trigger: 'blur', message: '请选择' }],
    chainId: [{ required: true, trigger: 'blur', message: '请选择' }],
}));

const title = computed(() => `${props.type === 'add' ? '新增' : '编辑'}手续费${props.type === 'add' ? '' : `-${props.activeData?.id}`}`);

const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    isSubmitLoading.value = true;
    return api
        .coinSetWithdrawFee({
            coinId: formState?.id,
            chainId: formState.chainId,
            withdrawFee: formState.withdrawFee,
            walletFee: formState.walletFee,
        })
        .then(() => {
            emits('onClose');
            message.success('操作成功');
            isSubmitLoading.value = false;
        })
        .finally(() => {
            isSubmitLoading.value = false;
        });
};

const formRef = ref<FormInstance>(Object.create(null));
const handelSubmit = async () => {
    // 提交
    if (!props.visible) return;
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emits('onSuccess')));
};

watch(
    () => props.visible,
    (n, o) => {
        // 用于填充modal数据
        if (n !== o && n) {
            Object.entries(FormParams).forEach(([key]: any) => {
                formState[key] = props.type === 'add' ? undefined : props.activeData[key];
            });
        }
    }
);
</script>

<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :after-close="formRef.resetFields"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 7 }" :hide-required-mark="false" :rules="formRules" :model="formState">
            <a-form-item name="walletFee" label="优易钱包手续费">
                <a-input-number v-model:value="formState.walletFee" size="small" placeholder="请输入" :min="0" />
            </a-form-item>
            <a-form-item name="withdrawFee" label="平台手续费">
                <a-input-number v-model:value="formState.withdrawFee" size="small" placeholder="请输入" :min="0" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
