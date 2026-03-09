<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="广告位状态" class="wrap-box">
                    <a-select ref="select" v-model:value="formState.state" placeholder="请选择推送类型">
                        <a-select-option v-for="item in stateList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="wrap-box-item">
                <a-button
                    v-if="buttonPermissions('add')"
                    block
                    type="primary"
                    size="small"
                    class="search-submit-btn btn dowload-box"
                    @click.stop="handelMessagePush(1)"
                >
                    新增
                </a-button>
                <div></div>
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

        <a-table ref="tableRef" :data-source="tableData" :columns="tableColumns" :pagination="false" :scroll="{ x: 1400, y: 650 }">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'url'">
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div class="ellipsis-box">
                            {{ text }}
                        </div>
                    </a-tooltip>
                </template>
                <template v-if="column.dataIndex === 'btnText'">
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div class="ellipsis-box">
                            {{ text }}
                        </div>
                    </a-tooltip>
                </template>
                <template v-if="column.dataIndex === 'state'">
                    <p :class="text === 2 ? 'text-color-red' : 'text-color-green'">
                        {{ text == 2 ? '已禁用' : '显示中' }}
                    </p>
                </template>
                <template v-if="column.dataIndex === 'image'">
                    <a-tooltip>
                        <template #title>{{ text }}</template>
                        <div class="ellipsis-box" style="width: 180px">
                            <a-image :width="100" :src="text" />
                        </div>
                    </a-tooltip>
                </template>
                <template v-if="column.dataIndex === 'operate'">
                    <a-button
                        v-if="buttonPermissions('enable')"
                        type="link"
                        :class="record.state === 2 ? 'text-color-green' : 'text-color-red'"
                        @click="hadnelOptionMessage(1, record.id, record.state)"
                    >
                        {{ record.state == 2 ? '启用' : '禁用' }}
                    </a-button>
                    <a-button v-if="buttonPermissions('update')" type="link" @click="handelMessagePush(2, record)"> 编辑 </a-button>
                    <a-button v-if="record.state == 2 && buttonPermissions('delete')" type="link" danger @click="hadnelOptionMessage(2, record.id)">
                        删除
                    </a-button>
                </template>
            </template>
        </a-table>

        <app-advertising v-model:visible="visible" :message-tyep="messageTyep" :m-item="formData" @handleOk="handelUpdate" />
    </div>
</template>

<script lang="ts" setup>
import type { ComputedRef } from 'vue';
import useTableScroll from '@/hooks/tableScroll';
import { computed, ref, reactive, watch } from 'vue';
import { message, Modal } from 'ant-design-vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { PagingDefaultConf } from '@/utils/constant';
import api from '@/api/appAdmin/index';
import type { AppMenuParams, AppMenuList, AdvertisingSpaceParams } from '@/api/appAdmin/types';
import AppAdvertising from '../components/AppAdvertising.vue';

const pagination = reactive({ ...PagingDefaultConf });
pagination.pageSize = 20;
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: '序号', dataIndex: 'id' },
    { title: '按钮文案', dataIndex: 'btnText' },
    { title: '语言', dataIndex: 'language' },
    { title: '按钮跳转链接', dataIndex: 'url' },
    { title: '广告位图片背景 ', dataIndex: 'image' },
    { title: '广告位状态', dataIndex: 'state' },
    { title: '修改时间', dataIndex: 'updateTime' },
    { title: '操作', dataIndex: 'operate' },
]);
const operationTime = ref([]);
const totalTable = ref(Object.create([]));
const formState = ref<AdvertisingSpaceParams>({
    state: null,
});

const tableRef = ref();
const formData = ref({});
const disabled = ref(false);
const visible = ref(false);
const CopyformStates = { ...formState.value };
const tableData = ref(Object.create([]));

type MessageType = 1 | 2; // 1 新增 2 编辑
const messageTyep = ref<MessageType>(1);
const loading = ref(false);

watch(
    () => visible.value,
    (val) => {
        if (!val) {
            messageTyep.value = 1;
            formData.value = {};
        }
    }
);
const handleSerach = () => {
    pagination.pageNo = 1;
    handleOnSubmit();
};

const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    api.fetchAdvertisingSpaceList(formState.value)
        .then((list: PromiseReturnType<typeof api.fetchAdvertisingSpaceList>) => {
            // tableData.value = list;
            totalTable.value = list;
            tableData.value = totalTable.value.slice(0, 10);
            console.log(tableData.value);
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};
handleOnSubmit();

const stateList = [
    { id: null, title: '全部' },
    { id: 1, title: '显示中' },
    { id: 2, title: '已禁用' },
];

const handelRest = () => {
    operationTime.value = [];
    formState.value = { ...CopyformStates };
    pagination.pageNo = 1;
    pagination.pageSize = 20;
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
const handelUpdate = () => {
    formData.value = {};
    handleOnSubmit();
};

const handelMessagePush = async (type: MessageType = 1, item?: AppMenuList) => {
    messageTyep.value = type;
    visible.value = true;
    if (type == 2) {
        formData.value = { ...item };
    }
};
const hadnelOptionMessage = async (type: 1 | 2 = 1, id: string, state?: 1 | 2) => {
    const stateText = `${state == 1 ? '隐藏' : '显示'}`;
    const title = type == 1 ? `修改菜单状态为${stateText}` : '删除菜单';
    const content = type == 1 ? `是否要将该菜单状态更改为${stateText}?` : '是否要删除该项菜单?';
    const featchs = ['fetchAdvertisingSpacePatch', 'fetchAdvertisingSpaceRemove'];
    Modal.confirm({
        title,
        content,
        okText: '确定',
        width: '430px',
        cancelText: '取消',
        class: 'user-moadl-warning',
        async onOk() {
            // @ts-ignore
            let data = {
                    id,
                    mode: state == 2 ? 'enable' : 'disable',
                },
                data1 = type == 1 ? data : id;
            // @ts-ignore
            await api[featchs[type - 1]](data1);
            message.success(`${title}成功`);
            handleOnSubmit();
        },
    });
};
useTableScroll(tableRef, totalTable, tableData);
</script>

<style scoped lang="scss">
.wrap-box {
    margin-right: 20px;

    :deep(.ant-select-selector) {
        width: 200px;
    }

    :deep(input) {
        width: 200px;
    }
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

.ellipsis-box {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 120px;
}
</style>
