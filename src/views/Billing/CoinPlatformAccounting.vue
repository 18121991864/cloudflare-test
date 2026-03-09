<template>
    <div class="table-container">
        <!-- <a-tabs v-model:activeKey="activeKey" centered>
            <a-tab-pane key="1" tab="币币平台账务"></a-tab-pane>
            <a-tab-pane key="2" tab="币币平台账务流水"></a-tab-pane>
        </a-tabs> -->
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="资金类型" class="mr-22 width-250">
                    <SCoin v-model="formState.coinId" :pure="false" placeholder="请选择资金类型" />
                </a-form-item>
                <!-- <a-form-item label="订单号" class="wrap-box">
          <a-input v-model:value="formState.orderNo" placeholder="请输入订单号" />
        </a-form-item> -->
            </div>
            <div class="wrap-box-item">
                <!-- <a-button
          block
          type="primary"
          size="small"
          class="search-submit-btn btn dowload-box"
          @click.stop="handExport"
        >
         导出
        </a-button> -->
                <div></div>
                <div class="wrap-block">
                    <a-button block type="primary" size="small" class="search-submit-btn btn" @click.stop="handleOnSubmit">
                        <template #icon><SearchOutlined /></template>搜索
                    </a-button>
                    <a-button class="search-reset-btn btn" @click="handelRest">
                        <template #icon><RedoOutlined /></template>
                        重置
                    </a-button>
                </div>
            </div>
        </a-form>
        <a-table :data-source="tableData" :columns="tableColumns" :pagination="false" :scroll="{ x: 1200 }">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'operate'">
                    <a-button type="link" @click="handelInfo(record)"> 详情 </a-button>
                </template>
                <template v-else>
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                            {{ text }}
                        </div>
                    </a-tooltip>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
        <info-modal ref="platRef" />
    </div>
</template>

<script lang="ts" setup>
import type { ComputedRef } from 'vue';
import { computed, ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { PagingDefaultConf } from '@/utils/constant';
import api from '@/api/asset/index';
import type { AssetFrozenListType, AssetFrozenParams, PlatformAssetListType, PlatformAssetParams } from '@/api/asset/types.d';

const pagination = reactive({ ...PagingDefaultConf });
pagination.pageSize = 20;
const recordId = ref('');
const activeKey = ref('1');
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: '账户ID', dataIndex: 'platformAccountId', width: 80 },
    { title: '资金类型', dataIndex: 'symbol', width: 120 },
    { title: '账户类型', dataIndex: 'accountType', width: 120 },
    { title: '可用数量', dataIndex: 'balance', width: 120 },
    { title: '冻结总数量', dataIndex: 'frozenBalanceTotal', width: 120 },
    // { title: '业务冻结数量', dataIndex: 'frozenBalance', width: 180 },
    // { title: '风控冻结数量', dataIndex: 'riskFrozenBalance', width: 180 },
    // { title: '手工冻结数量', dataIndex: 'manualFrozenBalance', width: 180 },
    { title: '账户hash', dataIndex: 'hash', width: 180 },
    { title: '账户创建时间', dataIndex: 'createTime', width: 180 },
    { title: '账户更新时间', dataIndex: 'updateTime', width: 180 },
    { title: 'version', dataIndex: 'version', width: 120 },
    { title: '操作', dataIndex: 'operate', fixed: 'right', width: 100 },
]);

const dataSource = reactive([]);
const operationTime = ref([]);
const formState = ref<PlatformAssetParams>({
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
});
const CopyformStates = { ...formState.value };
const tableData = ref(Object.create([]));
const platRef = ref();
const loading = ref(false);
const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    const { pageNo, pageSize } = pagination;
    api.fetchPlatformAssetList({
        ...formState.value,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchPlatformAssetList>) => {
            [tableData.value, pagination.total] = [list, totalSize];
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};
handleOnSubmit();
const closeAccountCheckList = [
    { id: '', title: '全部' },
    { id: 1, title: '待审核' },
    { id: 2, title: '审核通过' },
    { id: 3, title: '审核拒绝' },
];
const stateList = [
    { id: '', title: '全部' },
    { id: 1, title: '正常' },
    { id: 2, title: '冻结' },
    { id: 3, title: '注销' },
];
// const handleChange = () => {
//   if (operationTime.value && operationTime.value.length) {
//     formState.value.startTime = operationTime.value[0];
//     formState.value.endTime = operationTime.value[1];
//   } else {
//     formState.value.startTime = '';
//     formState.value.endTime = '';
//   }

//   handleOnSubmit();
// };
const handelRest = () => {
    formState.value = { ...CopyformStates };
    handleOnSubmit();
};
const loadExportExcel = ref(false);
const handExport = () => {
    if (loadExportExcel.value) return;
    const { pageNo, pageSize } = pagination;
    loadExportExcel.value = true;
    //   api
    //     .fetchexcelWriterExcel({
    //       ...formState.value,
    //       pageNo,
    //       pageSize,
    //     })
    //     .then((r: PromiseReturnType<typeof api.fetchexcelWriterExcel>) => {
    //       downloadExcel(r, i18n.global.t("开卡充值流水"));
    //     })
    //     .finally(() => {
    //       loadExportExcel.value = false;
    //     });
};
const handelInfo = (item: PlatformAssetListType) => {
    const infoDataInfo = [
        { label: '账户ID', value: 'platformAccountId' },
        { label: '资金类型', value: 'symbol' },
        { label: '账户类型', value: 'accountType' },
        { label: '可用数量', value: 'balance' },
        { label: '冻结总数量', value: 'frozenBalanceTotal' },
        { label: '质押借贷业务冻结数量', value: 'borrowFrozenBalance' },
        { label: '闪兑业务冻结数量', value: 'swapFrozenBalance' },
        { label: '提币业务冻结数量', value: 'frozenBalance' },
        { label: '风控冻结数量', value: 'riskFrozenBalance' },
        { label: '手工冻结数量', value: 'manualFrozenBalance' },
        { label: '汇款业务冻结数量', value: 'remitFrozenBalance' },
        { label: '账户hash', value: 'hash' },
        { label: '账户创建时间', value: 'createTime' },
        { label: '账户更新时间', value: 'updateTime' },
        { label: 'version', value: 'version' },
    ];
    platRef.value?.openModel(item, infoDataInfo);
};
</script>

<style lang="scss" scoped>
.wrap-box {
    width: 240px;
    margin-right: 40px;
}
:deep(.ant-picker-active-bar) {
    width: 0;
}
.wrap-box-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .dowload-box {
        width: 100px;
    }
}
.wrap-block {
    display: flex;
    margin-bottom: 20px;

    .btn {
        width: 100px;
        &.search-reset-btn {
            margin-left: 10px;
        }
    }
}
.btn-box {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 0 5px;
    .search-submit-btn {
        background-color: #2e91ff;
        border-color: #2e91ff;
    }
}
:deep(.ant-tabs-nav) {
    margin-bottom: 20px !important;
    &::before {
        border-bottom: 0 !important;
    }
}
</style>
