<template>
    <div class="table-container">
        <a-spin :spinning="isSpinning">
            <a-form ref="formRef" :model="currState" class="form-list" :hide-required-mark="true" :rules="rules" :label-col="{ span: 6 }">
                <a-form-item class="mt-32 width-500" :label="$t('common.RoleName')" name="roleName">
                    <a-input
                        v-model:value="currState.roleName"
                        size="small"
                        max-length="10"
                        autocomplete="off"
                        :placeholder="$t('common.PleaseEnter')"
                        :disabled="see"
                    />
                </a-form-item>
                <a-form-item class="width-500" :label="$t('common.PermissionsConfig')">
                    <a-tree
                        v-if="rootRoleList.length"
                        v-model:checked-keys="currState.checkedKeys"
                        :tree-data="rootRoleList"
                        :disabled="see"
                        :field-names="{ children: 'children', title: 'menuName', key: 'menuId' }"
                        checkable
                        check-strictly
                        default-expand-all
                        @check="handleTreeCheck"
                    />
                </a-form-item>
                <a-form-item class="width-500 sub-no-label" label=" ">
                    <div class="submit-btn mt-50">
                        <a-button class="mr-20 detail-reset-btn" size="small" :disabled="isLoading" @click.stop="handleBack">
                            {{ see ? $t('common.return') : $t('cancel') }}
                        </a-button>
                        <a-button v-if="!see" type="primary" class="detail-submit-btn" size="small" :loading="isLoading" @click.stop="handleSaveData">
                            {{ $t('confirm') }}
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-spin>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { buildArrTree } from '@/utils/common';
import useTagsView from '@/store/tagsView';
import { message } from 'ant-design-vue';
import useSideBar from '@/store/sideBar';
import NProgress from 'nprogress';
import api from '@/api/fetchTest/index';
import { useI18n } from 'vue-i18n';

interface SelectDataRef {
    menuId: string;
    menuName: string;
    parentId: string;
    menuType: number;
    showCheckPassword: boolean;
    checkPassword: boolean;
    component: string;
    children: SelectDataRef[];
}
export default defineComponent({
    name: 'EditRolePermissions',
    setup() {
        const { t } = useI18n();
        const formRef = ref();
        const isSpinning = ref(false);
        const isLoading = ref<boolean>(false);
        const currState = reactive<{
            roleName: string;
            roleId: string;
            remark: string;
            checkedKeys: { checked: any[] };
        }>({ roleName: '', roleId: '', remark: '', checkedKeys: { checked: [] } });
        const allRoleList = ref<PromiseReturnType<typeof api.sysRoleMenuList>>(Object.create([])); // 所有菜单权限列表

        const store = useSideBar();
        const { back } = useRouter();
        const tagsView = useTagsView();
        const {
            params: { id: roleId, see = '' },
        } = useRoute();

        const fetchRoleList = (): Promise<void> => {
            NProgress.start();
            isSpinning.value = true;
            return api
                .sysRoleMenuList()
                .then((r: PromiseReturnType<typeof api.sysRoleMenuList>) => {
                    allRoleList.value = r;
                })
                .finally(() => {
                    NProgress.done();
                    isSpinning.value = false;
                });
        };

        const handleTreeCheck = (
            checkedKey: { checked: string[] },
            e: {
                node: any;
                checked: boolean;
                checkedNodes: any;
            }
        ): void => {
            const ids: string[] = [];
            const deepChildSelect = (dataRef: SelectDataRef) => {
                dataRef.children.forEach((item) => {
                    if (!ids.includes(item.menuId)) {
                        ids.push(item.menuId);
                    }
                    if (item.children && item.children.length) {
                        deepChildSelect(item);
                    }
                });
            };
            console.log(e);

            e.node.dataRef.children && e.node.dataRef.children.length && deepChildSelect(e.node.dataRef);

            currState.checkedKeys.checked = e.checked
                ? [...checkedKey.checked, ...ids]
                : checkedKey.checked?.filter((value) => ids.indexOf(value) === -1);
        };

        const fetchRoleListDetail = (): void => {
            // 获取权限列表详情
            api.sysInfoCheckMenuList({ roleId: currState.roleId }).then((r: PromiseReturnType<typeof api.sysInfoCheckMenuList>) => {
                currState.checkedKeys.checked = r?.map((item) => item.menuId);
            });

            // 获取角色信息
            api.sysRoleInfo({ roleId: currState.roleId }).then(({ roleId, roleName }: any) => {
                [currState.roleId, currState.roleName] = [roleId, roleName];
            });
        };

        const rules = {
            roleName: [{ type: 'string', required: true, whitespace: true, trigger: 'blur', message: t('common.PleaseEnter') }],
        };

        const handleBack = () => {
            back();
            tagsView.deleteVisitedViewByName(roleId ? (see ? 'DetailRolePermissions' : 'EditRolePermissions') : 'AddRolePermissions', true);
        };

        const handleSaveData = (): void => {
            // 保存数据 调用接口
            formRef.value.validate().then(() => {
                const {
                    roleName,
                    roleId,
                    remark,
                    checkedKeys: { checked },
                } = currState;
                if (!checked.length) return message.warning(t('common.PleaseSelect'));
                const menuIdList = checked.map((value: number) => ({ checkUserPassword: 2, menuId: value }));
                isLoading.value = true;
                isSpinning.value = true;
                api.sysRoleAddUpdate({
                    checkOpPassword: false,
                    menuIdList,
                    remark,
                    state: 1,
                    roleName,
                    roleId,
                })
                    .then(async () => {
                        message.success(t('common.OperationSuccess'));
                        handleBack();
                        await store.fetchSidebarRoutes();
                    })
                    .finally(() => {
                        isLoading.value = false;
                        isSpinning.value = false;
                    });
            });
        };

        // 获取根路径菜单权限列表
        const rootRoleList = computed(() => buildArrTree(allRoleList.value, '0') || []);

        onMounted(() => {
            currState.roleId = String(roleId || '');
            fetchRoleList().then(() => {
                if (roleId) fetchRoleListDetail();
            });
        });

        return {
            rules,
            formRef,
            isLoading,
            currState,
            isSpinning,
            handleBack,
            rootRoleList,
            handleSaveData,
            handleTreeCheck,
            see: Boolean(see),
        };
    },
});
</script>

<style lang="scss">
.table-container {
    .sub-no-label {
        .ant-form-item-label > label::after {
            content: none;
        }
    }
}
</style>
