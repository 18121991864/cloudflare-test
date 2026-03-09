<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item label="模板 ID" class="mr-22 width-250" name="modelId">
                    <a-input
                        v-model:value="formState.modelId"
                        size="small"
                        placeholder="请输入"
                        @pressEnter="handleSearch"
                    />
                </a-form-item>
                <a-form-item label="内容" class="mr-22 width-250" name="info">
                    <a-input
                        v-model:value="formState.info"
                        size="small"
                        placeholder="请输入"
                        @pressEnter="handleSearch"
                    />
                </a-form-item>
                <a-form-item label="状态" class="mr-22 width-250" name="state">
                    <a-select v-model:value="formState.state" size="small" placeholder="请选择" @change="handleSearch">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">启用</a-select-option>
                        <a-select-option :value="2">禁用</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="类型" class="mr-22 width-250" name="type">
                    <SBusiness v-model="formState.type" @onChange="handleSearch"/>
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between">
                <div>
                    <a-button
                        v-if="buttonPermissions('add')"
                        block
                        type="primary"
                        size="small"
                        class="search-submit-btn ml-0"
                        @click="handleOpenModal()"
                    >
                        <template #icon>
                            <PlusOutlined/>
                        </template>
                        添加
                    </a-button>
                </div>
                <div class="display-flex">
                    <a-button block type="primary" size="small" class="search-submit-btn" @click.stop="handleSearch">
                        <template #icon>
                            <SearchOutlined/>
                        </template>
                        搜索
                    </a-button>
                    <a-button block size="small" class="search-reset-btn" @click.stop="handleResetForm">
                        <template #icon>
                            <RedoOutlined/>
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
            <template #bodyCell="{ column: { dataIndex }, record: { id, state, info, type }, record }">
                <template v-if="dataIndex === 'state'">
                    <p :class="state === 1 ? 'text-color-green' : 'text-color-red'">
                        {{ state === 1 ? "启用" : "禁用" }}
                    </p>
                </template>
                <template v-if="dataIndex === 'type'">
                    <p>
                        {{ type === 2 ? "邮件" : "短信" }}
                    </p>
                </template>
                <template v-if="dataIndex === 'info'">
                    <div v-html="info"></div>
                </template>
                <template v-if="dataIndex === 'action'">
                    <a-button
                        v-if="buttonPermissions('disable')"
                        type="link"
                        :danger="state === 1"
                        @click="handChecked(id)"
                    >
                        {{ state === 1 ? "禁用" : "开启" }}
                    </a-button>
                    <a-button
                        v-if="buttonPermissions('detail')"
                        type="link"
                        danger
                        @click="handleOpenModalDetali(record)"
                    >详情
                    </a-button
                    >
                    <a-button v-if="buttonPermissions('edit')" type="link" danger @click="handleOpenModal(record)"
                    >编辑
                    </a-button
                    >
                    <!-- <a-popconfirm okType="danger" :title="`确定删除吗？`" @confirm="fetchDel(id)">
                      <template #icon><question-circle-outlined :style="{color: 'red'}" /></template>
                      <a-button v-if="state!==1" type="link" danger>删除</a-button>
                    </a-popconfirm> -->
                </template>
            </template>
        </a-table>

        <Pagination
            v-model:page="pagination.pageNo"
            v-model:limit="pagination.pageSize"
            :total="pagination.total"
            @pagination="handleOnSubmit"
        />

        <EmailNotificationTemplateAddOrUpdate
            :visible="isModalOpen"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmit"
        />
        <EmailNotificationTemplateDetail
            :visible="isModalOpenDetail"
            :type="modalType"
            :active-data="activeData"
            @onClose="handleCloseModal"
            @onSuccess="handleOnSubmit"
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
import api from '../../api/channel';
import { PagingDefaultConf } from '../../utils/constant';
import EmailNotificationTemplateAddOrUpdate from './EmailNotificationTemplateAddOrUpdate.vue';
import EmailNotificationTemplateDetail from './EmailNotificationTemplateDetail.vue';

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: 'ID', dataIndex: 'id', width: 180, fixed: 'left' },
    { title: '通知标题', dataIndex: 'businessTypeName' },
    { title: '通知类型', dataIndex: 'type' },
    { title: '模板 ID', dataIndex: 'modelId' },
    { title: '通知 Titile', dataIndex: 'title' },
    { title: '内容', dataIndex: 'info' },
    { title: '语言', dataIndex: 'languageName', width: 250 },
    { title: '状态', dataIndex: 'state', fixed: 'right', width: 80 },
    { title: '操作', dataIndex: 'action', fixed: 'right', width: 180 },
]);

export default defineComponent({
    name: 'EmailNotificationTemplate',
    components: {
        SearchOutlined,
        RedoOutlined,
        PlusOutlined,
        QuestionCircleOutlined,
        EmailNotificationTemplateAddOrUpdate,
        EmailNotificationTemplateDetail,
    },
    setup() {
        const formState = reactive<{
            id: string; //
            info: string; // 内容
            modelId: string; // 模板 ID
            type: 2 | '';
            state: 1 | 2 | '';
        }>({ id: '', info: '', modelId: '', type: '', state: '' });

        const pagination = reactive({ ...PagingDefaultConf });
        const loading = ref(false);
        const tableData = ref(Object.create([]));
        const handleOnSubmit = () => {
            loading.value = true;
            NProgress.start();
            const { pageNo, pageSize } = pagination;
            api
                .fetchMsgTemplateList({
                    ...formState,
                    pageNo,
                    pageSize,
                })
                .then(({ list, totalSize }: PromiseReturnType<typeof api.fetchMsgTemplateList>) => {
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

        const handChecked = (id: string) => {
            api.fetchMsgTemplateUpdateState({ id }).then(() => {
                message.success('操作成功');
                handleOnSubmit();
            });
        };

        const isModalOpen = ref<boolean>(false);
        const modalType = ref<'add' | 'edit'>('add');
        const activeData = ref(Object.create(null)); // modal打开时激活的数据
        const handleOpenModal = (record: PromiseReturnType<typeof api.fetchCardRiskList>) => {
            // 打开新增/编辑弹框
            activeData.value = record || Object.create(null);
            [isModalOpen.value, modalType.value] = [true, record ? 'edit' : 'add'];
        };

        const isModalOpenDetail = ref<boolean>(false);
        const handleCloseModal = () => {
            // 关闭弹框
            [isModalOpen.value] = [false];
            [isModalOpenDetail.value] = [false];
        };

        const handleOpenModalDetali = (record: PromiseReturnType<typeof api.fetchCardRiskList>) => {
            // 打开新增/编辑弹框
            activeData.value = record || Object.create(null);
            [isModalOpenDetail.value, modalType.value] = [true, record ? 'edit' : 'add'];
        };
        const fetchDel = (id: string): void => {
            api.fetchCardRiskDel({ id }).then(() => {
                handleOnSubmit();
                message.success('操作成功');
            });
        };

        return {
            tableColumns,

            pagination,
            loading,
            tableData,
            handleOnSubmit,

            handChecked,

            isModalOpen,
            modalType,
            activeData,
            handleOpenModal,
            handleCloseModal,
            isModalOpenDetail,
            formState,
            formReset,
            handleSearch,
            handleResetForm,
            handleOpenModalDetali,
            fetchDel,
        };
    },
});
</script>
