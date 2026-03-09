<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        cancel-text="取消"
        ok-text="重新匹配"
        :mask-closable="false"
        :after-close="formRef.resetFields"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>重新匹配订单</template>
        <a-spin :spinning="spinning">
            <a-form ref="formRef" layout="horizontal" class="form-list" hide-required-mark :rules="formRules" :model="formState">
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
<script lang="ts">
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType } from 'vue';
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

export default defineComponent({
    emits: ['onClose', 'onSuccess'],
    props: {
        visible: { type: Boolean, required: true },
        type: { type: String as PropType<'add' | 'edit'>, required: true },
        activeData: {
            type: Object as PropType<PromiseReturnType<typeof api.fetchBargainList>['list']>,
            default: () => Object.create(null),
        },
    },
    setup(props, { emit }) {
        const formState = reactive({ ...FormParams });

        const formRules = computed<Record<string, Rule[]>>(() => ({
            // 表单规则
            orderNo: [{ required: true, trigger: 'blur', message: '请输入' }],
        }));

        const spinning = ref<boolean>(false);
        const handleInfo = () => {
            if (spinning.value || !formState.orderNo.trim()) return;
            spinning.value = true;
            api.fetchBargainSearch({ orderNo: formState.orderNo })
                .then((data: PromiseReturnType<typeof api.fetchBargainSearch>) => {
                    if (data) {
                        Object.entries(FormParams).forEach(([key]: any) => {
                            // @ts-ignore 回填填充formState数据
                            formState[key] = data[key];
                        });
                    }
                })
                .finally(() => {
                    spinning.value = false;
                });
        };

        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            if (isSubmitLoading.value) return;
            isSubmitLoading.value = true;
            const { orderNo } = formState;
            // @ts-ignore
            return api
                .fetchBargainMateCard({ id: props.activeData?.id, orderNo })
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
            if (!props.visible) return;
            formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
        };

        return {
            formRef,
            formState,
            isSubmitLoading,
            formRules,

            handleInfo,

            handelSubmit,
            spinning,
        };
    },
});
</script>
