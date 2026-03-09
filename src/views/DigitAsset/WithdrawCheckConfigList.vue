<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <!-- <a-form-item label="地址" class="mr-22 width-250" name="address">
                  <a-input size="small" v-model:value="formState.address" placeholder="请输入" @pressEnter="handleSearch"/>
                </a-form-item> -->
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
            <template #bodyCell="{ column: { dataIndex }, record: { id, state, type }, record }">
                <template v-if="dataIndex === 'state'">
                    <!-- <p class="text-color-green">{{ state === 1 ? "启用" : "" }}</p>
                    <p class="text-color-red">{{ state === 2 ? "禁用" : "" }}</p> -->
                    <p :class="state === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ state === 1 ? '启用' : '禁用' }}
                    </p>
                </template>
                <template v-if="dataIndex === 'type'">
                    <p>{{ type === 1 ? '初审' : '' }}</p>
                    <p>{{ type === 2 ? '复审' : '' }}</p>
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button v-if="buttonPermissions('edit') && state !== 2" type="link" @click="handleOpenModal(record)"> 编辑 </a-button>
                    <a-button v-if="buttonPermissions('enable')" type="link" :style="{ color: state == 1 ? 'red' : '#090' }" @click="handelOptions(id, 1)">
                        {{ state === 2 ? '启用' : '禁用' }}
                    </a-button>
                    <a-button v-if="buttonPermissions('del')" type="link" danger style="color: #f97b06" @click="handelOptions(id, 2)"> 删除</a-button>
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
import { computed, ComputedRef, defineComponent, reactive, ref, onActivated, createVNode } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { ExclamationCircleOutlined, SearchOutlined, RedoOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { useRoute } from 'vue-router';
import { Modal, message } from 'ant-design-vue';
import api from '@/api/asset/index';
import { PagingDefaultConf } from '@/utils/constant';
import AddressAddOrUpdate from './WithdrawCheckConfigAddOrUpdate.vue';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 130, fixed: 'left' },
    { title: '管理员账号', dataIndex: 'userName', width: 150 },
    { title: '币种', dataIndex: 'symbol', width: 180 },
    { title: '审核', dataIndex: 'type', width: 100 },
    { title: '金额', dataIndex: 'amount', width: 100 },
    { title: '创建时间', dataIndex: 'createTime', width: 250 },
    { title: '更新时间', dataIndex: 'updateTime', width: 250 },
    { title: '状态', dataIndex: 'state', width: 80 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
]);

export default defineComponent({
    name: 'WithdrawCheckConfigList',
    components: {
        SearchOutlined,
        RedoOutlined,
        PlusOutlined,
        /* QuestionCircleOutlined, */ AddressAddOrUpdate,
    },
    setup() {
        const formState = reactive<{
            state: string;
        }>({ state: '' });

        const pagination = reactive({ ...PagingDefaultConf });
        const loading = ref(false);
        const tableData = ref(Object.create([]));
        const handleOnSubmit = () => {
            loading.value = true;
            NProgress.start();
            const { pageNo, pageSize } = pagination;
            api.fetchTransactionWithdrawCheckConfigList({
                ...formState,
                pageNo,
                pageSize,
            })
                .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchTransactionWithdrawCheckConfigList>) => {
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
        const handelOptions = (id: string, type: number) => {
            const content = type == 2 ? '你确定要删除该提币审核人员吗？' : '你确定要修改该提币审核状态？';
            Modal.confirm({
                title: type == 2 ? '删除' : '修改状态',
                icon: createVNode(ExclamationCircleOutlined),
                content,
                okText: '确定',
                width: '430px',
                cancelText: '取消',
                class: 'user-moadl-warning',
                async onOk() {
                    const apiFetch = ['fetchupdateWithdrawCheckConfigState', 'fetchdelWithdrawCheckConfig'][type - 1];
                    //  @ts-ignore
                    api[apiFetch]({
                        id: id,
                    }).then(() => {
                        message.success(`${type == 2 ? '删除' : '修改状态'}成功`);
                        handleOnSubmit();
                    });
                },
            });
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
        const handDeprecated = (record: PromiseReturnType<typeof api.fetchTransactionWithdrawCheckConfigList>) => {
            activeData.value = record || Object.create(null);
            [isDeprecatedModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
        };

        const isModalOpen = ref<boolean>(false);
        const handleOpenModal = (record?: PromiseReturnType<typeof api.fetchTransactionWithdrawCheckConfigList>) => {
            // 打开新增/编辑弹框
            activeData.value = record || Object.create(null);
            [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
        };

        const handleCloseModal = () => {
            // 关闭弹框
            [isModalOpen.value] = [false];
            [isDeprecatedModalOpen.value] = [false];
        };

        return {
            tableColumns,

            pagination,
            loading,
            tableData,
            handleOnSubmit,

            handChecked,
            handDeprecated,
            isModalOpen,
            isDeprecatedModalOpen,
            modalType,
            activeData,
            handleOpenModal,
            handleCloseModal,

            formState,
            formReset,
            handleSearch,
            handleResetForm,
            handelOptions,
        };
    },
});
</script>
<style lang="scss">
.user-moadl-warning {
    .ant-btn-primary {
        background-color: #165dff !important;
    }
}
</style>
