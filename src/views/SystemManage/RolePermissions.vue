<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" class="form-list">
            <div class="action-btm display-flex flex-justify-content-space-between">
                <a-button
                    v-if="buttonPermissions('add')"
                    type="primary"
                    size="small"
                    class="black-btm"
                    @click.stop="$router.push('/systemManage/addRolePermissions')"
                >
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    {{ $t('common.AddRole') }}
                </a-button>
            </div>
        </a-form>
        <a-table
            size="small"
            :pagination="false"
            :loading="loading"
            :columns="tableColumns"
            :row-key="
                ({ roleId }) => {
                    return roleId;
                }
            "
            :data-source="tableData"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { roleId } }">
                <template v-if="dataIndex === 'action'">
                    <a-button
                        v-if="buttonPermissions('select')"
                        type="link"
                        @click.stop="$router.push(`/systemManage/viewRolePermissions/${roleId}/1`)"
                        >{{ $t('common.ViewPermissions') }}
                    </a-button>
                    <a-button v-if="buttonPermissions('edit')" type="link" @click.stop="$router.push(`/systemManage/editRolePermissions/${roleId}`)"
                        >{{ $t('common.Edit') }}
                    </a-button>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, onBeforeMount, ComputedRef, computed } from 'vue';
import NProgress from 'nprogress';
import { TableColumnType } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import api from '@/api/fetchTest/index';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: t('common.SerialNumber'), customRender: ({ index }) => `${index + 1}` },
    { title: t('common.RoleName'), dataIndex: 'roleName' },
    { title: t('common.Operate'), dataIndex: 'action', fixed: 'right', width: 200 },
]);

const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = () => {
    loading.value = true;
    NProgress.start();
    api.sysRoleList()
        .then((data: PromiseReturnType<typeof api.sysRoleList>) => {
            tableData.value = data;
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};

onActivated(() => {
    handleOnSubmit();
});
defineOptions({
    name: 'RolePermissions',
});
</script>

<style lang="scss" scoped>
.black-btm {
    margin-left: 0 !important;
}
</style>
