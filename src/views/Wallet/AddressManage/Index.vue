<template>
    <div class="table-container">
        <a-form layout="horizontal" :model="formState" class="form-list" ref="formRef" @finish="handleFinish">
            <div class="flex-wrap-wrap">
                <a-form-item class="mr-22 width-250" label="地址" name="column_field3">
                    <a-input size="small" v-model:value="formState.column_field3" placeholder="请输入" />
                </a-form-item>
                <a-form-item class="mr-22 width-250" label="用户UID" name="column_field2">
                    <a-input size="small" v-model:value="formState.column_field2" placeholder="请选择" />
                </a-form-item>
                <a-form-item class="mr-22 width-250" label="钱包ID" name="column_field5">
                    <a-input size="small" v-model:value="formState.column_field5" placeholder="请选择" />
                </a-form-item>
                <a-form-item class="mr-22 width-250" label="链" name="column_field7">
                    <a-input size="small" v-model:value="formState.column_field7" placeholder="请选择" />
                </a-form-item>
                <a-form-item class="mr-22 width-250" label="币种" name="column_field9">
                    <a-input size="small" v-model:value="formState.column_field9" placeholder="请选择" />
                </a-form-item>
                <a-form-item class="mr-22 width-250" label="AML污染" name="column_field13">
                    <a-input size="small" v-model:value="formState.column_field13" placeholder="请选择" />
                </a-form-item>
                <div class="action-btm" style="margin-left: auto">
                    <a-space>
                        <a-button block type="primary" size="small" class="search-submit-btn" html-type="submit">
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
                    </a-space>
                </div>
            </div>
        </a-form>
        <a-table class="table-wrapper" v-bind="getTableBindValue">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'labelName'">
                    <a-tag :color="record.labelColor">{{ record.labelName }}</a-tag>
                </template>
                <template v-else-if="column.dataIndex === 'actions'">
                    <a-button type="link" v-if="buttonPermissions('oe-adjust-user-info')">禁用</a-button>
                    <a-button type="link" v-if="buttonPermissions('oe-adjust-user-info')">启用</a-button>
                    <a-button type="link" v-if="buttonPermissions('oe-adjust-user-info')">启用</a-button>
                    <a-button type="link" v-if="buttonPermissions('oe-adjust-user-info')">手动归集</a-button>
                </template>
            </template>
        </a-table>

        <Pagination :total="total" v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" />
    </div>
</template>

<script setup lang="ts">
import { cloneDeep, omit } from 'lodash-es';
import { reactive, ref, unref } from 'vue';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { usePagination } from 'vue-request';
import { PagingDefaultConf } from '@/utils/constant';

const formState = reactive<Record<string, any>>({});

const pagination = reactive({
    ...PagingDefaultConf,
});

const searchValue = ref(cloneDeep(formState));
const formRef = ref();

const columns = [
    { title: 'ID', dataIndex: 'column_field1' },
    { title: '用户UID', dataIndex: 'column_field2' },
    { title: '地址', dataIndex: 'column_field3' },
    { title: '钱包账户ID', dataIndex: 'column_field4' },
    { title: '钱包ID', dataIndex: 'column_field5' },
    { title: '钱包品牌', dataIndex: 'column_field6' },
    { title: '链', dataIndex: 'column_field7' },
    { title: '币种', dataIndex: 'column_field8' },
    { title: '币种ID', dataIndex: 'column_field9' },
    { title: '代理商ID', dataIndex: 'column_field10' },
    { title: '风险备注', dataIndex: 'column_field11' },
    { title: '弃用原因', dataIndex: 'column_field12' },
    { title: 'AML污染', dataIndex: 'column_field13' },
    { title: '状态', dataIndex: 'column_field14' },
    { title: '操作', dataIndex: 'actions', width: 150 },
];

const { data, total, loading } = usePagination(
    () => {
        const search = unref(searchValue);
        const _searchValue = Object.keys(search).reduce((o, k) => {
            if (search[k] !== '') {
                o[k] = search[k];
            }
            return o;
        }, {} as Record<string, any>);
        const params = Object.assign({}, omit(pagination, 'pageTotal'), _searchValue);
        return Promise.resolve({ list: [] });
    },
    // @ts-ignore
    { refreshDeps: [pagination, searchValue] }
);

const getTableBindValue = computed<Record<string, any>>(() => {
    const scrollX = Math.max(
        //@ts-ignore
        columns.reduce((n, i) => n + (i.width || i.minWidth || 0), 0),
        1500
    );
    return {
        columns,
        bordered: true,
        size: 'small',
        rowKey: 'id',
        pagination: false,
        loading: unref(loading),
        scroll: { x: scrollX },
        dataSource: unref(data)?.list,
    };
});

function resetPagination() {
    Object.assign(pagination, {
        ...PagingDefaultConf,
    });
}

function handleResetForm() {
    formRef.value.resetFields();
    searchValue.value = cloneDeep(formState);
    resetPagination();
}

function handleFinish(values: Record<string, any>) {
    searchValue.value = cloneDeep(values);
    resetPagination();
}

// onMounted(refreshDataList);
</script>

<style scoped lang="scss">
.table-wrapper {
    ::v-deep(.ant-table) {
        margin: 0 !important;
    }

    .summary-cell {
        border-top: 1px solid #f0f0f0;
    }

    ::v-deep(.ant-table-expanded-row) {
        & > .ant-table-cell {
            padding: 0;
        }
        .ant-table-row-expand-icon.ant-table-row-expand-icon-collapsed {
            display: none;
        }
    }
}
</style>
