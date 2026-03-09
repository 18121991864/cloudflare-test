<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';
import NProgress from 'nprogress';
import { message } from 'ant-design-vue';
import { timeStampToDate } from '@/filters/dateFormat';
import { downFile } from '@/api/file/index';
import { handleDownFile } from '@/utils/common';
import useTableConf from '@/use/useTableConf';
import ModifyStatus from './Dialog/ModifyStatus.vue';
import ImgPreview from './Dialog/ImgPreview.vue';
import UploadForm from './Dialog/UploadForm.vue';
import api from '@/api/poboAPI/poboRemitterAccount';
import Log from './Dialog/Log.vue';
import Reject from '../Modal/Reject.vue';
import useUser from '@/store/user';

const userStore = useUser();

userStore.fetchTagList();

const logRef = ref();
const fileRef = ref();
const formRef = ref();
const rejectRef = ref();
const modifyRef = ref();
const previewRef = ref();
const curId = ref(0);
const tableData = ref<PromiseSelectReturnType<typeof api.list, 'list'>>([]);
const formState = reactive<{
    accountId: string;
    email: string;
    state: number | null; // 状态
    orderNoQdpay: string; // 渠道订单号
    receiverId: string; // 收款人id
    remitterId: string; // 汇款人id
    labelId?: string; // 标签ID
}>({
    email: '',
    state: null,
    accountId: '',
    orderNoQdpay: '', // 渠道订单号
    receiverId: '', // 收款人id
    remitterId: '', // 汇款人id
    labelId: null,
});

const route = useRoute();

const tableColumns = [
    { title: '用户UID', dataIndex: 'accountId', width: 180, fixed: 'left' },
    { title: '用户标签', dataIndex: 'labelName', width: 120 },
    { title: '姓名(本地语言)', dataIndex: 'nameLocal', width: 120 },
    { title: '汇款人ID', dataIndex: 'remitterId' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '认证状态', dataIndex: 'state' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '变更时间', dataIndex: 'updateTime' },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 260 },
];

// 状态：0-待审核 1-审核中 2-内部驳回 3-渠道审核 4-渠道驳回 5-渠道通过 6-风控中 7-已关闭
const stateArr = [
    { label: '待审核', value: 0 },
    { label: '审核中', value: 1 },
    { label: '内部驳回', value: 2 },
    { label: '渠道审核', value: 3 },
    { label: '渠道驳回', value: 4 },
    { label: '审核通过', value: 5 },
    { label: '风控中', value: 6 },
    { label: '已关闭', value: 7 },
];

const onLog = (data: { id: number }): void => {
    // 打开日志抽屉
    logRef.value.onShowDialog(true, data);
};

const onEditStatus = (data: { id: number; download: boolean }) => {
    // 打开修改状态弹窗
    if (!data.download) return message.warn('汇款人申请表未生成，请稍后再试');
    modifyRef.value.onShowDialog(true, data);
};

const onUploadFile = ({ download, id }: { download: boolean; id: number }) => {
    if (!download) return message.warn('汇款人申请表未生成，请稍后再试');
    fileRef.value.onShowDialog(true, id);
};

const onPreview = (id: number): void => {
    // 预览弹窗
    previewRef.value.onShowDialog(true, id);
};

const onDownFile = ({ download, id }: { download: boolean; id: number }, i: number) => {
    if (!download) return message.warn('汇款人申请表未生成，请稍后再试');
    tableData.value[i].isLoading = true;
    downFile({ id })
        .then((r) => {
            handleDownFile(r, String(timeStampToDate(new Date().getTime())));
            message.success('下载成功');
        })
        .finally(() => {
            tableData.value[i].isLoading = false;
        });
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

const fetchTableData = () => {
    NProgress.start();
    isLoading.value = true;
    const { current, pageSize } = paginationConfig;
    api.list({
        ...formState,
        pageNo: current,
        pageSize,
    })
        .then(({ list, totalSize, pageNo }) => {
            updatePagination(pageNo, pageSize, totalSize);
            tableData.value = list.map((item) => ({ ...item, isLoading: false }));
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
        });
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
        <ImgPreview ref="previewRef" />
        <UploadForm ref="fileRef" @updateTable="onSearch" />
        <Reject ref="rejectRef" @setFormState="getFormVal" />
        <ModifyStatus ref="modifyRef" @updateTable="onSearch" />
        <a-form ref="formRef" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="用户UID" class="mr-22 width-250" name="accountId">
                    <a-input v-model:value="formState.accountId" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="用户标签" class="mr-22 width-250" name="labelId">
                    <a-select v-model:value="formState.labelId" size="small" placeholder="请选择" @change="onSearch">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option v-for="item of userStore.getTagSelectOptions" :key="item.value" :value="item.value"
                            >{{ item.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="邮箱" class="mr-22 width-250" name="email">
                    <a-input v-model:value="formState.email" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="汇款人ID" class="mr-22 width-250" name="remitterId">
                    <a-input v-model:value="formState.remitterId" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="认证状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择" @change="onSearch">
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
                <template v-if="dataIndex === 'labelName'">
                    <a-tag :color="record.labelColor">{{ record.labelName }}</a-tag>
                </template>
                <template v-if="dataIndex === 'state'">
                    {{ getStateVal(record.state) }}
                </template>
                <template v-if="dataIndex === 'remitterId'">
                    {{ record.remitterId || '--' }}
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button v-if="buttonPermissions('account-application-upload')" type="link" @click="onUploadFile(record)"> 上传 </a-button>
                    <!--                    <a-button v-if="buttonPermissions('account-application-preview')" type="link" @click="onPreview(record.id)">-->
                    <!--                        预览-->
                    <!--                    </a-button>-->
                    <a-button v-if="buttonPermissions('account-application-edit')" type="link" @click="onEditStatus(record)"> 修改状态 </a-button>
                    <a-button
                        v-if="buttonPermissions('account-application-down')"
                        :loading="record.isLoading"
                        type="link"
                        @click="onDownFile(record, index)"
                    >
                        下载
                    </a-button>
                    <a-button v-if="buttonPermissions('account-application-log')" type="link" @click="onLog(record.id)"> 操作日志 </a-button>
                    <a-button
                        v-if="record.reject && buttonPermissions('account-application-reject')"
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
