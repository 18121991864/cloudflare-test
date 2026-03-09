<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list" :rules="formRules">
            <div class="flex-wrap-wrap">
                <a-form-item label="用户UID" class="mr-22 width-250" name="uid">
                    <a-input v-model:value="formState.uid" size="small" placeholder="请输入" />
                </a-form-item>

                <a-form-item label="可用数量" class="mr-22 width-250" name="balanceArray">
                    <InputSE v-model="formState.balanceArray" />
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
                <template v-if="dataIndex === 'status'">
                    <div :class="status === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ stateText(status) }}
                    </div>
                </template>
                <template v-else-if="dataIndex === 'frozenBalance'">
                    {{ amlFrozen }}
                </template>
                <template v-else-if="dataIndex === 'amlFrozen'">
                    <span> {{ amlFrozen }}</span>
                    <a-button type="link" @click="handleAmlFrozen(record)" class="ml-10" v-if="buttonPermissionsRoute('AMLAssetList')">
                        详情
                    </a-button>
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
    { title: 'ID', dataIndex: 'id', fixed: 'left' },
    { title: '用户UID', dataIndex: 'uid', width: 150 },
    { title: '资金类型', dataIndex: 'coinSymbol' },
    { title: '链上余额', dataIndex: 'balance' },
    { title: '手续费总额', dataIndex: 'fee' },
    { title: '冻结总数量', dataIndex: 'frozenBalance' },
    { title: 'AML风控冻结数量', dataIndex: 'amlFrozen' },
    { title: '创建时间', dataIndex: 'createTime', width: 150 },
    { title: '状态', dataIndex: 'status' },
]);

const formState = reactive({
    uid: '',
    balanceArray: [],
});
const router = useRouter();
const tipsError = (rule: any, value: any) => {
    const [start, end] = value;

    if (!start && !end) return Promise.resolve();
    if (Object.is(Number(start), NaN) || Object.is(Number(end), NaN)) {
        return Promise.reject('请输入数字');
    }
    if (start && end) {
        if (Number(end) < Number(start)) {
            return Promise.reject('开始金额不能大于结束金额');
        }
        if (Number(start) > Number(end)) {
            return Promise.reject('开始金额不能大于结束金额');
        }
    }

    return Promise.resolve();
};
const formRules: Record<string, any> = {
    balanceArray: [{ validator: tipsError, trigger: 'blur', required: false }],
};
const pagination = reactive({ ...PagingDefaultConf });
const stateText = computed(() => {
    return (state: number) => {
        const status = ['正常', '禁用', '注销'][state - 1];
        return status;
    };
});
const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = async () => {
    await formReset.value.validateFields();
    loading.value = true;
    NProgress.start();
    const { balanceArray, ...params } = formState;
    const [minBalance, maxBalance] = balanceArray;
    const { pageNo, pageSize } = pagination;
    api.getAccountList({
        ...params,
        minBalance,
        maxBalance,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.getAccountList>) => {
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
    if (route.query.userId) {
        formState.uid = route.query.userId as string;
        handleOnSubmit();
        return;
    }
    if (route.hash === '#no-refresh') return;

    handleResetForm();
});
const handleAmlFrozen = (record: PromiseReturnType<typeof api.getAccountList>['list'][0]) => {
    router.push({
        path: '/asset/AMLAssetList',
        query: {
            uid: record.uid,
            coinSymbol: record.coinSymbol,
        },
    });
};
defineOptions({ name: 'userAssetList' });
</script>
