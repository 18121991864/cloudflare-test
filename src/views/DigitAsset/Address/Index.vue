<script setup lang="ts">
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons-vue';
import AddressAddOrUpdate from './Modal/AddOrUpdate.vue';
import AddressDeprecated from './Modal/Deprecated.vue';
import { reactive, ref, onActivated } from 'vue';
import useTableConf from '@/use/useTableConf';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import NProgress from 'nprogress';
import api from '@/api/address/index';

const formReset = ref();
const formState = reactive<{
    address: string;
    status: 1 | 0 | ''; // 状态：1=启用,2=禁用
    accountId: '';
}>({
    address: '',
    status: '',
    accountId: '',
});
const isModalOpen = ref<boolean>(false);
const activeData = ref(Object.create(null)); // modal打开时激活的数据
const modalType = ref<'add' | 'edit'>('add');
const isDeprecatedModalOpen = ref<boolean>(false);
const tableData = ref<PromiseSelectReturnType<typeof api.fetchAddressList, 'list'>>([]);

const tableColumns = [
    { title: 'ID', dataIndex: 'id', width: 130, fixed: 'left' },
    { title: '币种 ID', dataIndex: 'coinId', width: 130 },
    { title: '钱包ID', dataIndex: 'walletUserId', width: 100 },
    { title: '用户UID', dataIndex: 'accountId', width: 100 },
    { title: '链', dataIndex: 'chainTag', width: 100 },
    { title: '币种简称', dataIndex: 'coinSymbol', width: 100 },
    { title: '地址', dataIndex: 'address', width: 250 },
    { title: '代理商 ID', dataIndex: 'agentId', width: 130 },
    { title: '弃用原因', dataIndex: 'info', width: 130 },
    { title: '风险备注', dataIndex: 'riskInfo', width: 130 },
    { title: '状态', dataIndex: 'status', fixed: 'right', width: 80 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
];

const fetchTableData = () => {
    isLoading.value = true;
    NProgress.start();
    const { current, pageSize } = paginationConfig;
    api.fetchAddressList({
        ...formState,
        pageNo: current,
        pageSize,
    })
        .then(({ list, totalSize, pageNo }) => {
            updatePagination(pageNo, pageSize, totalSize);
            tableData.value = list;
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

const route = useRoute();
onActivated(() => {
    if (route.hash === '#no-refresh') return; // 不需要刷新
    handleResetForm();
});

const handChecked = (id: string) => {
    api.fetchAddressState({ id }).then(() => {
        message.success('操作成功');
        onSearch();
    });
};

const handDeprecated = (record: PromiseReturnType<typeof api.fetchAddressList>) => {
    activeData.value = record || Object.create(null);
    [isDeprecatedModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const handleOpenModal = (record: PromiseReturnType<typeof api.fetchAddressList>) => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const handleCloseModal = () => {
    // 关闭弹框
    [isModalOpen.value] = [false];
    [isDeprecatedModalOpen.value] = [false];
};

const { isLoading, onSearch, paginationConfig, handleSizeChange, updatePagination } = useTableConf(fetchTableData);

fetchTableData();
</script>

<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="地址" class="mr-22 width-250" name="address">
                    <a-input v-model:value="formState.address" size="small" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="status">
                    <a-select v-model:value="formState.status" size="small" placeholder="请选择" @change="onSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">启用</a-select-option>
                        <a-select-option :value="0">禁用</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="用户UID" class="mr-22 width-250" name="accountId">
                    <a-input v-model:value="formState.accountId" size="small" placeholder="请输入" @pressEnter="onSearch" />
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
            :loading="isLoading"
            :columns="tableColumns"
            :data-source="tableData"
            :scroll="{ x: 1100 }"
            @change="handleSizeChange"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { id, status }, record }">
                <template v-if="dataIndex === 'status'">
                    <p class="text-color-red">{{ status === 0 ? '禁用' : '' }}</p>
                    <p class="text-color-green">{{ status === 1 ? '启用' : '' }}</p>
                    <p class="text-color-grey">{{ status === 2 ? '弃用' : '' }}</p>
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button v-if="buttonPermissions('open') && status !== 2" type="link" :danger="status === 1" @click="handChecked(id)">
                        {{ status === 1 ? '禁用' : '开启' }}
                    </a-button>
                    <a-button v-if="buttonPermissions('disable') && status !== 2" type="link" :danger="status === 1" @click="handDeprecated(record)">
                        弃用
                    </a-button>
                </template>
            </template>
        </a-table>
        <AddressAddOrUpdate :visible="isModalOpen" :type="modalType" :active-data="activeData" @onClose="handleCloseModal" @onSuccess="onSearch" />
        <AddressDeprecated
            :visible="isDeprecatedModalOpen"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="onSearch"
        />
    </div>
</template>
