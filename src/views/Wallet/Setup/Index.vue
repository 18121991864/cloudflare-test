<template>
    <div class="table-container">
        <a-form ref="formRef" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="钱包名称" class="mr-22 w-[250px]" name="name">
                    <a-select v-model:value="formState.name" size="small" placeholder="请选择">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option :value="item.name" v-for="item in chooseList" :key="item.id">{{ item.name }}</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="状态" class="mr-22 w-[250px]" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option :value="item.value" v-for="item in stateList" :key="item.value">{{ item.label }}</a-select-option>
                    </a-select>
                </a-form-item>
                <!-- <a-form-item label="钱包品牌" class="mr-22 w-[250px]" name="walletType">
                    <a-select v-model:value="formState.walletType" size="small" placeholder="请选择">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option :value="item.code" v-for="item in walletList" :key="item.code">{{ item.name }}</a-select-option>
                    </a-select>
                </a-form-item> -->
            </div>
            <div class="justify-between action-btm display-flex">
                <div>
                    <!-- <a-button v-if="buttonPermissions('add')" size="small" type="primary" @click.stop="updateSiteWallet('add')">
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        添加
                    </a-button> -->
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
            :columns="tableColumns"
            :data-source="tableData"
            :pagination="paginationConfig"
            @change="handleSizeChange"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { state, id }, record }">
                <template v-if="dataIndex === 'operate'">
                    <template v-if="state == 2">
                        <a-button type="link" class="text-rose-600" @click="updateState(3, id)" v-if="buttonPermissions('wallet-setup-deprecate')"
                            >弃用</a-button
                        >

                        <a-button type="link" class="text-green-400" @click="updateState(1, id)" v-if="buttonPermissions('wallet-setup-enable')"
                            >启用</a-button
                        >
                    </template>
                    <template v-else>
                        <a-button
                            v-if="buttonPermissions(state === 1 ? 'wallet-setup-disable' : 'wallet-setup-enable')"
                            @click="updateState(state === 1 ? 2 : 1, id)"
                            type="link"
                            :class="state === 1 ? 'text-rose-600' : 'text-green-400'"
                            >{{ state === 1 ? '禁用' : '启用' }}</a-button
                        >
                    </template>
                    <a-button type="link" @click="updateSiteWallet('edit', record)" v-if="buttonPermissions('wallet-setup-updata-name')"
                        >编辑名称</a-button
                    >
                </template>
                <template v-else-if="dataIndex === 'state'">
                    <span :class="stateItem(state)?.color"> {{ stateItem(state)?.label }}</span>
                </template>
            </template>
        </a-table>
        <Add ref="addRef" @update-table="updateSubmit" />
        <GoogleCode ref="googleCodeRef" @setCodeVal="setCodeVal" />
    </div>
</template>

<script setup lang="ts">
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { computed, ComputedRef, reactive, ref, onMounted } from 'vue';
import type { TableColumnType } from 'ant-design-vue';
import useTableConf from '@/use/useTableConf';
import Add from './Modal/Add.vue';
import NProgress from 'nprogress';
import api from '@/api/wallet/site';
// import Commonwallet from '@/api/wallet/common/index';
import type { SiteParams } from '@/api/wallet/site.d';
import { message, Modal } from 'ant-design-vue';
import GoogleCode from '@/components/Dialog/GoogleCode.vue';
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 80, fixed: 'left' },
    { title: '钱包名称', dataIndex: 'name' },
    { title: '钱包品牌', dataIndex: 'walletTypeName' },
    { title: 'APIKey', dataIndex: 'apiKey' },
    { title: 'APIsecret', dataIndex: 'secretKey' },
    { title: '状态', dataIndex: 'state' },
    { title: '操作', dataIndex: 'operate' },
]);
const { proxy } = getCurrentInstance();
const addRef = ref();
const googleCodeRef = ref<InstanceType<typeof GoogleCode>>();

const formRef = ref();
const stateRef = ref<1 | 2 | 3>(1);
const idRef = ref('0');
// const walletList = ref<PromiseReturnType<typeof Commonwallet.getTypeWalletList>>([]);
const chooseList = ref<PromiseReturnType<typeof api.getChooseListList>>([]);
const stateList = [
    { label: '启用', value: 1, color: 'text-green-400' },
    { label: '禁用', value: 2, color: 'text-rose-600' },
    { label: '弃用', value: 3, color: 'text-rose-600' },
];
const formState = reactive<SiteParams>({ name: null, walletType: null, state: null });
const tableData = ref(Object.create([]));
const stateItem = computed(() => (state: number) => {
    return stateList.find((item) => item.value === state);
});
const updateSiteWallet = (type: 'add' | 'edit', item?: SiteParams): void => {
    addRef.value.onShowDialog(true, type, item);
};

// 重置表单
const handleResetForm = (): void => {
    formRef.value.resetFields();
    onSearch();
};

const fetchTableData = () => {
    NProgress.start();
    isLoading.value = true;
    api.getSiteWalletList({
        ...formState,
        pageNo: paginationConfig.current,
        pageSize: paginationConfig.pageSize,
    })
        .then(({ list, totalSize, pageNo, pageSize }) => {
            updatePagination(pageNo, pageSize, totalSize);
            tableData.value = list;
        })
        .finally(() => {
            isLoading.value = false;
            NProgress.done();
        });
};

const { isLoading, onSearch, paginationConfig, handleSizeChange, updatePagination } = useTableConf(fetchTableData);
const getTypeWalletList = () => {
    // Commonwallet.getTypeWalletList({ ignoreUe: false }).then((res) => {
    //     walletList.value = res;
    // });
    api.getChooseListList().then((res) => {
        chooseList.value = res;
    });
};

const updateState = (state: 1 | 2 | 3, id: string) => {
    if (!proxy.$is2FA()) return false;
    const content = `你确定要将该状态修改为${stateList[state - 1].label}`;
    Modal.confirm({
        title: '更改状态',
        content,
        class: 'user-moadl-warning',
        onOk() {
            googleCodeRef.value?.handleShowDialog(true);
            stateRef.value = state;
            idRef.value = id;
        },
    });
};
const setCodeVal = (googleCode: string) => {
    api.updateStateSiteWallet({
        id: idRef.value,
        googleCode,
        state: stateRef.value,
    }).then(() => {
        message.success('修改状态成功');
        onSearch();
    });
};
const updateSubmit = () => {
    onSearch();
    getTypeWalletList();
};
onActivated(() => {
    updateSubmit();
});
</script>
