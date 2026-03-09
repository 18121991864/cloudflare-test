<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        :cancel-text="$t('cancel')"
        :ok-text="$t('confirm')"
        :mask-closable="false"
        :after-close="formRef.resetFields"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        :width="width"
        @cancel="handCancel"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 8 }" hide-required-mark :rules="formRules" :model="formState">
            <a-form-item :label="$t('common.LoginPassword')" name="password">
                <a-input-password v-model:value="formState.password" size="small" :placeholder="$t('common.PleaseEnter')" />
            </a-form-item>
            <a-form-item :label="$t('common.2FAValidation')" name="facode">
                <a-input-password v-model:value="formState.facode" size="small" :placeholder="$t('common.PleaseEnter')" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, defineComponent, reactive, ref, watch, PropType } from 'vue';
import { message } from 'ant-design-vue';
import { RuleObject } from 'ant-design-vue/es/form/interface';
import cookies from 'cookies-js';
import { PASSWORD } from '@/utils/constant';
import api from '@/api/fetchTest/index';
import useSidebar from '@/store/sideBar';
import useUser from '@/store/user';
import useTagsView from '@/store/tagsView';
import { useI18n } from 'vue-i18n';

const FormParams = {
    facode: null,
    userId: null,
    password: null,
};

export default defineComponent({
    emits: ['update:visible', 'onSuccess'],
    props: {
        visible: { type: Boolean, required: true },
        type: { type: String as PropType<'loginPwd' | '2FA' | 'payPwd'>, required: true },
        userId: { type: String, required: true },
        width: { type: Number, default: 450 },
    },
    setup(props, { emit }) {
        const { t } = useI18n();
        const formState = reactive({ ...FormParams });
        const { push } = useRouter();
        const validateCode = (rule: RuleObject, value: string) => {
            if (value === '') {
                return Promise.reject(new Error(t('common.PleaseEnter')));
            }
            const reg = /^[0-9]{6}$/;
            if (!reg.test(value)) {
                return Promise.reject(new Error(t('login.PleaseEnterTheSixDigitVerificationCode')));
            }
            return Promise.resolve();
        };
        const formRules = computed<Record<string, Rule[]>>(() => ({
            // 表单规则
            facode: [{ validator: validateCode, trigger: 'blur', required: true }],
            password: [{ message: t('common.PleaseEnter'), trigger: 'blur', required: true }],
        }));

        const store = useSidebar();
        const userStore = useUser();

        const title = computed(() => {
            return props.type === 'loginPwd'
                ? t('common.ResetLoginPassword')
                : props.type === '2FA'
                ? t('common.Reset2FA')
                : t('common.ResetPayPassword');
        });

        const storeTagsView = useTagsView();
        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            if (isSubmitLoading.value) return;
            isSubmitLoading.value = true;
            const { type } = props;
            console.log(48, formState);
            const isApi = type === '2FA' ? 'setSysUserResetSecret' : 'sysUserResetPassword';
            // const isParams =
            //     type === 'loginPwd'
            //         ? { ...formState, userId: props.userId, type: 1 }
            //         : {
            //               ...formState,
            //               userId: props.userId,
            //           };
            const isParams = { ...formState, userId: props.userId };
            if (type !== '2FA') {
                // @ts-ignore
                isParams.type = type === 'loginPwd' ? 1 : 2;
            }

            // @ts-ignore
            return api[isApi]({ ...isParams })
                .then(() => {
                    message.success('操作成功!');
                    isSubmitLoading.value = false;
                })
                .finally(() => {
                    isSubmitLoading.value = false;
                });
        };

        const handCancel = () => {
            userStore.fetchUserInfo();
            emit('update:visible', false);
        };
        const formRef = ref<FormInstance>(Object.create(null));
        const handelSubmit = async () => {
            // 提交
            formRef.value.validate().then(() =>
                handleAddOrUpdate()?.then(() => {
                    handCancel();
                    emit('onSuccess');
                })
            );
        };

        return {
            title,
            formRef,
            formState,
            isSubmitLoading,
            formRules,
            handCancel,
            handelSubmit,
        };
    },
});
</script>
