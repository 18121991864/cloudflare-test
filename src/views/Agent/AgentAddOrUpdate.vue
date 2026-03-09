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
            <a-form-item name="name" label="代理商名称">
                <a-input v-model:value="formState.name" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item name="state" label="状态">
                <a-radio-group v-model:value="formState.state" name="state">
                    <a-radio :value="1">启用</a-radio>
                    <a-radio :value="2">禁用</a-radio>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType } from 'vue';
import { message } from 'ant-design-vue';

import api from '@/api/agent/index';

const FormParams = {
    id: '',
    name: '', // 名称
    state: '', // 状态：1=启用,2=禁用
};

export default defineComponent({
    emits: ['onClose', 'onSuccess'],
    props: {
        visible: { type: Boolean, required: true },
        type: { type: String as PropType<'add' | 'edit'>, required: true },
        activeData: {
            type: Object as PropType<PromiseReturnType<typeof api.fetchAgentList>['list']>,
            default: () => Object.create(null),
        },
    },
    setup(props, { emit }) {
        const formState = reactive({ ...FormParams });

        const formRules = computed<Record<string, Rule[]>>(() => ({
            // 表单规则
            name: [{ required: true, trigger: 'blur', message: '请输入' }],
            state: [{ required: true, trigger: 'blur', message: '请选择' }],
        }));

        const title = computed(() => `${props.type === 'add' ? '新增' : '编辑'}代理商-${props.activeData?.id}`);

        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            if (isSubmitLoading.value) return;
            isSubmitLoading.value = true;
            // @ts-ignore
            return api
                .fetchUpdate({ id: props.activeData?.id, ...formState })
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
