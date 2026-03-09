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
        <a-form ref="formRef" class="form-list" :label-col="{ span: 4 }" hide-required-mark :rules="formRules" :model="formState">
            <a-form-item class="width-450 mr-20" name="reason" label="驳回原因">
                <a-input v-model:value="formState.reason" size="small" placeholder="请输入" />
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
    bachNo: '',
    reason: '',
};

export default defineComponent({
    emits: ['onClose', 'onSuccess'],
    props: {
        visible: { type: Boolean, required: true },
        type: { type: String as PropType<'openCard' | 'edit'>, required: true },
        activeData: { type: Object, default: () => Object.create(null) },
    },
    setup(props, { emit }) {
        const formState = reactive({ ...FormParams });

        const formRules = computed<Record<string, Rule[]>>(() => ({
            // 表单规则
            uri: [{ required: true, trigger: 'blur', message: '请上传' }],
            platform: [{ required: true, trigger: 'blur', message: '请选择' }],
            language: [{ required: true, trigger: 'blur', message: '请选择' }],
            state: [{ required: true, trigger: 'blur', message: '请选择' }],
        }));

        const title = computed(() => '填写驳回原因');

        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            if (isSubmitLoading.value) return;
            console.log(69, formState);
            isSubmitLoading.value = true;
            const { type } = props;
            const isApi = type === 'openCard' ? 'fetchCardCardBachCheck' : 'fetchCardCardBachCheck';
            const isParams = type === 'openCard' ? { ...formState, checkState: 2 } : { ...formState, checkState: 2 };

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
                if (n !== o && n) {
                    Object.entries(FormParams).forEach(([key]: any) => {
                        // @ts-ignore 回填填充formState数据
                        formState[key] = props.type === 'openCard' ? undefined : props.activeData[key];
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
