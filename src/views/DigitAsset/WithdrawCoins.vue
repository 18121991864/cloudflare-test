<template>
    <div class="table-container">
        <audio ref="soundeRef" :src="mp3" controls hidden></audio>
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="订单号" class="mr-22 width-250" name="orderNo">
                    <a-input v-model:value="formState.orderNo" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="所属代理商" class="mr-22 width-250" name="agentName">
                    <a-input v-model:value="formState.agentName" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="历史代理商" class="mr-22 width-250" name="historyAgentName">
                    <a-input v-model:value="formState.historyAgentName" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="hash" class="mr-22 width-250" name="hash">
                    <a-input v-model:value="formState.hash" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">成功</a-select-option>
                        <a-select-option :value="2">钱包处理中</a-select-option>
                        <a-select-option :value="3">失败</a-select-option>
                        <a-select-option :value="4">审核中</a-select-option>
                        <a-select-option :value="5">审核拒绝</a-select-option>
                        <a-select-option :value="7">钱包失败,资产退回</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="审核状态" class="mr-22 width-250" name="checkState">
                    <a-select v-model:value="formState.checkState" size="small" placeholder="请选择">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option :value="item.code" v-for="item in checkStateList" :key="item.code">{{ item.name }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="提币方式" class="mr-22 w-[300px]" name="withdrawType">
                    <a-select v-model:value="formState.withdrawType" :mode="ismultiple" size="small" placeholder="请选择">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option v-for="item of withdrawTypeList" :key="item.value" :value="item.value">{{ item.label }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="创建时间" class="mr-22 width-500" name="time">
                    <DateRangePicker
                        v-model="formState.time"
                        :default-select-option="{
                            time: 12,
                        }"
                    />
                </a-form-item>
                <a-form-item label="用户UID" class="mr-22 width-250" name="accountId">
                    <a-input v-model:value="formState.accountId" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="用户标签" class="mr-22 width-250" name="labelId">
                    <SLabelIds v-model="formState.labelId" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div class="display-flex">
                    <a-button
                        v-if="buttonPermissions('setPassword')"
                        block
                        type="primary"
                        size="small"
                        class="ml-0 search-submit-btn"
                        @click="handleOnSettingSubmit('add')"
                        >设置提币密码
                    </a-button>
                    <a-button
                        v-if="buttonPermissions('editPassword')"
                        block
                        type="primary"
                        size="small"
                        class="search-submit-btn ml-22"
                        @click="handleOnSettingSubmit('edit')"
                        >修改提币密码
                    </a-button>
                    <a-button
                        v-if="buttonPermissions('withdrawalApplication')"
                        block
                        type="primary"
                        size="small"
                        class="search-submit-btn ml-22"
                        @click="backWithdrawCoin({}, 'add')"
                        >提币申请
                    </a-button>
                    <a-button v-if="buttonPermissions('export')" block type="primary" size="small" class="search-submit-btn ml-22" @click="handExport"
                        >导出
                    </a-button>
                    <!-- <a-button v-if="buttonPermissions('resetPassword')" block type="primary" size="small" class="search-submit-btn ml-22" @click="handleOnSettingSubmit('reset')">重置提币密码</a-button> -->
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
            :pagination="false"
            :loading="loading"
            :columns="tableColumns"
            :row-key="
                ({ id }) => {
                    return id;
                }
            "
            :data-source="tableData"
            :scroll="{ x: 1500 }"
        >
            <template
                #bodyCell="{
                    column: { dataIndex },
                    record: { agentType, txHash, fromAddress, id, manualRemark, sourceType, labelList, labelNames, checkStateName },
                    record,
                    text,
                }"
            >
                <template v-if="dataIndex === 'labelList'">
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
                <template v-if="dataIndex === 'checkStateName'">
                    {{ checkStateName || '--' }}
                </template>
                <template v-if="dataIndex === 'type'">
                    {{ record.type === 1 ? '' : record.type === 2 ? '提币' : '' }}
                    {{ record.adjustTypeName ? '-' : '' }} {{ record.adjustTypeName }}
                </template>
                <template v-if="dataIndex === 'coinOutStatus'">
                    {{ record.coinOutStatus === 0 ? '待审核中' : '' }}
                    {{ record.coinOutStatus === 1 ? '可提币' : '' }}
                    {{ record.coinOutStatus === 2 ? '审核失败' : '' }}
                </template>
                <template v-if="['toAddress', 'chainTag','walletTypeName'].includes(dataIndex as string)">
                    {{ text || '--' }}
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
                        v-if="
                            !record.adjustTypeName &&
                            buttonPermissions('approve') &&
                            record.check === 1 &&
                            record.checkType === 1 &&
                            checkState(record)
                        "
                        type="link"
                        :style="{ color: 'red' }"
                        @click="handleWithdrawOpenModal(record, 'edit')"
                    >
                        提币初审
                    </a-button>

                    <a-button
                        v-if="
                            !record.adjustTypeName &&
                            buttonPermissions('withdrawalReview') &&
                            checkState(record) &&
                            record.check === 1 &&
                            record.checkType === 2
                        "
                        type="link"
                        :style="{ color: 'red' }"
                        @click="handleWithdrawOpenModal(record, 'edit')"
                    >
                        提币复审
                    </a-button>
                    <a-button
                        v-if="!record.adjustTypeName && buttonPermissions('reset') && record.walletState === 'faild' && record.failOpState === 1"
                        type="link"
                        :style="{ color: 'red' }"
                        @click="handleWithdrawOpenModal(record, 'add')"
                    >
                        重新提币
                    </a-button>
                    <!-- v-if="buttonPermissions('return')&&record.walletState==='faild'" -->
                    <a-button
                        v-if="!record.adjustTypeName && buttonPermissions('return') && record.walletState === 'faild' && record.failOpState === 1"
                        type="link"
                        :style="{ color: 'red' }"
                        @click="backTransferAmount(record, 'add')"
                    >
                        退回资产
                    </a-button>
                    <a-button
                        v-if="!record.adjustTypeName && record.sourceType != 2 && buttonPermissions('remark')"
                        type="link"
                        @click="handelAddRemark(id, manualRemark)"
                        >备注</a-button
                    >
                    <a-button type="link" v-if="record.state === 2 && buttonPermissions('hasten')" @click="updateSiteWallet(record.id)"
                        >加速</a-button
                    >
                    <!-- <a-popconfirm v-if="buttonPermissions('return')&&record.walletState==='faild'" okType="danger" :title="`退回提币失败的资产`" @confirm="backTransferAmount(record?.id)">
                      <template #icon><question-circle-outlined :style="{color: 'red'}" /></template>
                      <a-button type="link" danger>退回资产</a-button>
                    </a-popconfirm> -->
                </template>
            </template>
        </a-table>

        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />

        <BargainRematch :visible="isModalOpen" :type="modalType" :active-data="activeData" @onClose="handleCloseModal" @onSuccess="handleOnSubmit" />

        <SettingsModal
            :visible="isModalSettingOpen"
            :type="modalPasswordType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmit"
        />
        <WithdrawModal
            v-if="isModalWithdrawOpen"
            :visible="isModalWithdrawOpen"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmit"
        />
        <WithdrawModalTransferAmount
            v-if="isModalWithdrawOpenTransferAmount"
            :visible="isModalWithdrawOpenTransferAmount"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmit"
        />
        <WithdrawModalWithdrawCoin
            v-if="isModalWithdrawOpenWithdrawCoin"
            :visible="isModalWithdrawOpenWithdrawCoin"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmit"
        />
        <WithdrawManualRemark
            :id="manualId"
            :visible="remarkMoadl"
            :manual-remark="manualRemark"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmit"
        />
        <hasten ref="addRef" @update-table="handleOnSubmit" />
    </div>
</template>

<script lang="ts" setup>
import mp3 from '@/assets/mp3/dingding.mp3';
import { computed, ComputedRef, defineComponent, nextTick, reactive, ref, onActivated, onMounted, onDeactivated, onBeforeUnmount } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { SearchOutlined, RedoOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import api from '@/api/asset/index';
import { PagingDefaultConf } from '@/utils/constant';
import BargainRematch from './BargainRematch.vue';
import SettingsModal from './SettingsModal.vue';
import WithdrawModal from './WithdrawModal.vue';
import WithdrawModalTransferAmount from './WithdrawModalTransferAmount.vue';
import WithdrawModalWithdrawCoin from './WithdrawModalWithdrawCoin.vue';
import WithdrawManualRemark from './WithdrawManualRemark.vue';
import { downloadExcel } from '@/utils/common';
import type { withdrawAmountTotal } from '@/api/asset/types.d';
import AmountTotal from '@/views/Billing/components/AmounTotal.vue';
import useUser from '@/store/user';
import hasten from './Modal/hasten.vue';
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 200 },
    { title: '链', dataIndex: 'chainTag', width: 80 },
    { title: '创建时间', dataIndex: 'createTime', width: 120 },
    { title: '平台实得手续费', dataIndex: 'feeAmount', width: 120 },
    { title: '钱包提币手续费', dataIndex: 'walletFeeAmount', width: 120 },
    { title: '订单号', dataIndex: 'orderNo', width: 250 },
    { title: '用户UID', dataIndex: 'accountId', width: 200 },
    { title: '所属代理商', dataIndex: 'agentName', width: 100 },
    { title: '历史代理商', dataIndex: 'historyAgentName', width: 120 },
    { title: '用户标签', dataIndex: 'labelList', width: 200 },
    { title: '总金额', dataIndex: 'amount', width: 100 },
    { title: '到账金额', dataIndex: 'toAmount', width: 120 },
    { title: '提币方式', dataIndex: 'withdrawTypeStr', width: 100 },
    // { title: '审核状态', dataIndex: 'coinOutStatus', width: 80 },
    { title: '来源地址/源账户', dataIndex: 'fromAddress', width: 200 },
    { title: '币种', dataIndex: 'symbol', width: 120 },
    { title: '目标地址/目标账户', dataIndex: 'toAddress', width: 200 },
    { title: 'hash', dataIndex: 'txHash', width: 200 },
    { title: '提现来源', dataIndex: 'sourceTypeStr', width: 200 },
    { title: '备注', dataIndex: 'manualRemark', width: 200 },
    { title: '类型', dataIndex: 'typeStr', width: 120 },
    { title: '发起人', dataIndex: 'sourceType', width: 100 },
    { title: '提币路径', dataIndex: 'walletTypeName', width: 150 },
    { title: '手续费等级', dataIndex: 'feeLevelName', width: 100 },
    { title: '钱包状态', dataIndex: 'walletState', width: 120 },
    { title: '审核状态', dataIndex: 'checkStateName', width: 100 },
    { title: '状态', dataIndex: 'state', fixed: 'right', width: 100 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 240 },
]);
// 1、UID提币 2、手机号提币 3、邮箱提币 4、内部地址提币 5、链上提币
// const withdrawTypeList = [
//     { label: 'UID提币', value: 1 },
//     { label: '手机号提币', value: 2 },
//     { label: '邮箱提币', value: 3 },
//     { label: '内部地址提币', value: 4 },
//     { label: '链上提币', value: 5 },
// ];
const withdrawTypeList = ref<{ label: string; value: number }[]>([]);
// fetchTransactionCheckTransfer 审核提币
// fetchTransactionBackTransferAmount 退回提币失败的资产
// fetchTransactionSetTradePwd 设置提币钱包密码

const userStore = useUser();
const addRef = ref();
userStore.fetchTagList();

const soundeRef = ref<HTMLAudioElement | null>(null);
const timeValue = ref<any>(null);
const TotalNumber = ref(JSON.parse(window.sessionStorage.getItem('TotalNumber') || '0'));
const dataAmountTotal = ref<withdrawAmountTotal>({
    toAmountTotal: '0.0',
    withdrawAmountTotal: '0.0',
});
const second = ref(60);
const remarkMoadl = ref(false);
const manualRemark = ref('');
const manualId = ref('');
const autoplay = ref(false);
const formState = reactive<{
    time: string[];
    orderNo: string; // hash
    hash: string; // 订单号
    state: 0 | 1 | 2 | 3 | 4 | 5; // 状态 1、成功 2、钱包处理中 3、失败 4、审核中 5、审核拒绝
    accountId?: string; // 用户ID
    labelId?: string | null; // 标签ID
    withdrawType: any;
    agentName: string;
    historyAgentName: string;
    checkState: null;
}>({
    orderNo: '',
    hash: '',
    state: 4,
    time: [],
    agentName: '',
    accountId: undefined,
    labelId: null,
    withdrawType: 5,
    historyAgentName: '',
    checkState: null,
});

const pagination = reactive({ ...PagingDefaultConf });
const withdrawType = ref('');
const loading = ref(false);
const tableData = ref(Object.create([]));
const checkStateList = ref<PromiseReturnType<typeof api.transactionWithdrawCheckStateList>>([]);
const handleOnSubmit = () => {
    endTimePlay();
    loading.value = true;
    NProgress.start();
    const { time, ...params } = formState;
    const [startTime, endTime] = time;
    const { pageNo, pageSize } = pagination;

    api.fetchTransactionWithdrawList({
        ...params,
        startTime,
        endTime,
        pageNo,
        pageSize,
        withdrawType: withdrawType.value,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchTransactionWithdrawList>) => {
            [tableData.value, pagination.total] = [list, totalSize];

            if (TotalNumber.value && totalSize > TotalNumber.value) {
                startPlay();
                message.success('当前新增了一条新的数据,请注意查看');
            }
            TotalNumber.value = totalSize;
            sessionStorage.setItem('TotalNumber', JSON.stringify(totalSize));
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
            startTimePlay();
        });

    api.fetchgetWithdrawAmountTotal({
        ...params,
        startTime,
        endTime,
        pageNo,
        pageSize,
        withdrawType: withdrawType.value,
    })
        .then((list) => {
            dataAmountTotal.value.toAmountTotal = list.toAmountTotal;
            dataAmountTotal.value.withdrawAmountTotal = list.withdrawAmountTotal;
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};
const ismultiple = computed(() => {
    return withdrawType.value ? 'multiple' : '';
});
const loadExportExcel = ref(false);
const handExport = () => {
    loading.value = true;
    NProgress.start();
    const { time, ...params } = formState;
    const [startTime, endTime] = time;
    const { pageNo, pageSize } = pagination;
    api.fetchwithdrawExport({
        ...params,
        startTime,
        endTime,
        pageNo,
        pageSize,
        withdrawType: withdrawType.value,
    })
        .then((r) => {
            downloadExcel(r, '提币');
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
    withdrawType.value = '';
    handleOnSubmit();
};

const handleSearch = () => {
    pagination.pageNo = 1;
    handleOnSubmit();
};
const changeWithdrawType = () => {
    if (Array.isArray(formState.withdrawType) && formState.withdrawType.includes(null)) {
        withdrawType.value = '';
        formState.withdrawType = null;
        handleSearch();
        return false;
    }
    if (typeof formState.withdrawType === 'object' && Object.keys(formState.withdrawType).length === 0) {
        withdrawType.value = '';
        formState.withdrawType = null;
    }

    if (!formState.withdrawType) {
        withdrawType.value = '';
        formState.withdrawType = null;
    } else {
        const type = Array.isArray(formState.withdrawType) ? formState.withdrawType.join(',') : String(formState.withdrawType);
        withdrawType.value = type;
    }
    handleSearch();
};
// const startTimePlay = () => {
//   if (timeValue.value) {
//     endTimePlay();
//   }
//   timeValue.value = setInterval(() => {
//     handleOnSubmit();
//   }, 1000 * 60);

// };
const startTimePlay = () => {
    if (timeValue.value) {
        endTimePlay();
    }
    timeValue.value = setInterval(async () => {
        second.value--;
        if (second.value == 0) {
            second.value = 60;
            await handleOnSubmit();
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
const handDepositListExport = () => {
    const { pageNo, pageSize } = pagination;
    if (loadDepositListExportExcel.value) return;
    loadDepositListExportExcel.value = true;
    // api.fetchDepositListExcelWriter({
    //     ...formState,
    //     pageNo,
    //     pageSize
    // }).then((r: PromiseReturnType<typeof api.fetchDepositListExcelWriter>) => {
    //     downloadExcel(r, '充值管理');
    // }).finally(() => {
    //     loadDepositListExportExcel.value = false;
    // });
};

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
const depositTypeList = () => {
    api.transactionWithdrawTypeList().then((res) => {
        // console.log('res', res);
        res.forEach((item) => {
            withdrawTypeList.value.push({
                label: item.name,
                value: item.code,
            });
        });
    });
};
const transactionWithdrawCheckStateList = async () => {
    const res = await api.transactionWithdrawCheckStateList();
    checkStateList.value = res;
};
onActivated(() => {
    handleOnSubmit();
    startTimePlay();
    depositTypeList();
    transactionWithdrawCheckStateList();
});
const endPlay = () => {
    if (soundeRef.value) {
        soundeRef.value.pause();
        soundeRef.value.currentTime = 0;
    }
    endTimePlay();
};
onDeactivated(() => {
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
const updateSiteWallet = (id: string) => {
    addRef.value.onShowDialog(true, id);
};
const checkState = computed(() => {
    return (record: PromiseSelectReturnType<typeof api.fetchTransactionWithdrawList, 'list'>[0]) => {
        return record.checkState == 5 || record.checkState === null;
    };
});
</script>
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
