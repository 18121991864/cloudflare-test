<script setup lang="ts">
import { computed, reactive, ref, PropType } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import api from '@/api/userAPI/userList';

const FormParams = {
    againTradePwd: '',
    newTradePwd: '',
    oldTradePwd: '',
};

const emits = defineEmits(['onClose', 'onSuccess']);
const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit' | 'reset'>, required: true },
});

const formRef = ref();
const isLoading = ref<boolean>(false); // 是否处于提交中
const formState = reactive({ ...FormParams });

const handleAddOrUpdate = () => {
    if (isLoading.value) return;
    isLoading.value = true;
    if (props.type === 'add') {
        return api
            .fetchTransactionSetTradePwd({
                againTradePwd: formState.againTradePwd,
                newTradePwd: formState.newTradePwd,
            })
            .then(() => {
                emits('onClose');
                message.success('操作成功');
            })
            .finally(() => {
                isLoading.value = false;
            });
    }
    if (props.type === 'reset') {
        return api
            .fetchTransactionResetPaymentPwd({
                againTradePwd: formState.againTradePwd,
                newTradePwd: formState.newTradePwd,
            })
            .then(() => {
                emits('onClose');
                emits('onSuccess');
                message.success('操作成功');
            })
            .finally(() => {
                isLoading.value = false;
            });
    }
    if (props.type === 'edit') {
        return api
            .fetchTransactionUpdatePaymentPwd({ ...formState })
            .then(() => {
                emits('onClose');
                emits('onSuccess');
                message.success('操作成功');
            })
            .finally(() => {
                isLoading.value = false;
            });
    }
};

const handelSubmit = async () => {
    // 提交
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emits('onSuccess')));
};

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    againTradePwd: [{ required: true, trigger: 'blur', message: '请输入' }],
    oldTradePwd: [{ required: true, trigger: 'blur', message: '请输入' }],
    newTradePwd: [{ required: true, trigger: 'blur', message: '请输入' }],
}));

const title = computed(() => (props.type === 'add' ? '设置提币钱包密码' : props.type === 'edit' ? '修改提币钱包密码' : '重置提币钱包密码'));
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
        <a-form ref="formRef" class="form-list" :label-col="{ span: 5 }" :hide-required-mark="true" :rules="formRules" :model="formState">
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
