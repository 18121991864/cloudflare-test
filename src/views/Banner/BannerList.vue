<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option :value="1">启动</a-select-option>
                        <a-select-option :value="2">禁用</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="语言" class="mr-22 width-250" name="language">
                    <a-select v-model:value="formState.language" size="small" placeholder="请选择" @change="handleSearch" :options="langArr"/>
                       
                </a-form-item>
                <a-form-item label="平台" class="mr-22 width-250" name="platform">
                    <a-select v-model:value="formState.platform" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option :value="1">APP</a-select-option>
                        <a-select-option :value="2">PC</a-select-option>
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
                        class="search-submit-btn ml-0"
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
            <template #bodyCell="{ column: { dataIndex }, record: { id, state, linkUrl, fullImageUri }, record }">
                <template v-if="dataIndex === 'scale'"> {{ record?.scale }} %</template>
                <template v-if="dataIndex === 'scaleType'">
                    {{ record?.scaleType === 1 ? '开卡' : '' }}
                    {{ record?.scaleType === 2 ? '充值' : '' }}
                    {{ record?.scaleType === 3 ? '开卡减免' : '' }}
                    {{ record?.scaleType === 4 ? '首次开卡减免' : '' }}
                </template>
                <template v-if="dataIndex === 'platform'">
                    {{ record?.platform === 2 ? 'PC' : 'APP' }}
                </template>
                <template v-if="dataIndex === 'fullImageUri'">
                    <a-tooltip>
                        <template #title>{{ fullImageUri }}</template>
                        <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                            <a-image :width="100" :src="fullImageUri" />
                        </div>
                    </a-tooltip>
                </template>
                <template v-if="dataIndex === 'linkUrl'">
                    <a-tooltip>
                        <template #title>{{ linkUrl }}</template>
                        <div style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
                            {{ linkUrl }}
                        </div>
                    </a-tooltip>
                </template>
                <template v-if="dataIndex === 'rangeType'">
                    {{ record?.scaleType === 1 ? '全局' : '' }}
                    {{ record?.scaleType === 2 ? '用户' : '' }}
                </template>
                <template v-if="dataIndex === 'state'">
                    <p :class="state === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ state === 1 ? '启用' : '禁用' }}
                    </p>
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button v-if="buttonPermissions('disable')" type="link" :danger="state === 1" @click="handChecked(state === 1 ? 2 : 1, id)">
                        {{ state === 1 ? '禁用' : '开启' }}
                    </a-button>
                    <a-button v-if="buttonPermissions('edit')" type="link" @click="handleOpenModal(record)"> 修改 </a-button>
                    <a-button v-if="buttonPermissions('edit')" danger type="link" @click="handelOptions(record.id, record.state)"> 删除 </a-button>
                </template>
            </template>
        </a-table>

        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />

        <SettingsModal :visible="isModalOpen" :type="modalType" :active-data="activeData" @onClose="handleCloseModal" @onSuccess="handleOnSubmit" />
    </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, reactive, ref, onActivated, onMounted, createVNode } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { SearchOutlined, RedoOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import api from '@/api/userAPI/userList';
import { PagingDefaultConf } from '@/utils/constant';
import SettingsModal from './SettingsModal.vue';
import { langArr } from "@/utils/constant";

type TableDataType = {
    id: number;
    key: string;
    name: string;
    platform: number;
    language: string;
};
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 180, fixed: 'left' },
    {
        title: '语言',
        dataIndex: 'language',
        sorter: (a: TableDataType, b: TableDataType) => {
            if (a.language === 'en-US' && b.language !== 'en-US') return -1;
            if (b.language === 'en-US' && a.language !== 'en-US') return 1;
            return 0;
        },
        filteredValue: ['language', 'platform'],
    },
    {
        title: '平台',
        dataIndex: 'platform',
        sorter: (a: TableDataType, b: TableDataType) => b.platform - a.platform,
        filteredValue: ['language', 'platform'],
    },
    { title: '修改时间', dataIndex: 'updateTime' },
    { title: 'URI', dataIndex: 'fullImageUri', width: 120 },
    { title: '跳转链接', dataIndex: 'linkUrl', width: 120 },
    { title: '状态', dataIndex: 'state' },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
]);

export default defineComponent({
    name: 'BannerList',
    components: { SearchOutlined, RedoOutlined /* PlusOutlined, */, SettingsModal },
    setup() {
        const formState = reactive<{
            state: string | null; // 状态
            platform: string | null;
            language: string | null;
        }>({ state: null, platform: null, language: null });

        const pagination = reactive({ ...PagingDefaultConf });
        const loading = ref(false);
        const tableData = ref(Object.create([]));
        const handleOnSubmit = () => {
            loading.value = true;
            NProgress.start();
            const { pageNo, pageSize } = pagination;
            api.fetchBannerList({
                ...formState,
                pageNo,
                pageSize,
            })
                .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchBannerList>) => {
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
        const handleOpenModal = (record: PromiseReturnType<typeof api.fetchBannerList>, type: 'edit' | 'add') => {
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
        const handelOptions = (id: number, state: number) => {
            const content = state == 1 ? '该banner数据正在使用中，请禁用banner数据后再操作' : '是否要删除该项banner数据？';
            Modal.confirm({
                title: '删除',
                icon: createVNode(ExclamationCircleOutlined),
                content,
                okText: '确定',
                width: '430px',
                cancelText: '取消',
                class: 'user-moadl-warning',
                async onOk() {
                    if (state == 1) return false;
                    api.fetchBannerDelete(id).then(() => {
                        message.success('删除成功Banner成功');
                        handleOnSubmit();
                    });
                },
            });
        };

        return {
            tableColumns,
            langArr,
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
            handelOptions,
        };
    },
});
</script>
<style scoped lang="scss">
:deep(.ant-table-column-sorters) {
    .ant-table-column-sorter-up,
    .ant-table-column-sorter-down {
        font-size: 20px;
    }
}
</style>
