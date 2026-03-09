<script setup lang="ts">
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
import AmountTotal from '@/views/Billing/components/AmounTotal.vue';
import { reactive, ref, onActivated } from 'vue';
import { downloadExcel } from '@/utils/common';
import useTableConf from '@/use/useTableConf';
import Initiate from './Modal/Initiate.vue';
import TradePwd from './Modal/TradePwd.vue';
import Rematch from './Modal/Rematch.vue';
import { useRoute } from 'vue-router';
import api from '@/api/transaction/index';
import NProgress from 'nprogress';

const formReset = ref();
const amountTotal = ref('0.0');
const loadExportExcel = ref(false);
const isModalOpen = ref<boolean>(false);
const activeData = ref(Object.create(null)); // modal打开时激活的数据
const modalType = ref<'add' | 'edit'>('add');
const isModalInitiateOpen = ref<boolean>(false); // 发起提币弹窗
const isModalTradePwdOpen = ref<boolean>(false); // 设置交易密码弹窗
const formState = reactive<{
    hash: string;
    orderNo: string; // 链充币订单号
    toAddress: string; // 目标地址
    coinOutStatus: 0 | 1 | 2 | ''; // 钱包提币审核 0待审核中 1可提币 2审核失败
    type: 1 | 2 | ''; // 交易类型 1、充 2、提
    state: 1 | 2 | 3 | 4 | 5 | ''; // 1、成功 2、确认中 3、失败 4、审核中 5、审核拒绝
    walletStatus: string; // 状态 waiting打包中 pending发送中 confirming确认中 cantrade可交易 success已完成 faild失败
    time: Array<string>;
    uid: string;
    riskCoinStatus: 0 | 1 | 2; // 冻结状态：0、全部 1、未冻结 2、冻结中
    riskLevel: 0 | 1 | 2 | 3 | 4; // 风控等级，0、全部 1、低 2、中 3、高 4、严重
}>({
    hash: '',
    orderNo: '',
    toAddress: '',
    coinOutStatus: '',
    type: '',
    walletStatus: '',
    state: '',
    time: [],
    riskCoinStatus: 0,
    riskLevel: 0,
    uid: '',
});
const tableData = ref(Object.create([]));

const route = useRoute();

const tableColumns = [
    { title: 'ID', dataIndex: 'id', width: 180, fixed: 'left' },
    { title: '用户UID', dataIndex: 'accountId', width: 200 },
    { title: '链充币订单号', dataIndex: 'orderNo', width: 200 },
    { title: 'TxHash', dataIndex: 'txHash', width: 200 },
    { title: '交易类型', dataIndex: 'type', width: 80 },
    { title: '代理商', dataIndex: 'agentName', width: 110 },
    { title: 'From', dataIndex: 'fromAddress', width: 200 },
    { title: 'To', dataIndex: 'toAddress', width: 200 },
    { title: '金额', dataIndex: 'amount', width: 120 },
    { title: '币种', dataIndex: 'symbol', width: 80 },
    { title: '链', dataIndex: 'chainTag', width: 80 },
    { title: '创建时间', dataIndex: 'createTime', width: 120 },
    { title: '冻结状态', dataIndex: 'riskCoinStatus', fixed: 'right', width: 100 },
    { title: '状态', dataIndex: 'state', fixed: 'right', width: 100 },
    { title: '风控等级', dataIndex: 'riskLevel', fixed: 'right', width: 100 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
];

const fetchTableData = () => {
    isLoading.value = true;
    NProgress.start();
    const { time, ...params } = formState;
    const [startTime, endTime] = time;
    const { current, pageSize } = paginationConfig;
    api.fetchBargainList({
        ...params,
        startTime,
        endTime,
        pageNo: current,
        pageSize,
    })
        .then(({ list, totalSize, pageNo }) => {
            updatePagination(pageNo, pageSize, totalSize);
            tableData.value = list;
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
        });

    api.featchgetTransferAmountTotal({
        ...params,
        startTime,
        endTime,
        pageNo: current,
        pageSize,
    })
        .then((amount) => {
            amountTotal.value = amount;
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
        });
};

const handExport = () => {
    const { time, ...params } = formState;
    const [startTime, endTime] = time;
    if (loadExportExcel.value) return;
    loadExportExcel.value = true;
    api.fetchBargainListExcel({
        ...params,
        startTime,
        endTime,
    })
        .then((r: PromiseReturnType<typeof api.fetchBargainListExcel>) => {
            downloadExcel(r, '链上充值');
        })
        .finally(() => {
            loadExportExcel.value = false;
        });
};

const handleResetForm = (): void => {
    // 重置表单
    formReset.value.resetFields();
    onSearch();
};

onActivated(() => {
    if (route.hash === '#no-refresh') return; // 不需要刷新
    handleResetForm();
});
const handleOpenModal = (record: PromiseReturnType<typeof api.fetchBargainList>) => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const handleCloseModal = () => {
    // 关闭弹框
    [isModalOpen.value, isModalInitiateOpen.value, isModalTradePwdOpen.value] = [false, false, false];
};

const getStateText = (state: number): string => {
    const stateMap: Record<number, string> = {
        1: '成功',
        2: '确认中',
        3: '失败',
        4: '审核中',
        5: '审核拒绝',
        6: '未匹配订单',
    };
    return stateMap[state] || '';
};

const { isLoading, onSearch, paginationConfig, handleSizeChange, updatePagination } = useTableConf(fetchTableData);

fetchTableData();
</script>

<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="用户UID" class="mr-22 width-250" name="uid">
                    <a-input v-model:value="formState.uid" size="small" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
                <a-form-item label="TxHash" class="mr-22 width-250" name="hash">
                    <a-input v-model:value="formState.hash" size="small" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
                <a-form-item label="链充币订单号" class="mr-22 width-250" name="orderNo">
                    <a-input v-model:value="formState.orderNo" size="small" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
                <a-form-item label="目标地址" class="mr-22 width-250" name="toAddress">
                    <a-input v-model:value="formState.toAddress" size="small" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
                <a-form-item label="交易类型" class="mr-22 width-250" name="type">
                    <a-select v-model:value="formState.type" size="small" placeholder="请选择" @change="onSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">充值</a-select-option>
                        <a-select-option :value="2">提币</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择" @change="onSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">成功</a-select-option>
                        <a-select-option :value="2">确认中</a-select-option>
                        <a-select-option :value="3">失败</a-select-option>
                        <a-select-option :value="4">审核中</a-select-option>
                        <a-select-option :value="5">审核拒绝</a-select-option>
                        <a-select-option :value="6">未匹配订单</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="冻结状态" class="mr-22 width-250" name="riskCoinStatus">
                    <a-select v-model:value="formState.riskCoinStatus" size="small" placeholder="请选择" @change="onSearch">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">未冻结</a-select-option>
                        <a-select-option :value="2">冻结中</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="风控等级" class="mr-22 width-250" name="riskLevel">
                    <a-select v-model:value="formState.riskLevel" size="small" placeholder="请选择" @change="onSearch">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">低</a-select-option>
                        <a-select-option :value="2">中</a-select-option>
                        <a-select-option :value="3">高</a-select-option>
                        <a-select-option :value="4">严重</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="创建时间" class="mr-22 width-500" name="time">
                    <DateRangePicker v-model="formState.time" @onChange="onSearch" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div class="display-flex">
                    <!--<a-button block type="primary" size="small" class="search-submit-btn ml-0" @click="isModalInitiateOpen=true">发起提币</a-button>
                    <a-button block type="primary" size="small" class="search-submit-btn ml-20" @click="isModalTradePwdOpen=true">设置交易密码</a-button>-->
                    <a-button
                        v-if="buttonPermissions('export')"
                        block
                        type="primary"
                        size="small"
                        class="search-submit-btn ml-0"
                        :loading="loadExportExcel"
                        @click="handExport"
                    >
                        导出
                    </a-button>
                </div>
                <div class="display-flex">
                    <a-button block type="primary" size="small" class="search-submit-btn" @click.stop="onSearch">
                        <template #icon>
                            <SearchOutlined />
                        </template>
                        搜索
                    </a-button>
                    <a-button block size="small" class="search-reset-btn" @click.stop="handleResetForm">
                        <template #icon>
                            <RedoOutlined />
                        </template>
                        重置
                    </a-button>
                </div>
            </div>
        </a-form>
        <amount-total :is-to-show="false" :posting-amount-total="amountTotal" :title-amount1="'总金额'" />
        <a-table
            size="small"
            :pagination="paginationConfig"
            :loading="isLoading"
            :columns="tableColumns"
            :data-source="tableData"
            :scroll="{ x: 1100 }"
            @change="handleSizeChange"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { type, state, riskCoinStatus, riskLevel }, record }">
                <template v-if="dataIndex === 'type'">
                    <p :class="type === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ type === 1 ? '充值' : '提币' }}
                    </p>
                </template>
                <template v-if="dataIndex === 'riskCoinStatus'">
                    <p class="text-color-green">{{ riskCoinStatus === 1 ? '未冻结' : '' }}</p>
                    <p class="text-color-red">{{ riskCoinStatus === 2 ? '冻结中' : '' }}</p>
                </template>
                <template v-if="dataIndex === 'riskLevel'">
                    <p class="text-color-green">{{ riskLevel === 1 ? '低' : '' }}</p>
                    <p class="text-color-red">{{ riskLevel === 2 ? '中' : '' }}</p>
                    <p class="text-color-red">{{ riskLevel === 3 ? '高' : '' }}</p>
                    <p class="text-color-red">{{ riskLevel === 4 ? '严重' : '' }}</p>
                </template>
                <template v-if="dataIndex === 'state'">
                    <!-- 1、成功 2、确认中 3、失败 4、审核中 5、审核拒绝-->
                    <p :class="state === 1 || state === 2 ? 'text-color-green' : 'text-color-red'">
                        {{ getStateText(state) }}
                    </p>
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button
                        v-if="buttonPermissions('rematchOrder') && (state === 6 || state === 2) && riskCoinStatus !== 2"
                        type="link"
                        danger
                        @click="handleOpenModal(record)"
                    >
                        重新匹配订单
                    </a-button>
                </template>
            </template>
        </a-table>
        <Initiate :visible="isModalInitiateOpen" @onClose="handleCloseModal" @onSuccess="onSearch" />
        <TradePwd :visible="isModalTradePwdOpen" @onClose="handleCloseModal" @onSuccess="onSearch" />
        <Rematch :visible="isModalOpen" :type="modalType" :active-data="activeData" @onClose="handleCloseModal" @onSuccess="onSearch" />
    </div>
</template>
