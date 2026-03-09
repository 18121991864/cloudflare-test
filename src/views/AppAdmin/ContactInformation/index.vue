<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <!-- <a-form-item label="语言" class="mr-22 width-250" name="languageSymbol">
                  <a-select ref="select" v-model:value="formState.languageSymbol" placeholder="请选择语言">
                    <a-select-option :value="null">全部</a-select-option>
                    <a-select-option :value="item.language" v-for="item in languageList" :key="item.language">{{
                      item.value
                    }}</a-select-option>
                  </a-select>
                </a-form-item> -->
                <a-form-item label="联系方式" class="mr-22 width-250" name="contactInformation">
                    <a-input v-model:value="formState.contactInformation" placeholder="请输入联系方式" />
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="state">
                    <a-select ref="select" v-model:value="formState.state" placeholder="请选择状态">
                        <a-select-option :value="null">全部</a-select-option>
                        <a-select-option v-for="item in stateList" :key="item.id" :value="item.id">{{ item.title }} </a-select-option>
                    </a-select>
                </a-form-item>
            </div>
            <div class="wrap-box-item">
                <a-button v-if="buttonPermissions('add')" type="primary" size="small" class="search-reset-btn btn" @click="handleOpenModal(1)">
                    <template #icon>
                        <RedoOutlined />
                    </template>
                    新增
                </a-button>
                <div class="wrap-block">
                    <a-button block type="primary" size="small" class="search-reset-btn btn" @click.stop="handleOnSubmit">
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
        <a-table size="small" :pagination="false" :loading="loading" :columns="tableColumns" :data-source="tableData">
            <template #bodyCell="{ column: { dataIndex }, record }">
                <template v-if="dataIndex == 'action'">
                    <a-button
                        v-if="buttonPermissions('disable')"
                        type="link"
                        :class="record.state === 0 ? 'text-color-green' : 'text-color-red'"
                        @click="hadnelOptionMessage(record.id, record.state)"
                    >
                        {{ record.state == 0 ? '启用' : '禁用' }}
                    </a-button>
                    <a-button v-if="buttonPermissions('copy')" type="link" @click="handleOpenModal(3, record)">复制 </a-button>
                    <a-button v-if="buttonPermissions('edit')" type="link" @click="handleOpenModal(2, record)">编辑 </a-button>
                </template>
                <template v-if="dataIndex == 'show'">
                    <div>{{ record[dataIndex] == 0 ? '不显示' : '显示' }}</div>
                </template>
                <template v-if="dataIndex == 'state'">
                    <div :class="record[dataIndex] === 0 ? 'text-color-red' : 'text-color-green'">
                        {{ record[dataIndex] == 0 ? '禁用' : '启用' }}
                    </div>
                </template>
            </template>
        </a-table>
        <Pagination v-model:page="pagination.pageNo" v-model:limit="pagination.pageSize" :total="pagination.total" @pagination="handleOnSubmit" />
        <appContactUs v-model:visible="visible" :type="type" :language-list="languageList" :from-table-data="listItem" @handleOk="handleOk" />
    </div>
</template>

<script lang="ts" setup>
import { type TableColumnType, type FormInstance, Modal, message } from 'ant-design-vue';
import type { ComputedRef } from 'vue';
import { reactive, ref, computed } from 'vue';
import { PagingDefaultConf } from '@/utils/constant';
import appContactUs from './components/AppContactUs.vue';
import api from '@/api/appAdmin/index';
import type { languageType, AppContactlistType } from '@/api/appAdmin/types.d';

const formState = reactive({
    contactInformation: '',
    languageSymbol: '',
    state: null,
});
const type = ref(1);
const visible = ref(false);
const formReset = ref<FormInstance>();
const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id' },
    { title: '语言', dataIndex: 'language' },
    { title: '联系方式', dataIndex: 'contactInformation' },
    { title: '联系地址', dataIndex: 'contactAddress' },
    { title: '是否显示地址', dataIndex: 'show' },
    { title: '展示顺序', dataIndex: 'sort' },
    { title: '状态', dataIndex: 'state' },
    { title: '操作', dataIndex: 'action', width: 180, fixed: 'right' },
]);
const activeLanguage = ref('');
const changeLanguage = (language: string) => {
    activeLanguage.value = language;
    handleOnSubmit();
};
const listItem = ref<AppContactlistType>();
const pagination = reactive({ ...PagingDefaultConf });
const tableData = ref<AppContactlistType[]>([]);
const languageList = ref<languageType[]>([]);
const stateList = ref([
    { id: 1, title: '启用' },
    { id: 0, title: '禁用' },
]);
const handleOnSubmit = () => {
    loading.value = true;
    formState.languageSymbol = activeLanguage.value;
    api.fetchAppContactList({ ...formState, pageNo: pagination.pageNo, pageSize: pagination.pageSize })
        .then(({ list, totalSize }) => {
            tableData.value = list;
            pagination.total = totalSize;
        })
        .finally(() => {
            loading.value = false;
        });
};
const loading = ref(false);
const handelRest = () => {
    pagination.pageNo = 1;
    formReset.value?.resetFields();
    handleOnSubmit();
};
const handleOpenModal = (value: 1 | 2 | 3, item?: AppContactlistType) => {
    type.value = value;
    visible.value = true;
    if (value == 1) return false;

    listItem.value = item;
};
const getTableData = () => {
    getLanguageList();
};

const getLanguageList = () => {
    api.fetchAppContactLanguage().then((list) => {
        languageList.value = list;
        activeLanguage.value = list[0].language;
        handleOnSubmit();
    });
};
getTableData();
const handleOk = (language: string) => {
    activeLanguage.value = language;
    handleOnSubmit();
};
const hadnelOptionMessage = (id: string, state: 1 | 2) => {
    const stateText = `${state == 1 ? '禁用' : '启用'}`;
    const title = `修改状态为${stateText}`;
    const content = `是否要将该联系方式状态更改为${stateText}?`;
    Modal.confirm({
        title,
        content,
        okText: '确定',
        width: '430px',
        cancelText: '取消',
        class: 'user-moadl-warning',
        async onOk() {
            let data = {
                id,
                state: state == 1 ? 0 : 1,
            };
            loading.value = true;
            api.fetchAppContactUpdateState(data)
                .then(() => {
                    message.success(`${title}成功`);
                    handleOnSubmit();
                })
                .finally(() => {
                    loading.value = false;
                });
        },
    });
};
</script>

<style lang="scss" scoped>
.form-list {
    margin-bottom: 10px;
}

.wrap-box-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
        padding: 7 40px;
    }

    .wrap-block {
        display: flex;
        align-items: center;

        button {
            display: flex;
            align-items: center;
            justify-content: center;

            &:nth-child(1) {
                margin-right: 10px;
            }
        }
    }
}
</style>
