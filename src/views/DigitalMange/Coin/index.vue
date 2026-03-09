<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="币种" class="mr-22 width-250" name="symbol">
                    <a-input v-model:value="formState.symbol" size="small" placeholder="请输入" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
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
            <template #bodyCell="{ column: { dataIndex }, record }">
                <template v-if="['rechargeStatus', 'withdrawStatus'].includes(dataIndex)">
                    <div :class="record[dataIndex] === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ stateText(record[dataIndex]) }}
                    </div>
                </template>
                <template v-else-if="dataIndex === 'operate'">
                    <a-button type="link" @click="handleEdit(record)" v-if="buttonPermissions('coin-edit')"> 编辑 </a-button>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
        <EditModal v-model:visible="isModalOpen" :editData="activeData" @success="handleOnSubmit" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, createVNode, onActivated, reactive, ref } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';

import api from '@/newApi/digitAsset/coin/index';
import { PagingDefaultConf } from '@/utils/constant';
import EditModal from './Modal/EditModal/index.vue';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', fixed: 'left' },
    { title: '币种', dataIndex: 'symbol' },
    { title: '币全称', dataIndex: 'name' },
    { title: '链', dataIndex: 'chainSymbol' },
    { title: '最小提币数量', dataIndex: 'withdrawMin' },
    { title: '小数位（精度）', dataIndex: 'decimals' },
    { title: '平台提币手续费 ', dataIndex: 'platformFee' },
    { title: '链充币状态', dataIndex: 'rechargeStatus' },
    { title: '链提币状态', dataIndex: 'withdrawStatus' },
    { title: '操作', dataIndex: 'operate' },
]);

const formState = reactive({
    symbol: '',
});
const isModalOpen = ref(false);

const activeData = ref<PromiseReturnType<typeof api.getCoinlList>['list'][0]>(Object.create(null));
const pagination = reactive({ ...PagingDefaultConf });
const stateText = computed(() => {
    return (state: number) => {
        const status = ['启用', '禁用'][state - 1];
        return status;
    };
});
const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = async () => {
    loading.value = true;
    NProgress.start();

    const { pageNo, pageSize } = pagination;
    api.getCoinlList({
        ...formState,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.getCoinlList>) => {
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
    if (route.hash === '#no-refresh') return;

    handleResetForm();
});
const handleEdit = (record: PromiseReturnType<typeof api.getCoinlList>['list'][0]) => {
    activeData.value = record;
    isModalOpen.value = true;
};
defineOptions({ name: 'userAssetList' });
</script>
