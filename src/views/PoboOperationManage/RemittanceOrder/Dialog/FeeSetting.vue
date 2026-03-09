<script setup lang="ts">
import { createVNode, ref } from 'vue';
import { message, Modal } from 'ant-design-vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import api from '@/api/poboAPI/poboRemit';

const emits = defineEmits(['updateTable']);

const formRef = ref();
const visible = ref(false);
const isLoading = ref(false);
const feeState = ref<PromiseReturnType<typeof api.getFee>>(Object.create(null));

const handleOk = (): void => {
    formRef.value.validate().then(() => {
        if (Number(feeState.value.floatRate) > 10) {
            Modal.confirm({
                title: '确认?',
                icon: createVNode(ExclamationCircleOutlined),
                content: '请确认是否保存当前实时汇率调整设置的输入。此输入超出了正常汇率变动区间的万分之一至百分之十范围。',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    onSubmit();
                },
            });
        } else {
            onSubmit();
        }
    });
};

const onSubmit = (): void => {
    isLoading.value = true;
    const { orderProfit, floatRate } = feeState.value;
    api.setFeeProfit({ orderProfit: String(orderProfit), floatRate })
        .then(() => {
            message.success('操作成功!');
            emits('updateTable');
            visible.value = false;
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const fetchFeeState = (): void => {
    // 获取手续费数据
    api.getFee().then((r) => {
        feeState.value = r;
        feeState.value.fee = r.orderProfit + r.orderCost;
    });
};

const onSetOrder = (): void => {
    feeState.value.fee = Number(feeState.value.orderProfit) + Number(feeState.value.orderCost);
};

const onShowDialog = (val = false): void => {
    visible.value = val;
    fetchFeeState();
};

defineExpose({ onShowDialog });
</script>

<template>
    <a-modal v-model:open="visible" title="手续费设置" :confirm-loading="isLoading" @ok="handleOk">
        <a-form ref="formRef" :model="feeState" name="basic" :label-col="{ span: 5 }" autocomplete="off">
            <a-form-item label="订单成本">
                <a-input v-model:value="feeState.orderCost" disabled>
                    <template #suffix>USD</template>
                </a-input>
            </a-form-item>
            <a-form-item label="订单盈利" name="orderProfit" :rules="[{ required: true, message: '请输入' }]">
                <a-input-number
                    v-model:value="feeState.orderProfit"
                    :min="0"
                    :max="100"
                    :step="0.01"
                    :precision="2"
                    :controls="false"
                    @blur="onSetOrder"
                >
                    <template #addonAfter>%</template>
                </a-input-number>
            </a-form-item>
            <a-form-item label="实时汇率调整" name="floatRate">
                <a-input-number v-model:value="feeState.floatRate" :precision="2" :controls="false" :min="0.01">
                    <template #addonAfter>%</template>
                </a-input-number>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<style scoped lang="scss"></style>
