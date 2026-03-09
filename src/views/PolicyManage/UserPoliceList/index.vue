<template>
    <div class="table-container">
        <config-index ref="configRef">
            <template
                #customDataIndex="{
                    data: {
                        record,
                        column: { dataIndex },
                    },
                }"
            >
                <span v-if="dataIndex === 'gridTradeStatus'">{{ record.gridTradeStatus == '1' ? t('common.Enable') : t('common.Disable') }}</span>
            </template>
            <template #operate="{ data: { record } }">
                <!-- 编辑版本 -->
                <a-button v-if="buttonPermissions('editVersion')" @click="handleAudit(record)" type="link" >{{ t('common.EditVersion') }}</a-button>
                <!-- 开启/关闭网格交易 v-if="buttonPermissions('openCloseGridTrade')"  -->
                <a-button v-if="record.isEditGridTrade==1&&record.isGridTrade == 1&&buttonPermissions('isGridTrade')" @click="handleOpenCloseGridTrade(record)" type="link" >{{ record.gridTradeStatus == '1' ? t('common.CloseGridTrade') : t('common.OpenGridTrade') }}</a-button>
                <!-- 开启/关闭对刷刷量  -->
                <a-button v-if="record.isEditMutualTrade==1&&record.isMutualTrade == 1" @click="handleOpenCloseMutualTrade(record)" type="link" >{{ record.mutualTradeStatus == '1' ? t('common.CloseMutualTraffic') : t('common.OpenMutualTraffic') }}</a-button>
            </template>
        </config-index>
        <audit-modal v-model:visible="visible" :edit-data="editData" @onSuccess="handelSubmit" />
    </div>
</template>

<script lang="ts" setup>
import { ConstructionFrom } from '@/config-overall/interface';
import AuditModal from './components/AuditModal/index.vue';
import queryConfig from './config/query-item';
const configRef = ref<ComponentInstance['ConfigIndex']>();
const configQuery = ref<ConstructionFrom>();
import api from '@/newApi/policy';
import { message } from 'ant-design-vue';

const { t } = useI18n();

const visible = ref(false);
const editData = ref<PromiseReturnType<typeof api.getStrategyAccountPage>['list'][0]>();
const handelSubmit = () => {
    configRef.value?.handelSubmit();
};

onActivated(() => {
    configQuery.value = queryConfig().value as ConstructionFrom;
    configRef.value?.SetConfigFrom(configQuery.value);
});

// 网格交易
const handleOpenCloseGridTrade = (record: PromiseReturnType<typeof api.getStrategyAccountPage>['list'][0]) => {
    api.updateGridStatus({ accountStrategyId: record.id, status: record.gridTradeStatus == '1' ? '2' : '1' }).then((res) => {
        message.success(t('common.UpdateSuccess'));
        configRef.value?.handelSubmit();
    });
};

// 对刷刷量
const handleOpenCloseMutualTrade = (record: PromiseReturnType<typeof api.getStrategyAccountPage>['list'][0]) => {
    api.updateMutualStatus({ accountStrategyId: record.id, status: record.mutualTradeStatus == '1' ? '2' : '1' }).then((res) => {
        message.success(t('common.UpdateSuccess'));
        configRef.value?.handelSubmit();
    });
};


const handleAudit = (record: PromiseReturnType<typeof api.getStrategyAccountPage>['list'][0]) => {
    console.log('record', record)
    editData.value = record;
    visible.value = true;
};
</script>

<style lang="scss" scoped></style>
