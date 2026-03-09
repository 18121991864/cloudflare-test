<script setup lang="ts">
import { computed, reactive, ref, watch, PropType } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import SUserID from '@/components/SUserID.vue';
import SCoin from '@/components/SCoin.vue';
import { message } from 'ant-design-vue';
import api from '@/api/transaction/index';

const FormParams = {
    amount: '', // 金额
    coinId: '', // 币种id
    id: null,
    type: null, // 1、初审 2、复审
    userId: '', // 用户id
};

const emits = defineEmits(['onClose', 'onSuccess']);
const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: {
        type: Object as PropType<PromiseReturnType<typeof api.fetchTransactionWithdrawLimitList>['list']>,
        default: () => Object.create(null),
    },
});

const formRef = ref();
const isLoading = ref<boolean>(false); // 是否处于提交中
const formState = reactive({ ...FormParams });

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    amount: [{ required: true, trigger: 'blur', message: '请输入' }],
    coinId: [{ required: true, trigger: 'blur', message: '请选择' }],
    singleMax: [{ required: true, trigger: 'blur', message: '请输入' }],
    userId: [{ required: true, trigger: 'blur', message: '请输入' }],
    type: [{ required: true, trigger: 'blur', message: '请选择' }],
}));

const title = computed(() => `${props.type === 'add' ? '新增' : '编辑'}提币审核配置${props.type === 'add' ? '' : `-${props.activeData?.id}`}`);

const handleAddOrUpdate = () => {
    if (isLoading.value) return;
    isLoading.value = true;
    const isApi = props.type === 'add' ? 'fetchTransactionSetWithdrawCheckConfig' : 'fetchTransactionUpdateWithdrawCheckConfig';
    return api[isApi](
        props.type === 'add'
            ? {
                  ...formState,
                  amount: formState.type === 2 ? formState.amount : 0,
              }
            : { ...formState }
    )
        .then(() => {
            emits('onClose');
            message.success('操作成功');
        })
        .finally(() => {
            isLoading.value = false;
        });
};

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
        :confirm-loading="isLoading"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :cancel-button-props="{ disabled: isLoading }"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 6 }" :hide-required-mark="true" :rules="formRules" :model="formState">
            <a-form-item name="userId" label="用户UID">
                <SUserID v-model="formState.userId" :pure="true" />
            </a-form-item>
            <a-form-item v-if="type === 'add'" name="type" label="类型">
                <a-select v-model:value="formState.type" size="small" placeholder="请选择">
                    <a-select-option :value="1">初审</a-select-option>
                    <a-select-option :value="2">复审</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item v-if="formState.type === 2" name="amount" label="金额">
                <a-input-number v-model:value="formState.amount" size="small" placeholder="请输入" :min="0" />
            </a-form-item>
            <a-form-item v-if="type === 'add'" name="coinId" label="币种">
                <SCoin v-model="formState.coinId" :pure="true" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
