<template>
    <div>
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="地址" class="mr-22 width-250" name="address">
                    <a-input v-model:value="formState.address" size="small" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="status">
                    <a-select v-model:value="formState.status" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">启用</a-select-option>
                        <a-select-option :value="0">禁用</a-select-option>
                        <a-select-option :value="2">弃用</a-select-option>
                        <a-select-option :value="3">风控弃用</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="用户UID" class="mr-22 width-250" name="accountId">
                    <a-input v-model:value="formState.accountId" size="small" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="历史代理商ID" class="mr-22 width-250" name="historyAgentId">
                    <a-input v-model:value="formState.historyAgentId" size="small" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="代理商ID" class="mr-22 width-250" name="agentId">
                    <a-input v-model:value="formState.agentId" size="small" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="钱包品牌" class="mr-22 width-250" name="walletType">
                    <a-select v-model:value="formState.walletType" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="item.code" v-for="item in walletList" :key="item.code">{{ item.name }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="币种" class="mr-22 width-250" name="coinId">
                    <SCoin v-model="formState.coinId" :pure="false" placeholder="请选择币种" />
                </a-form-item>
                <a-form-item label="链" class="mr-22 width-250" name="chainId">
                    <SChain v-model="formState.chainId" :norequest="true" :pure="false" />
                </a-form-item>
                <a-form-item label="AML" class="mr-22 width-250" name="aml">
                    <a-select v-model:value="formState.aml" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">是</a-select-option>
                        <a-select-option :value="2">否</a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div>
                    <a-button
                        v-if="$filters.isShowTabsBtn('address-manage-add')"
                        block
                        type="primary"
                        size="small"
                        class="px-5 ml-0"
                        @click="handleOpenModal()"
                    >
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        添加UE地址
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
            :scroll="{ x: 1500 }"
        >
            <template #bodyCell="{ column: { dataIndex }, text, record: { id, status, aml }, record }">
                <template v-if="dataIndex === 'status'">
                    <p class="text-color-red">{{ status === 0 ? '禁用' : '' }}</p>
                    <p class="text-color-green">{{ status === 1 ? '启用' : '' }}</p>
                    <p class="text-color-grey">{{ status === 2 ? '弃用' : '' }}</p>
                    <p class="text-color-grey">{{ status === 3 ? '风控弃用' : '' }}</p>
                </template>
                <template v-else-if="dataIndex === 'action' && status !== 3">
                    <a-button
                        v-if="$filters.isShowTabsBtn('address-manage-open') && status !== 2"
                        type="link"
                        :danger="status === 1"
                        @click="handChecked(id)"
                    >
                        {{ status === 1 ? '禁用' : '开启' }}
                    </a-button>
                    <a-button
                        v-if="$filters.isShowTabsBtn('address-manage-disable') && status !== 2"
                        type="link"
                        :danger="status === 1"
                        @click="handDeprecated(record)"
                    >
                        弃用
                    </a-button>
                </template>
                <template v-else-if="dataIndex === 'aml'">
                    {{ aml === 1 ? '是' : '否' }}
                </template>
                <template v-else>{{ text || '--' }}</template>
            </template>
        </a-table>

        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />

        <AddressAddOrUpdate
            :visible="isModalOpen"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmit"
        />

        <AddressDeprecated
            :visible="isDeprecatedModalOpen"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmit"
        />
    </div>
</template>

<script lang="ts" setup>
import api from '@/api/asset';
import CommonApi from '@/api/wallet/common';
import { PagingDefaultConf } from '@/utils/constant';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { TableColumnType } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import NProgress from 'nprogress';
import { computed, ComputedRef, onActivated, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import AddressAddOrUpdate from '../../AddressAddOrUpdate.vue';
import AddressDeprecated from '../../AddressDeprecated.vue';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 130, fixed: 'left' },
    { title: '用户UID', dataIndex: 'accountId', width: 100 },
    { title: '地址', dataIndex: 'address', width: 250 },
    { title: '钱包品牌', dataIndex: 'walletTypeName', width: 100 },
    { title: '币种', dataIndex: 'coinSymbol', width: 100 },
    { title: '链', dataIndex: 'chainTag', width: 80 },
    { title: '历史代理商 ID', dataIndex: 'historyAgentName', width: 150 },
    { title: '历史代理商', dataIndex: 'historyAgentName', width: 150 },
    { title: '分配来源', dataIndex: 'sourceTypeName', width: 100 },
    { title: '代理商 ID', dataIndex: 'agentId', width: 150 },
    { title: '风险备注', dataIndex: 'riskInfo', width: 130 },
    { title: '弃用原因', dataIndex: 'info', width: 130 },
    { title: 'AML污染', dataIndex: 'aml', width: 100 },
    { title: '状态', dataIndex: 'status', fixed: 'right', width: 80 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
]);

const formState = reactive<{
    address: string;
    status: 1 | 0 | string; // 状态：1=启用,2=禁用
    accountId: string;
    coinId: string;
    chainId: string;
    aml: string;
    agentId: string;
    walletType: string;
    historyAgentId: string;
}>({ address: '', status: '', agentId: '', accountId: '', coinId: '', chainId: '', aml: '', walletType: '', historyAgentId: '' });

const pagination = reactive({ ...PagingDefaultConf });
const loading = ref(false);
const tableData = ref(Object.create([]));
const walletList = ref<PromiseReturnType<typeof CommonApi.getTypeWalletList>>([]);
const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    const { pageNo, pageSize } = pagination;
    api.fetchAddressList({
        ...formState,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchAddressList>) => {
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

const handChecked = (id: string) => {
    api.fetchAddressState({ id }).then(() => {
        message.success('操作成功');
        handleOnSubmit();
    });
};
const isDeprecatedModalOpen = ref<boolean>(false);
const modalType = ref<'add' | 'edit'>('add');
const activeData = ref(Object.create(null)); // modal打开时激活的数据
const handDeprecated = (record: PromiseReturnType<typeof api.fetchAddressList>) => {
    activeData.value = record || Object.create(null);
    [isDeprecatedModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const isModalOpen = ref<boolean>(false);
const handleOpenModal = (record?: PromiseReturnType<typeof api.fetchAddressList>) => {
    // 打开新增/编辑弹框
    activeData.value = record || Object.create(null);
    [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
};

const handleCloseModal = () => {
    // 关闭弹框
    [isModalOpen.value] = [false];
    [isDeprecatedModalOpen.value] = [false];
};

const getTypeWalletList = () => {
    CommonApi.getTypeWalletList({ ignoreUe: false }).then((res) => {
        walletList.value = res;
    });
};
getTypeWalletList();
</script>
<script lang="ts">
export default {
    name: 'Address',
};
</script>
