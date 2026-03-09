<template>
    <a-form ref="formRef" layout="vertical" :model="formState" :rules="formRules" :hide-required-mark="true" class="form-list form-login">
        <div class="form-container">
            <transition name="fade">
                <div v-if="formError" class="form-error-message">
                    <a-alert type="error" :message="formError" banner closable @close="formError = ''" />
                </div>
            </transition>

            <div class="form-header">
                <div class="form-title">{{ t('login.AccountLogin') }}</div>
            </div>

            <div class="form-body">
                <a-form-item class="form-item" required has-feedback name="userAccount">
                    <a-input
                        v-model:value="formState.userAccount"
                        type="text"
                        :placeholder="t('login.PleaseEnterTheAccount')"
                        autocomplete="off"
                        @focus="handleInputFocus('account')"
                        @blur="handleInputBlur('account')"
                        :class="{ 'input-focused': focusedField === 'account' }"
                    >
                        <template #prefix>
                            <img class="icon-svg" src="../../assets/images/user.svg" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item class="form-item" required has-feedback name="password">
                    <a-input
                        v-model:value="formState.password"
                        :type="showPassword ? 'text' : 'password'"
                        :placeholder="t('login.PleaseEnterThePassword')"
                        autocomplete="off"
                        @focus="handleInputFocus('password')"
                        @blur="handleInputBlur('password')"
                        :class="{ 'input-focused': focusedField === 'password' }"
                    >
                        <template #prefix>
                            <img class="icon-svg" src="../../assets/images/pass.svg" />
                        </template>
                        <template #suffix>
                            <span class="password-toggle" @click="togglePasswordVisibility">
                                <svg
                                    v-if="showPassword"
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <svg v-else viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                                    <path
                                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                                    ></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            </span>
                        </template>
                    </a-input>
                </a-form-item>

                <div class="remember-me">
                    <a-checkbox v-model:checked="rememberMe">{{ t('login.RememberAccount') }}</a-checkbox>
                </div>

                <a-form-item class="form-item">
                    <a-button
                        class="login-btn"
                        type="primary"
                        :loading="isLoading"
                        :disabled="isLoginBtn"
                        block
                        @click.stop="handleOnSubmit"
                        @mouseenter="buttonHover = true"
                        @mouseleave="buttonHover = false"
                        :class="{ 'button-hover': buttonHover }"
                    >
                        <span>{{ t('login.Login') }}</span>
                    </a-button>
                </a-form-item>
            </div>
        </div>
    </a-form>
    <Settings2FA :visible="is2FAModalOpen" :type="modalType" :active-data="{}" @onClose="is2FAModalOpen = false" @onSuccess="onSuccess" />
    <GoogleCode ref="googleCodeRef" @setCodeVal="validateGoogle" />
    <!-- <SettingsPassword
        :visible="isPassWordModalOpen"
        :type="'init'"
        :active-data="{}"
        @onClose="isPassWordModalOpen = false"
        @onSuccess="$router.push('/')"
    /> -->
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, ComputedRef, computed, onBeforeMount, onUnmounted } from 'vue';
import { RuleObject } from 'ant-design-vue/es/form/interface';
import { message, notification } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import cookies from 'cookies-js';
import NProgress from 'nprogress';
import { SIX_NUMBER } from '@/utils/constant';
import useEncryption from '@/store/encryption';
import api from '@/api/fetchTest/index';
import userAPI from '@/api/userAPI/userList';
import Settings2FA from '@/components/Settings2FA.vue';
import GoogleCode from '@/components/Dialog/GoogleCode.vue';
// import SettingsPassword from '@/components/SettingsPassword.vue';
import { useI18n } from 'vue-i18n';
// let timer: number = 0,
//     countDownCtrl: undefined | number;
export default defineComponent({
    name: 'Login',
    setup(props, { emit }) {
        const formRef = ref();
        const isLoading = ref<boolean>(false);
        const rememberMe = ref<boolean>(false);
        const formError = ref<string>('');
        const focusedField = ref<string | null>(null);
        const showPassword = ref<boolean>(false);
        const buttonHover = ref<boolean>(false);
        const { t } = useI18n();

        // 从本地存储中获取保存的账号
        const savedAccount = localStorage.getItem('walletRememberAccount');

        const formState = reactive<{ userAccount: string; password: string; facode: string; code: string }>({
            // 表单数据
            userAccount: savedAccount || '',
            password: '',
            code: '',
            facode: '',
        });

        // 如果有保存的账号，设置记住账号为true
        if (savedAccount) {
            rememberMe.value = true;
        }
        const configRef = ref<PromiseReturnType<typeof api.sysUserLogin>>();
        const googleCodeRef = ref<InstanceType<typeof GoogleCode>>();
        const codeState = reactive<{ codeText: string; isCountDownBtn: boolean }>({
            // 验证码相关数据
            codeText: '发送验证码',
            isCountDownBtn: false,
        });
        const isPassWordModalOpen = ref<boolean>(false);
        const store = useEncryption();
        const { push } = useRouter();

        const validateUserAccount = async (rule: RuleObject, value: string) => {
            // 账户验证
            // eslint-disable-next-line prefer-promise-reject-errors
            if (value === '') return Promise.reject(t('login.PleaseEnterTheAccount'));

            return Promise.resolve();
        };

        const validatePassword = async (rule: RuleObject, value: string) => {
            // 密码验证
            // eslint-disable-next-line prefer-promise-reject-errors
            if (value === '') return Promise.reject(t('login.PleaseEnterThePassword'));

            // eslint-disable-next-line prefer-promise-reject-errors
            // if (!PASSWORD.test(value)) return Promise.reject('请输入6-15位数字和大小写字母组成的密码');
            return Promise.resolve();
        };

        const validateCode = async (rule: RuleObject, value: string) => {
            // 验证码验证
            // eslint-disable-next-line prefer-promise-reject-errors
            if (value === '') return Promise.reject('请输入验证码');

            // eslint-disable-next-line prefer-promise-reject-errors
            if (!SIX_NUMBER.test(value)) return Promise.reject('请输入6位整数验证码');

            return Promise.resolve();
        };
        const is2FAModalOpen = ref<boolean>(false);
        const modalType = ref<'add' | 'edit' | 'loginset' | 'login'>('login');
        const change2FA = (type: 'edit' | 'add' | 'loginset' | 'login') => {
            [is2FAModalOpen.value] = [true];
            // googleCodeRef.value?.handleShowDialog(true);
            [modalType.value] = [type];
        };
        const handleClose2FAModal = () => {
            console.log(22);

            // 关闭弹框
            [is2FAModalOpen.value] = [false];
        };
        const handleSendCode = () => {
            // 发送验证码的判断
            /* if (formState.userAccount !== '') {
                timer = 60;
                codeState.isCountDownBtn = true;
                api.getLoginMsgCode({ account: formState.userAccount }).then(() => {
                    message.success('验证码已发送');
                    countDownCtrl = window.setInterval(() => {
                        if (timer > 0) {
                            timer -= 1;
                            codeState.codeText = String(timer);
                        } else {
                            codeState.isCountDownBtn = false;
                            codeState.codeText = '重新发送';
                            clearInterval(countDownCtrl);
                        }
                    }, 1000);
                }).catch(() => {
                    codeState.isCountDownBtn = false;
                });
            } else {
                message.warning('请输入登录账号');
            } */
        };

        const formRules = {
            // 验证规则
            userAccount: [{ validator: validateUserAccount, trigger: 'blur', required: true }],
            password: [{ validator: validatePassword, trigger: 'blur', required: true }],
            // facode: [{ validator: validateCode, trigger: 'blur', required: true }],
            // code: [{ validator: validateCode, trigger: 'blur', required: true }],
        };
        // 输入框聚焦处理
        const handleInputFocus = (field: string): void => {
            focusedField.value = field;
        };

        // 输入框失焦处理
        const handleInputBlur = (field: string): void => {
            if (focusedField.value === field) {
                focusedField.value = null;
            }
        };

        // 切换密码可见性
        const togglePasswordVisibility = (): void => {
            showPassword.value = !showPassword.value;
        };

        const handleOnSubmit = (): void => {
            // 提交表单数据
            formRef.value
                .validate()
                .then(async () => {
                    NProgress.start();
                    formError.value = ''; // 清除之前的错误信息
                    isLoading.value = true;

                    // 如果记住账号，保存到本地存储
                    if (rememberMe.value) {
                        localStorage.setItem('walletRememberAccount', formState.userAccount);
                    } else {
                        localStorage.removeItem('walletRememberAccount');
                    }

                    const { userAccount, password, facode } = formState;
                    store.userInfo.account = userAccount;

                    try {
                        const r = await api.sysUserLogin({ account: userAccount, password, facode });
                        configRef.value = r;

                        if (r.passwordError && r.passwordErrorNum <= 3) {
                            formError.value = t('login.PasswordError');
                            return;
                        }

                        if (r.token) cookies.set('walletToken', r.token);

                        if (r.googleState == 2) {
                            is2FAModalOpen.value = true;
                            modalType.value = 'loginset';
                        } else if (r.googleState == 1) {
                            googleCodeRef.value?.handleShowDialog(true);
                            modalType.value = 'login';
                        }

                        if (r.passwordErrorNum > 3) {
                            if (r.initLogin) return emit('editStatus', 'initPass');

                            formError.value = t('login.PasswordErrorNum');
                            notification.warning({
                                message: t('login.Tip'),
                                description: t('login.PasswordErrorNum'),
                                placement: 'topLeft',
                            });
                        }
                    } catch (error) {
                        formError.value = t('login.LoginFailed');
                        console.error('Login error:', error);
                    } finally {
                        NProgress.done();
                        isLoading.value = false;
                    }
                })
                .catch((errors) => {
                    // 表单验证失败
                    const errorFields = Object.keys(errors.fields || {});
                    if (errorFields.includes('userAccount')) {
                        formError.value = t('login.PleaseEnterTheAccount');
                    } else if (errorFields.includes('password')) {
                        formError.value = t('login.PleaseEnterThePassword');
                    }
                });
        };
        const handleResetForm = () => {
            // 重置表单
            formRef.value.resetFields();
        };

        const isLoginBtn: ComputedRef<boolean> = computed(() => {
            // 发送验证码按钮是否可点
            const { userAccount, password } = formState;
            return !userAccount || !password;
        });

        const isSendBtn: ComputedRef<boolean> = computed(() => {
            // 发送验证码按钮是否可点
            const { userAccount, password } = formState;
            const { isCountDownBtn } = codeState;
            return !userAccount || !password || isCountDownBtn;
        });

        onUnmounted(() => {
            // 清除定时器
            // clearInterval(countDownCtrl);
            document.onkeydown = null;
        });
        const onSuccess = () => {
            // is2FAModalOpen.value = false;
            // if (configRef.value?.initLogin) {
            //     isPassWordModalOpen.value = true;
            //     return false;
            // }
            push('/');
        };
        const validateGoogle = (googleCode: string) => {
            userAPI
                .fetchSysUserCheckGoogleCode({
                    googleCode: googleCode,
                })
                .then(() => {
                    onSuccess();
                    message.success(t('login.VerificationSuccess'));
                });
        };
        return {
            formRef,
            formState,
            formRules,
            isSendBtn,
            isLoading,
            isLoginBtn,
            rememberMe,
            formError,
            focusedField,
            showPassword,
            buttonHover,
            handleInputFocus,
            handleInputBlur,
            togglePasswordVisibility,
            handleOnSubmit,
            handleSendCode,
            handleResetForm,
            is2FAModalOpen,
            googleCodeRef,
            modalType,
            change2FA,
            handleClose2FAModal,
            onSuccess,
            validateGoogle,
            isPassWordModalOpen,
            t,
        };
    },
});
</script>

<style lang="scss" scoped>
// 颜色变量 - 简约设计
$color-primary: #ff9050;
$color-text-primary: #ffffff;
$color-text-secondary: #a0a0a0;
$color-text-muted: #666666;
$color-bg-primary: #ffffff;
$color-bg-secondary: #f8f9fa;
$color-bg-input: #ffffff;
$color-border: #e1e5e9;
$color-border-focus: #007bff;
$color-shadow: rgba(0, 0, 0, 0.1);
$color-shadow-light: rgba(0, 0, 0, 0.05);
.login-btn {
    height: 52px;
    border-radius: 8px;
    background: $color-primary;
    border: none;
    font-weight: 500;
    font-size: 16px;
    color: $color-text-primary;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba($color-primary, 0.25);
    transition: all 0.3s ease;
    margin-top: 20px;
    cursor: pointer;

    &:hover {
        background: lighten($color-primary, 5%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba($color-primary, 0.35);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba($color-primary, 0.2);
    }

    span {
        font-size: 16px;
    }
}

.form-container {
    width: 100%;
    max-width: 380px;
}

.form-header {
    margin-bottom: 32px;
    text-align: center;
}

.form-title {
    font-size: 24px;
    font-weight: 400;
    color: $color-text-primary;
    margin-bottom: 0;
    letter-spacing: 0.5px;
}

.form-body {
    width: 100%;
}

.form-item {
    margin-bottom: 24px;
    width: 100%;
}

.form-list {
    width: 100%;

    .ant-form-item {
        margin-bottom: 24px;
    }

    .ant-input {
        background: rgba(255, 255, 255, 0.95);
        height: 48px;
        border-radius: 6px;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        color: #333333;
        transition: all 0.3s ease;
        padding: 0 16px;
        box-sizing: border-box;
        width: 100%;
        font-size: 15px;
        font-weight: 400;
        backdrop-filter: blur(10px);

        &:focus,
        &:hover {
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        &::placeholder {
            color: #999999;
            font-weight: 400;
        }
    }

    .ant-input-affix-wrapper {
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 6px;
        transition: all 0.3s ease;
        padding: 0 8px;
        height: 48px;
        width: 100%;
        display: flex;
        align-items: center;
        overflow: hidden;
        backdrop-filter: blur(10px);

        &:focus,
        &:hover,
        &-focused {
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(255, 255, 255, 0.5) !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .ant-input {
            background: transparent;
            border: none !important;
            box-shadow: none !important;
            height: 100%;
            color: #333333;
            padding: 0;
            font-size: 15px;
            font-weight: 400;
        }

        .ant-input-prefix {
            margin: 0 12px 0 16px;
            display: flex;
            align-items: center;
        }
        :deep(.ant-input-suffix) {
            margin-right: 16px;
            display: flex;
            align-items: center;
        }
    }

    .ant-btn-primary[disabled] {
        background: $color-primary;
        color: rgba(255, 255, 255, 1);
        font-size: 16px;
        box-shadow: none;
        cursor: not-allowed;
    }

    .icon-svg {
        width: 18px;
        height: 18px;
        margin: 0;
        opacity: 0.7;
        transition: all 0.3s ease;
    }

    .ant-form-item-explain-error {
        color: #ff4757;
        font-size: 13px;
        margin-top: 6px;
        font-weight: 400;
    }
}

// 添加记住密码选项样式
.remember-me {
    display: flex;
    align-items: center;
    margin-bottom: 28px;

    .ant-checkbox-wrapper {
        color: rgba(255, 255, 255, 0.9);
        user-select: none;
        font-weight: 400;
        font-size: 14px;
        transition: all 0.3s ease;

        .ant-checkbox-checked .ant-checkbox-inner {
            background-color: $color-primary;
            border-color: $color-primary;
        }

        .ant-checkbox-inner {
            border-color: rgba(255, 255, 255, 0.3);
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            transition: all 0.3s ease;

            &:hover {
                border-color: rgba(255, 255, 255, 0.5);
            }
        }

        &:hover {
            color: rgba(255, 255, 255, 1);
        }
    }
}

// 表单错误消息样式
.form-error-message {
    width: 100%;
    margin-bottom: 20px;

    .ant-alert {
        // background-color: rgba(255, 71, 87, 0.1);
        border: 1px solid rgba(255, 71, 87, 0.2);
        border-radius: 6px;
        backdrop-filter: blur(10px);

        .ant-alert-message {
            color: #ff4757;
            font-weight: 400;
        }
    }
}

// 密码可见性切换按钮
.password-toggle {
    cursor: pointer;
    color: #666666;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    transition: all 0.3s ease;

    &:hover {
        color: #333333;
    }
}

// 输入框聚焦效果
.input-focused {
    border-color: rgba(255, 255, 255, 0.5) !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

// 按钮悬停效果
.button-hover {
    transform: translateY(-1px);
}

// 添加表单元素的过渡动画
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
