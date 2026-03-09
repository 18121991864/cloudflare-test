<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="链充币订单号" class="mr-22 width-250" name="depositOrderNo">
                    <a-input v-model:value="formState.depositOrderNo" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="链提币订单号" class="mr-22 width-250" name="withdrawOrderNo">
                    <a-input v-model:value="formState.withdrawOrderNo" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="status">
                    <a-select v-model:value="formState.status" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="item.value" v-for="item in withdrawStateSelect" :key="item.value">{{ item.label }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="提现类型" class="mr-22 width-250" name="withdrawType">
                    <a-select v-model:value="formState.withdrawType" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="item.value" v-for="item in withdrawTypeSelect" :key="item.value">{{ item.label }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="代理商编号" class="mr-22 width-250" name="agentNo">
                    <a-input v-model:value="formState.agentNo" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="审核状态" class="mr-22 width-250" name="reviewStatus">
                    <a-select v-model:value="formState.reviewStatus" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="item.value" v-for="item in withdrawReviewStatusSelect" :key="item.value">{{
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
            :scroll="{ x: 2600 }"
        >
            <template #bodyCell="{ column: { dataIndex }, record, record: { reviewStatusName, statusName } }">
                <template v-if="['rechargeStatus', 'withdrawStatus'].includes(dataIndex)">
                    <div :class="record[dataIndex] === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ stateText(record[dataIndex]) }}
                    </div>
                </template>
                <template v-else-if="['reviewStatus'].includes(dataIndex)">
                    <div :class="record.reviewStatus === 5 ? 'text-color-green' : 'text-color-red'">
                        {{ reviewStatusName }}
                    </div>
                </template>
                <template v-else-if="['status'].includes(dataIndex)">
                    <div :class="record.status === 6 ? 'text-color-green' : 'text-color-red'">
                        {{ statusName }}
                    </div>
                </template>
                <template v-else-if="['fromAddress', 'depositOrderNo', 'withdrawOrderNo', 'txHash'].includes(dataIndex)">
                    <div v-if="!record[dataIndex]">--</div>
                    <a-tooltip :title="record[dataIndex]" placement="topLeft">
                        <div class="w-36 truncate">
                            {{ record[dataIndex] }}
                        </div>
                    </a-tooltip>
                </template>
                <template v-else-if="dataIndex === 'operate'">
                    <!-- 1 初审 3 复审  是否有初审人员权个限这-->
                    <a-button
                        type="link"
                        @click="handlAudit(record)"
                        v-if="[1].includes(record.reviewStatus) && record.isPreReview && buttonPermissions('withdrawCoins-preliminary-review')"
                    >
                        初审
                    </a-button>
                    <a-button
                        type="link"
                        @click="handlAudit(record)"
                        v-if="[3].includes(record.reviewStatus) && record.isReexamination && buttonPermissions('withdrawCoins-reexamination')"
                    >
                        复审
                    </a-button>
                    <!-- 2 初审拒绝 4 复审拒绝 5审核完成 -->
                    <a-button
                        type="link"
                        @click="handlAuditDetail(record)"
                        v-if="[2, 4, 5].includes(record.reviewStatus) && buttonPermissions('withdrawCoins-review-details')"
                    >
                        审核详情
                    </a-button>
                    <!-- 审核拒绝/钱包失败 -->
                    <a-button
                        type="link"
                        @click="handleReWithdraw(record)"
                        v-if="[2, 5].includes(record.status) && buttonPermissions('withdrawCoins-again-withdraw-coins')"
                        class="text-color-red"
                    >
                        重新提币
                    </a-button>
                    <!-- .当提币类型是“外部提币”时，审核完成并且通过后，状态为“待提交”， 提交转账结果 -->
                    <!-- -->
                    <a-button
                        type="link"
                        v-if="[3].includes(record.status) && record.withdrawType === 3 && buttonPermissions('withdrawCoins-submit-transfer')"
                        @click="handleTransferResult(record)"
                    >
                        提交转账结果
                    </a-button>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
        <AuditModal v-model:visible="isModalOpen" :editData="activeData" @onSuccess="handleOnSubmit" />
        <AuditDetailModal v-model:visible="isAuditDetailModalOpen" :editData="activeData" @success="handleOnSubmit" />
        <TransferResultModal v-model:visible="isTransferResultModalOpen" :editData="activeData" @onSuccess="handleOnSubmit" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, createVNode, onActivated, reactive, ref } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';

import api from '@/newApi/digitAsset/withdraw/index';
import { PagingDefaultConf } from '@/utils/constant';
import AuditModal from './Modal/AuditModal/index.vue';
import AuditDetailModal from './Modal/AuditDetail/index.vue';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';
import TransferResultModal from './Modal/TransferResult/index.vue';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id' },
    { title: '链', dataIndex: 'chainSymbol' },
    { title: '币种', dataIndex: 'coinSymbol' },
    { title: '链充币订单号', dataIndex: 'depositOrderNo' },
    { title: '提币订单号 ', dataIndex: 'withdrawOrderNo' },
    { title: '提币类型 ', dataIndex: 'withdrawTypeName' },
    { title: '用户UID', dataIndex: 'uid' },
    { title: '代理商编号 ', dataIndex: 'agentNo' },
    { title: '总金额 ', dataIndex: 'applyAmount' },
    { title: '平台提币手续费', dataIndex: 'fee' },
    { title: '到账金额', dataIndex: 'actualReceivedAmount' },
    { title: '提币地址  ', dataIndex: 'fromAddress' },
    { title: '提币路径', dataIndex: 'withdrawAddressName' },
    { title: '目标地址  ', dataIndex: 'toAddress' },
    { title: 'hash ', dataIndex: 'txHash' },
    { title: '审核状态', dataIndex: 'reviewStatus' },
    { title: '钱包状态', dataIndex: 'walletStatusName' },
    { title: '状态', dataIndex: 'status' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '操作', dataIndex: 'operate' },
]);

const formState = reactive({
    agentNo: '',
    depositOrderNo: '',
    reviewStatus: '',
    status: '',
    uid: '',
    withdrawOrderNo: '',
    withdrawType: '',
});
const isModalOpen = ref(false);
const isAuditDetailModalOpen = ref(false);
const isTransferResultModalOpen = ref(false);
const activeData = ref<PromiseReturnType<typeof api.getWithdrawList>['list'][0]>(Object.create(null));
const withdrawStateSelect = ref<PromiseReturnType<typeof api.getWithdrawStateSelect>>([]);
const withdrawTypeSelect = ref<PromiseReturnType<typeof api.getWithdrawTypeSelect>>([]);
const withdrawReviewStatusSelect = ref<PromiseReturnType<typeof api.getWithdrawReviewStatusSelect>>([]);
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
    api.getWithdrawList({
        ...formState,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.getWithdrawList>) => {
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
    getDepositStateSelect();
    getDepositRiskLevelSelect();
    getWithdrawTypeSelect();
    if (route.query.orderNo) {
        formState.depositOrderNo = route.query.orderNo as string;
        handleOnSubmit();
        return;
    }
    if (route.hash === '#no-refresh') return;

    handleResetForm();
});
const handlAudit = (record: PromiseReturnType<typeof api.getWithdrawList>['list'][0]) => {
    activeData.value = record;
    isModalOpen.value = true;
};
const getDepositStateSelect = async () => {
    const res = await api.getWithdrawStateSelect();
    withdrawStateSelect.value = res;
};
const getWithdrawTypeSelect = async () => {
    const res = await api.getWithdrawTypeSelect();
    withdrawTypeSelect.value = res;
};
const handleTransferResult = (record: PromiseReturnType<typeof api.getWithdrawList>['list'][0]) => {
    activeData.value = record;
    isTransferResultModalOpen.value = true;
};
const getDepositRiskLevelSelect = async () => {
    const res = await api.getWithdrawReviewStatusSelect();
    withdrawReviewStatusSelect.value = res;
};
const handlAuditDetail = (record: PromiseReturnType<typeof api.getWithdrawList>['list'][0]) => {
    activeData.value = record;
    isAuditDetailModalOpen.value = true;
};

const handleReWithdraw = (record: PromiseReturnType<typeof api.getWithdrawList>['list'][0]) => {
    warringTips(
        {
            title: '重新提币',
            content: '你确定要重新提币吗？',
            sucessTips: '重新提币成功',
            handelSubmit: handleOnSubmit.bind(api),
            changeStateApi: api.getWithdrawApplyReturn.bind(api),
        },
        { id: record.id }
    );
};
defineOptions({ name: 'userWithdrawList' });
</script>
