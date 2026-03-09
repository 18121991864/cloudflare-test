<script lang="ts" setup>
import { reactive, ref, onActivated, onMounted, createVNode } from 'vue';
import { SearchOutlined, RedoOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, TableColumnType, message } from 'ant-design-vue';
import NProgress from 'nprogress';
import { useRoute } from 'vue-router';
import ModifyStatus from './Dialog/ModifyStatus.vue';
import FeeSetting from './Dialog/FeeSetting.vue';
import useTableConf from '@/use/useTableConf';
import CancelOrder from './Dialog/CancelOrder.vue';
import Log from './Dialog/Log.vue';
import api from '@/api/poboAPI/poboRemit';
import { timeStampToDate } from '@/filters/dateFormat';
import { downloadExcel, handleDownFile } from '@/utils/common';
import { poboRemitExcel, poboRemitDown } from '@/api/file/index';
import Reject from '../Modal/Reject.vue';

const logRef = ref();
const feeRef = ref();
const orderRef = ref();
const formRef = ref();
const modifyRef = ref();
const pdfCanvas = ref();
const rejectRef = ref();
const curId = ref(0);
const isExport = ref(false);
const tableData = ref<PromiseSelectReturnType<typeof api.list, 'list'>>([]);
const formState = reactive<{
    orderNo: string;
    accountId: string;
    orderNoQdpay: string; // 渠道订单号
    receiverId: string; // 收款人id
    remitterId: string; // 汇款人id
    state: number | null; // 状态
}>({
    orderNo: '',
    accountId: '',
    state: null,
    orderNoQdpay: '', // 渠道订单号
    receiverId: '', // 收款人id
    remitterId: '', // 汇款人id
});

const route = useRoute();

const tableColumns: TableColumnType[] = [
    { title: '订单号', dataIndex: 'orderNo', width: 180, fixed: 'left' },
    { title: '付款金额', dataIndex: 'paymentAmount' },
    { title: '汇出金额', dataIndex: 'collectionAmount' },
    { title: '汇率', dataIndex: 'exchangeRate' },
    { title: '手续费', dataIndex: 'exchangeFee', width: 120 },
    { title: '付款总额', dataIndex: 'paymentTotalAmount', width: 120 },
    { title: '退款金额', dataIndex: 'refundAmount' },
    { title: '汇款用途', dataIndex: 'purpose' },
    { title: '用户UID', dataIndex: 'accountId' },
    { title: '渠道订单号', dataIndex: 'orderNoQdpay' },
    { title: '认证状态', dataIndex: 'state' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '变更时间', dataIndex: 'updateTime' },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 260 },
];
// 0-待审核 1-审核中 2-内部驳回 3-渠道审核 4-渠道驳回 5-汇款中 6-已汇出 7-退款 8-退款中 9-已退款 10-取消订单 11-收款异常
const stateArr = [
    { label: '待审核', value: 0 },
    { label: '审核中', value: 1 },
    { label: '内部驳回', value: 2 },
    { label: '渠道审核', value: 3 },
    { label: '渠道驳回', value: 4 },
    { label: '汇款中', value: 5 },
    { label: '已汇出', value: 6 },
    { label: '退款', value: 7 },
    { label: '已退款', value: 9 },
    { label: '取消订单', value: 10 },
    { label: '收款异常', value: 11 },
    { label: '渠道取消', value: 12 },
];

const fetchTableData = () => {
    NProgress.start();
    isLoading.value = true;
    const { current, pageSize } = paginationConfig;
    api.list({ ...formState, pageNo: current, pageSize })
        .then(({ list, totalSize, pageNo }) => {
            updatePagination(pageNo, pageSize, totalSize);
            tableData.value = list.map((item) => ({ ...item, isLoading: false }));
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
        });
};

const onFeeDialog = (): void => {
    feeRef.value.onShowDialog(true);
};

const handleResetForm = (): void => {
    // 重置表单
    formRef.value.resetFields();
    onSearch();
};

onActivated(() => {
    if (route.hash === '#no-refresh') return; // 不需要刷新
    handleResetForm();
});

const onRefund = (id: number): void => {
    // 退款
    Modal.confirm({
        title: '退款',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确认退款后，汇款服务将终止，用户冻结金额将返还至钱包账户。',
        okText: '确定',
        cancelText: '取消',
        onOk() {
            api.refund({ id }).then(() => {
                onSearch();
                message.success('操作成功');
            });
        },
    });
};

const onExport = async () => {
    // 导出文件
    isExport.value = true;
    const { current, pageSize } = paginationConfig;
    const r = await poboRemitExcel({ ...formState, pageNo: current, pageSize });
    downloadExcel(r, '汇款订单');
    isExport.value = false;
    message.success('导出成功');
};

const onReject = (params: number): void => {
    curId.value = params;
    api.rejectReason(params).then((r) => {
        rejectRef.value.onShowDialog(true, r.reject);
    });
};

const getFormVal = ({ reject }: { reject: string }): void => {
    api.reject({ id: curId.value, reject }).then(() => {
        rejectRef.value.onShowDialog(false, '');
        rejectRef.value.clearFormState();
        message.success('操作成功');
        onSearch();
    });
};

const onModifyDialog = (id: number): void => {
    // 打开修改状态弹窗
    modifyRef.value.onShowDialog(true, id);
};

const onLog = (id: number): void => {
    // 打开日志抽屉
    logRef.value.onShowDialog(true, id);
};

const onCancelOrder = (id: number): void => {
    // 取消订单
    orderRef.value.onShowDialog(true, id);
};

const onStatus = (): void => {
    // 打开获取状态弹窗
    Modal.confirm({
        title: '提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: '确认获取认证状态？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
            api.updateQdPayState().then(() => {
                onSearch();
                message.success('操作成功');
            });
        },
    });
};

const onDownFile = (id: number, i: number) => {
    tableData.value[i].isLoading = true;
    poboRemitDown({ id })
        .then((r) => {
            handleDownFile(r, String(timeStampToDate(new Date().getTime())));
            message.success('下载成功');
        })
        .finally(() => {
            tableData.value[i].isLoading = false;
        });
};

const onOpen = (val: string) => {
    window.location.href = val;
};

const getImageUrl = (val: string): string => {
    const arr = val.split(',');
    return arr.length > 1 ? arr[0] : val;
};

const getImageArr = (val: string): string[] => val.split(',');

const { isLoading, onSearch, paginationConfig, handleSizeChange, updatePagination } = useTableConf(fetchTableData);

// 获取状态
const getStateVal = (val: number): string => stateArr.find(({ value }) => val === value)?.label || '-';

onMounted(fetchTableData);
</script>

<template>
    <div class="table-container">
        <Log ref="logRef" />
        <FeeSetting ref="feeRef" @updateTable="onSearch" />
        <Reject ref="rejectRef" @setFormState="getFormVal" />
        <CancelOrder ref="orderRef" @updateTable="onSearch" />
        <ModifyStatus ref="modifyRef" @updateTable="onSearch" />
        <a-form ref="formRef" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="订单号" class="mr-22 width-250" name="orderNo">
                    <a-input v-model:value="formState.orderNo" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="用户UID" class="mr-22 width-250" name="accountId">
                    <a-input v-model:value="formState.accountId" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="渠道订单号" class="mr-22 width-250" name="orderNoQdpay">
                    <a-input v-model:value="formState.orderNoQdpay" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="认证状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择" @change="onSearch">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option v-for="item of stateArr" :key="item.value" :value="item.value">{{ item.label }} </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <a-space :size="20">
                    <a-button
                        v-if="buttonPermissions('remittance-order-export')"
                        size="small"
                        :loading="isExport"
                        type="primary"
                        @click.stop="onExport"
                        >导出
                    </a-button>
                    <a-button v-if="buttonPermissions('remittance-order-status')" block type="primary" size="small" class="ml-0" @click="onStatus">
                        获取认证状态
                    </a-button>
                    <a-button v-if="buttonPermissions('remittance-order-fee')" block type="primary" size="small" class="ml-0" @click="onFeeDialog">
                        手续费设置
                    </a-button>
                </a-space>
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
        <a-table
            size="small"
            :loading="isLoading"
            :pagination="paginationConfig"
            :columns="tableColumns"
            :row-key="
                ({ id }) => {
                    return id;
                }
            "
            :data-source="tableData"
            :scroll="{ x: 1800 }"
            @change="handleSizeChange"
        >
            <template #bodyCell="{ column: { dataIndex }, record, index }">
                <template v-if="dataIndex === 'state'">
                    {{ getStateVal(record.state) }}
                </template>
                <template v-if="dataIndex === 'orderNoQdpay'">
                    {{ record.orderNoQdpay || '--' }}
                </template>
                <template v-if="dataIndex === 'paymentAmount'"> {{ record.paymentAmount }} USDT</template>
                <template v-if="dataIndex === 'collectionAmount'"> {{ record.collectionAmount }} USD</template>
                <template v-if="dataIndex === 'paymentTotalAmount'"> {{ record.paymentTotalAmount }} USDT</template>
                <template v-if="dataIndex === 'exchangeFee'"> {{ record.exchangeFee }} USD</template>

                <template v-if="dataIndex === 'action'">
                    <a-button
                        v-if="buttonPermissions('remittance-order-down')"
                        :loading="record.isLoading"
                        type="link"
                        @click="onDownFile(record.id, index)"
                    >
                        下载
                    </a-button>
                    <a-button v-if="buttonPermissions('remittance-order-edit')" type="link" @click="onModifyDialog(record.id)"> 修改状态 </a-button>
                    <a-button v-if="buttonPermissions('remittance-order-log')" type="link" @click="onLog(record.id)"> 操作日志 </a-button>
                    <a-button v-if="record.reject && buttonPermissions('remittance-order-reject')" type="link" @click="onReject(record.id)">
                        驳回
                    </a-button>
                    <a-button
                        v-if="
                            (record.state === 7 || record.state === 2 || record.state === 4 || record.state === 12) &&
                            buttonPermissions('remittance-order-cancel-refund')
                        "
                        type="link"
                        danger
                        @click.stop="onRefund(record.id)"
                        >退款
                    </a-button>
                </template>
                <template v-if="dataIndex === 'refundAmount' && record.refundAmount === null">
                    {{ record.refundAmount || '--' }}
                </template>
                <template v-else-if="dataIndex === 'refundAmount'"> {{ record.refundAmount }} {{ record.refundCurrency }} </template>
            </template>
        </a-table>
    </div>
</template>
