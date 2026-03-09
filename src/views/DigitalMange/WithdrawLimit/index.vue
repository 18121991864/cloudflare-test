<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <!-- <a-form-item label="用户UID" class="mr-22 width-250" name="accountId">
                    <a-input v-model:value="formState.accountId" size="small" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item> -->
                <a-form-item label="范围" class="mr-22 width-250" name="range">
                    <a-select v-model:value="formState.range" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option :value="''">全部</a-select-option>
                        <a-select-option :value="1">全局</a-select-option>
                        <!-- <a-select-option :value="2">用户</a-select-option> -->
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
                        block
                        type="primary"
                        size="small"
                        class="ml-0 search-submit-btn"
                        @click="handleOpenModal()"
                        v-if="buttonPermissions('withdrawLimitList-add')"
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
                    <a-button type="link" @click="handleOpenModal(record)" v-if="buttonPermissions('withdrawLimitList-edit')"> 编辑 </a-button>
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

<script lang="ts" setup>
import { computed, ComputedRef, defineComponent, reactive, ref, onActivated } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { SearchOutlined, RedoOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
import api from '@/newApi/digitAsset/withdrawalLimit';
import { PagingDefaultConf } from '@/utils/constant';
import AddressAddOrUpdate from './Modal/LimitAddOrUpdate.vue';
import type { withdrawLimitList } from '@/api/asset/types.d';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 100, fixed: 'left' },
    // { title: '用户UID', dataIndex: 'accountId', width: 180 },
    { title: '币种', dataIndex: 'symbol', width: 100 },
    { title: '链', dataIndex: 'chainSymbol', width: 100 },
    { title: '每天最大限额', dataIndex: 'day', width: 100 },
    { title: '每小时最大限额', dataIndex: 'hour', width: 130 },
    // { title: '每笔最大限额', dataIndex: 'singleMax', width: 100 },
    { title: '每笔最小限额', dataIndex: 'singleMin', width: 100 },
    { title: '范围', dataIndex: 'range', width: 80 },
    { title: '创建时间', dataIndex: 'createTime', width: 170 },
    { title: '更新时间', dataIndex: 'updateTime', width: 170 },
    { title: '状态', dataIndex: 'state', width: 80 },
    { title: '操作', dataIndex: 'action', width: 150 },
]);

const formState = reactive<{
    accountId: string; // 用户ID
    range: string; // 0、全部 1、全局 2、用户
    state: string; // 0、全部 1、启用 2、禁用
}>({ accountId: '', range: '', state: '' });

const pagination = reactive({ ...PagingDefaultConf });
const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = () => {
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
const handDeprecated = (record: PromiseReturnType<typeof api.getWithdrawList>) => {
    activeData.value = record || Object.create(null);
    [isDeprecatedModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const isModalOpen = ref<boolean>(false);
const handleOpenModal = (record?: PromiseReturnType<typeof api.getWithdrawList>) => {
    console.log(record);
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const handleCloseModal = () => {
    // 关闭弹框
    [isModalOpen.value] = [false];
    [isDeprecatedModalOpen.value] = [false];
};
</script>
