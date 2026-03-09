<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :after-close="formRef.resetFields"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="handelCancel"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 6 }" hide-required-mark :rules="formRules" :model="formState">
            <a-form-item name="userId" label="管理员账号">
                <SUserID v-model="formState.userId" :pure="true" />
            </a-form-item>
            <a-form-item name="type" label="类型">
                <a-select v-model:value="formState.type" size="small" placeholder="请选择" :disabled="type === 'edit'">
                    <a-select-option :value="1">初审</a-select-option>
                    <a-select-option :value="2">复审</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item name="amount" label="金额">
                <!--   :disabled="Number(formState.type) !== 2" -->
                <a-input-number v-model:value="formState.amount" size="small" placeholder="请输入" :min="0" />
            </a-form-item>
            <a-form-item label="链" name="chainId">
                <SChain v-model="formState.chainId" :pure="true" :status="1" @onChange="ChangeChainId" :disabled="type === 'edit'" />
            </a-form-item>
            <a-form-item name="coinId" label="币种" v-if="formState.chainId">
                <SCoin v-model="formState.coinId" :pure="true" :status="1" :chain-id="formState.chainId" :disabled="type === 'edit'" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType } from 'vue';
import { message } from 'ant-design-vue';

import api from '@/newApi/digitAsset/withdrawCheck/index';

const FormParams = {
    amount: 0, // 金额
    coinId: '', // 币种id
    id: null,
    type: null, // 1、初审 2、复审
    userId: '', // 用户id
    chainId: '', // 链id
};

const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: {
        type: Object as PropType<PromiseReturnType<typeof api.getWithdrawCheckList>['list'][0]>,
        default: () => Object.create(null),
    },
});
const emit = defineEmits(['onClose', 'onSuccess']);
const formState = reactive({ ...FormParams });

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    amount: [{ required: true, trigger: 'blur', message: '请输入' }],
    coinId: [{ required: true, trigger: 'blur', message: '请选择' }],
    singleMax: [{ required: true, trigger: 'blur', message: '请输入' }],
    userId: [{ required: true, trigger: 'blur', message: '请输入' }],
    type: [{ required: true, trigger: 'blur', message: '请选择' }],
    chainId: [{ required: true, trigger: 'blur', message: '请选择' }],
}));

const title = computed(() => `${props.type === 'add' ? '新增' : '编辑'}提币审核配置${props.type === 'add' ? '' : `- ${props.activeData?.id}`}`);

const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    isSubmitLoading.value = true;
    const isApi = props.type === 'add' ? 'addWithdrawCheck' : 'updateWithdrawCheck';
    // @ts-ignore
    return api[isApi](formState)
        .then(() => {
            emit('onClose');
            message.success('操作成功');
        })
        .finally(() => {
            isSubmitLoading.value = false;
        });
};

const formRef = ref<FormInstance>(Object.create(null));
const handelSubmit = async () => {
    // 提交
    if (!props.visible) return;
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
};
const handelCancel = () => {
    formRef.value.resetFields();
    emit('onClose');
};

watch(
    () => props.visible,
    (n, o) => {
        // 用于填充modal数据
        if (n !== o && n) {
            Object.entries(FormParams).forEach(([key]: any) => {
                if (key === 'amount') {
                    // @ts-ignore 回填填充formState数据
                    formState[key] = props.type === 'add' ? 0 : props.activeData[key];
                } else {
                    // @ts-ignore 回填填充formState数据
                    formState[key] = props.type === 'add' ? undefined : props.activeData[key];
                }
            });
        }
    }
);
const ChangeChainId = () => {
    if (props.type === 'edit') {
        formState.coinId = '';
    }
};
</script>
