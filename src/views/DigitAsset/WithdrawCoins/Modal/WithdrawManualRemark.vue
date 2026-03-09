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
        <a-form ref="formRef" class="form-list" :label-col="{ span: 5 }" hide-required-mark :rules="formRules" :model="formState">
            <a-form-item label="请填写备注" name="manualRemark">
                <a-input v-model:value="formState.manualRemark" size="small" placeholder="请输入" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';
import api from '@/api/transaction/index';

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

const formRef = ref();
const isLoading = ref<boolean>(false); // 是否处于提交中
const formState = reactive({ ...FormParams, id: props.id });

const handleAddOrUpdate = () => {
    if (isLoading.value) return;
    isLoading.value = true;
    return api
        .fetchgetwithdrawManualRemark(formState)
        .then(() => {
            emit('onClose');
            message.success('操作成功');
        })
        .finally(() => {
            isLoading.value = false;
            formState.manualRemark = '';
        });
};

const handelSubmit = async () => {
    // 提交
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
};

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    manualRemark: [{ required: true, trigger: 'blur', message: '请填写备注' }],
}));

const title = computed(() => `${props.manualRemark ? '修改' : '新增'}备注`);

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
</script>

<style lang="scss" scoped></style>
