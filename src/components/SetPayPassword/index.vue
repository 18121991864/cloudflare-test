<template>
    <a-modal :open="open" :title="setPasswordTitle" @ok="handleOk" @cancel="handleOk" :footer="null" :maskClosable="false" :closable="false">
        <a-form ref="formRef" class="form-list" :rules="formRules" :model="formState">
            <a-form-item :label="labelTitle" name="password">
                <a-input-password v-model:value="formState.password" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="确认支付密码" name="confrimPassword">
                <a-input-password v-model:value="formState.confrimPassword" size="small" placeholder="请输入" />
            </a-form-item>
            <a-form-item label="原支付密码" name="oldPassword" v-if="userInfo.isSetOPPassword">
                <a-input-password v-model:value="formState.oldPassword" size="small" placeholder="请输入" />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 16 }" class="mt-10 mb-0">
                <div class="flex">
                    <a-button @click="handleCancel" class="mr-2">取消</a-button>
                    <a-button type="primary" :loading="loading" @click="handleOk">确定</a-button>
                </div>
            </a-form-item>
        </a-form>
        <GoogleCode ref="googleCodeRef" @setCodeVal="validateGoogle" />
    </a-modal>
</template>
<script lang="ts" setup>
import useUser from '@/store/user';
import type { FormInstance, Rule } from 'ant-design-vue/es/form';
import GoogleCode from '@/components/Dialog/GoogleCode.vue';
import { PASSWORD_REG } from '@/utils/constant';
import api from '@/api/fetchTest/index';
import { message } from 'ant-design-vue/es';
const userStore = useUser();
withDefaults(
    defineProps<{
        open: boolean;
    }>(),
    {
        open: false,
    }
);
const userInfo = computed(() => userStore.userInfo);
const googleCodeRef = ref<InstanceType<typeof GoogleCode>>();
const emits = defineEmits<{
    (e: 'update:open', value: boolean): void;
    (e: 'onSuccess'): void;
}>();
const setPasswordTitle = computed(() => (!userInfo.value.isSetOPPassword ? '设置支付密码' : '修改支付密码'));
const labelTitle = computed(() => (!userInfo.value.isSetOPPassword ? '支付密码' : '支付密码'));
const formState = reactive({
    password: '',
    confrimPassword: '',
    oldPassword: '',
});
const formRef = ref<FormInstance | null>(null);
const loading = ref<boolean>(false);
const validatePassword = (type: 1 | 2 | 3) => (rule: Rule, value: string) => {
    const content = ['支付密码', '确认支付密码', '旧密码'][type - 1];
    if (!value) return Promise.reject(`请输入${content}`);
    if (value.length < 6) return Promise.reject(`${content}长度不能小于6位`);
    if (!PASSWORD_REG.test(value)) return Promise.reject(`${content}必须包含大写和小写、数字`);
    if (value.length > 18) return Promise.reject(`${content}长度不能大于18位`);
    if (type == 1) {
        if (value !== formState.confrimPassword && formState.confrimPassword) return Promise.reject('两次密码输入不一致，请重新输入');
    }
    if (type == 2) {
        if (value !== formState.password && formState.password) return Promise.reject('两次密码输入不一致，请重新输入');
    }
    if (type == 3) {
        if (value !== formState.oldPassword && formState.oldPassword) return Promise.reject('新密码不能与旧密码一样');
    }
    return Promise.resolve();
};
const formRules = computed<Record<string, Rule[]>>(() => ({
    password: [{ required: true, trigger: ['change', 'blur'], validator: validatePassword(1) }],
    confrimPassword: [{ required: true, trigger: ['change', 'blur'], validator: validatePassword(2) }],
    oldPassword: [{ required: true, trigger: ['change', 'blur'], validator: validatePassword(3) }],
}));
const handleOk = async () => {
    await formRef.value?.validate();
    loading.value = true;
    googleCodeRef.value?.handleShowDialog(true);
};
const handleCancel = () => {
    emits('update:open', false);
    formRef.value?.resetFields();
};
const validateGoogle = (code: string) => {
    if (formState.oldPassword == '') {
        // @ts-ignore
        delete formState.oldPassword;
    }
    api.sysUserUpdatePassword({
        ...formState,
        type: 2,
        facode: code,
    })
        .then(() => {
            emits('onSuccess');
            handleCancel();
            message.success(`${setPasswordTitle.value}成功`);
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
