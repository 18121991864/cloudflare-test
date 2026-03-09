<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="功能简介：" class="wrap-box">
                    <a-input v-model:value="formState.intros" placeholder="请输入功能简介" />
                </a-form-item>
                <a-form-item label="功能code：" class="wrap-box select-box">
                    <a-select
                        v-model:value="formState.featureCodes"
                        mode="multiple"
                        placeholder="请输入功能名称进行筛选"
                        :options="options"
                        :max-tag-count="2"
                        :field-names="{
                            label: 'value',
                            value: 'key',
                        }"
                    >
                        <template #maxTagPlaceholder="omittedValues">
                            <span style="color: red">+ {{ omittedValues.length }} ...</span>
                        </template>
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
                    @click.stop="handelPush(1)"
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
                <template v-if="column.dataIndex === 'operate'">
                    <a-button v-if="buttonPermissions('update')" type="link" @click="handelPush(2, record)">编辑 </a-button>
                </template>
            </template>
        </a-table>
        <safety-control-modal v-model:visible="visible" :message-tyep="messageTyep" :m-item="formData" @handleOk="handelUpdate" />
    </div>
</template>

<script lang="ts" setup>
import type { ComputedRef } from 'vue';
import { computed, ref, reactive, watch } from 'vue';
import { message } from 'ant-design-vue';
import useTableScroll from '@/hooks/tableScroll';
import NProgress from 'nprogress';
import type { TableColumnType, SelectProps } from 'ant-design-vue';
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { PagingDefaultConf } from '@/utils/constant';
import api from '@/api/appAdmin/index';
import SafetyControlModal from './components/SafetyControlModal.vue';

const recordId = ref('');
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: '生效范围', dataIndex: 'scopeName', width: 100 },
    { title: '功能简介', dataIndex: 'intros', width: 100 },
    { title: '功能code', dataIndex: 'featureCodes', width: 100 },
    { title: '效验时长(h)', dataIndex: 'validDuration', width: 100 },
    { title: '资金密码允许错误次数', dataIndex: 'errorCount', width: 100 },
    { title: '限制账号时长(h)', dataIndex: 'restrictDuration', width: 100 },
    { title: '影响功能', dataIndex: 'influenceFunctions', width: 100 },
    { title: '操作', dataIndex: 'operate', width: 100 },
]);
const operationTime = ref([]);
const formData = ref({});
const visible = ref(false);
const formState = ref({
    featureCodes: [],
    intros: '',
});
const tableRef = ref();
const TableDataTotal = ref(Object.create([]));
const tableData = ref(Object.create([]));
const options = ref(Object.create([]));
const handleSerach = () => {
    handleOnSubmit();
};
const handelUpdate = () => {
    formData.value = {};
    handleOnSubmit();
};
const getFCodeSelect = async () => {
    options.value = await api.fetchPinCheckRuleFCodeSelect();
};
getFCodeSelect();
const CopyformStates = { ...formState.value };

type MessageType = 1 | 2; // 1 新增 2 编辑
const messageTyep = ref<MessageType>(1);
const handelPush = (type: 1 | 2, item?: any) => {
    messageTyep.value = type;
    visible.value = true;
    if (type == 2) {
        formData.value = { ...item };
    }
};
const loading = ref(false);
const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    api.fetchPinCheckRuleList(formState.value)
        .then((list) => {
            TableDataTotal.value = list;
            tableData.value = TableDataTotal.value.slice(0, 10);
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};
handleOnSubmit();
const statusList = [
    { id: '', title: '全部' },
    { id: 1, title: '待处理' },
    { id: 2, title: '已处理' },
    //   { id: 3, title: "拒绝" },
];

const handelRest = () => {
    formState.value = { ...CopyformStates };
    handleOnSubmit();
};
const loadExportExcel = ref(false);
const handExport = () => {
    if (loadExportExcel.value) return;

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
const handelCancel = () => {
    recordId.value = '';
};

const handelConfim = async (id: string) => {
    await api.fetchupdateCloseAccount({ id });
    message.success('解绑成功');
    handelCancel();
    handleOnSubmit();
};

watch(
    () => visible.value,
    (val) => {
        if (!val) {
            messageTyep.value = 1;
            formData.value = {};
        }
    }
);
useTableScroll(tableRef, TableDataTotal, tableData);
</script>

<style lang="scss" scoped>
.wrap-box {
    width: 240px;
    margin-right: 40px;
}

.select-box {
    min-width: 240px;
    width: fit-content;
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
