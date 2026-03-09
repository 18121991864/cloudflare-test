<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="地址" class="mr-22 width-250" name="address">
                    <a-input v-model:value="formState.address" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="status">
                    <a-select v-model:value="formState.status" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="item.value" v-for="item in addressStatus" :key="item.value">{{ item.label }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="代理商编号" class="mr-22 width-250" name="agentNo">
                    <a-input v-model:value="formState.agentNo" size="small" placeholder="请输入" />
                </a-form-item>
                <a-form-item label="币种" class="mr-22 width-250" name="coinSymbol">
                    <SCoin v-model="formState.coinSymbol" :status="1" />
                </a-form-item>
                <a-form-item label="链" class="mr-22 width-250" name="chainId">
                    <SChain v-model="formState.chainId" :status="1" />
                </a-form-item>
                <a-form-item label="AML" class="mr-22 width-250" name="aml">
                    <a-select v-model:value="formState.aml" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="item.value" v-for="item in amladdressStatus" :key="item.value">{{ item.label }}</a-select-option>
                    </a-select>
                </a-form-item>
            </div>

            <form-query @handleSearch="handleSearch" @handleResetForm="handleResetForm">
                <template #btn-query>
                    <a-button
                        block
                        type="primary"
                        size="small"
                        class="search-submit-btn"
                        @click.stop="handelOpenModal(1)"
                        v-if="buttonPermissions('address-add')"
                    >
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        新增
                    </a-button>
                </template>
            </form-query>
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
            :scroll="{ x: 1500 }"
        >
            <template #bodyCell="{ column: { dataIndex }, record, record: { aml, remarks } }">
                <template v-if="['status'].includes(dataIndex)">
                    <div :class="['text-color-green', 'text-yellow-600', 'text-color-red'][record.status - 1]">
                        {{ stateText(record[dataIndex]) }}
                    </div>
                </template>
                <template v-else-if="['aml'].includes(dataIndex)">
                    {{ aml === 1 ? '是' : '否' }}
                </template>
                <template v-else-if="['remarks', 'coinNames', 'address'].includes(dataIndex)">
                    <a-tooltip :title="record[dataIndex]" placement="topLeft">
                        <div class="truncate" :class="dataIndex === 'coinNames' ? 'w-30' : 'w-24'" v-if="dataIndex !== 'address'">
                            {{ record[dataIndex] }}
                        </div>
                        <div class="truncate w-36" v-else-if="dataIndex === 'address'">
                            {{ record[dataIndex] }}
                        </div>
                    </a-tooltip>
                </template>

                <template v-else-if="dataIndex === 'operate'">
                    <a-button type="link" @click="handelOpenModal(record, 3)"> 备注 </a-button>

                    <a-button
                        type="link"
                        @click="updateStatus(1, record.id)"
                        class="text-color-green"
                        v-if="record.status == 2 && buttonPermissions('address-enable')"
                    >
                        启用
                    </a-button>
                    <a-button
                        type="link"
                        @click="updateStatus(2, record.id)"
                        class="text-yellow-600"
                        v-if="record.status == 1 && buttonPermissions('address-disable')"
                    >
                        禁用
                    </a-button>
                    <a-button
                        type="link"
                        @click="handelOpenModal(record, 2)"
                        class="text-color-red"
                        v-if="record.status !== 3 && buttonPermissions('address-deprecate')"
                    >
                        弃用
                    </a-button>
                    <a-button type="link" @click="handelOpenCoinModal(record)" v-if="record.status != 3 && buttonPermissions('address-add-coin')">
                        添加币种
                    </a-button>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
        <UpdateModal v-model:visible="isModalOpen" :editData="activeData" @success="handleOnSubmit" :type="modalType" />
        <AddCoin v-model:visible="isOpenCoinModal" :editData="activeData" @success="handleOnSubmit" />
    </div>
</template>

<script lang="ts" setup>
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';

import api from '@/newApi/digitAsset/address/index';
import { PagingDefaultConf } from '@/utils/constant';

import UpdateModal from './Modal/UpdateModal/index.vue';
import AddCoin from './Modal/AddCoin/index.vue';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', fixed: 'left' },
    { title: '用户UID', dataIndex: 'uid' },
    { title: '地址', dataIndex: 'address', width: 200 },
    { title: '钱包品牌', dataIndex: 'walletTypeName' },
    { title: '钱包名称 ', dataIndex: 'walletName', width: 200 },
    { title: '币种', dataIndex: 'coinNames' },
    { title: '代理商编号 ', dataIndex: 'agentNo' },
    { title: 'AML污染', dataIndex: 'aml' },
    { title: '弃用原因 ', dataIndex: 'discontinueReason' },
    { title: '备注 ', dataIndex: 'remarks', width: 100 },
    { title: '状态', dataIndex: 'status' },
    { title: '操作', dataIndex: 'operate', width: 240 },
]);
const isOpenCoinModal = ref(false);
const formState = reactive({
    address: '',
    agentNo: '',
    aml: '',
    chainId: '',
    coinSymbol: '',
    status: '',
    uid: '',
});
const isModalOpen = ref(false);
const addressStatus = ref<PromiseReturnType<typeof api.getAddressStatus>>([]);
const amladdressStatus = ref<PromiseReturnType<typeof api.getAMLStatusSelect>>([]);

const activeData = ref<PromiseReturnType<typeof api.getAddressPage>['list'][0]>(Object.create(null));
const pagination = reactive({ ...PagingDefaultConf });
const modalType = ref<1 | 2 | 3>(1);
const stateText = computed(() => {
    return (state: number) => {
        const status = ['启用', '禁用', '弃用'][state - 1];

        return status;
    };
});
const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = async () => {
    loading.value = true;
    NProgress.start();

    const { pageNo, pageSize } = pagination;
    api.getAddressPage({
        ...formState,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.getAddressPage>) => {
            [tableData.value, pagination.total] = [list, totalSize];
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};

const formReset = ref();
const handleResetForm = (): void => {
    console.log(pagination);

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
    getAddressStatus();
    // handleResetForm();
    handleOnSubmit();
});

const getAddressStatus = async () => {
    addressStatus.value = await api.getAddressStatus();
    amladdressStatus.value = await api.getAMLStatusSelect();
};
const handelOpenModal = (record: PromiseReturnType<typeof api.getAddressPage>['list'][0], type: 1 | 2 | 3) => {
    modalType.value = type;
    isModalOpen.value = true;
    activeData.value = record;
};
const updateStatus = (status: 1 | 2, id: string) => {
    const statusText = status === 2 ? '禁用' : '启用';
    warringTips(
        {
            title: '更新状态',
            content: `你确定要将该状态修改为${statusText}?`,
            sucessTips: '更新状态成功',
            handelSubmit: handleOnSubmit.bind(api),
            changeStateApi: api.updateStatusAddress.bind(api),
        },
        { id, status }
    );
};
const handelOpenCoinModal = (record: PromiseReturnType<typeof api.getAddressPage>['list'][0]) => {
    isOpenCoinModal.value = true;
    activeData.value = record;
};

defineOptions({ name: 'userAssetList' });
</script>
