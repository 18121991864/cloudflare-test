<script setup lang="ts">
import { ref } from 'vue';

const emits = defineEmits(['updateTable', 'setFormState']);

const formRef = ref();
const visible = ref(false);
const isLoading = ref(false);
const formState = ref<{
    remark: string;
    reject: string;
}>({
    remark: '',
    reject: '',
});

const handleOk = (): void => {
    formRef.value.validate().then(() => {
        isLoading.value = true;
        emits('setFormState', formState.value);
    });
};

const onShowDialog = (val = false, data: string): void => {
    visible.value = val;
    isLoading.value = false;
    formState.value.remark = data;
};
const clearFormState = (): void => {
    formRef.value.resetFields();
    formState.value.reject = '';
    formState.value.remark = '';
};
defineExpose({ onShowDialog, clearFormState });
</script>

<template>
    <a-modal
        v-model:open="visible"
        title="驳回"
        :confirm-loading="isLoading"
        @ok="handleOk"
        @cancel="clearFormState"
    >
        <a-form ref="formRef" :model="formState" name="basic" :label-col="{ span: 6 }" autocomplete="off">
            <a-form-item label="渠道驳回原因">
                <a-textarea v-model:value="formState.remark" :disabled="true" :rows="4"/>
            </a-form-item>
            <a-form-item label="通知用户驳回原因" name="reject" :rules="[{ required: true, message: '请输入' }]">
                <a-textarea
                    v-model:value="formState.reject"
                    placeholder="请输入修改的原因，最多两百个字符"
                    :rows="4"
                    show-count
                    :maxlength="200"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped lang="scss"></style>
