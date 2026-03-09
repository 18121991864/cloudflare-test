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
            <a-form-item :label="type === 'add' ? '提币密码' : '新提币密码'" name="newTradePwd">
                <a-input-password v-model:value="formState.newTradePwd" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="确认提币密码" name="againTradePwd">
                <a-input-password v-model:value="formState.againTradePwd" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item v-if="type === 'edit'" label="原交易密码" name="oldTradePwd">
                <a-input-password v-model:value="formState.oldTradePwd" size="small" placeholder="请输入" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType, onMounted } from 'vue';
import { message } from 'ant-design-vue';

import { type } from 'os';
import api from '@/api/userAPI/userList';

const FormParams = {
    againTradePwd: '',
    newTradePwd: '',
    oldTradePwd: '',
};

export default defineComponent({
    emits: ['onClose', 'onSuccess'],
    props: {
        visible: { type: Boolean, required: true },
        type: { type: String as PropType<'add' | 'edit' | 'reset'>, required: true },
        // activeData: { type: Object, default: () => Object.create(null) }
    },
    setup(props, { emit }) {
        const formState = reactive({ ...FormParams });

        const formRules = computed<Record<string, Rule[]>>(() => ({
            // 表单规则
            againTradePwd: [{ required: true, trigger: 'blur', message: '请输入' }],
            oldTradePwd: [{ required: true, trigger: 'blur', message: '请输入' }],
            newTradePwd: [{ required: true, trigger: 'blur', message: '请输入' }],
        }));

        const title = computed(() => (props.type === 'add' ? '设置提币钱包密码' : props.type === 'edit' ? '修改提币钱包密码' : '重置提币钱包密码'));

        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            if (isSubmitLoading.value) return;
            isSubmitLoading.value = true;
            if (props.type === 'add') {
                // @ts-ignore
                return api
                    .fetchTransactionSetTradePwd({
                        againTradePwd: formState.againTradePwd,
                        newTradePwd: formState.newTradePwd,
                    })
                    .then(() => {
                        emit('onClose');
                        message.success('操作成功');
                    })
                    .finally(() => {
                        isSubmitLoading.value = false;
                    });
            }
            if (props.type === 'reset') {
                // @ts-ignore
                return api
                    .fetchTransactionResetPaymentPwd({
                        againTradePwd: formState.againTradePwd,
                        newTradePwd: formState.newTradePwd,
                    })
                    .then(() => {
                        emit('onClose');
                        emit('onSuccess');
                        message.success('操作成功');
                    })
                    .finally(() => {
                        isSubmitLoading.value = false;
                    });
            }
            if (props.type === 'edit') {
                // @ts-ignore
                return api
                    .fetchTransactionUpdatePaymentPwd({ ...formState })
                    .then(() => {
                        emit('onClose');
                        emit('onSuccess');
                        message.success('操作成功');
                    })
                    .finally(() => {
                        isSubmitLoading.value = false;
                    });
            }
        };

        const formRef = ref<FormInstance>(Object.create(null));
        const handelSubmit = async () => {
            // 提交
            formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
        };

        // watch(() => props.visible, (n, o) => { // 用于填充modal数据
        //     if (n !== o && n) {
        //         Object.entries(FormParams).forEach(([key]: any) => {
        //             // @ts-ignore 回填填充formState数据
        //             formState[key] = props.type === 'add' ? undefined : props.activeData[key];
        //         });
        //     }
        // });

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
