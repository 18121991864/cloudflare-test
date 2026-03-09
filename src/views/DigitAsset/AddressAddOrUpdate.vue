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
            <a-form-item name="coinId" label="币种">
                <SCoin v-model="formState.coinId" :pure="true" />
            </a-form-item>
            <a-form-item v-if="formState.coinId" name="chainId" label="链">
                <SChain v-model="formState.chainId" :coin-id="formState.coinId" :pure="true" />
            </a-form-item>
            <a-form-item name="agentId" label="代理商ID">
                <SAgentChoose v-model="formState.agentId" :pure="true" />
            </a-form-item>
            <a-form-item name="num" label="数量">
                <a-input-number v-model:value="formState.num" size="small" placeholder="数量" :min="0" />
            </a-form-item>
            <!--<a-form-item name="address" label="平台地址">
              <a-input size="small" v-model:value="formState.address" placeholder="平台地址"/>
            </a-form-item>-->
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType } from 'vue';
import { message } from 'ant-design-vue';

import api from '@/api/asset/index';

const FormParams = {
    agentId: '', // 代理商ID
    coinId: '', // 币种id
    chainId: '', // 币种id
    // address: '', // 平台地址
    num: '', // 数量
};

export default defineComponent({
    emits: ['onClose', 'onSuccess'],
    props: {
        visible: { type: Boolean, required: true },
        type: { type: String as PropType<'add' | 'edit'>, required: true },
        activeData: {
            type: Object as PropType<PromiseReturnType<typeof api.fetchAddressList>['list']>,
            default: () => Object.create(null),
        },
    },
    setup(props, { emit }) {
        const formState = reactive({ ...FormParams });

        const formRules = computed<Record<string, Rule[]>>(() => ({
            // 表单规则
            num: [{ required: true, trigger: 'blur', message: '请输入' }],
            // address: [{ required: true, trigger: 'blur', message: '请输入' }],
            agentId: [{ required: true, trigger: 'blur', message: '请选择' }],
            coinId: [{ required: true, trigger: 'blur', message: '请选择' }],
            chainId: [{ required: true, trigger: 'blur', message: '请选择' }],
        }));

        const title = computed(() => `${props.type === 'add' ? '新增' : '编辑'}UE地址${props.type === 'add' ? '' : `-${props.activeData?.id}`}`);

        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            if (isSubmitLoading.value) return;
            isSubmitLoading.value = true;
            // @ts-ignore
            return api
                .fetchAddressCreate({ ...formState })
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

        watch(
            () => props.visible,
            (n, o) => {
                // 用于填充modal数据
                if (n !== o && n) {
                    Object.entries(FormParams).forEach(([key]: any) => {
                        // @ts-ignore 回填填充formState数据
                        formState[key] = props.type === 'add' ? undefined : props.activeData[key];
                    });
                }
            }
        );

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
