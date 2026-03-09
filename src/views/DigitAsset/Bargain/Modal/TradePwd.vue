<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import { computed, reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import api from '@/api/asset/index';

const FormParams = {
    newTradePwd: '', // 确认交易密码
    againTradePwd: '', // 交易密码
};

const emits = defineEmits(['onClose', 'onSuccess']);
const props = defineProps({
    visible: { type: Boolean, required: true },
});

const formRef = ref();
const isLoading = ref<boolean>(false); // 是否处于提交中
const formState = reactive({ ...FormParams });

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    newTradePwd: [{ required: true, trigger: 'blur', message: '请输入' }],
    againTradePwd: [{ required: true, trigger: 'blur', message: '请输入' }],
}));

const handleAddOrUpdate = () => {
    const { newTradePwd, againTradePwd } = formState;
    if (newTradePwd !== againTradePwd) {
        message.warning('两次密码不一致');
        return;
    }
    if (isLoading.value) return;
    isLoading.value = true;
    return api
        .fetchBargainSetTradePwd({ ...formState })
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
        <template #title>设置交易密码</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 5 }" :hide-required-mark="true" :rules="formRules" :model="formState">
            <a-form-item name="newTradePwd" label="交易密码">
                <a-input-password v-model:value="formState.newTradePwd" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item name="againTradePwd" label="确认交易密码">
                <a-input-password v-model:value="formState.againTradePwd" size="small" placeholder="请输入" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
