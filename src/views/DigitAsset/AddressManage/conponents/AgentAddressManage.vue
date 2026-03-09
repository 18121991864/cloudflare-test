<template>
    <div>
        <a-form ref="formRef" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="代理商ID" class="mr-22 width-250" name="agentId">
                    <a-input v-model:value="formState.agentId" size="small" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
                <a-form-item label="代理商名称" class="mr-22 width-250" name="agentName">
                    <a-input v-model:value="formState.agentName" size="small" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
                <a-form-item label="币种" class="mr-22 width-250" name="coinId">
                    <SCoin v-model="formState.coinId" :pure="false" placeholder="请选择币种" />
                </a-form-item>
                <a-form-item label="链" class="mr-22 width-250" name="chainId">
                    <SChain v-model="formState.chainId" :norequest="true" :pure="false" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div></div>
                <div class="display-flex">
                    <a-button block type="primary" size="small" class="search-submit-btn" @click.stop="onSearch">
                        <template #icon>
                            <SearchOutlined />
                        </template>
                        搜索
                    </a-button>
                    <a-button block size="small" class="search-reset-btn" @click.stop="onReset">
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
            :loading="isLoading"
            :columns="tableColumns"
            :data-source="tableData"
            :scroll="{ x: 1500 }"
            @change="handleSizeChange"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { minLimit, replenishNum }, record }">
                <template v-if="dataIndex === 'minLimit'">
                    {{ minLimit }}; {{ replenishNum}} <a-button v-if="$filters.isShowTabsBtn('agent-address-manage-edit')" type="link" @click.stop="onEditShow(record)">编辑</a-button>
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button v-if="$filters.isShowTabsBtn('agent-address-manage-add')" type="link" @click.stop="onAddShow(record)">
                        补充UE地址
                    </a-button>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="paginationConfig.current" v-model:limit="paginationConfig.pageSize" :total="paginationConfig.total" @pagination="fetchTableData" />
        <AutoFill ref="autoRef" @updateTable="onSearch" />
        <AddAddress ref="addRef" @updateTable="onSearch" />
    </div>
</template>

<script lang="ts" setup>
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
import AddAddress from '../Modal/AddAddress.vue';
import AutoFill from '../Modal/AutoFill.vue';
import useTableConf from "@/use/useTableConf";
import NProgress from 'nprogress';
import api from '@/api/address';


const addRef = ref();
const autoRef = ref();
const formRef = ref();
const formState = ref<{
    agentName: string;
    status: 1 | 0 | string; // 状态：1=启用,2=禁用
    accountId: string;
    coinId: string;
    chainId: string;
    aml: string;
    agentId: string;
    walletType: string;
}>({ agentName: '', status: '', agentId: '', accountId: '', coinId: '', chainId: '', aml: '', walletType: '' });
const tableData = ref(Object.create([]));

const tableColumns= computed(() => [
    { title: '代理商ID', dataIndex: 'agentId', width: 130, fixed: 'left' },
    { title: '代理商名称', dataIndex: 'agentName', width: 100 },
    { title: '状态', dataIndex: 'state', width: 100, customRender: ({ text }: { text: string }) => {
        return text == '1' ? '开启' : '关闭';
    } },
    { title: '币种', dataIndex: 'coinSymbol', width: 100 },
    { title: '链', dataIndex: 'chainTag', width: 80 },
    { title: '总分配数量', dataIndex: 'totalNum', width: 150 },
    { title: '已使用数量', dataIndex: 'usedNum', width: 130 },
    { title: '剩余数量', dataIndex: 'remainingNum', width: 130 },
    { title: '自动补充设置', dataIndex: 'minLimit', width: 100 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
]);

const onAddShow = (data: { agentId: string }): void => {
    addRef.value.onShowDialog(true, data);
};

const onEditShow = (data: { agentId: string }): void => {
    autoRef.value.onShowDialog(true, data);
};

const fetchTableData = async () => {
    try {
        NProgress.start();
        isLoading.value = true;

        const { list, totalSize, pageNo, pageSize } = await api.agentAddressList({
            ...formState.value,
            pageNo: paginationConfig.current,
            pageSize: paginationConfig.pageSize,
        });
        updatePagination(pageNo, pageSize, totalSize);
        tableData.value = list;
    } finally {
        isLoading.value = false;
        NProgress.done();
    }
};


const onReset= (): void => {
    paginationConfig.current = 1;
    formRef.value.resetFields();
    onSearch();
};

const { isLoading, onSearch, paginationConfig, handleSizeChange, updatePagination } = useTableConf(fetchTableData);

fetchTableData();
</script>
