<template>
    <a-modal :open="visible" :width="800" :title="t('user.Audit')" :mask-closable="false" :footer="null" @cancel="handleCancel">
        <a-form ref="formRef" :model="formState" :rules="rules">
            <a-form-item :label="t('user.AuditResult')" name="state">
                <a-radio-group v-model:value="formState.state">
                    <a-radio :value="1">{{ t('user.pass') }}</a-radio>
                    <a-radio :value="2">{{ t('user.reject') }}</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item v-if="formState.state == 1" :label="t('policy.GridTradeStatus')" :name="['gridTradeStatus']">
                <a-switch
                    v-model:checked="formState.gridTradeStatus"
                    :checked-children="t('common.Enable')"
                    :un-checked-children="t('common.Disable')"
                    :checked-value="1"
                    :un-checked-value="2"
                />
            </a-form-item>
            <a-form-item v-if="formState.state == 1" :label="t('policy.MutualTrafficStatus')" :name="['mutualTradeStatus']">
                <a-switch
                    v-model:checked="formState.mutualTradeStatus" 
                    :checked-children="t('common.Enable')" 
                    :un-checked-children="t('common.Disable')" 
                    :checked-value="1" 
                    :un-checked-value="2" 
                    disabled
                />
            </a-form-item>
            <!-- <div v-if="strategyVersionList && strategyVersionList.length > 0">
                <a-table v-if="formState.strategyVersionList.length > 0" :dataSource="formState.strategyVersionList" :pagination="false" bordered>
                    <a-table-column :title="t('policy.CurrencyPairName')" dataIndex="name" />
                    <a-table-column :title="t('policy.StrategyName')" align="center">
                        <template #default="{ record, index }">
                            {{ strategyVersionList[index]?.name }}
                        </template>
                    </a-table-column>
                    <a-table-column :title="t('policy.VersionName')" align="center">
                        <template #default="{ record, index }">
                            <a-form-item 
                                :name="['strategyVersionList', index, 'strategyVersionId']"
                                :rules="{
                                    required: true,
                                    message: t('user.PleaseSelectStrategyVersion'),
                                }"
                                class="mb-0"
                            >
                                <a-select
                                    v-model:value="record.strategyVersionId"
                                    :options="strategyVersionList[index].versionList"
                                    :field-names="{ label: 'versionName', value: 'id' }"
                                    :placeholder="t('user.PleaseSelectStrategyVersion')"
                                    style="width: 100%"
                                />
                            </a-form-item>
                            <a-form-item v-show="false" :name="['strategyVersionList', index, 'strategyId']">
                                <a-input v-model:value="record.strategyId" disabled />
                            </a-form-item>
                        </template>
                    </a-table-column>
                </a-table>
            </div> -->
            <a-form-item :label="t('user.Remark')" name="remark" class="mt-4">
                <a-textarea v-model:value="formState.remark" :placeholder="t('user.PleaseEnterTheRemark')" />
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
import policyApi from '@/newApi/policy';
import { FormInstance, message } from 'ant-design-vue/es';
import { useI18n } from 'vue-i18n';
import { useRequest } from 'vue-request';


const props = withDefaults(
    defineProps<{
        visible: boolean;
        editData: PromiseReturnType<typeof api.getAccountKeyList>['list'][0];
        type: 'audit' | 'view';
    }>(),
    {
        visible: false,
        editData: () => Object.create(null),
        type: 'view',
    }
);
const emit = defineEmits(['update:visible', 'onSuccess']);
const { t } = useI18n();

const { data: strategyVersionList, run } = useRequest(() => {
    return policyApi.getStrategyVersionList({ accountId: props.editData.accountId })
}, {
    manual: true,
});

watch(() => props.visible, (newVal) => {
    if (newVal) {
        formState.value.state = '';
        formState.value.remark = '';
        formState.value.gridTradeStatus = 2;
        formState.value.mutualTradeStatus = props.editData.mutualState || 2;
        // run();
    }
});
// const strategyVersionList: { id: string; name: string; versionList: { id: string; versionName: string }[] }[] = [
//     {
//         "id": "1",
//         "name": "1",
//         "versionList": [
//             {
//                 "id": "11",
//                 "versionName": "versionName11"
//             }
//         ]
//     },
//     {
//         "id": "2",
//         "name": "2",
//         "versionList": [
//             {
//                 "id": "22",
//                 "versionName": "versionName22"
//             }
//         ]
//     },
// ]


const formState = ref({
    state: '',
    // strategyVersionList: [] as { strategyId: string; strategyVersionId: string | undefined; name: string; gridTradeStatus: boolean }[],
    remark: '',
    gridTradeStatus: 2,
    mutualTradeStatus: 2,
});

// watch(() => ([formState.value.state, strategyVersionList.value]), () => {
//     if (formState.value.state == '1') {
//         formState.value.strategyVersionList = strategyVersionList.value?.map((item) => ({
//             strategyId: item.id,
//             strategyVersionId: item.strategyVersionId,   
//             name: item.name,
//             // gridTradeStatus: item.gridTradeStatus,
//             // isGridTrade: item.isGridTrade,
//         })) as any;
//     } else {
//         formState.value.strategyVersionList = [] as any;
//     }
// });

const rules = {
    state: [{ required: true, message: t('user.PleaseSelectAuditStatus'), trigger: ['blur', 'change'] }],
    remark: [{ required: true, message: t('user.PleaseEnterTheRemark'), trigger: ['blur', 'change'] }],
};
const formRef = ref<FormInstance>();
const handleCancel = () => {
    emit('update:visible', false);
};
const loading = ref<boolean>(false);
const handelSubmit = async () => {
    await formRef.value?.validate();
    loading.value = true;

    api.updateKeyAuditState({
        ...formState.value,
        id: props.editData.id,
    } as any)
        .then(() => {
            message.success(t('user.AuditSuccess'));
            handleCancel();
            emit('onSuccess');
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
