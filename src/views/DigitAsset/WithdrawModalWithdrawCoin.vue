<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :after-close="formRef.resetFields"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 5 }" hide-required-mark :rules="formRules" :model="formState">
            <a-form-item label="地址" name="address">
                <a-input v-model:value="formState.address" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="金额" name="amount">
                <a-input-number v-model:value="formState.amount" :min="0" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="币种" name="coinId">
                <SCoin v-model="formState.coinId" :pure="true" />
            </a-form-item>
            <a-form-item v-if="formState.coinId" name="chainId" label="链">
                <SChain v-model="formState.chainId" :coin-id="formState.coinId" :pure="true" />
            </a-form-item>
            <a-form-item label="登录密码" name="loginPassword">
                <a-input v-model:value="formState.loginPassword" type="password" size="small" placeholder="请输入" />
                <!-- <template #prefix>
                  <img v-show="formState.loginPassword" class="icon-svg" src="../../assets/images/pass.svg">
                </template> -->
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType, onMounted } from 'vue';
import { message } from 'ant-design-vue';

import api from '@/api/asset/index';

const FormParams = {
    id: '',
    loginPassword: '',
    address: '',
    amount: '',
    chainId: '',
    coinId: '',
};

export default defineComponent({
    emits: ['onClose', 'onSuccess'],
    props: {
        visible: { type: Boolean, required: true },
        type: { type: String as PropType<'add' | 'edit'>, required: true },
        activeData: { type: Object, default: () => Object.create(null) },
    },
    setup(props, { emit }) {
        const formState = reactive({ ...FormParams });

        const formRules = computed<Record<string, Rule[]>>(() => ({
            // 表单规则
            loginPassword: [{ required: true, trigger: 'blur', message: '请输入' }],
            amount: [{ required: true, trigger: 'blur', message: '请输入' }],
            address: [{ required: true, trigger: 'blur', message: '请输入' }],
            chainId: [{ required: true, trigger: 'blur', message: '请选择' }],
            coinId: [{ required: true, trigger: 'blur', message: '请选择' }],
        }));

        const title = computed(() => '申请提币');

        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            if (isSubmitLoading.value) return;
            isSubmitLoading.value = true;

            return api
                .fetchTransactionWithdrawCoin({ ...formState })
                .then(() => {
                    emit('onClose');
                    emit('onSuccess');
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

        onMounted(() => {
            Object.entries(FormParams).forEach(([key]: any) => {
                console.log(props.activeData, props.type);
                // @ts-ignore 回填填充formState数据
                formState[key] = props.activeData[key];
            });
        });
        return {
            title,
            formRef,
            formState,
            isSubmitLoading,
            formRules,

            handelSubmit,
        };
    },
});
</script>
