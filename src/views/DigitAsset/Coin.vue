<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="币种" class="mr-22 width-250" name="symbol">
                    <a-input v-model:value="formState.symbol" size="small" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div class="flex">
                    <!-- v-if="buttonPermissions('setPassword')"
                    v-if="buttonPermissions('editPassword')" -->
                    <a-button v-if="buttonPermissions('syn')" block type="primary" size="small" class="ml-0 search-submit-btn" @click="handCoinSync"
                        >同步
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
                        >快照钱包余额
                    </a-button>
                    <!-- <a-button block type="primary" size="small" class="search-submit-btn ml-22"  @click="handleOnSettingSubmit('add')">设置提币密码</a-button>
                    <a-button  block type="primary" size="small" class="search-submit-btn ml-22"  @click="handleOnSettingSubmit('edit')">修改提币密码</a-button> -->
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
            :scroll="{ x: 1100 }"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { id, status, inStatus, chainId, withdrawFee, outStatus }, record }">
                <template v-if="dataIndex === 'status'">
                    <p :class="status === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ status === 1 ? '启用' : '禁用' }}
                    </p>
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
                    <!-- <a-button  v-if="buttonPermissions('disable')" type="link" @click="handChecked(id,chainId)" :danger="status===1">
                      {{ status===1?'禁用':'开启' }}
                    </a-button>
                    <a-button v-if="buttonPermissions('disableWithdrawal')" type="link" @click="handCheckedOutStatus(id,chainId)" :danger="outStatus===1">
                      {{ outStatus===1?'禁用提币':'开启提币' }}
                    </a-button>
                    <a-button v-if="buttonPermissions('disableRecharge')" type="link" @click="handCheckedInState(id,chainId)" :danger="inStatus===1">
                      {{ inStatus===1?'禁用充值':'开启充值' }}
                    </a-button> -->
                    <a-popconfirm ok-type="danger" :title="`确认同步？`" @confirm="handleOnSubmit">
                        <template #icon>
                            <question-circle-outlined :style="{ color: 'red' }" />
                        </template>
                        <a-button v-if="buttonPermissions('synBalance')" type="link" danger>同步余额</a-button>
                    </a-popconfirm>

                    <!-- <a-button v-if="buttonPermissions('setFee')" type="link" :style="{color: 'red'}" @click="handleOpenModal(record)">
                      设置提币手续费
                    </a-button> -->

                    <a-button v-if="buttonPermissions('edit')" type="link" @click="handleOpenModalCoin(record)"> 编辑 </a-button>
                </template>
            </template>
        </a-table>

        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />

        <CoinUpdateFee
            :visible="isModalOpen"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmitFee"
        />

        <CoinAddOrUpdate
            :visible="isModalOpenCoin"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmitFee"
        />
    </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, reactive, ref, onActivated } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { SearchOutlined, RedoOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import api from '@/api/asset/index';
import { PagingDefaultConf } from '@/utils/constant';
import CoinUpdateFee from './CoinUpdateFee.vue';
import CoinAddOrUpdate from './CoinAddOrUpdate.vue';
import currency from '@/store/currency';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 180, fixed: 'left' },
    { title: '币种', dataIndex: 'symbol', width: 90 },
    { title: '币全称', dataIndex: 'name', width: 120 },
    { title: '钱包余额', dataIndex: 'balance', width: 120 },
    { title: '链类型', dataIndex: 'chainTag', width: 90 },
    { title: '平台最小充币金额', dataIndex: 'inAccountAmount', width: 150 },
    { title: '钱包最小上账金额', dataIndex: 'inMinAmount', width: 150 },
    { title: '钱包单笔最大提币额', dataIndex: 'maxOutAmount', width: 150 },
    { title: '钱包单笔最小提币额', dataIndex: 'minOutAmount', width: 150 },
    { title: '内部提币最小限额', dataIndex: 'internalOutMinAmount', width: 150 },
    { title: '内部提币最大限额', dataIndex: 'internalOutMaxAmount', width: 150 },
    { title: '小数位', dataIndex: 'decimals', width: 120 },
    { title: '平台提币手续费', dataIndex: 'totalFee', width: 120 },
    { title: '钱包提币手续费', dataIndex: 'walletFee', width: 120 },
    { title: '平台实得手续费', dataIndex: 'withdrawFee', width: 120 },
    { title: '链充币状态', dataIndex: 'inStatus', width: 90 },
    { title: '链提币状态', dataIndex: 'outStatus', width: 90 },
    { title: '链状态', dataIndex: 'status', width: 80 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 150 },
]);

export default defineComponent({
    name: 'Coin',
    components: {
        SearchOutlined,
        RedoOutlined,
        /* PlusOutlined, */ QuestionCircleOutlined,
        CoinUpdateFee,
        CoinAddOrUpdate,
    },
    setup() {
        const formState = reactive<{
            symbol: string;
        }>({ symbol: '' });

        const pagination = reactive({ ...PagingDefaultConf });
        const loading = ref(false);
        const tableData = ref(Object.create([]));
        const storeCurrency = currency();
        const handleOnSubmit = () => {
            loading.value = true;
            NProgress.start();
            const { pageNo, pageSize } = pagination;
            api.fetchCoinList({
                ...formState,
                pageNo,
                pageSize,
            })
                .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchCoinList>) => {
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
        const handleOnSubmitFee = () => {
            handleResetForm();
            storeCurrency.fetchCurrencyInfo();
            // loading.value = true;
            // NProgress.start();
            // const { pageNo, pageSize } = pagination;
            // api.coinSetWithdrawFee({
            //     ...formState,
            //     pageNo,
            //     pageSize
            // }).then(({ list, totalSize }: PromiseReturnType<typeof api.coinSetWithdrawFee>) => {
            //     [tableData.value, pagination.total] = [list, totalSize];
            // }).finally(() => {
            //     loading.value = false;
            //     NProgress.done();
            // });
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

        const handChecked = (coinId: string, chainId: string) => {
            api.fetchCoinState({ coinId, chainId }).then(() => {
                message.success('操作成功');
                handleOnSubmit();
            });
        };

        const handCheckedOutStatus = (coinId: string, chainId: string) => {
            api.fetchCoinUpdateOutState({ coinId, chainId }).then(() => {
                message.success('操作成功');
                handleOnSubmit();
            });
        };

        const handCheckedInState = (coinId: string, chainId: string) => {
            api.fetchCoinUpdateInState({ coinId, chainId }).then(() => {
                message.success('操作成功');
                handleOnSubmit();
            });
        };

        const handCoinSync = () => {
            api.fetchCoinSync().then(() => {
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
            // api.fetchAddressState({ id }).then(() => {
            //     message.success('操作成功');
            //     handleOnSubmit();
            // });
        };
        const isModalOpen = ref<boolean>(false);
        const handleOpenModal = (record: PromiseReturnType<typeof api.fetchAddressList>) => {
            // 打开新增/编辑弹框
            activeData.value = record || Object.create(null);
            [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
        };

        const isModalOpenCoin = ref<boolean>(false);
        const handleOpenModalCoin = (record: PromiseReturnType<typeof api.fetchAddressList>) => {
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
        const loadSnapshot = ref(false);
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

        return {
            tableColumns,

            pagination,
            loading,
            tableData,
            handleOnSubmit,

            handChecked,
            handCheckedInState,

            handCoinSync,

            formState,
            formReset,
            handleSearch,
            handleResetForm,

            isDeprecatedModalOpen,
            modalType,
            activeData,
            handleOpenModal,
            handleCloseModal,
            handDeprecated,

            isModalOpen,
            handleOnSubmitFee,

            handCheckedOutStatus,

            handSnapshot,
            loadSnapshot,

            isModalOpenCoin,
            handleOpenModalCoin,
        };
    },
});
</script>
