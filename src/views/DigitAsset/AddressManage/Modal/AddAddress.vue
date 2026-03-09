<script setup lang="ts">
import { message } from 'ant-design-vue';
import { useRequest } from "vue-request";
import api from '@/api/address';

const emits = defineEmits(['updateTable']);

const open = ref(false);
const formRef = ref();
const formState = ref({
    num: '',
    coinId: '',
    agentId: '',
    chainId: '',
    agentName: '',
    remainingNum: ''
});

const { data, loading, runAsync } = useRequest(() => api.fetchAddressCreate(formState.value), { manual: true });

const onOk = async () => {
    await formRef.value.validate();
    await runAsync();
    onCancel();
    emits('updateTable');
    message.success('操作成功');
};

const onCancel = (): void => {
    formRef.value.resetFields();
    open.value = false;
};

const onShowDialog = (val: boolean,
      { coinId,  agentId, chainId, agentName, remainingNum }:
      { coinId: string; agentId: string; chainId: string; agentName: string; remainingNum: string
}): void => {
    formState.value = {
        num: '',
        coinId,
        agentId,
        chainId,
        agentName,
        remainingNum,
    };
    open.value = val;
};

defineExpose({ onShowDialog });
</script>

<template>
    <a-modal v-model:open="open" title="补充UE地址" @ok="onOk" :confirm-loading="loading" @cancel="onCancel">
        <a-form ref="formRef" :model="formState">
            <a-form-item label="补充数量" name="num" :rules="[{ message: '请输入补充数量', trigger: 'blur', required: true }]">
                <a-input-number placeholder="请输入补充数量" :precision="0" v-model:value="formState.num" :min="1" :max="1000" />
            </a-form-item>
            <p>代理商名称： {{ formState.agentName }}</p>
            <p>代理商剩余数量： {{ formState.remainingNum }}</p>
        </a-form>
    </a-modal>
</template>

<style scoped lang="scss">

</style>
