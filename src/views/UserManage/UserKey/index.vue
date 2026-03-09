<template>
    <div class="table-container">
        <config-index ref="configRef">
            <template #customDataIndex="{ data: { record,  column: { dataIndex }, } }">
                <template v-if="dataIndex === 'status'">
                    <span :class="[record.status === 1 ? 'text-green-500' : 'text-red-500']">{{
                        record.status === 1 ? t('common.Enable') : t('common.Disable')
                    }}</span>
                </template>
                <template v-if="dataIndex === 'errorMsg'">
                    <a-tooltip v-if="record.cancelReason">
                        <template #title>{{ record.cancelReason }}</template>
                        <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                            {{ record.cancelReason }}
                        </div>
                    </a-tooltip>
                    <div v-else>--</div>
                </template>
            </template>
            <template #operate="{ data: { record } }">
                <!-- 审核 -->
                <a-button type="link" @click="handleAudit(record, 'audit')" v-if="buttonPermissions('auditKey')&&record.auditStatus === 1">{{ t('user.Audit') }}</a-button>
                <!-- 查看 -->
                <!-- <a-button type="link" @click="handleAudit(record, 'view')" v-if="buttonPermissions('auditKey')&&record.auditStatus === 1">{{ t('user.Audit') }}</a-button> -->
            </template>
        </config-index>
        
        <audit-modal v-model:visible="visible" :edit-data="editData" :type="currentType" @onSuccess="handelSubmit" />
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import queryConfig from './config/query-item';
import AuditModal from './components/AuditModal/index.vue';
const configRef = ref<ComponentInstance['ConfigIndex']>();
import api from '@/newApi/user/index';

const { t } = useI18n();

const visible = ref(false);
const editData = ref<PromiseReturnType<typeof api.getAccountKeyList>['list'][0]>();

const handelSubmit = () => {
    configRef?.value?.handelSubmit();
};

onActivated(() => {
    configRef.value?.SetConfigFrom(queryConfig.value);
});

const currentType = ref<'audit' | 'view'>('audit');

const handleAudit = (record: PromiseReturnType<typeof api.getAccountKeyList>['list'][0], type: 'audit' | 'view') => {
    currentType.value = type;
    editData.value = record as any;
    visible.value = true;
};
</script>

<style lang="scss" scoped></style>
