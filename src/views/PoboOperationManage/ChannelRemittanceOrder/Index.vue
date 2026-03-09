<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { message, TableColumnType } from 'ant-design-vue';
import NProgress from 'nprogress';
import { useRoute } from 'vue-router';
import useTableConf from '@/use/useTableConf';
import api from '@/api/ditchAPI/ditchRemit';
import { ditchRemitExcel } from '@/api/file/index';
import { downloadExcel } from '@/utils/common';

const formRef = ref();
const isExport = ref(false);
const tableData = ref<PromiseSelectReturnType<typeof api.list, 'list'>>([]);
const formState = reactive<{
    orderNumber: string; // 渠道订单
    partnerOrderNumber: string; // 订单号
    receiverId: string; // 收款人ID
    remitterId: string; // 汇款人ID
    state: string | null; // 状态：AUDITING-审核中 REJECT-驳回 REMITTED-已汇出 REMITTING-汇款中 REFUND-已退款 CLOSED-已关闭 RECEIVE_ABNORMAL-收款异常
}>({
    orderNumber: '',
    partnerOrderNumber: '',
    receiverId: '',
    remitterId: '',
    state: null,
});

const route = useRoute();

const tableColumns: TableColumnType[] = [
    { title: '订单号', dataIndex: 'partnerOrderNumber', width: 180, fixed: 'left' },
    { title: '渠道订单号', dataIndex: 'orderNumber' },
    { title: '支付金额', dataIndex: 'paymentAmount' },
    { title: '汇款金额', dataIndex: 'remitAmount' },
    { title: '汇率', dataIndex: 'exchangeRate' },
    { title: '手续费', dataIndex: 'handleFee' },
    { title: '支付总额', dataIndex: 'totalPayment' },
    { title: '退款金额', dataIndex: 'refundAmount' },
    { title: '收款人ID', dataIndex: 'receiverId' },
    { title: '收款人姓名', dataIndex: 'receiverName' },
    { title: '汇款人ID', dataIndex: 'remitterId' },
    { title: '汇款人姓名', dataIndex: 'remitterName' },
    { title: '认证状态', dataIndex: 'status' },
    { title: '完成时间', dataIndex: 'finishedTime' },
];
// 状态：AUDITING-审核中 REJECT-驳回 REMITTED-已汇出 REMITTING-汇款中 REFUND-已退款 CLOSED-已关闭 RECEIVE_ABNORMAL-收款异常
const stateArr = [
    { label: '审核中', value: 'AUDITING' },
    { label: '驳回', value: 'REJECT' },
    { label: '已汇出', value: 'REMITTED' },
    { label: '汇款中', value: 'REMITTING' },
    { label: '已退款', value: 'REFUND' },
    { label: '已关闭', value: 'CLOSED' },
    { label: '已取消', value: 'CANCELED' },
    { label: '收款异常', value: 'RECEIVE_ABNORMAL' },
];

const fetchTableData = () => {
    NProgress.start();
    isLoading.value = true;
    const { current, pageSize } = paginationConfig;
    api.list({ ...formState, pageNo: current, pageSize })
        .then(({ list, totalSize, pageNo }) => {
            updatePagination(pageNo, pageSize, totalSize);
            tableData.value = list;
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
        });
};

const onExport = async () => {
    // 导出文件
    isExport.value = true;
    const { current, pageSize } = paginationConfig;
    const r = await ditchRemitExcel({ ...formState, pageNo: current, pageSize });
    downloadExcel(r, '渠道汇款订单');
    isExport.value = false;
    message.success('导出成功');
};

const handleResetForm = (): void => {
    // 重置表单
    formRef.value.resetFields();
    onSearch();
};

const { isLoading, onSearch, paginationConfig, handleSizeChange, updatePagination } = useTableConf(fetchTableData);

// 获取状态
const getStateVal = (val: number): string => stateArr.find(({ value }) => val === value)?.label || '--';

onMounted(fetchTableData);
</script>

<template>
    <div class="table-container">
        <a-form ref="formRef" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="订单号" class="mr-22 width-250" name="partnerOrderNumber">
                    <a-input v-model:value="formState.partnerOrderNumber" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="渠道订单号" class="mr-22 width-250" name="orderNumber">
                    <a-input v-model:value="formState.orderNumber" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="汇款人ID" class="mr-22 width-250" name="remitterId">
                    <a-input v-model:value="formState.remitterId" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="收款人ID" class="mr-22 width-250" name="receiverId">
                    <a-input v-model:value="formState.receiverId" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="认证状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择" @change="onSearch">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option v-for="item of stateArr" :key="item.value" :value="item.value">{{ item.label }} </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div>
                    <a-button
                        v-if="buttonPermissions('channel-remittance-order-export')"
                        size="small"
                        :loading="isExport"
                        type="primary"
                        @click.stop="onExport"
                        >导出
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
            :scroll="{ x: 1600 }"
            @change="handleSizeChange"
        >
            <template #bodyCell="{ column: { dataIndex }, record }">
                <template v-if="dataIndex === 'status'">
                    {{ getStateVal(record.status) }}
                </template>
                <template v-if="dataIndex === 'paymentAmount'"> {{ record.paymentAmount }} USD</template>
                <template v-if="dataIndex === 'totalPayment'"> {{ record.totalPayment }} USD</template>

                <template v-if="dataIndex === 'remitAmount'"> {{ record.remitAmount }} USD</template>
                <template v-if="dataIndex === 'handleFee'"> {{ record.handleFee }} USD</template>
                <template v-if="dataIndex === 'refundAmount' && record.refundAmount === null">
                    {{ record.refundAmount || '--' }}
                </template>
                <template v-else-if="dataIndex === 'refundAmount'"> {{ record.refundAmount }} {{ record.refundCurrency }} </template>
            </template>
        </a-table>
    </div>
</template>
