<script lang="ts" setup>
import { reactive, ref, onActivated, onMounted } from 'vue';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
import NProgress from 'nprogress';
import { message, TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import useTableConf from '@/use/useTableConf';
import ModifyStatus from './Dialog/ModifyStatus.vue';
import CancelOrder from './Dialog/CancelOrder.vue';
import ImgPreview from './Dialog/ImgPreview.vue';
import Info from './Dialog/Info.vue';
import api from '@/api/poboAPI/poboPayeeAccount';
import Log from './Dialog/Log.vue';
import Reject from '../Modal/Reject.vue';
import { poboPayeeAccountDown } from '@/api/file/index';
import { handleDownFile } from '@/utils/common';
import { timeStampToDate } from '@/filters/dateFormat';

const logRef = ref();
const formRef = ref();
const infoRef = ref();
const orderRef = ref();
const rejectRef = ref();
const modifyRef = ref();
const previewRef = ref();
const curId = ref(0);
const tableData = ref<PromiseSelectReturnType<typeof api.list, 'list'>>([]);
const formState = reactive<{
    accountNumber: string;
    name: string;
    stateAudit: number | null; // 状态
    orderNoQdpay: string; // 渠道订单号
    receiverId: string; // 收款人id
    remitterId: string; // 汇款人id
    userId: string;
}>({
    name: '',
    accountNumber: '',
    stateAudit: null,
    orderNoQdpay: '', // 渠道订单号
    receiverId: '', // 收款人id
    remitterId: '', // 汇款人id
    userId: '',
});

const route = useRoute();

const tableColumns: TableColumnType[] = [
    { title: '主体', dataIndex: 'subject', fixed: 'left' },
    { title: '用户UID', dataIndex: 'userId' },
    { title: '姓名/保险公司名称', dataIndex: 'name' },
    { title: '收款银行名称', dataIndex: 'collectionBank' },
    { title: '银行地址', dataIndex: 'bankAddress' },
    { title: '收款人账户号', dataIndex: 'accountNumber' },
    { title: '收款人ID', dataIndex: 'receiverId' },
    { title: '收款人银行SWIFT/BIC代码', dataIndex: 'bankSwiftCode' },
    { title: '状态', dataIndex: 'stateAudit' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '变更时间', dataIndex: 'updateTime' },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 260 },
];

// 审核状态：0-待审核 1-审核中 2-内部驳回 3-渠道审核 4-渠道驳回 5-渠道通过 6-风控中 7-已关闭 8-已删除
const stateArr = [
    { label: '待审核', value: 0 },
    { label: '审核中', value: 1 },
    { label: '内部驳回', value: 2 },
    { label: '渠道审核', value: 3 },
    { label: '渠道驳回', value: 4 },
    { label: '审核通过', value: 5 },
    { label: '风控中', value: 6 },
    { label: '已关闭', value: 7 },
    { label: '已删除', value: 8 },
];

const fetchTableData = () => {
    NProgress.start();
    isLoading.value = true;
    const { current, pageSize } = paginationConfig;
    api.list({
        ...formState,
        pageNo: current,
        pageSize,
    })
        .then(({ list, totalSize, pageSize, pageNo }) => {
            updatePagination(pageNo, pageSize, totalSize);
            tableData.value = list.map((item) => ({ ...item, isLoading: false }));
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
        });
};

const onEnable = ({ state, id }: { state: number; id: number }): void => {
    // 启用 / 禁用
    orderRef.value.onShowDialog(true, { type: state === 1 ? 'DISABLE' : 'ENABLE', id });
};

const onPreview = (id: number): void => {
    // 预览弹窗
    previewRef.value.onShowDialog(true, id);
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

const onInfo = (id: number): void => {
    infoRef.value.onShowDialog(true, id);
};

const onDownFile = (id: number, i: number) => {
    tableData.value[i].isLoading = true;
    poboPayeeAccountDown({ id })
        .then((r) => {
            handleDownFile(r, String(timeStampToDate(new Date().getTime())));
            message.success('下载成功');
        })
        .finally(() => {
            tableData.value[i].isLoading = false;
        });
};

const onEditStatus = (data: { id: number }): void => {
    // 打开修改状态弹窗
    modifyRef.value.onShowDialog(true, data);
};

const onLog = (id: number): void => {
    // 打开日志抽屉
    logRef.value.onShowDialog(true, id);
};

const handleResetForm = (): void => {
    // 重置表单
    formRef.value.resetFields();
    onSearch();
};

// 获取状态
const getStateVal = (val: number): string => stateArr.find(({ value }) => val === value)?.label || '-';

const { isLoading, onSearch, paginationConfig, handleSizeChange, updatePagination } = useTableConf(fetchTableData);

onMounted(fetchTableData);
</script>

<template>
    <div class="table-container">
        <Log ref="logRef" />
        <Info ref="infoRef" />
        <ImgPreview ref="previewRef" />
        <Reject ref="rejectRef" @setFormState="getFormVal" />
        <CancelOrder ref="orderRef" @updateTable="onSearch" />
        <ModifyStatus ref="modifyRef" @updateTable="onSearch" />
        <a-form ref="formRef" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="用户UID" class="mr-22 width-250" name="userId">
                    <a-input v-model:value="formState.userId" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="姓名/保险公司名称" class="mr-22 width-250" name="name">
                    <a-input v-model:value="formState.name" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="收款人账户号" class="mr-22 width-250" name="accountNumber">
                    <a-input v-model:value="formState.accountNumber" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="收款人ID" class="mr-22 width-250" name="receiverId">
                    <a-input v-model:value="formState.receiverId" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="stateAudit">
                    <a-select v-model:value="formState.stateAudit" size="small" placeholder="请选择" @change="onSearch">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option v-for="item of stateArr" :key="item.value" :value="item.value">{{ item.label }} </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div></div>
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
            :pagination="paginationConfig"
            :columns="tableColumns"
            :row-key="
                ({ id }) => {
                    return id;
                }
            "
            :data-source="tableData"
            :scroll="{ x: 1100 }"
            :loading="isLoading"
            @change="handleSizeChange"
        >
            <template #bodyCell="{ column: { dataIndex }, record, index }">
                <template v-if="dataIndex === 'stateAudit'">
                    {{ getStateVal(record.stateAudit) }}
                </template>
                <template v-if="dataIndex === 'receiverId'">
                    {{ record.receiverId || '--' }}
                </template>
                <template v-if="dataIndex === 'subject'">
                    {{ record.subject === 1 ? '企业' : record.subject === 2 ? '个人' : '--' }}
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button
                        v-if="buttonPermissions('account-receivable-down')"
                        :loading="record.isLoading"
                        type="link"
                        @click="onDownFile(record.id, index)"
                    >
                        下载
                    </a-button>
                    <a-button v-if="buttonPermissions('account-receivable-info')" type="link" @click.stop="onInfo(record.id)">详情 </a-button>
                    <!--                    <a-button v-if="buttonPermissions('account-receivable-preview')" type="link" @click="onPreview(record.id)">-->
                    <!--                        预览-->
                    <!--                    </a-button>-->
                    <a-button v-if="buttonPermissions('account-receivable-log')" type="link" @click="onLog(record.id)"> 操作日志 </a-button>
                    <a-button v-if="buttonPermissions('account-receivable-edit')" type="link" @click="onEditStatus(record)"> 修改状态 </a-button>
                    <a-button
                        v-if="record.reject && buttonPermissions('account-receivable-reject')"
                        :loading="record.isLoading"
                        type="link"
                        @click="onReject(record.id)"
                    >
                        驳回
                    </a-button>
                </template>
            </template>
        </a-table>
    </div>
</template>
