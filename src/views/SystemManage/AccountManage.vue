<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item :label="$t('common.AdminAccount')" name="account">
                    <a-input
                        v-model:value="formState.account"
                        size="small"
                        class="width-250 mr-22"
                        :placeholder="$t('common.PleaseEnter')"
                        @pressEnter="handleSearch"
                    />
                </a-form-item>
                <a-form-item :label="$t('common.RealName')" name="realName">
                    <a-input
                        v-model:value="formState.realName"
                        size="small"
                        class="width-250 mr-22"
                        :placeholder="$t('common.PleaseEnter')"
                        @pressEnter="handleSearch"
                    />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div>
                    <a-button
                        v-if="buttonPermissions('add')"
                        type="primary"
                        size="small"
                        class="black-btm"
                        @click.stop="$router.push('/systemManage/addAccount')"
                    >
                        <template #icon>
                            <PlusOutlined />
                        </template>
                        {{ $t('common.AddAdminAccount') }}
                    </a-button>
                </div>
                <div class="display-flex">
                    <a-button block type="primary" size="small" class="search-submit-btn" @click.stop="handleSearch">
                        <template #icon>
                            <SearchOutlined />
                        </template>
                        {{ $t('common.search') }}
                    </a-button>
                    <a-button block size="small" class="search-reset-btn" @click.stop="handleResetForm">
                        <template #icon>
                            <RedoOutlined />
                        </template>
                        {{ $t('common.Reset') }}
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
                ({ userId }) => {
                    return userId;
                }
            "
            :data-source="tableData"
            :scroll="{
                y: 500,
            }"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { state, userId, isFACode } }">
                <template v-if="dataIndex === 'state'">
                    <a-switch
                        v-if="buttonPermissions('disable')"
                        :checked="state"
                        :checked-value="1"
                        :un-checked-value="state"
                        :checked-children="$t('common.Enable')"
                        :un-checked-children="state === 3 ? $t('common.Frozen') : $t('common.Disable')"
                        @click="handChecked(state === 1 ? 2 : 1, userId)"
                    />
                    <span v-else :class="stateList[state - 1].color">{{ stateList[state - 1].label }}</span>
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button v-if="buttonPermissions('reset')" type="link" class="mr-15" @click.stop="handleCloseDialog(userId, 'loginPwd')"
                        >{{ $t('common.ResetLoginPassword') }}
                    </a-button>
                    <a-dropdown v-if="showMore(isFACode)">
                        <a-button type="link" @click.prevent>
                            {{ $t('common.MoreOperations') }}
                            <DownOutlined />
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <!-- <a-menu-item>
                                    <a-button
                                        v-if="buttonPermissions('accountManage-resetPay')"
                                        type="link"
                                        class="mr-15"
                                        @click.stop="handleCloseDialog(userId, 'payPwd')"
                                        >重置支付密码
                                    </a-button>
                                </a-menu-item> -->
                                <a-menu-item>
                                    <a-button
                                        v-if="isFACode === 1 && buttonPermissions('reset2FA')"
                                        type="link"
                                        class="mr-15"
                                        @click="handleCloseDialog(userId, '2FA')"
                                        >{{ $t('common.Reset2FA') }}
                                    </a-button>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-button
                                        v-if="buttonPermissions('edit')"
                                        type="link"
                                        :disabled="state === 1"
                                        @click.stop="$router.push(`/systemManage/editAccount/${userId}`)"
                                        >{{ $t('common.Edit') }}
                                    </a-button>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
        <reset-passwords v-model:visible="resetVisible" :type="resetType" :user-id="resetUserId" :on-success="handleResetForm" />
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, reactive, ref, computed, ComputedRef, getCurrentInstance, onActivated } from 'vue';
import { ExclamationCircleOutlined, PlusOutlined, RedoOutlined, SearchOutlined, DownOutlined } from '@ant-design/icons-vue';
import { message, Modal, TableColumnType } from 'ant-design-vue';
import NProgress from 'nprogress';
import { useRoute } from 'vue-router';
import api from '@/api/fetchTest/index';
import { PagingDefaultConf } from '@/utils/constant';
import { useI18n } from 'vue-i18n';
import ResetPasswords from './components/ResetPasswords.vue';
const { t } = useI18n();

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: t('common.SerialNumber'), width: 50, customRender: ({ index }) => `${index + 1}` },
    { title: t('common.AdminAccount'), dataIndex: 'account' },
    { title: t('common.RealName'), dataIndex: 'realName' },
    { title: t('common.Role'), dataIndex: 'roleName' },
    { title: t('common.AccountStatus'), dataIndex: 'state' },
    { title: t('common.LastLoginTime'), dataIndex: 'lastLoginTime' },
    { title: t('common.Operate'), dataIndex: 'action', fixed: 'right', width: 220 },
]);

const { proxy } = getCurrentInstance();

const resetVisible = ref(false);
const resetType = ref<'loginPwd' | '2FA' | 'payPwd'>('loginPwd');
const resetUserId = ref('');
const stateList = [
    {
        label: t('common.Enable'),
        color: 'text-color-green',
    },
    {
        label: t('common.Disable'),
        color: 'text-color-red',
    },
    {
        label: t('common.Frozen'),
        color: 'text-color-red',
    },
];
const formState = reactive<{ account: string; realName: string }>({
    // 表单数据
    account: '',
    realName: '',
});
const route = useRoute();

const pagination = reactive({ ...PagingDefaultConf });
const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    const { pageNo, pageSize } = pagination;
    api.sysUserList({
        ...formState,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.sysUserList>) => {
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
onActivated(() => {
    if (route.hash === '#no-refresh') return; // 不需要刷新
    handleOnSubmit();
});

const handleSearch = () => {
    pagination.pageNo = 1;
    handleOnSubmit();
};

const handleCloseDialog = (userId: string, type: 'loginPwd' | '2FA' | 'payPwd'): void => {
    if (proxy.$is2FA()) {
        resetVisible.value = true;
        resetUserId.value = userId;
        resetType.value = type;
    }
    // 关闭弹窗校验审核密码
    // Modal.confirm({
    //     title: '提示?',
    //     icon: createVNode(ExclamationCircleOutlined),
    //     content: '是否重置此用户登录密码',
    //     okText: '确定',
    //     okType: 'danger',
    //     cancelText: '取消',
    //     onOk() {
    //         api.sysUserResetPassword({ userId, type: 1 }).then(() => {
    //             message.success('重置密码成功');
    //         });
    //     }
    // } as any);
};

const handChecked = (state: number, id: string) => {
    api.sysUserAddOrUpdate({ state, id }).then(() => {
        message.success(t('common.OperationSuccess'));
        handleOnSubmit();
    });
};
const showMore = computed(() => {
    return (isFACode: number) => {
        const isReset2FA = isFACode === 1 && proxy.buttonPermissions('reset2FA');
        return proxy.buttonPermissions('reset') || proxy.buttonPermissions('accountManage-resetPay') || isReset2FA || proxy.buttonPermissions('edit');
    };
});
defineOptions({ name: 'AccountManage' });
</script>

<style lang="scss" scoped>
.black-btm {
    margin-left: 0 !important;
}
</style>
