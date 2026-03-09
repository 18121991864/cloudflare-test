<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="操作人" class="mr-22 width-500" name="opAccount">
                    <a-input
                        v-model:value="formState.opAccount"
                        size="small"
                        class="width-250 mr-22"
                        placeholder="请输入"
                        @pressEnter="handleSearch"
                    />
                </a-form-item>
                <a-form-item label="请求功能" class="mr-22 width-500" name="reqFunc">
                    <a-input v-model:value="formState.reqFunc" size="small" class="width-250 mr-22" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="操作时间" class="mr-22 width-500" name="time">
                    <DateRangePicker v-model="formState.time" @onChange="handleSearch" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-flex-end">
                <div class="display-flex">
                    <a-button block type="primary" size="small" class="search-submit-btn" @click.stop="handleOnSubmit">
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
            <template #bodyCell="{ column: { dataIndex }, record: { reqData, respData, errMsg, occurErr }, record }">
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
                <template v-if="dataIndex === 'respData'">
                    <a-popover placement="top" :title="null" trigger="click">
                        <template #content>
                            <div style="min-height: 300px; max-height: 400px; overflow: auto">
                                <pre>{{ JSON.parse(respData) }}</pre>
                            </div>
                        </template>
                        <a-button type="link" ghost>详细</a-button>
                    </a-popover>
                </template>
                <template v-if="['errMsg'].includes(dataIndex)">
                    <a-popover placement="top" :title="null" trigger="click" v-if="record[dataIndex]">
                        <template #content>
                            <div class="overflow-y-auto px-5 break-all h-[400px] w-[400px]">
                                {{ record[dataIndex] }}
                            </div>
                        </template>
                        <a-button type="link" ghost>详细</a-button>
                    </a-popover>
                    <span v-else>--</span>
                </template>
                <template v-if="dataIndex === 'occurErr'">{{ occurErr ? '是' : '否' }}</template>
                <template v-if="dataIndex === 'success'">{{ record.success ? '成功' : '失败' }}</template>
            </template>
        </a-table>

        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
    </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, reactive, ref, onActivated } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { Dayjs } from 'dayjs';
import api from '@/api/asset/index';
import { PagingDefaultConf } from '@/utils/constant';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 180, fixed: 'left' },
    { title: '操作人', dataIndex: 'opAccount', width: 120 },
    { title: '操作时间', dataIndex: 'opTime', width: 100 },
    { title: 'ip', dataIndex: 'ip', width: 100 },
    { title: '请求功能', dataIndex: 'reqFunc', width: 100 },
    { title: '请求URL', dataIndex: 'reqUrl', width: 180 },
    { title: '请求报文', dataIndex: 'reqData', width: 100 },
    { title: '响应报文', dataIndex: 'respData', width: 100 },
    { title: '请求方式', dataIndex: 'reqMethod', width: 100 },
    { title: '执行耗时(毫秒)', dataIndex: 'elapsedTime', width: 150 },
    { title: '是否发生错误的表示', dataIndex: 'occurErr', width: 130 },
    { title: '发生错误的信息', dataIndex: 'errMsg', width: 200 },

    { title: '响应状态', dataIndex: 'success', fixed: 'right', width: 100 },
]);

export default defineComponent({
    name: 'OperationLog',
    components: { SearchOutlined, RedoOutlined /* PlusOutlined, */ },
    setup() {
        const formState = reactive<{
            time: string[];
            opAccount: string;
            reqFunc: string;
        }>({ time: [], opAccount: '', reqFunc: '' });

        const pagination = reactive({ ...PagingDefaultConf });
        const loading = ref(false);
        const tableData = ref(Object.create([]));
        const handleOnSubmit = () => {
            loading.value = true;
            NProgress.start();
            const { time, ...params } = formState;
            const [startTime, endTime] = time;
            const { pageNo, pageSize } = pagination;
            api.fetchOperationLogList({
                ...params,
                startTime,
                endTime,
                pageNo,
                pageSize,
            })
                .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchOperationLogList>) => {
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

        return {
            tableColumns,

            pagination,
            loading,
            tableData,
            handleOnSubmit,

            formState,
            formReset,
            handleSearch,
            handleResetForm,
        };
    },
});
</script>
