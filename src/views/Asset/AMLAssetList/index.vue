<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="用户UID" class="mr-22 width-250" name="uid">
                    <a-input v-model:value="formState.uid" size="small" placeholder="请输入" />
                </a-form-item>

                <a-form-item label="资金类型" class="mr-22 width-250" name="coinSymbol">
                    <SCoin :status="1" v-model="formState.coinSymbol" />
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
            <template #bodyCell="{ column: { dataIndex }, record: { status, amlFrozen }, record }">
                <template v-if="dataIndex === 'AMLStatus'">
                    <span class="text-color-red">冻结中</span>
                </template>

                <template v-else-if="dataIndex === 'address'">
                    <a-tooltip :title="record.address" placement="topLeft">
                        <div class="truncate">
                            {{ record.address }}
                        </div>
                    </a-tooltip>
                </template>
                <template v-else-if="dataIndex === 'operate'">
                    <a-button type="link" @click="handleAmlFrozen(record)" v-if="buttonPermissionsRoute('deposit')"> 冻结关联订单 </a-button>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, createVNode, onActivated, reactive, ref } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';

import api from '@/newApi/asset/index';
import { PagingDefaultConf } from '@/utils/constant';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: '用户UID', dataIndex: 'uid', width: 150 },
    { title: '地址', dataIndex: 'address', width: 170 },
    {
        title: 'AML风控冻结状态 ',
        dataIndex: 'AMLStatus',
        width: 180,
    },
    { title: '资金类型', dataIndex: 'coinSymbol' },
    { title: '链', dataIndex: 'chainSymbol' },
    { title: '冻结金额 ', dataIndex: 'frozenAmount' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '更新时间 ', dataIndex: 'updateTime' },
    { title: '操作', dataIndex: 'operate', width: 100 },
]);

const formState = reactive({
    uid: '',
    coinSymbol: '',
});

const pagination = reactive({ ...PagingDefaultConf });
const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = async () => {
    loading.value = true;
    NProgress.start();

    const { pageNo, pageSize } = pagination;
    api.getAMLList({
        ...formState,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.getAMLList>) => {
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
    const { uid, coinSymbol } = route.query;
    if (uid || coinSymbol) {
        formState.uid = uid as string;
        formState.coinSymbol = coinSymbol as string;
        handleOnSubmit();
        return;
    }
    if (route.hash === '#no-refresh') return;

    handleResetForm();
});
const router = useRouter();
const handleAmlFrozen = (record: PromiseReturnType<typeof api.getAccountList>['list'][0]) => {
    console.log(record);
    router.push({
        path: '/digitAsset/deposit',
        query: {
            state: 3,
        },
    });
};
defineOptions({ name: 'userAssetList' });
</script>
