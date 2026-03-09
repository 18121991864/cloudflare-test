<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="用户UID" class="mr-22 width-250" name="uid">
                    <a-input v-model:value="formState.uid" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="代理商ID" class="mr-22 width-250" name="agentId">
                    <a-input v-model:value="formState.agentId" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="所属代理商" class="mr-22 width-250" name="agentName">
                    <a-input v-model:value="formState.agentName" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="历史代理商" class="mr-22 width-250" name="historyAgentName">
                    <a-input v-model:value="formState.historyAgentName" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="用户标签" class="mr-22 width-250" name="labelId">
                    <SLabelIds v-model="formState.labelId" />
                </a-form-item>
                <a-form-item label="TxHash" class="mr-22 width-250" name="hash">
                    <a-input v-model:value="formState.hash" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="充币订单号" class="mr-22 width-250" name="orderNo">
                    <a-input v-model:value="formState.orderNo" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="目标地址" class="mr-22 width-250" name="toAddress">
                    <a-input v-model:value="formState.toAddress" size="small" placeholder="请输入" />
                </a-form-item>
                <!-- <a-form-item label="交易类型" class="mr-22 width-250" name="type">
                  <a-select size="small" v-model:value="formState.type" placeholder="请选择" @change="handleSearch">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option :value="1">充值</a-select-option>
                    <a-select-option :value="2">提币</a-select-option>
                  </a-select>
                </a-form-item> -->
                <a-form-item label="状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option v-for="item in stateList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="充币方式" class="mr-22 w-[300px]" name="withdrawType">
                    <a-select
                        v-model:value="formState.withdrawType"
                        :mode="ismultiple"
                        size="small"
                        placeholder="请选择"
                        @change="changeWithdrawType"
                    >
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option v-for="item of withdrawTypeList" :key="item.value" :value="item.value">{{ item.label }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="冻结状态" class="mr-22 width-250" name="riskCoinStatus">
                    <a-select v-model:value="formState.riskCoinStatus" size="small" placeholder="请选择">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">未冻结</a-select-option>
                        <a-select-option :value="2">冻结中</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="风控等级" class="mr-22 width-250" name="riskLevel">
                    <a-select v-model:value="formState.riskLevel" size="small" placeholder="请选择">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">低</a-select-option>
                        <a-select-option :value="2">中</a-select-option>
                        <a-select-option :value="3">高</a-select-option>
                        <a-select-option :value="4">严重</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="创建时间" class="mr-22 width-500" name="time">
                    <DateRangePicker
                        v-model="formState.time"
                        :default-select-option="{
                            time: 12,
                        }"
                        @defaultChange="handleSearch"
                    />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div class="display-flex">
                    <a-button
                        v-if="buttonPermissions('export')"
                        block
                        type="primary"
                        size="small"
                        class="ml-0 search-submit-btn"
                        :loading="loadExportExcel"
                        @click="handExport"
                    >
                        导出
                    </a-button>
                </div>
                <div class="display-flex">
                    <a-button block type="primary" size="small" class="search-submit-btn" @click.stop="handleSearch">
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
            :pagination="false"
            :loading="loading"
            :columns="tableColumns"
            :row-key="({ id }) => id"
            :data-source="tableData"
            :scroll="{ x: 1500 }"
        >
            <template
                #bodyCell="{
                    column: { dataIndex },
                    record: { id, type, state, riskCoinStatus, riskLevel, refundState, labelNames, labelList },
                    record,
                }"
            >
                <template v-if="dataIndex === 'type'">
                    <p :class="type === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ type === 1 ? '充值' : '提币' }}
                    </p>
                </template>
                <template v-else-if="dataIndex === 'riskCoinStatus'">
                    <p class="text-color-green">
                        {{ riskCoinStatus === 1 ? '未冻结' : '' }}
                    </p>
                    <p class="text-color-red">
                        {{ riskCoinStatus === 2 ? '冻结中' : '' }}
                    </p>
                </template>
                <template v-else-if="dataIndex === 'riskLevel'">
                    <p class="text-color-green">{{ riskLevel === 1 ? '低' : '' }}</p>
                    <p class="text-color-red">{{ riskLevel === 2 ? '中' : '' }}</p>
                    <p class="text-color-red">{{ riskLevel === 3 ? '高' : '' }}</p>
                    <p class="text-color-red">{{ riskLevel === 4 ? '严重' : '' }}</p>
                </template>
                <template v-else-if="dataIndex === 'refundState'">
                    <p>{{ refundStates[refundState - 1] }}</p>
                </template>
                <template v-else-if="dataIndex === 'state'">
                    <!-- 1、成功 2、确认中 3、失败 4、审核中 5、审核拒绝-->
                    <p :class="state === 1 || state === 2 ? 'text-color-green' : 'text-color-red'">
                        {{ stateName(state) }}
                    </p>
                </template>
                <template v-else-if="dataIndex === 'action'">
                    <!-- <a-button
                                  v-if="buttonPermissions('rematchOrder') && (state === 6 || state === 2) && riskCoinStatus !== 2"
                                  type="link"
                                  @click="handleOpenModal(record)"
                                  danger>
                                  重新匹配订单
                              </a-button> -->
                    <!-- 这个按钮不会再要 隐藏就行  -->
                    <a-button
                        v-if="riskCoinStatus == 2 && (refundState == 2 || refundState == null) && buttonPermissions('refund')"
                        type="link"
                        class="text-color-red"
                        @click="handelRefund(id)"
                        >退款
                    </a-button>
                </template>
                <template v-else-if="dataIndex === 'labelList'">
                    <a-tooltip :title="labelNames">
                        <div style="display: flex; flex-wrap: wrap; gap: 4px">
                            <template v-for="(item, index) of labelList?.slice(0, 3)" :key="item">
                                <a-tag :color="item.color">{{ item.name }}</a-tag>
                                <template v-if="index === 2 && labelList.length > 3">
                                    <span>...</span>
                                </template>
                            </template>
                        </div>
                    </a-tooltip>
                </template>
                <template v-else>
                    <a-tooltip>
                        <template #title>{{ record[dataIndex] }}</template>
                        <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                            {{ record[dataIndex] }}
                        </div>
                    </a-tooltip>
                </template>
            </template>
        </a-table>

        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />

        <BargainInitiate :visible="isModalInitiateOpen" @onClose="handleCloseModal" @onSuccess="handleOnSubmit" />

        <BargainTradePwd :visible="isModalTradePwdOpen" @onClose="handleCloseModal" @onSuccess="handleOnSubmit" />

        <BargainRematch :visible="isModalOpen" :type="modalType" :active-data="activeData" @onClose="handleCloseModal" @onSuccess="handleOnSubmit" />
        <refund-modal v-model:visible="refundvisible" :refund-id="refundId" @handleOk="handleOnSubmit" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, reactive, ref, onActivated } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
import api from '@/api/asset/index';
import { PagingDefaultConf } from '@/utils/constant';
import BargainInitiate from './BargainInitiate.vue';
import BargainTradePwd from './BargainTradePwd.vue';
import BargainRematch from './BargainRematch.vue';
import { downloadExcel } from '@/utils/common';
import AmountTotal from '@/views/Billing/components/AmounTotal.vue';
import RefundModal from './components/RefundModal.vue';
import useUser from '@/store/user';

const userStore = useUser();

userStore.fetchTagList();

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 180, fixed: 'left' },
    { title: '用户UID', dataIndex: 'accountId', width: 200 },
    { title: '所属代理商', dataIndex: 'agentName', width: 150 },
    { title: '历史代理商', dataIndex: 'historyAgentName', width: 120 },
    { title: '代理商ID', dataIndex: 'agentId', width: 200 },
    { title: '用户标签', dataIndex: 'labelList', width: 200 },
    { title: '充币方式', dataIndex: 'depositSonTypeStr', width: 100 },
    { title: '充币订单号', dataIndex: 'orderNo', width: 250 },
    { title: 'TxHash', dataIndex: 'txHash', width: 200 },
    { title: '交易类型', dataIndex: 'type', width: 80 },
    { title: '代理商', dataIndex: 'agentName', width: 110 },
    { title: 'From', dataIndex: 'fromAddress', width: 200 },
    { title: 'To', dataIndex: 'toAddress', width: 200 },
    { title: '金额', dataIndex: 'amount', width: 120 },
    { title: '币种', dataIndex: 'symbol', width: 80 },
    { title: '链', dataIndex: 'chainTag', width: 80 },
    { title: '创建时间', dataIndex: 'createTime', width: 200 },
    { title: '退款地址', dataIndex: 'refundToAddress', width: 200 },
    { title: '冻结状态', dataIndex: 'riskCoinStatus', width: 100 },
    { title: '退款状态', dataIndex: 'refundState', width: 100 },
    { title: '退款Hash', dataIndex: 'refundHash', width: 100 },
    { title: '状态', dataIndex: 'state', width: 100 },
    { title: '风控等级', dataIndex: 'riskLevel', width: 100 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
]);
const refundStates = ['退款中', '退款失败', '退款成功'];
const refundvisible = ref(false);
const refundId = ref('');
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
    labelId?: string | null; // 标签ID
    withdrawType: string | null;
    agentName: string;
    historyAgentName: string;
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
    labelId: null,
    withdrawType: null,
    agentName: '',
    historyAgentName: '',
});

const pagination = reactive({ ...PagingDefaultConf });
const loading = ref(false);
const amountTotal = ref('0.0');
const tableData = ref(Object.create([]));
const withdrawType = ref<string | null>(null);
// 1、UID提币 2、手机号提币 3、邮箱提币 4、内部地址提币 5、链上提币
const withdrawTypeList = ref<{ label: string; value: number }[]>([]);
// { label: 'UID充币', value: 1 },
// { label: '手机号充币', value: 2 },
// { label: '邮箱充币', value: 3 },
// { label: '内部地址充币', value: 4 },
// { label: '链上充币', value: 5 },

const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    const { time, ...params } = formState;
    const [startTime, endTime] = time;
    const { pageNo, pageSize } = pagination;
    console.log(withdrawType.value);

    api.fetchBargainList({
        ...params,
        startTime,
        endTime,
        pageNo,
        pageSize,
        withdrawType: withdrawType.value,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchBargainList>) => {
            [tableData.value, pagination.total] = [list, totalSize];
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });

    api.featchgetTransferAmountTotal({
        ...params,
        startTime,
        endTime,
        pageNo,
        pageSize,
        withdrawType: withdrawType.value,
    })
        .then((amount) => {
            amountTotal.value = amount;
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};

const loadExportExcel = ref(false);
const handExport = () => {
    const { time, ...params } = formState;
    const [startTime, endTime] = time;
    if (loadExportExcel.value) return;
    loadExportExcel.value = true;
    api.fetchBargainListExcel({
        ...params,
        startTime,
        endTime,
        withdrawType: withdrawType.value,
    })
        .then((r: PromiseReturnType<typeof api.fetchBargainListExcel>) => {
            downloadExcel(r, '充值');
        })
        .finally(() => {
            loadExportExcel.value = false;
        });
};
const stateList = [
    { id: 1, title: '成功' },
    { id: 2, title: '确认中' },
    { id: 3, title: '失败' },
    { id: 4, title: '审核中' },
    { id: 5, title: '审核拒绝' },
    { id: 6, title: '未匹配订单' },
    { id: 8, title: '充币风控退款' },
];
const stateName = computed(() => (state: number) => stateList.find((item) => item.id === state)?.title);
const formReset = ref();
const handleResetForm = (): void => {
    // 重置表单
    pagination.pageNo = 1;
    formReset.value?.resetFields();
    withdrawType.value = null;
    handleOnSubmit();
};

const handleSearch = () => {
    pagination.pageNo = 1;
    handleOnSubmit();
};

const route = useRoute();
const depositTypeList = () => {
    api.transactionDepositTypeList().then((res) => {
        // console.log('res', res);
        res.forEach((item) => {
            withdrawTypeList.value.push({
                label: item.name,
                value: item.code,
            });
        });
    });
};
onActivated(() => {
    if (route.hash === '#no-refresh') return; // 不需要刷新
    // handleResetForm();
    depositTypeList();
});

const isModalOpen = ref<boolean>(false);
const modalType = ref<'add' | 'edit'>('add');
const activeData = ref(Object.create(null)); // modal打开时激活的数据
const handleOpenModal = (record: PromiseReturnType<typeof api.fetchBargainList>) => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const isModalInitiateOpen = ref<boolean>(false); // 发起提币弹窗
const isModalTradePwdOpen = ref<boolean>(false); // 设置交易密码弹窗
const handleCloseModal = () => {
    // 关闭弹框
    [isModalOpen.value, isModalInitiateOpen.value, isModalTradePwdOpen.value] = [false, false, false];
};
const handelRefund = (id: string) => {
    refundId.value = id;
    refundvisible.value = true;
};
const changeWithdrawType = () => {
    if (Array.isArray(formState.withdrawType) && formState.withdrawType.includes(null)) {
        withdrawType.value = null;
        formState.withdrawType = null;
        handleSearch();
        return false;
    }
    if (typeof formState.withdrawType === 'object' && Object.keys(formState.withdrawType).length === 0) {
        withdrawType.value = null;
        formState.withdrawType = null;
    }

    if (!formState.withdrawType) {
        withdrawType.value = null;
        formState.withdrawType = null;
    } else {
        const type = Array.isArray(formState.withdrawType) ? formState.withdrawType.join(',') : String(formState.withdrawType);
        console.log('tyoe', type);

        withdrawType.value = type;
    }
    handleSearch();
};
const ismultiple = computed(() => {
    return withdrawType.value ? 'multiple' : '';
});
// handleResetForm();
</script>
<script lang="ts">
export default {
    name: 'Bargain',
};
</script>
