<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="状态" class="mr-22 width-250" name="status">
                    <a-select v-model:value="formState.status" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="item.value" v-for="item in withdrawStateSelect" :key="item.value">{{ item.label }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="目标地址" class="mr-22 width-250" name="address">
                    <a-input v-model:value="formState.address" size="small" placeholder="请输入" />
                </a-form-item>
            </div>

            <FormQuery @handleSearch="handleSearch" @handleResetForm="handleResetForm">
                <template #btn-query>
                    <a-button
                        block
                        type="primary"
                        size="small"
                        class="ml-0 search-submit-btn"
                        @click="handleOpenModal"
                        v-if="buttonPermissions('withdrawalPath-add')"
                    >
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        添加
                    </a-button>
                </template>
            </FormQuery>
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
            :scroll="{ x: 1200 }"
        >
            <template #bodyCell="{ column: { dataIndex }, record, record: { auditStatusName, statusName } }">
                <template v-if="['auditStatus'].includes(dataIndex)">
                    <div :class="record.auditStatus === 2 ? 'text-color-green' : 'text-color-red'">
                        {{ auditStatusName }}
                    </div>
                </template>
                <template v-else-if="['status'].includes(dataIndex)">
                    <div :class="record.status === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ statusName }}
                    </div>
                </template>
                <template v-else-if="['address'].includes(dataIndex)">
                    <div v-if="!record[dataIndex]">--</div>
                    <a-tooltip :title="record[dataIndex]" placement="topLeft">
                        <div class="truncate w-36">
                            {{ record[dataIndex] }}
                        </div>
                    </a-tooltip>
                </template>
                <template v-else-if="dataIndex === 'operate'">
                    <a-button type="link" @click="handlAudit(record)" v-if="showAudit(record) && buttonPermissions('withdrawalPath-review')">
                        审核
                    </a-button>
                    <!-- 审核通过才能更改状态 -->
                    <template v-if="record.auditStatus">
                        <a-button
                            type="link"
                            @click="updateStatus(record)"
                            v-if="record.status === 2 && buttonPermissions('withdrawalPath-enable')"
                            class="text-color-green"
                        >
                            启用
                        </a-button>
                        <a-button
                            type="link"
                            @click="updateStatus(record)"
                            v-else-if="record.status === 1 && buttonPermissions('withdrawalPath-disable')"
                            class="text-color-red"
                        >
                            禁用
                        </a-button>
                    </template>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />

        <AuditModal v-model:visible="isModalOpen" :editData="activeData" @onSuccess="handleOnSubmit" />
        <UpdatePath v-model:visible="isUpateModalOpen" @onSuccess="handleOnSubmit" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, createVNode, onActivated, reactive, ref } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';

import api from '@/newApi/digitAsset/withdrawPath/index';
import { PagingDefaultConf } from '@/utils/constant';
import AuditModal from './Modal/AuditModal/index.vue';
import UpdatePath from './Modal/UpdatePath/index.vue';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id' },
    { title: '名称', dataIndex: 'name' },
    { title: '币种', dataIndex: 'coinSymbol' },
    { title: '链', dataIndex: 'chainSymbol' },
    { title: '目标地址  ', dataIndex: 'address' },
    { title: '审核状态', dataIndex: 'auditStatus' },
    { title: '状态', dataIndex: 'status' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '更新时间', dataIndex: 'updateTime' },
    { title: '操作', dataIndex: 'operate' },
]);

const formState = reactive({
    address: '',
    status: '',
});
const isModalOpen = ref(false);
const isUpateModalOpen = ref(false);
const activeData = ref<PromiseReturnType<typeof api.getaddressWithdrawPage>['list'][0]>(Object.create(null));
const withdrawStateSelect = ref<PromiseReturnType<typeof api.getaWithdrawStatus>>([]);

const pagination = reactive({ ...PagingDefaultConf });
// auditStatus 1.待审核  status 3.审核中  isCurrentUserCreate:false 创建人不能审核
const showAudit = computed(() => {
    return (item: PromiseReturnType<typeof api.getaddressWithdrawPage>['list'][0]) => {
        return item.auditStatus == 1 && item.status == 3 && !item.isCurrentUserCreate;
    };
});

const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = async () => {
    loading.value = true;
    NProgress.start();

    const { pageNo, pageSize } = pagination;
    api.getaddressWithdrawPage({
        ...formState,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.getaddressWithdrawPage>) => {
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
    if (route.hash === '#no-refresh') return;

    handleResetForm();
});
const handlAudit = (record: PromiseReturnType<typeof api.getaddressWithdrawPage>['list'][0]) => {
    activeData.value = record;
    isModalOpen.value = true;
};
const getDepositStateSelect = async () => {
    const res = await api.getaWithdrawStatus();
    withdrawStateSelect.value = res;
};

const updateStatus = (record: PromiseReturnType<typeof api.getaddressWithdrawPage>['list'][0]) => {
    const statusText = record.status === 1 ? '禁用' : '启用';
    warringTips(
        {
            title: '更新状态',
            content: `你确定要将该状态修改为${statusText}?`,
            sucessTips: '更新状态成功',
            handelSubmit: handleOnSubmit.bind(api),
            changeStateApi: api.UpateWithdraPathState.bind(api),
        },
        { id: record.id, status: record.status === 1 ? 2 : 1 }
    );
};
const handleOpenModal = () => {
    // console.log(222);
    isUpateModalOpen.value = true;
};

defineOptions({ name: 'userWithdrawList' });
</script>
