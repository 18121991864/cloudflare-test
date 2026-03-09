<script setup lang="ts">
import { computed, reactive, ref, watch, PropType } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import api from '@/api/address/index';

const emits = defineEmits(['onClose', 'onSuccess']);
const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: {
        type: Object as PropType<PromiseReturnType<typeof api.fetchAddressList>['list']>,
        default: () => Object.create(null),
    },
});

const FormParams = {
    agentId: '', // 代理商ID
    coinId: '', // 币种id
    chainId: '', // 币种id
    // address: '', // 平台地址
    num: '', // 数量
};

const formRef = ref();
const formState = reactive({ ...FormParams });

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    num: [{ required: true, trigger: 'blur', message: '请输入' }],
    agentId: [{ required: true, trigger: 'blur', message: '请选择' }],
    coinId: [{ required: true, trigger: 'blur', message: '请选择' }],
    chainId: [{ required: true, trigger: 'blur', message: '请选择' }],
}));

const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    isSubmitLoading.value = true;
    return api
        .fetchAddressCreate({ ...formState })
        .then(() => {
            emits('onClose');
            message.success('操作成功');
        })
        .finally(() => {
            isSubmitLoading.value = false;
        });
};

const handelSubmit = async () => {
    // 提交
    if (!props.visible) return;
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emits('onSuccess')));
};

console.log(props.activeData, '--');

const title = computed(() => `${props.type === 'add' ? '新增' : '编辑'}地址${props.type === 'add' ? '' : `-${props.activeData?.id}`}`);

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
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 5 }" :hide-required-mark="true" :rules="formRules" :model="formState">
            <a-form-item name="coinId" label="币种">
                <SCoin v-model="formState.coinId" :pure="true" />
            </a-form-item>
            <a-form-item v-if="formState.coinId" name="chainId" label="链">
                <SChain v-model="formState.chainId" :coin-id="formState.coinId" :pure="true" />
            </a-form-item>
            <a-form-item name="agentId" label="代理商ID">
                <SAgentChoose v-model="formState.agentId" :pure="true" />
            </a-form-item>
            <a-form-item name="num" label="数量">
                <a-input-number v-model:value="formState.num" size="small" placeholder="数量" :min="0" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
