<script setup lang="ts">
import { computed, reactive, ref, PropType } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { message } from 'ant-design-vue';

import api from '@/api/asset/index';

const FormParams = {
    orderNo: '', // 充值订单号
    surname: '', // 姓
    name: '', // 名
    amount: '', // 金额
    createTime: '', // 时间
    uid: '', // UID
    address: '', // 充值地址
};

const emits = defineEmits(['onClose', 'onSuccess']);
const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: {
        type: Object as PropType<PromiseReturnType<typeof api.fetchBargainList>['list']>,
        default: () => Object.create(null),
    },
});

const formRef = ref();
const spinning = ref<boolean>(false);
const isLoading = ref<boolean>(false); // 是否处于提交中
const formState = reactive({ ...FormParams });

const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    orderNo: [{ required: true, trigger: 'blur', message: '请输入' }],
}));

const handleInfo = () => {
    if (spinning.value || !formState.orderNo.trim()) return;
    spinning.value = true;
    api.fetchBargainSearch({ orderNo: formState.orderNo })
        .then((data: PromiseReturnType<typeof api.fetchBargainSearch>) => {
            if (data) {
                Object.entries(FormParams).forEach(([key]: any) => {
                    formState[key] = data[key];
                });
            }
        })
        .finally(() => {
            spinning.value = false;
        });
};

const handleAddOrUpdate = () => {
    if (isLoading.value) return;
    isLoading.value = true;
    const { orderNo } = formState;
    return api
        .fetchBargainMateCard({ id: props.activeData?.id, orderNo })
        .then(() => {
            emits('onClose');
            message.success('操作成功');
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const handelSubmit = async () => {
    // 提交
    if (!props.visible) return;
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emits('onSuccess')));
};
</script>

<template>
    <a-modal
        :open="visible"
        :confirm-loading="isLoading"
        cancel-text="取消"
        ok-text="重新匹配"
        :mask-closable="false"
        :cancel-button-props="{ disabled: isLoading }"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>重新匹配订单</template>
        <a-spin :spinning="spinning">
            <a-form ref="formRef" layout="horizontal" class="form-list" :hide-required-mark="true" :rules="formRules" :model="formState">
                <a-form-item name="orderNo" label="订单号">
                    <a-input
                        v-model:value="formState.orderNo"
                        size="small"
                        placeholder="鼠标离开输入框或点击回车健进行搜索"
                        @blur="handleInfo"
                        @pressEnter="handleInfo"
                    />
                </a-form-item>
                <a-form-item name="surname" label="姓">
                    <a-input size="small" :value="formState.surname" disabled />
                </a-form-item>
                <a-form-item name="name" label="名">
                    <a-input size="small" :value="formState.name" disabled />
                </a-form-item>
                <a-form-item name="uid" label="UID">
                    <a-input size="small" :value="formState.uid" disabled />
                </a-form-item>
                <a-form-item name="amount" label="金额">
                    <a-input size="small" :value="formState.amount" disabled />
                </a-form-item>
                <a-form-item name="createTime" label="充值时间">
                    <a-input size="small" :value="formState.createTime" disabled />
                </a-form-item>
                <a-form-item name="address" label="充值地址">
                    <a-input size="small" :value="formState.address" disabled />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>
