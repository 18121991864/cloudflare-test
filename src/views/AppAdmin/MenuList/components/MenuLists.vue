<template>
    <div>
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item v-if="props.activeIndex == 1" label="菜单区" style="width: 200px; margin-right: 10px">
                    <a-select ref="select" v-model:value="formState.parentId" placeholder="请选择菜单类型" :allow-clear="true">
                        <a-select-option v-for="item in parentList" :key="item.id" :value="item.id">{{ item.name }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="菜单名称" class="wrap-box">
                    <a-input v-model:value="formState.name" placeholder="请输入菜单名称" />
                </a-form-item>
                <a-form-item label="菜单路径" class="wrap-box">
                    <a-input v-model:value="formState.url" placeholder="请输入菜单路径" />
                </a-form-item>

                <a-form-item label="菜单唯一值" class="wrap-box">
                    <a-input v-model:value="formState.key" placeholder="请输入菜单唯一值" />
                </a-form-item>
                <a-form-item label="是否需要登录" class="wrap-box">
                    <a-select ref="select" v-model:value="formState.loginRequired" placeholder="请选择推送类型">
                        <a-select-option v-for="item in loginRequiredList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="菜单类型" class="wrap-box">
                    <a-select ref="select" v-model:value="formState.type" placeholder="请选择菜单类型">
                        <a-select-option v-for="item in typeList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="菜单状态" class="wrap-box">
                    <a-select ref="select" v-model:value="formState.state" placeholder="请选择菜单状态">
                        <a-select-option v-for="item in statusList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
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
        <div class="tabs-box">
            <div
                v-for="(item, index) in languageList"
                :key="item.language"
                class="tabs-item"
                :class="{ active: item.language === activeLanguage }"
                @click="changeLanguage(item.language)"
            >
                {{ item.value }}
            </div>
        </div>
        <a-table :data-source="tableData" :columns="tableColumns" :pagination="false" :scroll="{ x: 1400 }">
            <template #bodyCell="{ column, text, record }">
                <template v-if="['icon', 'darkIcon'].includes(column.dataIndex as string)">
                    <a-image :src="text" style="max-width: 70px" />
                </template>
                <template v-if="column.dataIndex === 'loginRequired'">
                    {{ text ? '需要' : '不需要' }}
                </template>
                <template v-if="column.dataIndex === 'state'">
                    <div :class="record.state === 0 ? 'text-color-green' : ' text-color-red'">
                        {{ statusList[text + 1].title }}
                    </div>
                </template>
                <template v-if="column.dataIndex === 'type'">
                    {{ typeList[text].title }}
                </template>
                <template v-if="column.dataIndex === 'operate'">
                    <a-button
                        v-if="buttonPermissions('hidden')"
                        type="link"
                        :class="record.state === 0 ? 'text-color-red' : 'text-color-green'"
                        @click="hadnelOptionMessage(1, record.id, record.state)"
                    >
                        {{ record.state == 0 ? '隐藏' : '显示' }}
                    </a-button>
                    <a-button v-if="buttonPermissions('copy')" type="link" @click="handelMessagePush(3, record)"> 复制 </a-button>
                    <a-button v-if="buttonPermissions('edit')" type="link" @click="handelMessagePush(2, record)"> 编辑 </a-button>
                    <a-button v-if="buttonPermissions('delete')" type="link" danger @click="hadnelOptionMessage(2, record.id)"> 删除 </a-button>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
        <app-moadl-menu
            v-model:visible="visible"
            :message-tyep="messageTyep"
            :m-item="formData"
            :active-index="activeIndex"
            :language-list="languageList"
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
import type { AppMenuParams, AppMenuList, languageType, AppMenuAreaList } from '@/api/appAdmin/types.d';
import AppMoadlMenu from '@/views/AppAdmin/components/AppMoadlMeun.vue';

const pagination = reactive({ ...PagingDefaultConf });
const props = defineProps({
    activeIndex: {
        type: Number,
        default: 1,
    },
});
pagination.pageSize = 20;
const tableHeader = ref([
    { title: 'id', dataIndex: 'id', width: 100 },
    { title: '菜单名称', dataIndex: 'name', width: 180 },
    { title: '菜单图标(白天)', dataIndex: 'icon', width: 200 },
    { title: '菜单图标(黑夜)', dataIndex: 'darkIcon', width: 200 },
    { title: '菜单唯一值', dataIndex: 'key', width: 200 },
    { title: '是否需要登录', dataIndex: 'loginRequired', width: 300 },
    // { title: '菜单本地路径', dataIndex: 'path', width: 220 },
    { title: '菜单路径', dataIndex: 'url', width: 220 },
    { title: '菜单位置', dataIndex: 'position', width: 180 },
    { title: '菜单状态', dataIndex: 'state', width: 180 },
    { title: '菜单类型', dataIndex: 'type', width: 180 },
    { title: '操作', dataIndex: 'operate', width: 300 },
]);
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => tableHeader.value);
const getCustomCell = (_: any, index: number) => {
    const obj = {
        children: _,
        rowSpan: 0,
    };
    // index 初始为 0的时候或当前id跟上一个id不等的时候
    if (index === 0 || _.parentId !== tableData.value[index - 1].parentId) {
        // 判断菜单区id跟后面是否一致
        obj.rowSpan = getRowSpan(_.parentId, index);
    } else {
        obj.rowSpan = 0; // 不渲染单元格
    }
    return obj;
};
const getRowSpan = (parentId: string, startIndex: number) => {
    // 根据 parentId 计算 rowSpan
    let count = 0;
    for (let i = startIndex; i < tableData.value.length; i++) {
        if (tableData.value[i].parentId === parentId) {
            count++;
        } else {
            break;
        }
    }
    return count;
};
const languageList = ref<languageType[]>([]);
watch(
    () => props.activeIndex,
    (val) => {
        if (val == 1) {
            tableHeader.value.splice(1, 0, {
                title: '菜单区',
                dataIndex: 'areaName',
                //@ts-ignore
                customCell: getCustomCell,
                width: 180,
            });
        } else {
            const index = tableHeader.value.findIndex((item) => item.title === '菜单区');
            index > -1 ? tableHeader.value.splice(index, 1) : '';
        }
        !languageList.value.length && getLanguageList();
    },
    {
        immediate: true,
    }
);
const operationTime = ref([]);
const parentList = ref<AppMenuAreaList[]>([]);
const formState = ref<Partial<AppMenuParams>>({
    pageNo: pagination.pageNo,
    pageSize: pagination.pageSize,
    name: '',
    state: null,
    type: null,
    loginRequired: null,
    path: '',
    url: '',
    key: null,
    parentId: undefined,
});
const formData = ref({});
const activeLanguage = ref('');
const visible = ref(false);
const CopyformStates = { ...formState.value };
const tableData = ref(Object.create([]));

const transmissionText = computed(() => {
    return (id: number) => {
        return transmissionList.find((item) => item.id == id)?.title;
    };
});
type MessageType = 1 | 2 | 3; // 1 新增 2 编辑// 3复制
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
watch(
    () => props.activeIndex,
    (val) => {
        if (val == 1) {
            getAppMenuAreaList();
        }
        tableData.value = [];

        handelRest();
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
    const featchs = ['fetchAppMenuList', 'fetchAppCardMenuList'][props.activeIndex - 1];
    // @ts-ignore
    api[featchs]({
        ...formState.value,
        language: activeLanguage.value,
        pageNo,
        pageSize,
    })
        .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchAppMenuList>) => {
            [tableData.value, pagination.total] = [list, totalSize];
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};

const statusList = [
    { id: null, title: '全部' },
    { id: 0, title: '显示' },
    { id: 1, title: '隐藏' },
];
const typeList = [
    { id: null, title: '全部' },
    { id: 1, title: '外部链接' },
    { id: 2, title: '本地路径' },
];
const loginRequiredList = [
    { id: null, title: '全部' },
    { id: true, title: '是' },
    { id: false, title: '否' },
];
const transmissionList = [
    { id: null, title: '全部' },
    { id: 0, title: '局部' },
    { id: 2, title: '全局' },
];

// const handleChange = () => {
//   if (operationTime.value && operationTime.value.length) {
//     formState.value.gt = operationTime.value[0];
//     formState.value.lt = operationTime.value[1];
//   } else {
//     formState.value.gt = "";
//     formState.value.lt = "";
//   }

//   handleOnSubmit();
// };
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
const handelUpdate = (language: string) => {
    formState.value.parentId = undefined;
    activeLanguage.value = language;
    formData.value = {};
    handleOnSubmit();
};

const handelMessagePush = async (type: MessageType = 1, item?: AppMenuList) => {
    messageTyep.value = type;
    visible.value = true;
    if (type > 1) {
        formData.value = { ...item };
    }
};

function getLanguageList() {
    api.fetchAppContactLanguage().then((list) => {
        languageList.value = list;
        activeLanguage.value = list[0].language;
        props.activeIndex == 1 && getAppMenuAreaList();
        handleOnSubmit();
    });
}

const hadnelOptionMessage = async (type: 1 | 2 = 1, id: string, state?: 0 | 1) => {
    const stateText = `${state == 0 ? '隐藏' : '显示'}`;
    const title = type == 1 ? `修改菜单状态为${stateText}` : '删除菜单';
    const content = type == 1 ? `是否要将该菜单状态更改为${stateText}?` : '是否要删除该项菜单?';
    const Cardfeatchs = ['fetchAppCardtoggleVisibilityMenu', 'fetchAppCardRemoveMenu'];
    const featchs = ['fetchApptoggleVisibilityMenu', 'fetchAppRemoveMenu'];
    const Apis = props.activeIndex == 1 ? featchs : Cardfeatchs;
    Modal.confirm({
        title,
        content,
        okText: '确定',
        width: '430px',
        cancelText: '取消',
        class: 'user-moadl-warning',
        async onOk() {
            // @ts-ignore
            await api[Apis[type - 1]](id);
            message.success(`${title}成功`);
            handleOnSubmit();
        },
    });
};
const changeLanguage = (language: string) => {
    formState.value.parentId = undefined;
    activeLanguage.value = language;
    props.activeIndex == 1 && getAppMenuAreaList();
    handleOnSubmit();
};
const getAppMenuAreaList = () => {
    api.fetchappMenuAreaList({
        language: activeLanguage.value as string,
    }).then((res) => {
        parentList.value = res;
    });
};
</script>

<style lang="scss" scoped>
.wrap-box {
    width: 240px;
    margin-right: 20px;
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
