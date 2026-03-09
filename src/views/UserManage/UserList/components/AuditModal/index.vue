<template>
    <a-modal
        :open="visible"
        :title="t('user.SetCategory')"
        :mask-closable="false"
        :footer="null"
        width="600px"
        @cancel="handleCancel"
    >
        <a-form ref="formRef" :model="formState" :rules="rules">
            <a-form-item :label="t('user.Category')" name="category">
                <a-radio-group v-model:value="formState.category">
                    <a-radio :value="1">{{ t('user.OrdinaryUser') }}</a-radio>
                    <a-radio :value="2">{{ t('user.PayingUser') }}</a-radio>
                </a-radio-group>
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 16 }" class="mt-10 mb-0">
                <div class="flex">
                    <a-button @click="handleCancel" class="mr-2">{{ t('cancel') }}</a-button>
                    <a-button type="primary" :loading="loading" @click="handelSubmit">{{ t('confirm') }}</a-button>
                </div>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts" setup>
import api from '@/newApi/user/index';
import { FormInstance } from 'ant-design-vue/es';
import { useI18n } from 'vue-i18n';
const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData: PromiseReturnType<typeof api.getAccountList>['list'][0];
    }>(),
    {
        visible: false,
        editData: () => Object.create(null),
    }
);
const emit = defineEmits(['update:visible', 'onSuccess']);
const { t } = useI18n();
const formState = ref({
    category: '',
});
const rules = {
    category: [{ required: true, message: t('common.PleaseSelect'), trigger: ['blur', 'change'] }],
};
const formRef = ref<FormInstance>();
const handleCancel = () => {
    emit('update:visible', false);
};
const loading = ref<boolean>(false);

watch(()=>props.visible, () => {
    formState.value.category = props.editData.category
})

const handelSubmit = async () => {
    loading.value = true;
    await formRef.value?.validate();

    api.categoryUpdate({
        ...formState.value,
        id: props.editData.id,
    })
        .then(() => {
            emit('onSuccess');
            handleCancel();
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
