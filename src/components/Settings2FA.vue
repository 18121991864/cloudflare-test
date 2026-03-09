<template>
    <a-modal
        :open="visible"
        :confirm-loading="isSubmitLoading"
        :cancel-text="t('cancel')"
        :ok-text="t('confirm')"
        :mask-closable="false"
        :after-close="() => {}"
        :cancel-button-props="{ disabled: isSubmitLoading }"
        :width="width"
        :footer="null"
        @cancel="$emit('onClose')"
        @ok="handelSubmit"
    >
        <template #title>{{ title }}</template>
        <template v-if="['add', 'edit'].includes(type)">
            <template v-if="next === 1">
                <a-form ref="formRef" class="form-list" :label-col="{ span: 3 }" hide-required-mark :rules="formRules" :model="formState">
                    <div class="title">{{ t('login.LoginPassword') }}</div>
                    <a-form-item label="" name="password">
                        <a-input-password
                            v-model:value="formState.password"
                            size="small"
                            :placeholder="t('login.PleaseEnterTheGoogleVerificationCode')"
                        />
                    </a-form-item>
                    <div v-if="type !== 'add'" class="title">{{ t('login.2FAVerification') }}</div>
                    <a-form-item v-if="type !== 'add'" label="" name="facode">
                        <a-input v-model:value="formState.facode" size="small" :placeholder="t('login.PleaseEnterTheGoogleVerificationCode')" />
                    </a-form-item>
                </a-form>
            </template>
            <template v-if="next === 2">
                <a-form class="form-list" :label-col="{ span: 9 }" hide-required-mark>
                    <div class="title">{{ t('login.EnterTheGoogleVerificationKey') }}</div>
                    <a-form-item label="">
                        <a-input
                            v-model:value="secretKey"
                            :disabled="true"
                            size="small"
                            :placeholder="t('login.PleaseEnterTheGoogleVerificationCode')"
                        />
                    </a-form-item>
                </a-form>
                <div class="qr-code-box">
                    <div class="title">{{ t('login.OrScanTheGoogleVerificationKeyQrCode') }}</div>
                    <div ref="qrcodeRef" class="qr-code-ref" style="margin: 0 auto">
                        <vue-qr :text="qrCode" logo-src="" :size="160"></vue-qr>
                    </div>
                </div>
            </template>
            <template v-if="next === 3">
                <a-form ref="formRef" class="form-list" :label-col="{ span: 3 }" hide-required-mark :rules="formRules" :model="formState">
                    <div class="title">{{ t('login.InputTheGoogleVerificationCode') }}</div>
                    <a-form-item label="" name="code">
                        <a-input-password
                            v-model:value="formState.code"
                            size="small"
                            :placeholder="t('login.PleaseEnterTheGoogleVerificationCode')"
                        />
                    </a-form-item>
                </a-form>
            </template>
        </template>
        <template v-else>
            <template v-if="next === 3">
                <a-form ref="formRef" class="form-list" :label-col="{ span: 3 }" hide-required-mark :rules="formRules" :model="formState">
                    <div class="title">
                        {{ t('login.InputTheGoogleVerificationCode') }}
                        <a-button class="paste-btn" type="link" @click.stop="onPaste">{{ t('login.Paste') }}</a-button>
                    </div>
                    <a-form-item label="" name="code">
                        <a-input v-model:value="formState.code" size="small" :placeholder="t('login.PleaseEnterTheGoogleVerificationCode')" />
                    </a-form-item>
                </a-form>
            </template>
            <template v-else>
                <a-form class="form-list" :label-col="{ span: 9 }" hide-required-mark>
                    <div class="title">{{ t('login.EnterTheGoogleVerificationKey') }}</div>
                    <a-form-item label="">
                        <a-input
                            v-model:value="secretKey"
                            :disabled="true"
                            size="small"
                            :placeholder="t('login.PleaseEnterTheGoogleVerificationCode')"
                        />
                    </a-form-item>
                </a-form>
                <div class="qr-code-box">
                    <div class="title">{{ t('login.OrScanTheGoogleVerificationKeyQrCode') }}</div>
                    <div ref="qrcodeRef" class="qr-code-ref" style="margin: 0 auto">
                        <vue-qr :text="qrCode" logo-src="" :size="160"></vue-qr>
                    </div>
                </div>
            </template>
        </template>
        <div class="btn-box">
            <template v-if="['add', 'edit'].includes(type)">
                <a-button v-if="next === 2" style="width: 100%" type="primary" @click="getQrcode">
                    {{ next === 2 ? t('login.ReGet') : '' }}
                </a-button>
                <a-button v-if="next === 3" style="width: 100%" type="primary" @click="next = 2">
                    {{ next === 3 ? t('login.PreviousStep') : '' }}
                </a-button>
                <a-button v-if="next === 1" :loading="isSubmitLoading" style="width: 100%" type="primary" @click="handelSubmit">
                    {{ next === 1 ? t('login.Verify') : '' }}
                    {{ next === 2 ? t('login.NextStep') : '' }}
                    {{ next === 3 ? t('login.Confirm') : '' }}
                </a-button>
                <a-button v-if="next === 2" :loading="isSubmitLoading" style="width: 100%" type="primary" @click="handelSubmit">
                    {{ next === 1 ? t('login.Verify') : '' }}
                    {{ next === 2 ? t('login.NextStep') : '' }}
                    {{ next === 3 ? t('login.Confirm') : '' }}
                </a-button>
                <a-button v-if="next === 3" :loading="isSubmitLoading" style="width: 100%" type="primary" @click="handelSubmit">
                    {{ next === 1 ? t('login.Verify') : '' }}
                    {{ next === 2 ? t('login.NextStep') : '' }}
                    {{ next === 3 ? t('login.Confirm') : '' }}
                </a-button>
            </template>
            <template v-else>
                <a-button style="width: 100%" type="primary" @click="next = 3" v-if="next === 1">{{ t('login.NextStep') }}</a-button>
                <div v-if="next === 3" class="flex w-full">
                    <a-button style="width: 100%" type="primary" @click="next = 1" class="mr-4" v-if="type !== 'login'">{{
                        t('login.PreviousStep')
                    }}</a-button>
                    <a-button style="width: 100%" type="primary" @click="validateGoogle">{{ t('login.Verify') }}</a-button>
                </div>
            </template>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { computed, reactive, ref, PropType, watch } from 'vue';
import { message } from 'ant-design-vue';
import { RuleObject } from 'ant-design-vue/es/form/interface';
import cookies from 'cookies-js';
import { useRouter } from 'vue-router';
import useSidebar from '@/store/sideBar';
import useUser from '@/store/user';
import api1 from '@/api/fetchTest/index';
import useTagsView from '@/store/tagsView';
import api from '@/api/userAPI/userList';
import vueQr from 'vue-qr/src/packages/vue-qr.vue';
import { handlePaste } from '@/utils/common';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const FormParams = {
    password: '', //
    code: null,
    facode: '',
};

const props = defineProps<{
    visible: boolean;
    type: 'add' | 'edit' | 'loginset' | 'login';
    activeData: object;
    width?: number;
}>();

const emit = defineEmits<{
    (e: 'onClose'): void;
    (e: 'onSuccess'): void;
}>();

const store = useSidebar();
const userStore = useUser();
const titles = [
    { type: 'add', title: t('login.Bind2FA') },
    { type: 'edit', title: t('login.Change2FA') },
    { type: 'loginset', title: t('login.SetUp2FA') },
    { type: 'login', title: t('login.Verify2FA') },
];
const { push } = useRouter();
const storeTagsView = useTagsView();
const formState = reactive({ ...FormParams });
const next = ref<number>(1);
const secretKey = ref<string>('');
const qrCode = ref<string>('');
const isSubmitLoading = ref<boolean>(false);
const formRef = ref<FormInstance>(Object.create(null) as FormInstance);
const onPaste = async () => {
    // code 粘贴事件
    //@ts-ignore
    formState.code = ((await handlePaste()) as string[]).join('');
};

const validateCode = (rule: RuleObject, value: string) => {
    if (value === '') {
        return Promise.reject(new Error(t('login.PleaseEnterTheSixDigitVerificationCode')));
    }
    const reg = /^[0-9]{6}$/;
    if (!reg.test(value)) {
        return Promise.reject(new Error(t('login.PleaseEnterTheSixDigitVerificationCode')));
    }
    return Promise.resolve();
};

const formRules = computed<Record<string, Rule[]>>(() => ({
    password: [{ required: true, trigger: 'blur', message: t('login.PleaseEnterTheLoginPassword') }],
    code: [{ validator: validateCode, trigger: 'blur', required: true }],
    '2FA': [{ validator: validateCode, trigger: 'blur', required: true }],
}));

const title = computed(() => {
    return titles.find((item) => item.type === props.type)?.title;
});

const getQrcode = () => {
    secretKey.value = '';
    qrCode.value = '';
    isSubmitLoading.value = true;
    api.fetchSysUserQrcode()
        .then((res) => {
            secretKey.value = res.secret;
            qrCode.value = res.qrcode;
            isSubmitLoading.value = false;
        })
        .finally(() => {
            isSubmitLoading.value = false;
        });
};

const handleAddOrUpdate = () => {
    if (isSubmitLoading.value) return;
    isSubmitLoading.value = true;
    const isApi1 = 'fetchSysUserCheckCipher';
    const isApi2 = 'fetchSysUserCheckCipherAnd2FA';
    const isApi3 = 'fetchSysUserCheckGoogleCodeAnd';
    const isParams = { ...formState };
    if (next.value === 1) {
        // @ts-ignore
        return api[props.type === 'add' ? isApi1 : isApi2]({ ...isParams, userId: userStore.userInfo?.userId })
            .then(() => {
                next.value = 2;
                getQrcode();
                isSubmitLoading.value = false;
            })
            .finally(() => {
                isSubmitLoading.value = false;
            });
    }
    if (next.value === 2) {
        next.value = 3;
        isSubmitLoading.value = false;
        return;
    }
    if (next.value === 3) {
        // @ts-ignore
        return api[isApi3]({ ...isParams })
            .then(() => {
                emit('onClose');
                message.success(`2FA${props.type === 'add' ? t('login.BindSuccessfully') : t('login.ChangeSuccessfully')}`);
                api1.loginOut().then(() => {
                    cookies.expire('walletToken');
                    storeTagsView.clearVisitedView();
                    push('/login');
                });
            })
            .finally(() => {
                isSubmitLoading.value = false;
            });
    }
};
const validateGoogle = () => {
    api.fetchSysUserCheckGoogleCode({
        googleCode: formState.code as any as string,
    }).then(() => {
        emit('onSuccess');
        message.success(t('login.VerificationSuccess'));
    });
};
const handelSubmit = async () => {
    if (next.value === 1) {
        formRef.value.validate().then(() => handleAddOrUpdate());
        return;
    }
    if (next.value === 2) {
        handleAddOrUpdate();
        return;
    }
    if (next.value === 3) {
        formRef.value.validate().then(() => handleAddOrUpdate());
    }
};
watch(
    () => props.visible,
    (visible) => {
        if (!visible) {
            next.value = 1;

            if (!formRef.value) return;
            if (!formRef.value.resetFields) return;

            formRef.value.resetFields();
            return;
        }
        if (['login', 'loginset'].includes(props.type)) {
            getQrcode();
            if (props.type === 'login') {
                next.value = 3;
            }
        }
    }
);
</script>

<style lang="scss" scoped>
.qr-code-box {
    .qr-code-ref {
        display: flex;
        justify-content: center;
    }
}
.title {
    font-weight: 600;
    margin-bottom: 12px;
}
.btn-box {
    display: flex;
    justify-content: space-between;
    gap: 32px;
    button {
        flex: 1;
    }
}
</style>
