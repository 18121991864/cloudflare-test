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
        <template #title>设置交易密码</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 5 }" hide-required-mark :rules="formRules" :model="formState">
            <a-form-item name="newTradePwd" label="交易密码">
                <a-input-password v-model:value="formState.newTradePwd" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item name="againTradePwd" label="确认交易密码">
                <a-input-password v-model:value="formState.againTradePwd" size="small" placeholder="请输入" />
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
    newTradePwd: '', // 确认交易密码
    againTradePwd: '', // 交易密码
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
            newTradePwd: [{ required: true, trigger: 'blur', message: '请输入' }],
            againTradePwd: [{ required: true, trigger: 'blur', message: '请输入' }],
        }));

        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            const { newTradePwd, againTradePwd } = formState;
            if (newTradePwd !== againTradePwd) {
                message.warning('两次密码不一致');
                return;
            }
            if (isSubmitLoading.value) return;
            isSubmitLoading.value = true;
            // @ts-ignore
            return api
                .fetchBargainSetTradePwd({ ...formState })
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
