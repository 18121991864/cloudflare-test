<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        cancel-text="取消"
        ok-text="确定"
        :mask-closable="false"
        :after-close="formRef.resetFields"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        :width="width"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <a-form ref="formRef" class="form-list" :label-col="{ span: 5 }" hide-required-mark :rules="formRules" :model="formState">
            <a-form-item label="2FA验证" name="facode" v-if="type !== 'init'">
                <a-input-password v-model:value="formState.facode" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="旧密码" name="oldPassword">
                <a-input-password v-model:value="formState.oldPassword" size="small" placeholder="请输入" />
            </a-form-item>
            <WalletPassword
                v-model="formState.newPass"
                :input-props="{ placeholder: '请输入新密码' }"
                :item-props="{ name: 'newPass', required: true, label: '新密码' }"
            />
            <a-form-item label="验证新密码" name="password">
                <a-input-password v-model:value="formState.password" size="small" placeholder="请输入" />
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
import useTagsView from '@/store/tagsView';
import WalletPassword from '@/components/Wallet/Password.vue';

const FormParams = {
    newPass: null, //
    password: null, //
    type: 1,
    oldPassword: null,
    facode: null,
};

export default defineComponent({
    emits: ['onClose', 'onSuccess'],
    props: {
        visible: { type: Boolean, required: true },
        type: { type: String as PropType<'add' | 'edit' | 'init'>, required: true },
        activeData: { type: Object, default: () => Object.create(null) },
        width: { type: Number, default: 450 },
    },
    components: { WalletPassword },
    setup(props, { emit }) {
        const formState = reactive({ ...FormParams });

        const { push } = useRouter();
        const validateNewPass = async (rule: RuleObject, value: string) => {
            // 账户验证
            // eslint-disable-next-line prefer-promise-reject-errors
            if (value === '') return Promise.reject('请输入密码');

            // eslint-disable-next-line prefer-promise-reject-errors
            // if (!PASSWORD.test(value)) return Promise.reject('请输入6-15位数字和大小写字母组成的密码');

            return Promise.resolve();
        };

        const validatePassword = async (rule: RuleObject, value: string) => {
            // 密码验证
            // eslint-disable-next-line prefer-promise-reject-errors
            if (value === '') return Promise.reject('请输入密码');

            // eslint-disable-next-line prefer-promise-reject-errors
            // if (!PASSWORD.test(value)) return Promise.reject('请输入6-15位数字、大小写字母组成的密码');

            // eslint-disable-next-line prefer-promise-reject-errors
            if (formState.newPass !== value) return Promise.reject('两次密码输入不一致，请重新输入');

            return Promise.resolve();
        };

        const validateCode = (rule: RuleObject, value: string) => {
            if (value === '') {
                return Promise.reject(new Error('请输入六位数字验证码'));
            }
            const reg = /^[0-9]{6}$/;
            if (!reg.test(value)) {
                return Promise.reject(new Error('请输入六位数字验证码'));
            }
            return Promise.resolve();
        };
        const formRules = computed<Record<string, Rule[]>>(() => ({
            // 表单规则
            newPass: [{ validator: validateNewPass, trigger: 'blur', required: true }],
            facode: [{ validator: validateCode, trigger: 'blur', required: true }],
            oldPassword: [{ required: true, trigger: 'blur', message: '请输入' }],
            password: [{ validator: validatePassword, trigger: 'blur', required: true }],
        }));

        const title = computed(() => `${props.type === 'add' ? '添加' : '修改'}密码`);

        const storeTagsView = useTagsView();
        const isSubmitLoading = ref<boolean>(false); // 是否处于提交中
        const handleAddOrUpdate = () => {
            if (isSubmitLoading.value) return;
            isSubmitLoading.value = true;
            const { type } = props;
            console.log(48, formState);
            const isApi = type === 'add' ? 'sysUserUpdatePassword' : 'sysUserUpdatePassword';
            const isParams = type === 'add' ? { ...formState } : { ...formState };

            // @ts-ignore
            return api[isApi]({ ...isParams })
                .then(() => {
                    emit('onClose');
                    message.success('密码修改成功!');
                    api.loginOut().then(() => {
                        cookies.expire('walletToken');
                        storeTagsView.clearVisitedView();
                        push('/login');
                    });
                })
                .finally(() => {
                    isSubmitLoading.value = false;
                });
        };

        const formRef = ref<FormInstance>(Object.create(null));
        const handelSubmit = async () => {
            // 提交
            formRef.value.validate().then(() => handleAddOrUpdate()?.then(() => emit('onSuccess')));
        };

        watch(
            () => props.visible,
            (n, o) => {
                // 用于填充modal数据
                if (n !== o && n) {
                    // Object.entries(FormParams).forEach(([key]: any) => {
                    //     // @ts-ignore 回填填充formState数据
                    //     formState[key] = props.type === 'add' ? undefined : props.activeData[key];
                    // });
                }
            }
        );

        return {
            title,
            formRef,
            formState,
            isSubmitLoading,
            formRules,

            handelSubmit,
        };
    },
});
</script>
