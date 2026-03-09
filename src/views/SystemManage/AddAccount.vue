<template>
    <div class="table-container">
        <a-form ref="formRef" :model="currState" class="form-list" :hide-required-mark="true" :rules="rules" :label-col="{ span: 3 }">
            <a-form-item :label="$t('common.AccountLoginName')" name="account">
                <a-input
                    v-model:value="currState.account"
                    size="small"
                    class="width-250 mr-22"
                    autocomplete="off"
                    :disabled="Boolean(currState.userId)"
                    :placeholder="$t('common.PleaseEnter')"
                />
            </a-form-item>
            <a-form-item :label="$t('common.RealName')" name="fullName">
                <a-input
                    v-model:value="currState.fullName"
                    size="small"
                    class="width-250 mr-22"
                    autocomplete="off"
                    :placeholder="$t('common.PleaseEnter')"
                />
            </a-form-item>
            <a-form-item :label="$t('common.AssignRole')" name="roleId">
                <a-select v-model:value="currState.roleId" class="width-250 mr-22" placeholder="请选择">
                    <a-select-option v-for="x of roleList" :key="x.roleId" :value="x.roleId">{{ x.roleName }} </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :label="$t('common.AccountStatus')" name="state">
                <a-radio-group v-model:value="currState.state" name="radioGroup" class="width-250 mr-22">
                    <a-radio :value="1">{{ $t('common.Enable') }}</a-radio>
                    <a-radio :value="2">{{ $t('common.Disable') }}</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item class="mt-40 sub-no-label" label=" ">
                <div class="submit-btn">
                    <a-button type="primary" class="detail-reset-btn" size="small" @click.stop="handleBack">{{ $t('common.return') }} </a-button>
                    <a-button type="primary" class="detail-submit-btn" size="small" :loading="isLoading" @click.stop="handleSaveData"
                        >{{ $t('common.Submit') }}
                    </a-button>
                </div>
            </a-form-item>
        </a-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, reactive } from 'vue';
import NProgress from 'nprogress';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { RuleObject } from 'ant-design-vue/es/form/interface';
import api from '@/api/fetchTest/index';
import { useI18n } from 'vue-i18n';
import useTagsView from '@/store/tagsView';

export default defineComponent({
    name: 'AddAccount',
    setup() {
        const { t } = useI18n();
        const currState = reactive<{
            account: string; // 账号
            fullName: string; // 姓名
            roleId: string | undefined; // 角色ID
            state: number; // 账号状态 1启用 2禁用
            userId?: string | undefined; // ID
        }>({
            account: '',
            fullName: '',
            roleId: undefined,
            state: 1,
            userId: '',
        });

        const { back } = useRouter();
        const tagsView = useTagsView();
        const handleBack = () => {
            back();
            tagsView.deleteVisitedViewByName(currState.roleId ? 'EditAccount' : 'AddAccount', true);
        };
        const hasRoute = useRoute();

        /* const validateEmail = async (rule: RuleObject, value: string) => { // 账户验证
            // eslint-disable-next-line prefer-promise-reject-errors
            if (value === '') return Promise.reject('请输入邮箱');
            // eslint-disable-next-line prefer-promise-reject-errors
            if (!EMAIL.test(value)) return Promise.reject('请输入正确的邮箱号');
            return Promise.resolve();
        }; */

        const rules = {
            account: [{ required: true, message: t('common.PleaseEnter'), trigger: 'blur' }],
            // newsletter: [{ validator: validateEmail, trigger: 'blur', required: true }],
            fullName: [{ required: true, message: t('common.PleaseEnter'), trigger: 'blur' }],
            roleId: [{ required: true, message: t('common.PleaseSelect'), trigger: 'blur' }],
        };

        const formRef = ref();
        const isLoading = ref<boolean>(false);
        const handleSaveData = (): void => {
            // 保存数据
            formRef.value.validate().then(() => {
                NProgress.start();
                isLoading.value = true;
                const { userId: id } = currState;
                api.sysUserAddOrUpdate({ ...currState, id })
                    .then(() => {
                        message.success(t('common.OperationSuccess'));
                        back();
                    })
                    .finally(() => {
                        NProgress.done();
                        isLoading.value = false;
                    });
            });
        };

        const roleList = ref<PromiseReturnType<typeof api.sysRoleList>>(Object.create([]));
        const fetchRoleList = (): void => {
            // 获取角色列表
            api.sysRoleList().then((r: PromiseReturnType<typeof api.sysRoleList>) => {
                roleList.value = r;
            });
        };

        const fetchRowDetail = (): void => {
            // 获取当前行详细数据
            NProgress.start();
            api.sysUserInfo({ userId: currState.userId })
                .then((data: any) => {
                    Object.keys(currState).forEach((key: string) => {
                        // @ts-ignore 回填填充currState数据
                        currState[key] = data[key];
                    });
                })
                .finally(() => {
                    NProgress.done();
                });
        };

        onBeforeMount(() => {
            const { id } = hasRoute.params;
            fetchRoleList();
            currState.userId = id ? String(id) : '';
            if (id) fetchRowDetail();
        });

        return {
            rules,
            formRef,
            roleList,
            currState,
            isLoading,
            handleSaveData,

            handleBack,
        };
    },
});
</script>
