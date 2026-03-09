<script setup lang="ts">
import { message } from 'ant-design-vue';
import { useRequest } from "vue-request";
import api from '@/api/address';

const emits = defineEmits(['updateTable']);

const open = ref(false);
const formRef = ref();
const formState = ref({
    replenishNum: '',
    coinId: '',
    agentId: '',
    chainId: '',
    agentName: '',
    minLimit: '',
});

const { data, loading, runAsync } = useRequest(() => api.agentReplenishSet(formState.value), { manual: true });

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
      { coinId,  agentId, chainId, agentName, minLimit, replenishNum }:
      { coinId: string; agentId: string; chainId: string; agentName: string; minLimit: string; replenishNum: string;
}): void => {
    formState.value = {
        coinId,
        agentId,
        chainId,
        agentName,
        minLimit,
        replenishNum,
    };
    open.value = val;
};

defineExpose({ onShowDialog });
</script>

<template>
    <a-modal v-model:open="open" title="自动补充设置" @ok="onOk" :confirm-loading="loading" @cancel="onCancel">
        <p>代理商名称： {{ formState.agentName }}</p>
        <a-form ref="formRef" :model="formState">
            <a-form-item label="当地址不足" name="minLimit" :rules="[{ message: '请输入地址数量', trigger: 'blur', required: true }]">
                <a-input-number placeholder="请输入当地址不足" :precision="0" v-model:value="formState.minLimit" :min="1" :max="100" />
            </a-form-item>
            <a-form-item label="补充数量" name="replenishNum" :rules="[{ message: '请输入补充数量', trigger: 'blur', required: true }]">
                <a-input-number placeholder="请输入补充数量" :precision="0" v-model:value="formState.replenishNum" :min="1" :max="100" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped lang="scss">

</style>
