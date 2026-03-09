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
        <template #title>发起提币</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 5 }" hide-required-mark :rules="formRules" :model="formState">
            <a-form-item name="itemId" label="币种">
                <SCoin v-model="formState.itemId" :pure="true" />
            </a-form-item>
            <a-form-item v-if="formState.itemId" name="chainTag" label="链">
                <SChain v-model="formState.chainTag" :coin-id="formState.itemId" :pure="true" :name="true" />
            </a-form-item>
            <a-form-item name="amount" label="金额">
                <a-input-number v-model:value="formState.amount" size="small" placeholder="金额" :min="0" />
            </a-form-item>
            <a-form-item name="address" label="地址">
                <a-input v-model:value="formState.address" size="small" placeholder="地址" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType } from 'vue';
import { message } from 'ant-design-vue';

import api from '@/api/asset/index';

const FormParams = {
    address: '', // 地址
    amount: '', // 金额
    chainTag: '', // 链
    itemId: '', // 钱包币种id
};

export default defineComponent({
    props: {
        visible: { type: Boolean, required: true },
    },
    emits: ['onClose', 'onSuccess'],
    setup(props, { emit }) {
        const formState = reactive({ ...FormParams });

        const formRules = computed<Record<string, Rule[]>>(() => ({
            // 表单规则
            amount: [{ required: true, trigger: 'blur', message: '请输入' }],
            address: [{ required: true, trigger: 'blur', message: '请输入' }],
            chainTag: [{ required: true, trigger: 'blur', message: '请选择' }],
            itemId: [{ required: true, trigger: 'blur', message: '请选择' }],
        }));

        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            if (isSubmitLoading.value) return;
            isSubmitLoading.value = true;
            // @ts-ignore
            return api
                .fetchBargainTransfer({ ...formState })
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

        return {
            formRef,
            formState,
            isSubmitLoading,
            formRules,

            handelSubmit,
        };
    },
});
</script>
