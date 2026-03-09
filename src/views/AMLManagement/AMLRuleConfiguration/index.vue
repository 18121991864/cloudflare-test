<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="规则" class="mr-22 width-250" name="name">
                    <a-input v-model:value="formState.name" size="small" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item>

                <a-form-item label="状态" class="mr-22 width-250" name="status">
                    <a-select v-model:value="formState.status" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option :value="1">启用</a-select-option>
                        <a-select-option :value="2">禁用</a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="flex justify-between action-btm">
                <!-- 新增 -->
                <a-button
                    type="primary"
                    size="small"
                    class="search-submit-btn"
                    @click.stop="handleOpenModal(undefined, 'add')"
                    v-if="buttonPermissions('aml-rule-configuration-add')"
                >
                    新建
                </a-button>
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
                ({ id }: { id: string }) => {
                    return id;
                }
            "
            :data-source="tableData"
            :scroll="{ x: 1400 }"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { id, state, categoryName, typeName, mortgageRate, weightInfo }, record }">
                <template v-if="dataIndex === 'state'">
                    <p :class="state === 1 ? 'text-color-green' : 'text-color-red'">{{ state === 1 ? '启用' : '禁用' }}</p>
                </template>
                <template v-else-if="dataIndex === 'typeName'">
                    {{ `${typeName}-${categoryName}` }}
                </template>
                <template v-else-if="dataIndex === 'mortgageRate'">
                    {{ `${mortgageRate}%` }}
                </template>
                <template v-else-if="dataIndex === 'inviterCode'">
                    <template v-if="weightInfo && weightInfo.length">
                        <a-tooltip placement="topLeft">
                            <template #title>
                                <span v-for="item in weightInfo" :key="item.ditchCode">
                                    <span class="mr-2">{{ item.ditchName }}</span>
                                </span>
                            </template>
                            <div class="truncate w-36">
                                <template v-for="item in weightInfo" :key="item.ditchCode">
                                    <span class="mr-2">{{ item.ditchName }}</span>
                                </template>
                            </div>
                        </a-tooltip>
                    </template>
                </template>
                <template v-else-if="dataIndex === 'action'">
                    <a-button
                        type="link"
                        :danger="state === 1"
                        @click="handChecked(state === 1 ? 2 : 1, id)"
                        v-if="buttonPermissions(state === 1 ? 'aml-rule-configuration-disable' : 'aml-rule-configuration-enable')"
                    >
                        {{ state === 1 ? '禁用' : '启用' }}
                    </a-button>
                    <!-- 查看 -->
                    <a-button type="link" @click="handleOpenModal(record, 'info')" v-if="buttonPermissions('aml-rule-configuration-info')">
                        详情
                    </a-button>
                    <!-- 编辑 -->
                    <a-button type="link" @click="handleOpenModal(record, 'edit')" v-if="buttonPermissions('aml-rule-configuration-edit')">
                        编辑
                    </a-button>
                </template>
            </template>
        </a-table>

        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />

        <AddOrUpdateOrInfo
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
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
import api from '@/newApi/amlManagement/index';
import { PagingDefaultConf } from '@/utils/constant';
import AddOrUpdateOrInfo from './components/AddOrUpdateOrInfo.vue';
import warringTips from '@/config-overall/hook/warring-tips';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 180, fixed: 'left' },
    { title: '规则名称', dataIndex: 'name' },
    { title: '应用范围', dataIndex: 'rangeName' },
    { title: '渠道', dataIndex: 'inviterCode' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '状态', dataIndex: 'state' },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 260 },
]);

const formState = reactive<{
    agentId: string | null;
    name: string; // 名称
    status: 1 | 2 | null; // 状态：1=启用,2=禁用
}>({ agentId: null, name: '', status: null });
const pagination = reactive({ ...PagingDefaultConf });
const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    const { pageNo, pageSize } = pagination;
    api.fetchAMLRuleList({
        ...formState,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchAMLRuleList>) => {
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

const handChecked = (state: 1 | 2, id: string) => {
    const statusText = state === 2 ? '禁用' : '启用';
    warringTips(
        {
            title: '更新状态',
            content: `你确定要将该状态修改为${statusText}?`,
            sucessTips: '更新状态成功',
            handelSubmit: handleOnSubmit.bind(api),
            changeStateApi: api.fetchUpdateAMLRule.bind(api),
        },
        { id, state }
    );
};

const isModalOpen = ref<boolean>(false);
const modalType = ref<'add' | 'edit' | 'info'>('add');
const activeData = ref(Object.create(null)); // modal打开时激活的数据
const handleOpenModal = (record: PromiseReturnType<typeof api.fetchAMLRuleList> | undefined, type: 'add' | 'edit' | 'info') => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalOpen.value, modalType.value] = [true, type];
};

const handleCloseModal = () => {
    // 关闭弹框
    [isModalOpen.value] = [false];
};
</script>
