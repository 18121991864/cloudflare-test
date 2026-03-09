<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import api from '@/api/poboAPI/poboPayeeAccount';

const emits = defineEmits(['updateTable']);

const formRef = ref();
const curId = ref(0);
const visible = ref(false);
const isLoading = ref(false);
const formState = ref<{
    state: null | number;
    remark: string;
}>({
    state: null,
    remark: '',
});

const stateArr = [
    { label: '审核中', value: 1 },
    { label: '内部驳回', value: 2 },
    { label: '渠道审核', value: 3 },
];

const handleOk = (): void => {
    formRef.value.validate().then(() => {
        isLoading.value = true;
        const { state, remark } = formState.value;
        api.updateState({ id: curId.value, stateAudit: state, remark })
            .then(() => {
                message.success('操作成功!');
                emits('updateTable');
                visible.value = false;
            })
            .finally(() => {
                isLoading.value = false;
            });
    });
};

const onShowDialog = (val = false, data: { id: number; state: number }): void => {
    formState.value = Object.create(null);
    visible.value = val;
    curId.value = data.id;
};

defineExpose({ onShowDialog });
</script>

<template>
    <a-modal v-model:open="visible" title="修改状态" :confirm-loading="isLoading" @ok="handleOk">
        <a-form ref="formRef" :model="formState" name="basic" :label-col="{ span: 4 }" autocomplete="off">
            <a-form-item label="状态" name="state" :rules="[{ required: true, message: '请选择' }]">
                <a-select v-model:value="formState.state" placeholder="请选择">
                    <a-select-option v-for="item of stateArr" :key="item.value" :value="item.value">{{ item.label }} </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="备注" name="remark" :rules="[{ required: true, message: '请输入' }]">
                <a-textarea v-model:value="formState.remark" maxlength="50" placeholder="请输入" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped lang="scss"></style>
