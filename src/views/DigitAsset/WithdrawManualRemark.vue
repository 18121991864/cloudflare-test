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
            <a-form-item label="请填写备注" name="manualRemark">
                <a-input v-model:value="formState.manualRemark" size="small" placeholder="请输入" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType, onMounted } from 'vue';
import { message } from 'ant-design-vue';

import api from '@/api/asset/index';

const props = defineProps({
    visible: { type: Boolean, required: true },
    manualRemark: { type: String, default: '' },
    id: { type: String, required: true },
});
const FormParams = {
    id: '',
    manualRemark: props.manualRemark,
};

const emit = defineEmits(['onClose', 'onSuccess']);
const formState = reactive({ ...FormParams, id: props.id });

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    manualRemark: [{ required: true, trigger: 'blur', message: '请填写备注' }],
}));
watch(
    () => props.id,
    (newId) => {
        formState.id = newId;
    }
);
watch(
    () => props.manualRemark,
    (newRemark) => {
        formState.manualRemark = newRemark;
    }
);

const title = computed(() => `${props.manualRemark ? '修改' : '新增'}备注`);

const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    isSubmitLoading.value = true;
    return api
        .fetchgetwithdrawManualRemark(formState)
        .then(() => {
            emit('onClose');
            message.success('操作成功');
        })
        .finally(() => {
            isSubmitLoading.value = false;
            formState.manualRemark = '';
        });
};

const formRef = ref<FormInstance>(Object.create(null));
const handelSubmit = async () => {
    // 提交
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
};
</script>

<style lang="scss" scoped></style>
