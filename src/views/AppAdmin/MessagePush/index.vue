<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="用户UID" class="wrap-box">
                    <a-input v-model:value="formState.accId" placeholder="请输入用户UID" style="width: 200px" />
                </a-form-item>
                <a-form-item label="推送类型" class="wrap-box">
                    <a-select ref="select" v-model:value="formState.transmission" placeholder="请选择推送类型">
                        <a-select-option v-for="item in transmissionList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="活动简述" class="wrap-box">
                    <a-input v-model:value="formState.subtitle" placeholder="请输入活动简述" />
                </a-form-item>
                <a-form-item label="状态" class="wrap-box">
                    <a-select ref="select" v-model:value="formState.state" placeholder="请选择状态">
                        <a-select-option v-for="item in statusList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="创建时间">
                    <DateRangePicker v-model="operationTime" @onChange="handleChange" />
                </a-form-item>
            </div>
            <div class="wrap-box-item">
                <a-button v-if="buttonPermissions('add')" block type="primary" size="small" class="search-submit-btn btn dowload-box" @click.stop="handelMessagePush(1)">
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
        <a-table :data-source="tableData" :columns="tableColumns" :pagination="false">
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'state'">{{ statusList[text + 1].title }}</template>
                <template v-if="column.dataIndex === 'accId'">{{ text == '0' ? '' : text }}</template>
                <template v-if="column.dataIndex === 'transmission'">{{ transmissionText(text) }}</template>
                <template v-if="column.dataIndex === 'operate'">
                    <a-button v-if="record.state === 1 && buttonPermissions('view')" type="link" @click="handelMessagePush(3, record.id)"> 查看 </a-button>
                    <template v-else>
                        <a-button v-if="buttonPermissions('send')" type="link" style="color: #42b983" @click="hadnelOptionMessage(1, record.id)"> 立即发送 </a-button>
                        <a-button v-if="buttonPermissions('edit')" type="link" @click="handelMessagePush(2, record.id)"> 编辑</a-button>
                        <a-button v-if="buttonPermissions('del')" type="link" danger @click="hadnelOptionMessage(2, record.id)"> 删除</a-button>
                    </template>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
        <app-moadl-message
            v-model:visible="visible"
            :message-tyep="messageTyep"
            :app-data-from="formData"
            :disabled="disabled"
            @handleOk="handelUpdate"
        />
    </div>
</template>

<script lang="ts" setup>
import type { ComputedRef } from 'vue';
import { computed, ref, reactive, watch } from 'vue';
import { message, Modal } from 'ant-design-vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { PagingDefaultConf } from '@/utils/constant';
import api from '@/api/appAdmin/index';
import { AppMessageParams } from '@/api/appAdmin/types.d';
import AppMoadlMessage from '../components/AppMoadlMessage.vue';

const pagination = reactive({ ...PagingDefaultConf });
pagination.pageSize = 20;
const recordId = ref('');
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'id', dataIndex: 'id', width: 100 },
    { title: '活动简述', dataIndex: 'overview' },
    { title: '用户UID', dataIndex: 'accId' },
    { title: '推送类型', dataIndex: 'transmission', width: 100 },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '发送时间', dataIndex: 'updateTime' },
    { title: '状态', dataIndex: 'state', width: 100 },
    { title: '操作', dataIndex: 'operate', width: 200 },
]);
const operationTime = ref([]);
const formState = ref<AppMessageParams>({
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
    state: null,
    transmission: null,
});
const formData = ref({});
const disabled = ref(false);
const visible = ref(false);
const CopyformStates = { ...formState.value };
const tableData = ref(Object.create([]));
const transmissionText = computed(() => {
    return (id: number) => {
        return transmissionList.find((item) => item.id == id)?.title;
    };
});
type MessageType = 1 | 2 | 3; // 1 新增 2 编辑 3 查看
const messageTyep = ref<MessageType>(1);
const loading = ref(false);
watch(
    () => visible,
    (val) => {
        if (!val) {
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
    const { pageNo, pageSize } = pagination;
    api.fetchAppEventList({
        ...formState.value,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchAppEventList>) => {
            [tableData.value, pagination.total] = [list, totalSize];
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};
handleOnSubmit();
const statusList = [
    { id: null, title: '全部' },
    { id: 0, title: '未发送' },
    { id: 1, title: '已发送' },
];

const transmissionList = [
    { id: null, title: '全部' },
    { id: 0, title: '局部' },
    { id: 2, title: '全局' },
];
const handleChange = () => {
    if (operationTime.value && operationTime.value.length) {
        formState.value.gt = operationTime.value[0];
        formState.value.lt = operationTime.value[1];
    } else {
        formState.value.gt = '';
        formState.value.lt = '';
    }

    handleOnSubmit();
};
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

const handelMessagePush = async (type: MessageType = 1, id?: string) => {
    if (type !== 1) {
        formData.value = await api.fetchAppEventInfo(id as string);
    }
    disabled.value = type == 3;
    messageTyep.value = type;
    visible.value = true;
};
const hadnelOptionMessage = async (type: 1 | 2 = 1, id: string) => {
    const title = type == 1 ? '发送消息' : '删除消息';
    const content = type == 1 ? '是否要发送该条消息?' : '是否要删除该条消息?';
    const featchs = ['fetchAppSendMessage', 'fetchAppRemoveMessage'];
    Modal.confirm({
        title,
        content,
        okText: '确定',
        width: '430px',
        cancelText: '取消',
        class: 'user-moadl-warning',
        async onOk() {
            // @ts-ignore
            await api[featchs[type - 1]](id);
            message.success(`${title}成功`);
            handleOnSubmit();
        },
    });
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
