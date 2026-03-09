<script setup lang="ts">
import { SearchOutlined, RedoOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import AddOrUpdate from './Modal/AddOrUpdate.vue';
import { reactive, ref, onActivated } from 'vue';
import UpdateFee from './Modal/UpdateFee.vue';
import useTableConf from '@/use/useTableConf';
import { message } from 'ant-design-vue';
import addressApi from '@/api/address/index';
import { useRoute } from 'vue-router';
import NProgress from 'nprogress';
import api from '@/api/coin';

const formReset = ref();
const loadSnapshot = ref(false);
const isModalOpen = ref<boolean>(false);
const isModalOpenCoin = ref<boolean>(false);
const activeData = ref(Object.create(null)); // modal打开时激活的数据
const modalType = ref<'add' | 'edit'>('add');
const isDeprecatedModalOpen = ref<boolean>(false);
const formState = reactive<{
    symbol: string;
}>({
    symbol: '',
});
const tableData = ref<PromiseSelectReturnType<typeof api.fetchCoinList, 'list'>>([]);

const route = useRoute();

const tableColumns = [
    { title: 'ID', dataIndex: 'id', width: 180, fixed: 'left' },
    { title: '币种', dataIndex: 'symbol', width: 120 },
    { title: '币全称', dataIndex: 'name', width: 120 },
    { title: '钱包余额', dataIndex: 'balance', width: 120 },
    { title: '链类型', dataIndex: 'chainTag', width: 120 },
    { title: '最小上账金额', dataIndex: 'inAccountAmount', width: 120 },
    { title: '最小充值金额', dataIndex: 'inMinAmount', width: 120 },
    { title: '钱包单笔最大提币额', dataIndex: 'maxOutAmount', width: 150 },
    { title: '钱包单笔最小提币额', dataIndex: 'minOutAmount', width: 150 },
    { title: '小数位', dataIndex: 'decimals', width: 120 },
    { title: '总提币手续费', dataIndex: 'totalFee', width: 120 },
    { title: '优易钱包手续费', dataIndex: 'walletFee', width: 120 },
    { title: '平台手续费', dataIndex: 'withdrawFee', width: 120 },
    { title: '提币状态', dataIndex: 'outStatus', width: 120 },
    { title: '充值状态', dataIndex: 'inStatus', width: 120 },
    { title: '状态', dataIndex: 'status', fixed: 'right', width: 80 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 150 },
];

const fetchTableData = () => {
    isLoading.value = true;
    NProgress.start();
    const { current, pageSize } = paginationConfig;
    api.fetchCoinList({
        ...formState,
        pageNo: current,
        pageSize,
    })
        .then(({ list, totalSize, pageNo }: PromiseReturnType<typeof api.fetchCoinList>) => {
            updatePagination(pageNo, pageSize, totalSize);
            tableData.value = list;
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
        });
};

const handleResetForm = (): void => {
    // 重置表单
    formReset.value.resetFields();
    onSearch();
};

const handleOnSubmitFee = () => {
    handleResetForm();
};

onActivated(() => {
    if (route.hash === '#no-refresh') return; // 不需要刷新
    handleResetForm();
});

const handChecked = (coinId: string, chainId: string) => {
    api.fetchCoinState({ coinId, chainId }).then(() => {
        message.success('操作成功');
        onSearch();
    });
};

const handCheckedOutStatus = (coinId: string, chainId: string) => {
    api.fetchCoinUpdateOutState({ coinId, chainId }).then(() => {
        message.success('操作成功');
        onSearch();
    });
};

const handCheckedInState = (coinId: string, chainId: string) => {
    api.fetchCoinUpdateInState({ coinId, chainId }).then(() => {
        message.success('操作成功');
        onSearch();
    });
};

const handCoinSync = () => {
    api.fetchCoinSync().then(() => {
        message.success('操作成功');
        onSearch();
    });
};

const handDeprecated = (record: PromiseReturnType<typeof addressApi.fetchAddressList>) => {
    activeData.value = record || Object.create(null);
    [isDeprecatedModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const handleOpenModal = (record: PromiseReturnType<typeof addressApi.fetchAddressList>) => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const handleOpenModalCoin = (record: PromiseReturnType<typeof addressApi.fetchAddressList>) => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalOpenCoin.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const handleCloseModal = () => {
    // 关闭弹框
    [isModalOpen.value] = [false];
    [isDeprecatedModalOpen.value] = [false];
    [isModalOpenCoin.value] = [false];
};

// 快照钱包余额
const handSnapshot = () => {
    if (loadSnapshot.value) return;
    loadSnapshot.value = true;
    api.fetchCoinAssetSnapshotExport({})
        .then((r: PromiseReturnType<typeof api.fetchCoinAssetSnapshotExport>) => {
            message.success('快照成功');
        })
        .finally(() => {
            loadSnapshot.value = false;
        });
};

const { isLoading, onSearch, paginationConfig, handleSizeChange, updatePagination } = useTableConf(fetchTableData);

fetchTableData();
</script>

<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="币种" class="mr-22 width-250" name="symbol">
                    <a-input v-model:value="formState.symbol" size="small" placeholder="请输入" @pressEnter="onSearch" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div class="flex">
                    <a-button v-if="buttonPermissions('syn')" block type="primary" size="small" class="search-submit-btn ml-0" @click="handCoinSync">
                        同步
                    </a-button>
                    <a-button
                        v-if="buttonPermissions('snapshot')"
                        style="width: 140px"
                        block
                        type="primary"
                        size="small"
                        class="search-submit-btn"
                        :loading="loadSnapshot"
                        @click="handSnapshot"
                    >
                        快照钱包余额
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
            :loading="isLoading"
            :scroll="{ x: 1100 }"
            :columns="tableColumns"
            :data-source="tableData"
            :pagination="paginationConfig"
            @change="handleSizeChange"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { status, inStatus, withdrawFee, outStatus }, record }">
                <template v-if="dataIndex === 'status'">
                    <p :class="status === 1 ? 'text-color-green' : 'text-color-red'">{{ status === 1 ? '启用' : '禁用' }}</p>
                </template>
                <template v-if="dataIndex === 'withdrawFee'">
                    {{ withdrawFee }}
                </template>
                <template v-if="dataIndex === 'inStatus'">
                    <p :class="inStatus === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ inStatus === 1 ? '启用' : '禁用' }}
                    </p>
                </template>
                <template v-if="dataIndex === 'outStatus'">
                    <p :class="outStatus === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ outStatus === 1 ? '启用' : '禁用' }}
                    </p>
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-popconfirm v-if="buttonPermissions('synBalance')" ok-type="danger" :title="`确认同步？`" @confirm="onSearch">
                        <template #icon>
                            <question-circle-outlined :style="{ color: 'red' }" />
                        </template>
                        <a-button type="link" danger>同步余额</a-button>
                    </a-popconfirm>
                    <a-button type="link" :style="{ color: 'red' }" @click="handleOpenModalCoin(record)"> 编辑 </a-button>
                </template>
            </template>
        </a-table>

        <UpdateFee :visible="isModalOpen" :type="modalType" :active-data="activeData" @onClose="handleCloseModal" @onSuccess="handleOnSubmitFee" />

        <AddOrUpdate
            :visible="isModalOpenCoin"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmitFee"
        />
    </div>
</template>
