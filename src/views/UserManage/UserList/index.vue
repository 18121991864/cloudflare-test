<template>
    <div class="table-container">
        <config-index ref="configRef">
            <template #customDataIndex="{ data: { record } }">
                <span :class="[record.status === 1 ? 'text-green-500' : 'text-red-500']">{{
                    record.status === 1 ? t('common.Enable') : t('common.Disable')
                }}</span>
            </template>
            <template #operate="{ data: { record } }">
                <a-button type="link" @click="handleAudit(record)">{{ t('user.SetCategory') }}</a-button>
            </template>
        </config-index>
        <audit-modal v-model:visible="visible" :edit-data="editData" @onSuccess="configRef?.handelSubmit" />
    </div>
</template>

<script lang="ts" setup>
import queryConfig from './config/query-item';
import AuditModal from './components/AuditModal/index.vue';
import api from '@/newApi/user/index';
import { useI18n } from 'vue-i18n';
const configRef = ref<ComponentInstance['ConfigIndex']>();
const visible = ref(false);
const editData = ref<PromiseReturnType<typeof api.getAccountList>['list'][0]>();
const { t } = useI18n();
onActivated(() => {
    configRef.value?.SetConfigFrom(queryConfig.value);
});
const handleAudit = (record: PromiseReturnType<typeof api.getAccountList>['list'][0]) => {
    visible.value = true;
    editData.value = record;
};
</script>

<style lang="scss" scoped></style>
