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
            <a-form-item label="登录密码" name="loginPassword">
                <a-input v-model:value="formState.loginPassword" type="password" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item v-if="type !== 'add'" label="状态" name="state">
                <a-radio-group v-model:value="formState.state" name="state">
                    <a-radio :value="1">通过</a-radio>
                    <a-radio :value="2">拒绝</a-radio>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { computed, reactive, ref, PropType, onMounted } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import api from '@/api/transaction/index';

const FormParams = {
    id: '',
    loginPassword: '',
    state: '',
};

const emits = defineEmits(['onClose', 'onSuccess']);
const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: { type: Object, default: () => Object.create(null) },
});

const formRef = ref();
const isLoading = ref<boolean>(false); // 是否处于提交中
const formState = reactive({ ...FormParams });

const handleAddOrUpdate = () => {
    if (isLoading.value) return;
    isLoading.value = true;
    if (props.type === 'add') {
        return api
            .fetchTransactionCheckTransfer({ ...formState })
            .then(() => {
                emits('onClose');
                emits('onSuccess');
                message.success('操作成功');
            })
            .finally(() => {
                isLoading.value = false;
            });
    }
    return api
        .fetchTransactionAfreshTransfer({ ...formState })
        .then(() => {
            emits('onClose');
            emits('onSuccess');
            message.success('操作成功');
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const handelSubmit = async () => {
    // 提交
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emits('onSuccess')));
};

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    loginPassword: [{ required: true, trigger: 'blur', message: '请输入' }],
    state: [{ required: true, trigger: 'blur', message: '请选择' }],
}));

const title = computed(() => (props.type === 'edit' ? '审核提币' : '重新提币'));

onMounted(() => {
    Object.entries(FormParams).forEach(([key]: any) => {
        // @ts-ignore 回填填充formState数据
        formState[key] = props.activeData[key];
    });
});
</script>
