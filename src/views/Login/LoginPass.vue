<template>
    <a-form ref="formRef" layout="vertical" :model="formState" :rules="formRules" :hide-required-mark="true" class="form-list form-login">
        <div class="flex-wrap-wrap">
            <WalletPassword
                v-model="formState.newPass"
                :input-props="{ placeholder: '请设定您的新登陆密码', size: 'small', maxLength: '15' }"
                :item-props="{ name: 'newPass', required: true }"
            >
                <template #prefix>
                    <img v-show="formState.newPass" class="icon-svg" src="../../assets/images/pass.svg" />
                </template>
            </WalletPassword>

            <a-form-item class="width-260" required has-feedback label="" name="password">
                <a-input
                    v-model:value="formState.password"
                    size="small"
                    type="password"
                    max-length="15"
                    placeholder="请再次确认您的新登录密码"
                    autocomplete="off"
                >
                    <template #prefix>
                        <img v-show="formState.password" class="icon-svg" src="../../assets/images/pass.svg" />
                    </template>
                </a-input>
            </a-form-item>
            <!--<a-form-item class="width-260" label="" name="code">
              <a-input-group compact>
                <a-input size="small" autocomplete="off" maxlength="6" class="code-input" v-model:value="formState.code" placeholder="请输入验证码" />
                <a-button type="link" size="small" class="original" :disabled="isSendBtn" @click.stop="handleSendCode">{{codeText}}</a-button>
              </a-input-group>
            </a-form-item>-->
            <a-form-item class="mt-16 width-260">
                <a-button size="small" type="primary" :loading="isLoading" block @click.stop="handleOnSubmit">重置密码 </a-button>
            </a-form-item>
        </div>
    </a-form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, computed, ComputedRef, onUnmounted, onBeforeMount } from 'vue';
import { RuleObject } from 'ant-design-vue/es/form/interface';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import NProgress from 'nprogress';
import { PASSWORD, SIX_NUMBER } from '@/utils/constant';
import api from '@/api/fetchTest/index';
import WalletPassword from '@/components/Wallet/Password.vue';

interface StateType {
    newPass: string;
    password: string;
    code: string;
}

let timer: number = 0,
    countDownCtrl: undefined | number;
export default defineComponent({
    name: 'LoginPass',
    components: { WalletPassword },
    setup() {
        const formRef = ref();
        const isLoading = ref<boolean>(false);
        const formState = reactive<StateType>({
            // 表单数据
            newPass: '',
            password: '',
            code: '',
        });
        const codeState = reactive<{ codeText: string; isCountDownBtn: boolean }>({
            // 验证码相关数据
            codeText: '发送验证码',
            isCountDownBtn: false,
        });

        const { push } = useRouter();

        const validateNewPass = async (rule: RuleObject, value: string) => {
            // 账户验证
            // eslint-disable-next-line prefer-promise-reject-errors
            if (value === '') return Promise.reject('请输入密码');

            // eslint-disable-next-line prefer-promise-reject-errors
            if (!PASSWORD.test(value)) return Promise.reject('请输入6-15位数字和大小写字母组成的密码');

            return Promise.resolve();
        };

        const validatePassword = async (rule: RuleObject, value: string) => {
            // 密码验证
            // eslint-disable-next-line prefer-promise-reject-errors
            if (value === '') return Promise.reject('请输入密码');

            // eslint-disable-next-line prefer-promise-reject-errors
            if (!PASSWORD.test(value)) return Promise.reject('请输入6-15位数字、大小写字母组成的密码');

            // eslint-disable-next-line prefer-promise-reject-errors
            if (formState.newPass !== value) return Promise.reject('两次密码输入不一致，请重新输入');

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

        const handleSendCode = () => {
            // 发送验证码的判断
            timer = 60;
            codeState.isCountDownBtn = true;
            api.getSetLoginPwdMsgCode()
                .then(() => {
                    message.success('验证码发送成功!');
                    countDownCtrl = window.setInterval(() => {
                        if (timer > 0) {
                            timer -= 1;
                            codeState.codeText = `${timer}后重发`;
                        } else {
                            codeState.isCountDownBtn = false;
                            codeState.codeText = '重新发送';
                            clearInterval(countDownCtrl);
                        }
                    }, 1000);
                })
                .catch(() => {
                    codeState.isCountDownBtn = false;
                });
        };

        const formRules = {
            // 验证规则
            // newPass: [{ validator: validateNewPass, trigger: 'blur', required: true }],
            password: [{ validator: validatePassword, trigger: 'blur', required: true }],
            // code: [{ validator: validateCode, trigger: 'blur', required: true }]
        };
        const handleOnSubmit = () => {
            // 提交表单数据
            formRef.value.validate().then(() => {
                NProgress.start();
                isLoading.value = true;
                const { password /* , code */ } = formState;
                api.setLoginPass({ password /* , code */ })
                    .then((r: PromiseReturnType<typeof api.setLoginPass>) => {
                        message.success('登陆密码设置成功!');
                        push('/');
                    })
                    .finally(() => {
                        NProgress.done();
                        isLoading.value = false;
                    });
            });
        };

        const isSendBtn: ComputedRef<boolean> = computed(() => {
            // 发送验证码按钮是否可点
            const { newPass, password } = formState;
            const { isCountDownBtn } = codeState;
            return !newPass || !password || isCountDownBtn || newPass !== password;
        });

        onBeforeMount(() => {
            document.onkeydown = (e) => {
                if (e.code === 'Enter') {
                    handleOnSubmit();
                }
            };
        });

        onUnmounted(() => {
            // 清除定时器
            clearInterval(countDownCtrl);
            document.onkeydown = null;
        });

        return {
            ...toRefs(codeState),
            formState,
            formRules,
            formRef,
            isLoading,
            isSendBtn,
            handleOnSubmit,
            handleSendCode,
        };
    },
});
</script>

<style lang="scss" scoped>
.form-list {
    .ant-input {
        background: #fff;
        height: 46px;
        border-radius: 4px;
        border: none !important;
    }

    .ant-btn-primary[disabled] {
        background: #6191f9;
        color: #fff;
        font-size: 16px;
    }

    .code-input {
        width: calc(100% - 85px);
        // background: (0, 0, 0, 0) !important;
    }

    .original {
        height: 46px;
        width: 86px;
    }
}
</style>
