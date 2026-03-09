<script setup lang="ts">
import { message } from 'ant-design-vue';
import api from '@/api/wallet/site';
import Commonwallet from '@/api/wallet/common/index';
import type { FormInstance } from 'ant-design-vue';
import _ from 'lodash';

type TypeWalletList = PromiseReturnType<typeof Commonwallet.getTypeWalletList>;
const chooseList = ref<TypeWalletList>([]);
const emits = defineEmits(['updateTable']);

const formRef = ref<FormInstance>();
const type = ref<'add' | 'edit'>('add');
const visible = ref(false);
const isLoading = ref(false);
const formState = ref<{
    id: null | number;
    // walletType: null | number;
    name: string;
    ordName: string;
}>({
    id: null,
    // walletType: null,
    name: '',
    ordName: '',
});
const deepformState = ref(_.cloneDeep(formState.value));
const title = computed(() => {
    return type.value === 'add' ? '添加钱包' : '编辑名称';
});
const handleOk = (): void => {
    formRef.value?.validate().then(() => {
        isLoading.value = true;
        const feathApi = ['addSiteWallet', 'updateSiteWallet'][type.value === 'edit' ? 1 : 0];
        // @ts-ignore
        api[feathApi](formState.value)
            .then(() => {
                message.success(`${title.value}成功!`);
                emits('updateTable');
                onCancel();
            })
            .finally(() => {
                isLoading.value = false;
            });
    });
};

const onShowDialog = async (show: boolean, state: 'add' | 'edit' = 'add', data?: any) => {
    visible.value = show;
    type.value = state;
    // await getTypeWalletList();
    if (data) {
        Object.keys(formState.value).forEach((key) => {
            if (key === 'ordName') {
                return;
            }
            if (key === 'name') {
                formState.value.ordName = data[key];
                return;
            } 
            // @ts-ignore
            formState.value[key] = data[key];
        });
    }
};
const getTypeWalletList = async () => {
    const list = await Commonwallet.getTypeWalletList({ ignoreUe: false });
    chooseList.value = list;
};
const onCancel = () => {
    visible.value = false;
    formRef.value?.resetFields();
    formState.value = _.cloneDeep(deepformState.value);
};
defineExpose({ onShowDialog });
</script>

<template>
    <a-modal v-model:open="visible" :title="title" :confirm-loading="isLoading" @ok="handleOk" @cancel="onCancel">
        <a-form ref="formRef" :model="formState" name="basic" :label-col="{ span: 4 }" layout="vertical" autocomplete="off">
            <!-- <a-form-item label="钱包品牌" name="walletType" :rules="[{ required: true, message: '请选择' }]">
                <a-select v-model:value="formState.walletType" placeholder="请选择" :disabled="type === 'edit'">
                    <a-select-option v-for="item of chooseList" :key="item.code" :value="item.code">{{ item.name }} </a-select-option>
                </a-select>
            </a-form-item> -->
            <!-- 当前名称 -->
            <a-form-item label="当前名称" name="name">
                <a-input disabled v-model:value="formState.ordName" placeholder="请输入" />
            </a-form-item>
            <!-- 新名称 -->
            <a-form-item label="新名称" name="name" :rules="[{ required: true, message: '请输入' }]">
                <a-input v-model:value="formState.name" placeholder="请输入" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped lang="scss"></style>
