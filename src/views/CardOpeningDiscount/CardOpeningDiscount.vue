<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="账号UID" class="mr-22 width-250" name="accountId">
                    <a-input v-model:value="formState.accountId" size="small" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div>
                    <a-button
                        v-if="buttonPermissions('add')"
                        block
                        type="primary"
                        size="small"
                        class="search-submit-btn ml-0"
                        @click="handleOpenModal()"
                    >
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        添加
                    </a-button>
                </div>
                <div></div>
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
            <template #bodyCell="{ column: { dataIndex }, record: { state }, record }">
                <template v-if="dataIndex === 'scale'"> {{ record?.scale }} % </template>
                <template v-if="dataIndex === 'scaleType'">
                    {{ record?.scaleType === 1 ? '开卡' : '' }}
                    {{ record?.scaleType === 2 ? '充值' : '' }}
                    {{ record?.scaleType === 3 ? '开卡减免' : '' }}
                    {{ record?.scaleType === 4 ? '首次开卡减免' : '' }}
                </template>
                <template v-if="dataIndex === 'platform'">
                    {{ record?.platform === 1 ? 'web' : '' }}
                    {{ record?.platform === 2 ? 'pc' : '' }}
                </template>
                <template v-if="dataIndex === 'rangeType'">
                    {{ record?.scaleType === 1 ? '全局' : '' }}
                    {{ record?.scaleType === 2 ? '用户' : '' }}
                </template>
                <template v-if="dataIndex === 'state'">
                    <p :class="state === 1 ? 'text-color-green' : 'text-color-red'">{{ state === 1 ? '启用' : '禁用' }}</p>
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button v-if="buttonPermissions('edit')" type="link" @click="handleOpenModal(record)"> 修改 </a-button>
                </template>
            </template>
        </a-table>

        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />

        <SettingsModal :visible="isModalOpen" :type="modalType" :active-data="activeData" @onClose="handleCloseModal" @onSuccess="handleOnSubmit" />
    </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, reactive, ref, onActivated, onMounted } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import api from '@/api/userAPI/userList';
import { PagingDefaultConf } from '@/utils/constant';
import SettingsModal from './SettingsModal.vue';
import { downloadExcel } from '@/utils/common';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 180, fixed: 'left' },
    { title: '账号', dataIndex: 'account' },
    { title: '账号UID', dataIndex: 'accountId' },
    { title: '最大金额', dataIndex: 'maxAmount' },
    { title: '最小金额', dataIndex: 'minAmount' },
    { title: '开始时间', dataIndex: 'beginTime' },
    { title: '结束时间', dataIndex: 'endTime' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '修改时间', dataIndex: 'updateTime' },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 120 },
]);

export default defineComponent({
    name: 'CardOpeningDiscount',
    components: { SearchOutlined, RedoOutlined /* PlusOutlined, */, SettingsModal },
    setup() {
        const formState = reactive<{
            accountId: string | null; // 状态
        }>({ accountId: null });

        const pagination = reactive({ ...PagingDefaultConf });
        const loading = ref(false);
        const tableData = ref(Object.create([]));
        const handleOnSubmit = () => {
            loading.value = true;
            NProgress.start();
            const { pageNo, pageSize } = pagination;
            api.cardOpenFirstConfigList({
                ...formState,
                pageNo,
                pageSize,
            })
                .then(({ list, totalSize }: PromiseReturnType<typeof api.cardOpenFirstConfigList>) => {
                    [tableData.value, pagination.total] = [list, totalSize];
                })
                .finally(() => {
                    loading.value = false;
                    NProgress.done();
                });
        };

        onMounted(handleOnSubmit);

        const loadExportExcel = ref(false);
        const handExport = () => {
            if (loadExportExcel.value) return;
            loadExportExcel.value = true;
            // const { time, ...params } = formState;
            // const [startTime, endTime] = time;
            // api.xxx({
            //     ...params,
            //     startTime,
            //     endTime
            // }).then((r: PromiseReturnType<typeof api.xxx>) => {
            //     downloadExcel(r, '划转列表');
            // }).finally(() => {
            //     loadExportExcel.value = false;
            // });
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

        const isModalOpen = ref<boolean>(false);
        const modalType = ref<'edit' | 'add'>('add');
        const activeData = ref(Object.create(null)); // modal打开时激活的数据
        const handleOpenModal = (record: PromiseReturnType<typeof api.cardOpenFirstConfigList>, type: 'edit' | 'add') => {
            // 打开新增/编辑弹框
            activeData.value = { ...record } || Object.create(null);
            setTimeout(() => {
                [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
            }, 100);
        };

        const handChecked = (state: 1 | 2, id: string) => {
            api.fetchBannerUpdateState({ state, id }).then(() => {
                message.success('操作成功');
                handleOnSubmit();
            });
        };

        const handleCloseModal = () => {
            // 关闭弹框
            [isModalOpen.value] = [false];
        };

        return {
            tableColumns,

            pagination,
            loading,
            tableData,
            handleOnSubmit,
            activeData,

            formState,
            formReset,
            handleSearch,
            handleResetForm,

            loadExportExcel,
            handExport,
            handleOpenModal,
            isModalOpen,
            modalType,
            handleCloseModal,
            handChecked,
        };
    },
});
</script>
