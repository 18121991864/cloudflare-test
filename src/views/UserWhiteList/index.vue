<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="UID" class="mr-22 width-250" name="accountId">
                    <a-input v-model:value="formState.accountId" size="small" placeholder="请输入" @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="赦免认证等级" class="mr-22 width-250" name="kycLevelRequired">
                    <a-select v-model:value="formState.kycLevelRequired" placeholder="请选择" :options="levelOptions" @change="handleSearch" />
                </a-form-item>
                <a-form-item label="模拟认证等级" class="mr-22 width-250" name="kycLevelMock">
                    <a-select v-model:value="formState.kycLevelMock" placeholder="请选择" :options="levelOptions" @change="handleSearch" />
                </a-form-item>

                <a-form-item label="状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" placeholder="请选择" :options="stateOptions" @change="handleSearch" />
                </a-form-item>
                <a-form-item label="用户标签" class="mr-22 width-250" name="labelId">
                    <SLabelIds v-model="formState.labelId" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex">
                <div v-if="buttonPermissions('userWhiteListAdd')">
                    <a-button type="primary" @click="editModalRef?.open()">新增</a-button>
                </div>
                <div v-else>&nbsp;</div>
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
            row-key="id"
            :data-source="tableData"
            :scroll="{ x: 1100 }"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { labelList, labelNames }, record }">
                <template v-if="dataIndex === 'accountId'">
                    <a
                        @click="
                            $router.push({
                                name: 'userList',
                                query: { uid: record.accountId },
                            })
                        "
                        >{{ record.accountId }}
                    </a>
                </template>                
                <template v-if="dataIndex === 'labelList'">
                    <a-tooltip :title="labelNames">
                        <div style="display: flex; flex-wrap: wrap; gap: 4px">
                            <template v-for="(item, index) of labelList?.slice(0,3)" :key="item">
                                <a-tag :color="item.color">{{ item.name }}</a-tag>
                                <template v-if="index === 2 && labelList.length > 3">
                                    <span>...</span>
                                </template>
                            </template>
                        </div>
                    </a-tooltip>
                </template>
                <template v-if="dataIndex === 'businessType'">
                    <ul style="padding-inline-start: 0; margin-bottom: 0">
                        <li v-for="bus in record.businessType.split(',')" :key="bus" style="font-weight: 600">
                            {{ bus }}
                        </li>
                    </ul>
                </template>
                <template v-if="dataIndex === 'kycLevelRequired'">
                    <WhitelistLevelCell :status="record.kycLevelRequired" />
                </template>
                <template v-else-if="dataIndex === 'kycLevelMock'">
                    <WhitelistLevelCell :status="record.kycLevelMock" />
                </template>
                <template v-else-if="dataIndex === 'state'">
                    <WhitelistStateCell :status="record.state" />
                </template>
                <template v-else-if="dataIndex === 'action'">
                    <a-button
                        v-if="buttonPermissions('userWhiteListUpdateState')"
                        type="link"
                        :loading="record.stateLoading"
                        @click="handleSetState(record)"
                    >
                        {{ record.state === whitelistStateEnum.Disable ? '启用' : '禁用' }}
                    </a-button>
                    <a-button v-if="buttonPermissions('userWhiteListUpdate')" type="link" @click="editModalRef?.open(record)"> 编辑 </a-button>
                </template>
            </template>
        </a-table>

        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
        <EditWhiteListModal ref="editModalRef" @sucess="handleEditSuccess" />
    </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, reactive, ref, onActivated, getCurrentInstance } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons-vue';
import api from '@/api/whiteList/index';
import { PagingDefaultConf } from '@/utils/constant';
import { whitelistStateEnumMap, commonLevelEnumMap, whitelistStateEnum } from '@/enums/whitelistEnum';
import { transMapBySelectOptions, unshiftSelectOptionAll } from '@/utils/component';
import EditWhiteListModal from './EditWhiteListModal.vue';
import WhitelistStateCell from './WhitelistStateCell.vue';
import WhitelistLevelCell from './WhitelistLevelCell.vue';

const editModalRef = ref();

const instance = getCurrentInstance();

defineOptions({ name: 'userWhiteList' });

const stateOptions = transMapBySelectOptions(whitelistStateEnumMap);
unshiftSelectOptionAll(stateOptions);

const levelOptions = transMapBySelectOptions(commonLevelEnumMap);
unshiftSelectOptionAll(levelOptions);

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => {
    const result: TableColumnType[] = [
        {
            title: 'UID',
            dataIndex: 'accountId',
            fixed: 'left',
        },
        {
            title: '标签',
            dataIndex: 'labelList',
            width: 200,
        },
        {
            title: '业务类型',
            dataIndex: 'businessType',
        },
        {
            title: '赦免认证等级',
            dataIndex: 'kycLevelRequired',
        },
        {
            title: '实际认证等级',
            dataIndex: 'kycLevel',
        },
        {
            title: '模拟认证等级',
            dataIndex: 'kycLevelMock',
        },
        {
            title: '状态',
            dataIndex: 'state',
        },
    ];

    if (instance?.proxy?.buttonPermissions('userWhiteListUpdate') || instance?.proxy?.buttonPermissions('userWhiteListUpdateState')) {
        result.push({
            title: '操作',
            dataIndex: 'action',
            fixed: 'right',
            width: 200,
        });
    }

    return result;
});

const formState = reactive({
    accountId: '', // UID
    kycLevelRequired: '', // 赦免认证等级
    kycLevelMock: '', // 模拟认证等级
    state: '', // 状态
    labelId: '', // 用户标签
});
const pagination = reactive({ ...PagingDefaultConf });
const loading = ref(false);
const tableData = ref(Object.create([]));

const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    const { pageNo, pageSize } = pagination;

    api.fetchWhitelistList({
        ...formState,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchWhitelistList>) => {
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

function handleEditSuccess() {
    handleOnSubmit();
    editModalRef.value?.close();
}

async function handleSetState(record: Record<string, any>) {
    const setState = record.state === whitelistStateEnum.Disable ? whitelistStateEnum.Enable : whitelistStateEnum.Disable;
    record.stateLoading = true;

    await api
        .fetchPpdateState({
            id: record.id,
            state: setState,
        })
        .finally(() => (record.stateLoading = false));
    record.state = setState;
}
</script>
<style lang="scss" scoped>
.action-btm {
    justify-content: space-between;
}
</style>
