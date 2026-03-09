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
        <a-form ref="formRef" class="form-list" :label-col="{ span: 5 }" hide-required-mark :rules="formRules" :model="formState">
            <a-form-item label="登录密码" name="loginPassword">
                <a-input v-model:value="formState.loginPassword" type="password" size="small" placeholder="请输入" @pressEnter="handleSearch" />
            </a-form-item>
            <a-form-item v-if="type === 'edit'" label="状态" name="state">
                <a-radio-group v-model:value="formState.state" name="state">
                    <a-radio :value="1">通过</a-radio>
                    <a-radio :value="2">拒绝</a-radio>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType, onMounted } from 'vue';
import { message } from 'ant-design-vue';

import api from '@/api/asset/index';

const FormParams = {
    id: '',
    loginPassword: '',
};

export default defineComponent({
    emits: ['onClose', 'onSuccess'],
    props: {
        visible: { type: Boolean, required: true },
        type: { type: String as PropType<'add' | 'edit'>, required: true },
        activeData: { type: Object, default: () => Object.create(null) },
    },
    setup(props, { emit }) {
        const formState = reactive({ ...FormParams });

        const formRules = computed<Record<string, Rule[]>>(() => ({
            // 表单规则
            // tradePwd: [{ required: true, trigger: 'blur', message: '请输入' }],
            state: [{ required: true, trigger: 'blur', message: '请输入' }],
        }));

        const title = computed(() => '退回资产');

        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            if (isSubmitLoading.value) return;
            isSubmitLoading.value = true;

            return api
                .fetchTransactionBackTransferAmount({ ...formState })
                .then(() => {
                    emit('onClose');
                    emit('onSuccess');
                    message.success('操作成功');
                })
                .finally(() => {
                    isSubmitLoading.value = false;
                });
        };

        const formRef = ref<FormInstance>(Object.create(null));
        const handelSubmit = async () => {
            // 提交
            formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
        };

        onMounted(() => {
            Object.entries(FormParams).forEach(([key]: any) => {
                console.log(props.activeData, props.type);
                // @ts-ignore 回填填充formState数据
                formState[key] = props.activeData[key];
            });
        });
        return {
            title,
            formRef,
            formState,
            isSubmitLoading,
            formRules,

            handelSubmit,
        };
    },
});
</script>
