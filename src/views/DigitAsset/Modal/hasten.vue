<script setup lang="ts">
import { message } from 'ant-design-vue';
import api from '@/api/asset/index';
import Commonwallet from '@/api/wallet/common/index';
import type { FormInstance } from 'ant-design-vue';
import type { addWalletCollectionData } from '@/api/wallet/collection/index.d';

type TypeWalletList = PromiseReturnType<typeof Commonwallet.getTypeWalletList>;
const chooseList = ref<TypeWalletList>([]);
const emits = defineEmits(['updateTable']);

const formRef = ref<FormInstance>();
const type = ref<'add' | 'edit'>('add');
const visible = ref(false);
const isLoading = ref(false);
const formState = ref({
    id: '',
    level: null,
});

const handleOk = (): void => {
    formRef.value?.validate().then(() => {
        isLoading.value = true;
        // @ts-ignore
        api.transactionQuicken(formState.value)
            .then(() => {
                message.success(`加速成功!`);
                emits('updateTable');
                onCancel();
            })
            .finally(() => {
                isLoading.value = false;
            });
    });
};

const onShowDialog = (show: boolean, id: string) => {
    visible.value = show;
    formState.value.id = id;
};
const onCancel = () => {
    visible.value = false;
    formRef.value?.resetFields();
};
defineExpose({ onShowDialog });
</script>

<template>
    <a-modal v-model:open="visible" :width="500" title="加速" :confirm-loading="isLoading" @ok="handleOk" @cancel="onCancel">
        <a-form ref="formRef" :model="formState" name="basic" layout="vertical" autocomplete="off">
            <a-form-item name="level" :rules="[{ required: true, message: '请输入' }]" class="flex justify-center">
                <template #label>
                    <div class="font-semibold text-neutral-950">请选择你为这笔交易付出的加速Gas费</div>
                </template>
                <a-radio-group v-model:value="formState.level" name="level" class="flex justify-center">
                    <a-radio :value="1">
                        <div>低</div>
                        <div class="tips-text">不建议</div>
                    </a-radio>
                    <a-radio :value="2">中</a-radio>
                    <a-radio :value="3">高 </a-radio>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped lang="scss">
:deep(.ant-radio-wrapper) {
    position: relative;
    .tips-text {
        position: absolute;
        left: 0;
        top: 25px;
        color: red;
        font-weight: 550;
    }
}
</style>
