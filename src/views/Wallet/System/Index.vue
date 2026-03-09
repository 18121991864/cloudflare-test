<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="账户类型" class="mr-22" name="opAccount">
                    <a-input v-model:value="formState.opAccount" size="small" class="width-250 mr-22" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
                <a-form-item label="账户名称" class="mr-22" name="reqFunc">
                    <a-input v-model:value="formState.reqFunc" size="small" class="width-250 mr-22" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-500" name="time">
                    <a-input v-model="formState.time" @onChange="onSearch" />
                </a-form-item>
                <a-form-item label="钱包品牌" class="mr-22 width-500" name="time">
                    <a-input v-model="formState.time" @onChange="onSearch" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex justify-between">
                <div>
                    <a-button size="small" type="primary">
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
            :loading="loading"
            :columns="tableColumns"
            :data-source="tableData"
            :pagination="paginationConfig"
            @change="handleSizeChange"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { reqData, respData }, record }">
                <template v-if="dataIndex === 'reqData'">
                    <a-popover placement="top" :title="null" trigger="click">
                        <template #content>
                            <div style="min-height: 300px; max-height: 400px; overflow: auto">
                                <pre>{{ JSON.parse(reqData) }}</pre>
                            </div>
                        </template>
                        <a-button type="link" ghost>详细</a-button>
                    </a-popover>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, reactive, ref, onMounted } from 'vue';
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { TableColumnType } from 'ant-design-vue';
import useTableConf from '@/use/useTableConf';
import NProgress from 'nprogress';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: '钱包账户ID', dataIndex: 'name' },
    { title: '账户名称', dataIndex: 'opAccount' },
    { title: '账户类型', dataIndex: 'opTime' },
    { title: '钱包ID', dataIndex: 'reqFunc' },
    { title: '钱包名称', dataIndex: 'reqFunc' },
    { title: '钱包品牌', dataIndex: 'reqFunc' },
    { title: '管理地址(链/地址)', dataIndex: 'reqFunc' },
    { title: '状态', dataIndex: 'reqUrl' },
    { title: '弃用原因', dataIndex: 'reqUrl' },
    { title: '操作', dataIndex: 'respData' },
]);

const formRef = ref();
const formState = reactive<{
    time: string[];
    opAccount: string;
    reqFunc: string;
}>({ time: [], opAccount: '', reqFunc: '' });

const loading = ref(false);
const tableData = ref(Object.create([]));

// 重置表单
const handleResetForm = (): void => {
    formRef.value.resetFields();
    onSearch();
};

const fetchTableData = () => {
    // NProgress.start();
    // isLoading.value = true;
    // api.vaUserAssetLogCutList(getParams())
    //     .then(({ list, totalSize, pageNo, pageSize }) => {
    //         updatePagination(pageNo, pageSize, totalSize);
    //         tableData.value = list;
    //     })
    //     .finally(() => {
    //         isLoading.value = false;
    //         NProgress.done();
    //     });
};

const { isLoading, onSearch, paginationConfig, handleSizeChange, updatePagination } = useTableConf(fetchTableData);

onMounted(fetchTableData);
</script>
