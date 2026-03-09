<template>
    <a-modal :open="visible" :title="t('common.EditVersion')" :mask-closable="false" :footer="null" width="600px" @cancel="handleCancel">
        <a-form ref="formRef" :model="formState" :rules="rules">
                <a-form-item
                    :label="t('policy.VersionName')"
                    :name="['strategyVersionId']"
                    :rules="{
                        required: true,
                        message: t('user.PleaseSelectStrategyVersion'),
                    }"
                >
                    <a-select
                        v-model:value="formState.strategyVersionId"
                        :options="data?.list?.map((item: any) => ({ label: item.versionName, value: item.id }))"
                        :placeholder="t('user.PleaseSelectStrategyVersion')"
                    />
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
import apiPolicy from '@/newApi/policy';
import { FormInstance, message } from 'ant-design-vue/es';
import { useI18n } from 'vue-i18n';
import { useRequest } from 'vue-request';


const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData: PromiseReturnType<typeof apiPolicy.getStrategyAccountPage>['list'][0];
    }>(),
    {
        visible: false,
        editData: () => Object.create(null),
    }
);
const emit = defineEmits(['update:visible', 'onSuccess']);
const { t } = useI18n();

const { data, run } = useRequest(() => {
    return apiPolicy.getStrategyVersionPage({ strategyId: props.editData.strategyId, pageNo: 1, pageSize: 1000 })
}, {
    manual: true,
});


const formState = ref({
    strategyVersionId: '',
});

watch(() => props.visible, (newVal) => {
    if (newVal) {
        run();
        formState.value.strategyVersionId = props.editData.versionId;
    } else {
        formState.value.strategyVersionId = ''; 
    }
});

const rules = {
};

const formRef = ref<FormInstance>();
const handleCancel = () => {
    emit('update:visible', false);
};
const loading = ref<boolean>(false);
const handelSubmit = async () => {
    await formRef.value?.validate();
    loading.value = true;

    apiPolicy.updateAccountVersion({
        ...formState.value,
        id: props.editData.id,
    } as any)
        .then(() => {
            message.success(t('common.EditVersionSuccess'));
            handleCancel();
            emit('onSuccess');
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>

