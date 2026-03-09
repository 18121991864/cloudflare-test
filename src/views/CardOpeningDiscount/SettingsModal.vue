<template>
    <a-modal
        :visible="visible"
        :confirm-loading="isSubmitLoading"
        width="550px"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :after-close="formRef.resetFields"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-form
            ref="formRef"
            class="form-list"
            :label-col="{ span: 5 }"
            hide-required-mark
            :rules="formRules"
            :model="formState"
            style="margin-top: 20px"
        >
            <a-form-item v-if="props.type == 'add'" label="账号ID" name="accountId">
                <a-input v-model:value="formState.accountId" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="操作时间" class="mr-22 width-500" name="time">
                <DateRangePicker v-model="formState.time" @onChange="handleSearch" timeFormat="date" />
            </a-form-item>
            <a-form-item label="最小金额" name="minAmount">
                <a-input-number v-model:value="formState.minAmount" size="small" :placeholder="`请输入`" :min="0" />
            </a-form-item>
            <a-form-item label="最大金额" name="maxAmount">
                <a-input-number v-model:value="formState.maxAmount" size="small" :placeholder="`请输入`" :min="0" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType } from 'vue';
import { message } from 'ant-design-vue';

import api from '@/api/userAPI/userList';
const emit = defineEmits(['onClose', 'onSuccess']);
const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: { type: Object, default: () => Object.create({}) },
});
const FormParams = {
    accountId: '', // 账号id
    beginTime: '', // 开始时间
    endTime: '', // 结束时间
    maxAmount: '', // 最大金额
    minAmount: '', // 最小金额
    id: null,
    time: [],
};

const formState = ref({ ...FormParams });
const minAmountValidator = (rules: any, value: string) => {
    if (!value) return Promise.reject('请输入');
    // 最多只能输入两位小数正则表达式
    const reg = /^\d+(\.\d{0,2})?$/;
    if (!reg.test(String(value))) {
        return Promise.reject('最多只能输入两位小数');
    }
    if (Number(value) >= Number(formState.value.maxAmount)) {
        return Promise.reject('最小金额必须小于最大金额');
    }
    return Promise.resolve();
};
const maxAmountValidator = (rules: any, value: string) => {
    if (!value) return Promise.reject('请输入');
    // 最多只能输入两位小数正则表达式
    const reg = /^\d+(\.\d{0,2})?$/;
    if (!reg.test(String(value))) {
        return Promise.reject('最多只能输入两位小数');
    }
    if (Number(value) <= Number(formState.value.minAmount)) {
        return Promise.reject('最大金额必须大于最小金额');
    }
    return Promise.resolve();
};
const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    time: [{ required: true, trigger: 'blur', message: '请选择' }],
    maxAmount: [{ required: true, trigger: 'blur', validator: maxAmountValidator }],
    accountId: [{ required: true, trigger: 'blur', message: '请输入' }],
    minAmount: [{ required: true, trigger: 'blur', validator: minAmountValidator }],
}));
watch(
    () => [formState.value.maxAmount, formState.value.minAmount],
    ([maxAmount, minAmount]) => {
        if (maxAmount) {
            formRef.value.validateFields(['maxAmount']);
        }
        if (minAmount) {
            formRef.value.validateFields(['minAmount']);
        }
        if (maxAmount && minAmount) {
            formRef.value.validateFields(['maxAmount', 'minAmount']);
        }
    }
);
const title = computed(() => `${props.type === 'add' ? '添加' : '修改'}首次开卡减免-${props.activeData?.id || ''}`);

const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    const { time, ...par } = formState.value;
    const [beginTime, endTime] = time;
    isSubmitLoading.value = true;
    const { type } = props;
    const isApi = type === 'add' ? 'cardOpenFirstConfigAdd' : 'cardOpenFirstConfigUpdate';
    const isParams = type === 'add' ? { ...par, beginTime, endTime } : { ...par, beginTime, endTime };

    console.log(70, isApi, type, isParams);
    // @ts-ignore
    return api[isApi]({ ...isParams })
        .then(() => {
            emit('onClose');
            message.success('操作成功');
        })
        .finally(() => {
            isSubmitLoading.value = false;
        });
};

const formRef = ref<FormInstance>(Object.create(null));
const handelSubmit = async () => {
    // 提交
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
};

watch(
    () => props.visible,
    (n, o) => {
        // 用于填充modal数据
        formState.value = {
            ...props.activeData,
            time: [props.activeData.beginTime, props.activeData.endTime],
        };
    }
);
</script>
