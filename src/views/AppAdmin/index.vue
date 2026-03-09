<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="版本号" class="wrap-box">
                    <a-input v-model:value="formState.versionNo" placeholder="请输入版本号" />
                </a-form-item>
                <a-form-item label="构建号" class="wrap-box">
                    <a-input v-model:value="formState.constructNo" placeholder="请输入构建号" />
                </a-form-item>
                <a-form-item label="状态" class="wrap-box">
                    <a-select ref="select" v-model:value="formState.state" placeholder="请选择状态">
                        <a-select-option v-for="item in stateList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="应用类型" class="wrap-box">
                    <a-select ref="select" v-model:value="formState.type" placeholder="请选择应用类型">
                        <a-select-option v-for="item in typeList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="市场类型" class="wrap-box">
                    <a-select ref="select" v-model:value="formState.marketType" placeholder="请选择市场类型">
                        <a-select-option v-for="item in getMarketType" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="更新类型" class="wrap-box">
                    <a-select ref="select" v-model:value="formState.force" placeholder="请选择更新类型">
                        <a-select-option v-for="item in forceList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="针对用户" class="wrap-box">
                    <a-select ref="select" v-model:value="formState.range" placeholder="请选择针对用户">
                        <a-select-option v-for="item in updateType" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="发布时间">
                    <DateRangePicker v-model="operationTime" @onChange="handleChange" />
                </a-form-item>
            </div>
            <div class="wrap-box-item">
                <a-button
                    v-if="buttonPermissions('add')"
                    block
                    type="primary"
                    size="small"
                    class="search-submit-btn btn dowload-box"
                    @click="handOpenMoadl('add')"
                >
                    添加
                </a-button>
                <div class="wrap-block">
                    <a-button block type="primary" size="small" class="search-submit-btn btn" @click.stop="handleSerach">
                        <template #icon>
                            <SearchOutlined />
                        </template>
                        搜索
                    </a-button>
                    <a-button class="search-reset-btn btn" @click="handelRest">
                        <template #icon>
                            <RedoOutlined />
                        </template>
                        重置
                    </a-button>
                </div>
            </div>
        </a-form>
        <a-table :data-source="tableData" :columns="tableColumns" :pagination="false" :scroll="{ x: 1600 }">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'state'">{{ stateList[text].title }}</template>
                <template v-if="column.dataIndex === 'type'">{{ typeList[text].title }}</template>
                <template v-if="column.dataIndex === 'force'">{{ forceList[text].title }}</template>
                <template v-if="column.dataIndex === 'marketType'">{{ marketTypeList[text].title }}</template>
                <template v-if="column.dataIndex === 'url'">
                    <a-tooltip :title="text">
                        <p class="w-48 truncate">{{ text }}</p>
                    </a-tooltip>
                </template>
                <template v-if="column.dataIndex === 'operate'">
                    <a-button v-if="record.state == 2 && buttonPermissions('edit')" type="link" @click="handOpenMoadl('edit', record.id)"
                        >编辑
                    </a-button>
                    <a-button v-if="record.state == 1 && buttonPermissions('view')" type="link" @click="handOpenMoadl('examine', record.id)">
                        查看详情
                    </a-button>
                    <a-button
                        v-if="record.state == 2 && buttonPermissions('available')"
                        type="link"
                        style="color: #42b983"
                        @click="ChangeState(record.id)"
                        >上架
                    </a-button>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
        <app-modal-vesion v-model:visible="visible" :type="appType" :m-item="mItem" @update:visible="handelVisible" />
    </div>
</template>

<script lang="ts" setup>
import type { ComputedRef } from 'vue';
import { computed, ref, reactive, createVNode } from 'vue';
import { Modal, message } from 'ant-design-vue';
import { ExclamationCircleOutlined, SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons-vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import AppModalVesion from './components/AppModalVesion.vue';
import { PagingDefaultConf } from '@/utils/constant';
import api from '@/api/appAdmin/index';
import { VersionAdd, VersionList, VersionParams } from '@/api/appAdmin/types.d';

const pagination = reactive({ ...PagingDefaultConf });
pagination.pageSize = 20;
const recordId = ref('');
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 100 },
    { title: '版本号', dataIndex: 'versionNo', width: 100 },
    { title: '构建号', dataIndex: 'constructNo', width: 100 },
    { title: '应用类型', dataIndex: 'type', width: 100 },
    { title: '市场类型', dataIndex: 'marketType', width: 100 },
    { title: '更新类型', dataIndex: 'force', width: 160 },
    { title: '下载URL', dataIndex: 'url', width: 200 },
    { title: '发布时间', dataIndex: 'createTime', width: 210 },
    { title: '针对用户', dataIndex: 'rangeName', width: 210 },
    { title: '状态', dataIndex: 'state', width: 100 },
    { title: '操作', dataIndex: 'operate', width: 160 },
]);
const visible = ref(false);
const appType = ref('add');
const mItem = ref<Required<VersionAdd>>({
    constructNo: '',
    content: { 'en-US': '', 'zh-CN': '' },
    force: 1,
    id: '',
    marketType: 1,
    type: 1,
    url: '',
    versionNo: '',
});
const operationTime = ref([]);
const formState = ref<VersionParams>({
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
    state: null,
    type: null,
    force: null,
    marketType: null,
    range: null,
});
const CopyformStates = { ...formState.value };
const tableData = ref(
    Object.create([
        // {
        //   accountId: "899999",
        //   amount: 1000,
        //   createTime: "2022-09-01",
        //   email: "1494518217@qq.com",
        //   id: 20,
        //   state: 2,
        //   type: 1,
        // },
    ])
);
const loading = ref(false);

const handleSerach = () => {
    pagination.pageNo = 1;
    handleOnSubmit();
};
const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    const { pageNo, pageSize } = pagination;
    api.fetchVersionList({
        ...formState.value,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchVersionList>) => {
            [tableData.value, pagination.total] = [list, totalSize];
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};

handleOnSubmit();

const stateList = [
    { id: null, title: '全部' },
    { id: 1, title: '上架中' },
    { id: 2, title: '已下架' },
];

const typeList = [
    { id: null, title: '全部' },
    { id: 1, title: 'Android' },
    { id: 2, title: 'iOS' },
];

const forceList = [
    { id: null, title: '全部' },
    { id: 1, title: '强制更新' },
    { id: 2, title: '普通更新' },
];

const marketTypeList = [
    { id: null, title: '全部' },
    { id: 1, title: 'AppStore', key: 2 },
    { id: 2, title: '谷歌', key: 1 },
    { id: 3, title: 'APK', key: 1 },
    { id: 4, title: '华为商店', key: 1 },
];

const updateType = [
    { id: null, title: '全部' },
    { id: 0, title: '全局用户' },
    { id: 1, title: '迁移用户' },
];

const getMarketType = computed(() => marketTypeList.filter((item) => (formState.value.type ? item.key === formState.value.type : marketTypeList)));

const handelVisible = () => {
    appType.value = 'add';
    handleOnSubmit();
};

const handleChange = () => {
    if (operationTime.value && operationTime.value.length) {
        formState.value.startTime = operationTime.value[0];
        formState.value.endTime = operationTime.value[1];
    } else {
        formState.value.startTime = '';
        formState.value.endTime = '';
    }

    handleOnSubmit();
};

const handelRest = () => {
    formState.value = { ...CopyformStates };
    pagination.pageNo = 1;
    pagination.pageSize = 20;

    operationTime.value = [];
    handleOnSubmit();
};

const loadExportExcel = ref(false);
const handExport = () => {
    if (loadExportExcel.value) return;
    const { pageNo, pageSize } = pagination;
    loadExportExcel.value = true;
    //   api
    //     .fetchexcelWriterExcel({
    //       ...formState.value,
    //       pageNo,
    //       pageSize,
    //     })
    //     .then((r: PromiseReturnType<typeof api.fetchexcelWriterExcel>) => {
    //       downloadExcel(r, i18n.global.t("开卡充值流水"));
    //     })
    //     .finally(() => {
    //       loadExportExcel.value = false;
    //     });
};
const handOpenMoadl = async (type: 'add' | 'edit' | 'examine', id?: string) => {
    if (type !== 'add') {
        await handelListInfo(id as string);
    }
    visible.value = true;
    appType.value = type;
};
const handelListInfo = async (id: string) => {
    const item = await api.fetchVersionInfo({ id });
    mItem.value = item;
};
const ChangeState = async (id: string) => {
    Modal.confirm({
        title: '上架',
        icon: createVNode(ExclamationCircleOutlined),
        content: '你确定要将该版本上架吗？',
        okText: '确定',
        width: '430px',
        cancelText: '取消',
        class: 'user-moadl-warning',
        async onOk() {
            await api.fetchVersionRecover({ id });
            message.success('更改状态成功');
            handleOnSubmit();
        },
    });
};
const handelEmail = (id: string) => {
    recordId.value = id;
    console.log(recordId.value);
};
</script>

<style lang="scss" scoped>
.wrap-box {
    width: 240px;
    margin-right: 40px;
}

:deep(.ant-picker-active-bar) {
    width: 0;
}

.wrap-box-item {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .dowload-box {
        width: 100px;
    }
}

.wrap-block {
    display: flex;
    margin-bottom: 20px;

    .btn {
        width: 100px;

        &.search-reset-btn {
            margin-left: 10px;
        }
    }
}

.btn-box {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding: 0 5px;

    .search-submit-btn {
        background-color: #2e91ff;
        border-color: #2e91ff;
    }
}
</style>
