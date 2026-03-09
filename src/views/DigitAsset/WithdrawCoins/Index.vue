<script setup lang="ts">
import { reactive, ref, onActivated, onMounted, onDeactivated, onBeforeUnmount } from 'vue';
import WithdrawCoin from './Modal/WithdrawModalWithdrawCoin.vue';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
import AmountTotal from '@/views/Billing/components/AmounTotal.vue';
import WithdrawManualRemark from './Modal/WithdrawManualRemark.vue';
import BargainRematch from '../Bargain/Modal/Rematch.vue';
import TransferAmount from './Modal/TransferAmount.vue';
import SettingsModal from './Modal/SettingsModal.vue';
import WithdrawModal from './Modal/WithdrawModal.vue';
import { downloadExcel } from '@/utils/common';
import useTableConf from '@/use/useTableConf';
import mp3 from '@/assets/mp3/dingding.mp3';
import { message } from 'ant-design-vue';
import api from '@/api/transaction/index';
import NProgress from 'nprogress';

const formReset = ref();
const timeValue = ref<any>(null);
const soundeRef = ref<HTMLAudioElement | null>(null);
const TotalNumber = ref(JSON.parse(window.sessionStorage.getItem('TotalNumber') || '0'));
const second = ref(60);
const remarkMoadl = ref(false);
const manualRemark = ref('');
const manualId = ref('');
const formState = reactive<{
    time: string[];
    orderNo: string; // hash
    hash: string; // 订单号
    state: 0 | 1 | 2 | 3 | 4 | 5; // 状态 1、成功 2、钱包处理中 3、失败 4、审核中 5、审核拒绝
}>({ orderNo: '', hash: '', state: 0, time: [] });
const dataAmountTotal = ref({
    toAmountTotal: '0.0',
    withdrawAmountTotal: '0.0',
});
const tableData = ref<PromiseSelectReturnType<typeof api.fetchTransactionWithdrawList, 'list'>>([]);

const tableColumns = [
    { title: 'ID', dataIndex: 'id', width: 200, fixed: 'left' },
    { title: '订单号', dataIndex: 'orderNo', width: 250 },
    { title: '用户UID', dataIndex: 'accountId', width: 200 },
    { title: '总金额', dataIndex: 'amount', width: 100 },
    { title: '到账金额', dataIndex: 'toAmount', width: 120 },
    { title: '链', dataIndex: 'chainTag', width: 80 },
    { title: '创建时间', dataIndex: 'createTime', width: 120 },
    { title: '平台手续费', dataIndex: 'feeAmount', width: 100 },
    { title: '钱包手续费', dataIndex: 'walletFeeAmount', width: 100 },
    { title: '源地址', dataIndex: 'fromAddress', width: 200 },
    { title: '币种', dataIndex: 'symbol', width: 120 },
    { title: '目标地址', dataIndex: 'toAddress', width: 200 },
    { title: 'hash', dataIndex: 'txHash', width: 200 },
    { title: '备注', dataIndex: 'manualRemark', width: 200 },
    { title: '类型', dataIndex: 'type', width: 120 },
    { title: '发起人', dataIndex: 'sourceType', width: 150 },
    { title: '钱包状态', dataIndex: 'walletState', width: 120 },
    { title: '状态', dataIndex: 'state', fixed: 'right', width: 100 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
];

const fetchTableData = () => {
    endTimePlay();
    isLoading.value = true;
    NProgress.start();
    const { time, ...params } = formState;
    const [startTime, endTime] = time;
    const { current, pageSize } = paginationConfig;

    api.fetchTransactionWithdrawList({
        ...params,
        startTime,
        endTime,
        pageNo: current,
        pageSize,
    })
        .then(({ list, totalSize, pageNo }) => {
            updatePagination(pageNo, pageSize, totalSize);
            tableData.value = list;
            if (TotalNumber.value && totalSize > TotalNumber.value) {
                startPlay();
                message.success('当前新增了一条新的数据,请注意查看');
            }
            TotalNumber.value = totalSize;
            sessionStorage.setItem('TotalNumber', JSON.stringify(totalSize));
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
            startTimePlay();
        });

    api.fetchgetWithdrawAmountTotal({
        ...params,
        startTime,
        endTime,
        pageNo: current,
        pageSize,
    })
        .then((list) => {
            dataAmountTotal.value.toAmountTotal = list.toAmountTotal;
            dataAmountTotal.value.withdrawAmountTotal = list.withdrawAmountTotal;
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
        });
};

const handExport = () => {
    isLoading.value = true;
    NProgress.start();
    const { time, ...params } = formState;
    const [startTime, endTime] = time;
    const { current, pageSize } = paginationConfig;
    api.fetchwithdrawExport({
        ...params,
        startTime,
        endTime,
        pageNo: current,
        pageSize,
    })
        .then((r) => {
            downloadExcel(r, '链上提币');
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
        });
};

const handleResetForm = (): void => {
    // 重置表单
    formReset.value.resetFields();
    onSearch();
};

onMounted(() => {
    handleResetForm();
    startTimePlay();
});

const startTimePlay = () => {
    if (timeValue.value) {
        endTimePlay();
    }
    timeValue.value = setInterval(async () => {
        second.value--;
        if (second.value === 0) {
            second.value = 60;
            await onSearch();
            endTimePlay();
        }
    }, 1000);
};
const endTimePlay = () => {
    clearTimeout(timeValue.value);
    timeValue.value = null;
};

const isModalOpen = ref<boolean>(false);
const modalType = ref<'add' | 'edit'>('add');
const activeData = ref(Object.create(null)); // modal打开时激活的数据
const handleOpenModal = (record: PromiseReturnType<typeof api.fetchTransactionWithdrawList>) => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
    endTimePlay();
};

const modalPasswordType = ref<'add' | 'edit' | 'reset'>('add');
const isModalSettingOpen = ref<boolean>(false);
const handleOnSettingSubmit = (type: 'edit' | 'add' | 'reset') => {
    // 打开新增/编辑弹框
    [isModalSettingOpen.value, modalPasswordType.value] = [true, type];
    endTimePlay();
};

const isModalWithdrawOpenTransferAmount = ref(false);
const isModalWithdrawOpenWithdrawCoin = ref(false);
const isModalWithdrawOpen = ref<boolean>(false);
const handleCloseModal = () => {
    // 关闭弹框
    [isModalOpen.value] = [false];
    [isModalSettingOpen.value] = [false];
    [isModalWithdrawOpen.value] = [false];
    [isModalWithdrawOpenTransferAmount.value] = [false];
    [isModalWithdrawOpenWithdrawCoin.value] = [false];
    [remarkMoadl.value] = [false];
    startTimePlay();
};
const handleWithdrawOpenModal = (record: PromiseReturnType<typeof api.fetchTransactionWithdrawList>, type: 'add' | 'edit') => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalWithdrawOpen.value, modalType.value] = [true, type];
    endTimePlay();
};

const loadDepositListExportExcel = ref(false);

const backTransferAmount = (record: PromiseReturnType<typeof api.fetchTransactionWithdrawList>, type: 'add' | 'edit') => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalWithdrawOpenTransferAmount.value, modalType.value] = [true, type];
    endTimePlay();
};

const backWithdrawCoin = (record: PromiseReturnType<typeof api.fetchTransactionWithdrawList>, type: 'add' | 'edit') => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalWithdrawOpenWithdrawCoin.value, modalType.value] = [true, type];
    endTimePlay();
};

const startPlay = () => {
    if (soundeRef.value) {
        soundeRef.value.play();
    }
};

onActivated(() => {
    startTimePlay();
});

const endPlay = () => {
    if (soundeRef.value) {
        soundeRef.value.pause();
        soundeRef.value.currentTime = 0;
    }
    endTimePlay();
};

onUnmounted(() => {
    endPlay();
});

onBeforeUnmount(() => {
    endPlay();
});

const handelAddRemark = (id: string, remark: string) => {
    manualId.value = id;
    manualRemark.value = remark;
    remarkMoadl.value = true;
    endTimePlay();
};

const { isLoading, onSearch, paginationConfig, handleSizeChange, updatePagination } = useTableConf(fetchTableData);

fetchTableData();
</script>

<template>
    <div class="table-container">
        <audio ref="soundeRef" :src="mp3" controls hidden></audio>
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="订单号" class="mr-22 width-250" name="orderNo">
                    <a-input v-model:value="formState.orderNo" size="small" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
                <a-form-item label="hash" class="mr-22 width-250" name="hash">
                    <a-input v-model:value="formState.hash" size="small" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择" @change="onSearch">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">成功</a-select-option>
                        <a-select-option :value="2">钱包处理中</a-select-option>
                        <a-select-option :value="3">失败</a-select-option>
                        <a-select-option :value="4">审核中</a-select-option>
                        <a-select-option :value="5">审核拒绝</a-select-option>
                        <a-select-option :value="7">钱包失败,资产退回</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="创建时间" class="mr-22 width-500" name="time">
                    <DateRangePicker v-model="formState.time" @onChange="onSearch" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div class="display-flex">
                    <a-button
                        v-if="buttonPermissions('setPassword')"
                        block
                        type="primary"
                        size="small"
                        class="search-submit-btn ml-0"
                        @click="handleOnSettingSubmit('add')"
                    >
                        设置提币密码
                    </a-button>
                    <a-button
                        v-if="buttonPermissions('editPassword')"
                        block
                        type="primary"
                        size="small"
                        class="search-submit-btn ml-22"
                        @click="handleOnSettingSubmit('edit')"
                    >
                        修改提币密码
                    </a-button>
                    <a-button
                        v-if="buttonPermissions('withdrawalApplication')"
                        block
                        type="primary"
                        size="small"
                        class="search-submit-btn ml-22"
                        @click="backWithdrawCoin({}, 'add')"
                    >
                        提币申请
                    </a-button>
                    <a-button
                        v-if="buttonPermissions('export')"
                        block
                        type="primary"
                        size="small"
                        class="search-submit-btn ml-22"
                        @click="handExport"
                    >
                        导出
                    </a-button>
                    <!-- <a-button v-if="buttonPermissions('resetPassword')" block type="primary" size="small" class="search-submit-btn  ml-22" @click="handleOnSettingSubmit('reset')">重置提币密码</a-button> -->
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

        <div class="second-box">
            <amount-total
                :title-amount1="'到账总金额'"
                :title-amount2="'提币总金额'"
                :posting-amount-total="dataAmountTotal.toAmountTotal"
                :trans-amount-total="dataAmountTotal.withdrawAmountTotal"
            />
            <div class="second">
                页面刷新倒计时:<span class="second-number">{{ second }}秒</span>
            </div>
        </div>
        <a-table
            size="small"
            :pagination="paginationConfig"
            :loading="isLoading"
            :columns="tableColumns"
            :data-source="tableData"
            :scroll="{ x: 1100 }"
            @change="handleSizeChange"
        >
            <template
                #bodyCell="{ column: { dataIndex }, record: { agentType, txHash, fromAddress, id, manualRemark, sourceType, toAddress }, record }"
            >
                <template v-if="dataIndex === 'agentType'">
                    {{ agentType === 1 ? '平台' : agentType === 2 ? '其他' : '' }}
                </template>
                <template v-if="dataIndex === 'sourceType'">
                    {{ sourceType === 1 ? '用户' : '后台' }}
                </template>
                <template v-if="dataIndex === 'fromAddress'">
                    {{ fromAddress || '--' }}
                </template>
                <template v-if="dataIndex === 'txHash'">
                    {{ txHash || '--' }}
                </template>
                <template v-if="dataIndex === 'type'">
                    {{ record.type === 1 ? '' : record.type === 2 ? '提币' : '' }}
                </template>
                <template v-if="dataIndex === 'coinOutStatus'">
                    {{ record.coinOutStatus === 0 ? '待审核中' : '' }}
                    {{ record.coinOutStatus === 1 ? '可提币' : '' }}
                    {{ record.coinOutStatus === 2 ? '审核失败' : '' }}
                </template>
                <template v-if="dataIndex === 'state'">
                    {{ record.state === 1 ? '成功' : '' }}
                    {{ record.state === 2 ? '钱包处理中' : '' }}
                    {{ record.state === 3 ? '失败' : '' }}
                    {{ record.state === 4 ? '审核中' : '' }}
                    {{ record.state === 5 ? '审核拒绝' : '' }}
                    {{ record.state === 6 ? '' : '' }}
                    {{ record.state === 7 ? '钱包失败,资产退回' : '' }}
                </template>
                <template v-if="dataIndex === 'walletState'">
                    {{ record.walletState || '--' }}
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button
                        v-if="buttonPermissions('approve') && record.check === 1"
                        type="link"
                        :style="{ color: 'red' }"
                        @click="handleWithdrawOpenModal(record, 'edit')"
                    >
                        {{ record.checkType === 1 ? '提币初审' : '' }}
                        {{ record.checkType === 2 ? '提币复审' : '' }}
                    </a-button>
                    <a-button
                        v-if="buttonPermissions('reset') && record.walletState === 'faild' && record.failOpState === 1"
                        type="link"
                        :style="{ color: 'red' }"
                        @click="handleWithdrawOpenModal(record, 'add')"
                    >
                        重新提币
                    </a-button>
                    <a-button
                        v-if="buttonPermissions('return') && record.walletState === 'faild' && record.failOpState === 1"
                        type="link"
                        :style="{ color: 'red' }"
                        @click="backTransferAmount(record, 'add')"
                    >
                        退回资产
                    </a-button>
                    <a-button type="link" @click="handelAddRemark(id, manualRemark)">备注</a-button>
                </template>
            </template>
        </a-table>

        <BargainRematch :visible="isModalOpen" :type="modalType" :active-data="activeData" @onClose="handleCloseModal" @onSuccess="onSearch" />

        <SettingsModal
            :visible="isModalSettingOpen"
            :type="modalPasswordType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="onSearch"
        />
        <WithdrawModal
            v-if="isModalWithdrawOpen"
            :visible="isModalWithdrawOpen"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="onSearch"
        />
        <TransferAmount
            v-if="isModalWithdrawOpenTransferAmount"
            :visible="isModalWithdrawOpenTransferAmount"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="onSearch"
        />
        <WithdrawCoin
            v-if="isModalWithdrawOpenWithdrawCoin"
            :visible="isModalWithdrawOpenWithdrawCoin"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="onSearch"
        />
        <WithdrawManualRemark :id="manualId" :visible="remarkMoadl" :manual-remark="manualRemark" @onClose="handleCloseModal" @onSuccess="onSearch" />
    </div>
</template>

<style lang="scss" scoped>
.second-box {
    display: flex;
    justify-content: space-between;

    .amout-total-box {
        flex: 1;
    }

    .second {
        padding-right: 70px;
        color: #948080;
        margin-right: 10px;
        font-weight: 400;

        .second-number {
            color: #000;
            margin-left: 10px;
        }
    }
}
</style>
