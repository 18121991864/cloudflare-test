<script setup lang="ts">
import { computed, reactive, ref, watch, PropType } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import SChain from '@/components/SChain.vue';
import SCoin from '@/components/SCoin.vue';
import { message } from 'ant-design-vue';
import api from '@/api/transaction/index';

const FormParams = {
    accountId: '', // 用户id
    coinId: '', // 币id
    chainId: '', // 链id
    day: '', // 每天最大限额
    hour: '', // 每笔最大限额
    id: null, // id
    range: null, // 1、全局 2、用户
    singleMax: '', // 每笔最大限额
    singleMin: '', // 每笔最小限额
    state: null, // 状态：状态：1=启用，2=禁用
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
    accountId: [{ required: true, trigger: 'blur', message: '请输入' }],
    coinId: [{ required: true, trigger: 'blur', message: '请选择' }],
    chainId: [{ required: true, trigger: 'blur', message: '请选择' }],
    day: [{ required: true, trigger: 'blur', message: '请输入' }],
    hour: [{ required: true, trigger: 'blur', message: '请输入' }],
    range: [{ required: true, trigger: 'blur', message: '请输入' }],
    singleMax: [{ required: true, trigger: 'blur', message: '请输入' }],
    singleMin: [{ required: true, trigger: 'blur', message: '请输入' }],
    state: [{ required: true, trigger: 'blur', message: '请选择' }],
}));

const title = computed(() => `${props.type === 'add' ? '新增' : '编辑'}提币额度配置${props.type === 'add' ? '' : `-${props.activeData?.id}`}`);

const handleAddOrUpdate = () => {
    if (isLoading.value) return;
    isLoading.value = true;
    const isApi = props.type === 'add' ? 'fetchTransactionSetWithdrawLimit' : 'fetchTransactionUpdateWithdrawLimit';
    return api[isApi](
        props.type === 'add'
            ? {
                  ...formState,
                  accountId: formState.range === 1 ? '' : formState.accountId,
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
            <a-form-item v-if="type === 'add'" name="range" label="范围">
                <a-select v-model:value="formState.range" size="small" placeholder="请选择">
                    <a-select-option :value="1">全局</a-select-option>
                    <a-select-option :value="2">用户</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item v-if="type === 'add' && formState.range === 2" name="accountId" label="用户UID">
                <a-input v-model:value="formState.accountId" size="small" placeholder="用户UID" />
            </a-form-item>
            <a-form-item name="day" label="每天最大限额">
                <a-input-number v-model:value="formState.day" size="small" placeholder="每天最大限额" :min="0" />
            </a-form-item>
            <a-form-item name="hour" label="每小时最大限额">
                <a-input-number v-model:value="formState.hour" size="small" placeholder="每小时最大限额" :min="0" />
            </a-form-item>
            <a-form-item name="singleMax" label="每笔最大限额">
                <a-input-number v-model:value="formState.singleMax" size="small" placeholder="每笔最大限额" :min="0" />
            </a-form-item>
            <a-form-item name="singleMin" label="每笔最小限额">
                <a-input-number v-model:value="formState.singleMin" size="small" placeholder="每笔最小限额" :min="0" />
            </a-form-item>
            <a-form-item v-if="type === 'add'" name="coinId" label="币种">
                <SCoin v-model="formState.coinId" :pure="true" />
            </a-form-item>
            <a-form-item v-if="type === 'add'" name="chainId" label="链">
                <SChain v-model="formState.chainId" :coin-id="formState.coinId" :pure="true" />
            </a-form-item>
            <a-form-item name="state" label="状态">
                <a-select v-model:value="formState.state" size="small" placeholder="请选择">
                    <a-select-option :value="1">启用</a-select-option>
                    <a-select-option :value="0">禁用</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
