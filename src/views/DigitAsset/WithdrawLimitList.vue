<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="用户UID" class="mr-22 width-250" name="accountId">
                    <a-input v-model:value="formState.accountId" size="small" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="范围" class="mr-22 width-250" name="range">
                    <a-select v-model:value="formState.range" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option :value="0">全部</a-select-option>
                        <a-select-option :value="1">全局</a-select-option>
                        <a-select-option :value="2">用户</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">启用</a-select-option>
                        <a-select-option :value="2">禁用</a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div>
                    <a-button
                        v-if="buttonPermissions('add')"
                        block
                        type="primary"
                        size="small"
                        class="ml-0 search-submit-btn"
                        @click="handleOpenModal()"
                    >
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        添加
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
            :scroll="{ x: 1100 }"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { state, range }, record }">
                <template v-if="dataIndex === 'state'">
                    <p class="text-color-green">{{ state === 1 ? '启用' : '' }}</p>
                    <p class="text-color-red">{{ state === 2 ? '禁用' : '' }}</p>
                </template>
                <template v-if="dataIndex === 'range'">
                    {{ range === 1 ? '全局' : '' }}
                    {{ range === 2 ? '用户' : '' }}
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button v-if="buttonPermissions('edit')" type="link" @click="handleOpenModal(record)"> 编辑 </a-button>
                    <a-button
                        v-if="buttonPermissions('edit')"
                        type="link"
                        :style="{ color: state == 1 ? 'red' : '#090' }"
                        @click="handleEdutRecord(record)"
                    >
                        {{ state == 1 ? '禁用' : '启用' }}
                    </a-button>
                </template>
            </template>
        </a-table>

        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />

        <AddressAddOrUpdate
            :visible="isModalOpen"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmit"
        />
    </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, reactive, ref, onActivated } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { SearchOutlined, RedoOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
import api from '@/api/asset/index';
import { PagingDefaultConf } from '@/utils/constant';
import AddressAddOrUpdate from './WithdrawLimitAddOrUpdate.vue';
import type { withdrawLimitList } from '@/api/asset/types.d';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 100, fixed: 'left' },
    { title: '用户UID', dataIndex: 'accountId', width: 180 },
    { title: '币种', dataIndex: 'symbol', width: 100 },
    { title: '链', dataIndex: 'chainTag', width: 100 },
    { title: '每天最大限额', dataIndex: 'day', width: 100 },
    { title: '每小时最大限额', dataIndex: 'hour', width: 130 },
    { title: '每笔最大限额', dataIndex: 'singleMax', width: 100 },
    { title: '每笔最小限额', dataIndex: 'singleMin', width: 100 },
    { title: '范围', dataIndex: 'range', width: 80 },
    { title: '创建时间', dataIndex: 'createTime', width: 170 },
    { title: '更新时间', dataIndex: 'updateTime', width: 170 },
    { title: '状态', dataIndex: 'state', fixed: 'right', width: 80 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
]);

const formState = reactive<{
    accountId: string; // 用户ID
    range: 2 | 1 | 0 | ''; // 0、全部 1、全局 2、用户
    state: 2 | 1 | ''; // 0、全部 1、启用 2、禁用
}>({ accountId: '', range: '', state: '' });

const pagination = reactive({ ...PagingDefaultConf });
const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    const { pageNo, pageSize } = pagination;
    api.fetchTransactionWithdrawLimitList({
        ...formState,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchTransactionWithdrawLimitList>) => {
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
    if (route.hash === '#no-refresh') return; // 不需要刷新
    handleResetForm();
});

const handChecked = (id: string) => {
    api.fetchAddressState({ id }).then(() => {
        message.success('操作成功');
        handleOnSubmit();
    });
};
const isDeprecatedModalOpen = ref<boolean>(false);
const modalType = ref<'add' | 'edit'>('add');
const activeData = ref(Object.create(null)); // modal打开时激活的数据
const handDeprecated = (record: PromiseReturnType<typeof api.fetchTransactionWithdrawLimitList>) => {
    activeData.value = record || Object.create(null);
    [isDeprecatedModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const isModalOpen = ref<boolean>(false);
const handleOpenModal = (record: PromiseReturnType<typeof api.fetchTransactionWithdrawLimitList>) => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const handleCloseModal = () => {
    // 关闭弹框
    [isModalOpen.value] = [false];
    [isDeprecatedModalOpen.value] = [false];
};
const handleEdutRecord = async (record: withdrawLimitList) => {
    Modal.confirm({
        title: '修改状态',
        content: '你确定要修改该提币额度状态吗？',
        okText: '确定',
        width: '430px',
        cancelText: '取消',
        class: 'user-moadl-warning',
        async onOk() {
            // 编辑
            const state = record.state === 1 ? 2 : 1;
            await api.fetchTransactionUpdateWithdrawLimit({
                ...record,
                state,
            });
            message.success('修改状态成功');
            handleOnSubmit();
        },
    });
};
</script>
