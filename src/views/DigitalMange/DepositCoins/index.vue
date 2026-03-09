<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="用户UID" class="mr-22 width-250" name="accountNo">
                    <a-input v-model:value="formState.accountNo" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option :value="item.value" v-for="item in depositStateSelect" :key="item.value">{{ item.label }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="代理商ID" class="mr-22 width-250" name="agentId">
                    <a-input v-model:value="formState.agentId" size="small" placeholder="请输入" />
                </a-form-item>

                <a-form-item label="链ID" class="mr-22 width-250" name="chainId">
                    <SChain v-model="formState.chainId" :status="1" />
                </a-form-item>
                <a-form-item label="风控等级" class="mr-22 width-250" name="amlLevel">
                    <a-select v-model:value="formState.amlLevel" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="item.value" v-for="item in depositRiskLevelSelect" :key="item.value">{{
                            item.label
                        }}</a-select-option>
                    </a-select>
                </a-form-item>
            </div>

            <FormQuery @handleSearch="handleSearch" @handleResetForm="handleResetForm" />
        </a-form>

        <a-table
            class="margin-top-10"
            size="small"
            :pagination="false"
            :loading="loading"
            :columns="tableColumns"
            :row-key="
                ({ id }) => {
                    return id;
                }
            "
            :data-source="tableData"
            :scroll="{ x: 2300 }"
        >
            <template #bodyCell="{ column: { dataIndex }, record, record: { amlLevelName, stateName } }">
                <template v-if="['amlLevel'].includes(dataIndex)">
                    <div :class="['text-color-green', 'text-yellow-600', 'text-yellow-600', 'text-color-red', 'text-color-red'][record.amlLevel - 1]">
                        {{ amlLevelName }}
                    </div>
                </template>
                <template v-else-if="['state'].includes(dataIndex)">
                    <div :class="['text-color-green', 'text-yellow-600', 'text-yellow-600', 'text-color-red'][record.state - 1]">
                        {{ stateName }}
                    </div>
                </template>
                <template v-else-if="['withdrawStateName'].includes(dataIndex)">
                    <div :class="record.withdrawState == 6 ? 'text-color-green' : 'text-color-red'" v-if="record.withdrawStateName">
                        {{ record.withdrawStateName }}
                    </div>
                    <div v-else>--</div>
                </template>
                <template v-else-if="['orderNo', 'txHash', 'fromAddress', 'toAddress'].includes(dataIndex)">
                    <div v-if="!record[dataIndex]">--</div>
                    <a-tooltip :title="record[dataIndex]" placement="topLeft">
                        <div class="truncate w-36">
                            {{ record[dataIndex] }}
                        </div>
                    </a-tooltip>
                </template>
                <template v-else-if="dataIndex === 'aml'">
                    <a-button type="link" @click="handleAMLDetail(record, 1)"> 详情 </a-button>
                </template>
                <template v-else-if="dataIndex === 'operate'">
                    <a-button
                        type="link"
                        @click="handleInfo(record)"
                        v-if="record.withdrawState && [3, 4].includes(record.state) && buttonPermissionsRoute('withdrawCoins')"
                    >
                        查看退款记录
                    </a-button>
                    <!-- 状态 成功=1  是否提币 !==1 -->
                    <a-button
                        type="link"
                        @click="handleEdit(record)"
                        class="text-color-green"
                        v-if="showWithdraw(record, 1) && buttonPermissionsRoute('withdrawCoins')"
                    >
                        申请提币
                    </a-button>
                    <!-- 状态 风控中=3  是否提币 !==1 -->
                    <a-button
                        type="link"
                        @click="handleRefund(record)"
                        class="text-color-red"
                        v-if="showWithdraw(record, 3) && buttonPermissions('deposit-refund')"
                    >
                        退款
                    </a-button>
                    <a-button
                        type="link"
                        @click="handleInfo(record)"
                        v-if="record.withdrawState && [1].includes(record.state) && buttonPermissionsRoute('withdrawCoins')"
                    >
                        查看提币记录
                    </a-button>
                    <a-button
                        type="link"
                        @click="handleAMLDetail(record, 2)"
                        v-if="[6].includes(record.state) && buttonPermissions('deposit-aml-results')"
                    >
                        提交AML结果
                    </a-button>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
        <WithdrawalEditModal v-model:visible="isModalOpen" :editData="activeData" @success="handleOnSubmit" />
        <RefundEditModal v-model:visible="isRefundModalOpen" :editData="activeData" @success="handleOnSubmit" />
        <AMLDetailModal v-model:visible="isAMLDetailModalOpen" :editData="activeData" @onSuccess="handleOnSubmit" :type="amlType" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, createVNode, onActivated, reactive, ref, getCurrentInstance } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';

import api from '@/newApi/digitAsset/deposit/index';
import { PagingDefaultConf } from '@/utils/constant';
import WithdrawalEditModal from './Modal/Withdrawal/index.vue';
import RefundEditModal from './Modal/Refund/index.vue';
import AMLDetailModal from './Modal/AMLDetail/index.vue';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';

const formState = reactive<DepositListParams>({
    accountNo: '',
    agentId: '',
    amlLevel: '',
    chainId: '',
    state: null,
});
const isModalOpen = ref(false);
const isRefundModalOpen = ref(false);
const isAMLDetailModalOpen = ref(false);
const { proxy } = getCurrentInstance();

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => {
    const columns = [
        { title: 'ID', dataIndex: 'id' },
        { title: '用户UID', dataIndex: 'accountNo' },
        { title: '代理商ID', dataIndex: 'agentId' },
        { title: '充币订单号', dataIndex: 'orderNo', width: 180 },
        { title: 'TxHash ', dataIndex: 'txHash', width: 150 },
        { title: 'From ', dataIndex: 'fromAddress', width: 150 },
        { title: 'To', dataIndex: 'toAddress', width: 150 },
        { title: '钱包名称', dataIndex: 'walletSiteName' },
        { title: '金额 ', dataIndex: 'amount' },
        { title: '币种', dataIndex: 'coinSymbol' },
        { title: '链', dataIndex: 'chainSymbol' },
        { title: '创建时间 ', dataIndex: 'createTime' },
        { title: 'AML查询结果', dataIndex: 'aml' },
        { title: 'AML系数', dataIndex: 'amlCoefficient' },
        { title: '风控等级', dataIndex: 'amlLevel' },
        { title: '状态', dataIndex: 'state' },
        { title: '提币状态', dataIndex: 'withdrawStateName' },
        { title: '操作', dataIndex: 'operate' },
    ];
    const show = proxy.buttonPermissions('deposit-info');
    const newColumns = columns.filter((item) => item.dataIndex !== 'aml');
    return show ? columns : newColumns;
});
const activeData = ref<PromiseReturnType<typeof api.getDepositList>['list'][0]>(Object.create(null));
const amlType = ref<1 | 2>(1);
const depositStateSelect = ref<PromiseReturnType<typeof api.getDepositStateSelect>>([]);
const depositRiskLevelSelect = ref<PromiseReturnType<typeof api.getDepositRiskLevelSelect>>([]);
const pagination = reactive({ ...PagingDefaultConf });
const stateText = computed(() => {
    return (state: number) => {
        const status = ['启用', '禁用'][state - 1];
        return status;
    };
});
const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = async () => {
    loading.value = true;
    NProgress.start();

    const { pageNo, pageSize } = pagination;
    api.getDepositList({
        ...formState,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.getDepositList>) => {
            [tableData.value, pagination.total] = [list, totalSize];
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};

const formReset = ref();
const handleResetForm = (): void => {
    // 重置表单
    pagination.pageNo = 1;
    formReset.value.resetFields();
    handleOnSubmit();
};

const handleSearch = () => {
    pagination.pageNo = 1;
    handleOnSubmit();
};

const route = useRoute();
onActivated(() => {
    if (route.hash === '#no-refresh') return;

    getDepositStateSelect();
    getDepositRiskLevelSelect();
    const state = route.query.state as string;
    if (state) {
        formState.state = Number(state);
        handleOnSubmit();
        return;
    }
    handleResetForm();
});
const handleEdit = (record: PromiseReturnType<typeof api.getDepositList>['list'][0]) => {
    activeData.value = record;
    isModalOpen.value = true;
};
const getDepositStateSelect = async () => {
    const res = await api.getDepositStateSelect();
    depositStateSelect.value = res;
};
const getDepositRiskLevelSelect = async () => {
    const res = await api.getDepositRiskLevelSelect();
    depositRiskLevelSelect.value = res;
};
const handleRefund = (record: PromiseReturnType<typeof api.getDepositList>['list'][0]) => {
    activeData.value = record;
    isRefundModalOpen.value = true;
};
const handleAMLDetail = (record: PromiseReturnType<typeof api.getDepositList>['list'][0], type: 1 | 2) => {
    activeData.value = record;
    isAMLDetailModalOpen.value = true;
    amlType.value = type;
};
const router = useRouter();
const handleInfo = (record: PromiseReturnType<typeof api.getDepositList>['list'][0]) => {
    router.push({
        path: '/digitAsset/withdrawCoins',
        query: {
            orderNo: record.orderNo,
        },
    });
};
const showWithdraw = computed(() => {
    return (record: PromiseReturnType<typeof api.getDepositList>['list'][0], type: number) => {
        return record.state === type && record.withdraw !== 1;
    };
});
const showWithdrawRecord = computed(() => {
    return (record: PromiseReturnType<typeof api.getDepositList>['list'][0]) => {
        return record.state === 1 && record.withdraw === 1;
    };
});

defineOptions({ name: 'userDepositList' });
</script>
