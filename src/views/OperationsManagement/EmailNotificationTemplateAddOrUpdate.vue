<template>
    <a-modal
        style="width: 920px"
        :open="visible"
        :confirm-loading="isSubmitLoading"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        @cancel="handelCancel"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-spin :spinning="spinning">
            <a-form
                ref="formRef"
                class="form-list"
                :label-col="{ span: 2 }"
                hide-required-mark
                :rules="formRules"
                :model="formState"
            >
                <a-form-item label="业务类型" name="businessType">
                    <SBusiness v-model="formState.businessType"/>
                </a-form-item>
                <a-form-item name="type" label="通知类型">
                    <a-select v-model:value="formState.type" placeholder="请选择">
                        <a-select-option label="短信通知" :value="1">短信通知</a-select-option>
                        <a-select-option label="邮件通知" :value="2">邮件通知</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item name="language" label="语言">
                    <a-select v-model:value="formState.language" placeholder="请选择">
                        <a-select-option label="简体中文" value="zh-CN">简体中文</a-select-option>
                        <a-select-option label="英文" value="en-US">英文</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item name="title" label="通知标题">
                    <a-textarea
                        v-model:value="formState.title"
                        placeholder="备注最多100字"
                        maxlength="100"
                        show-count
                        :rows="4"
                    />
                </a-form-item>
                <a-form-item name="state" label="状态">
                    <a-radio-group v-model:value="formState.state" name="state">
                        <a-radio :value="1">启用</a-radio>
                        <a-radio :value="2">禁用</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item v-if="visible && formState.type == 2" class="mr-20" name="info1" label="通知内容">
                    <!-- <TinymceEditor hasId="s-ditch-card" v-model="formState.info" /> -->
                    <wang-editor
                        v-model:valueHtml="formState.info"
                        v-model:valueText="formState.info1"
                        @update:valueText="($event, flag) => handelText(flag)"
                    />
                </a-form-item>
                <a-form-item v-else class="mr-20" name="info" label="通知内容">
                    <a-textarea v-model:value="formState.info" placeholder="请输入通知内容" show-count :rows="4"/>
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType, onBeforeMount } from 'vue';
import { message } from 'ant-design-vue';
import api from '../../api/channel';
import wangEditor from '@/components/wangEditor.vue';
import { useWangEdit, isItialization } from '@/hooks/wangEdit';

const formState = ref(Object.create(null));
const copyformState = JSON.parse(JSON.stringify(formState.value));
const emit = defineEmits(['onClose', 'onSuccess']);
const props = defineProps({
    visible: { type: Boolean, required: true },
    type: { type: String as PropType<'add' | 'edit'>, required: true },
    activeData: { type: Object as any, default: () => Object.create(null) },
});
const spinning = ref(false);
const formRules = computed<Record<string, Rule[]>>(() => ({
    // 表单规则
    info1: [{ required: true, trigger: 'change', message: '请输入' }],
    info: [{ required: true, trigger: 'change', message: '请输入' }],
    title: [{ required: true, trigger: 'blur', message: '请输入' }],
    language: [{ required: true, trigger: 'blur', message: '请选择' }],
    state: [{ required: true, trigger: 'change', message: '请选择' }],
}));

const title = computed(() => `${props.type === 'add' ? '新增' : '编辑'}模板`);

const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    isSubmitLoading.value = true;
    const { ...params } = formState.value;
    const isApi = props.type === 'add' ? 'fetchMgTemplateAdd' : 'fetchMsgTemplateUpdate';
    // @ts-ignore
    return api[isApi]({ id: props.type === 'add' ? undefined : props.activeData?.id, ...params })
        .then(() => {
            message.success('操作成功');
            isSubmitLoading.value = false;

            handelCancel();
        })
        .finally(() => {
            isSubmitLoading.value = false;
        });
};
watch(
    () => props.visible,
    (visible) => {
        if (props.type === 'edit' && visible) {
            spinning.value = true;
            api.fetchMsgTemplateInfo({ id: props.activeData.id }).then((e: any) => {
                Object.entries(e).forEach(([key]: any) => {
                    // @ts-ignore 回填填充formState数据
                    formState.value[key] = props.activeData[key];
                });
                spinning.value = false;
            });
            console.log(formState.value);
        }
    }
);

const formRef = ref<FormInstance>(Object.create(null));
const handelSubmit = async () => {
    // 提交
    if (!props.visible) return;
    formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
};
const handelCancel = () => {
    formRef.value.resetFields();
    emit('onClose');
    formState.value = JSON.parse(JSON.stringify(copyformState));
    isItialization.value = false;
};
const handelText = (flag: boolean) => {
    isItialization.value = flag;
    useWangEdit(formState, 'info1', formRef);
};
</script>
