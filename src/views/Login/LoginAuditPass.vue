<template>
    <a-form ref="formRef" layout="vertical" :model="formState" :rules="formRules" :hide-required-mark="true" class="form-list">
        <div class="flex-wrap-wrap">
            <a-form-item class="width-260" required has-feedback label="新密码" name="newPass">
                <a-input v-model:value="formState.newPass" type="password" size="small" max-length="6" placeholder="请输入" autocomplete="off" />
            </a-form-item>
            <a-form-item class="width-260" required has-feedback label="确认密码" name="password">
                <a-input v-model:value="formState.password" size="small" type="password" max-length="6" placeholder="请输入" autocomplete="off" />
            </a-form-item>
            <a-form-item class="width-170" required has-feedback label="验证码" name="code">
                <a-input v-model:value="formState.code" size="small" max-length="6" class="width-170" autocomplete="off" placeholder="请输入验证码" />
            </a-form-item>
            <a-button type="primary" size="small" class="code-btn" :disabled="isSendBtn" @click.stop="handleSendCode">
                {{ codeText }}
            </a-button>
            <a-form-item class="mt-16 width-260">
                <a-button size="small" type="primary" :loading="isLoading" :disabled="isLoginBtn" block @click.stop="handleOnSubmit">登录 </a-button>
            </a-form-item>
        </div>
    </a-form>
    <!--<a-form
      ref="formRef"
      :model="formState"
      :layout="'vertical'"
      :rules="formRules"
      :hideRequiredMark="true">
      <a-form-item class="width-260" required has-feedback label="新密码" name="newPass">
        <a-input
          type="password"
          size="small"
          maxLength="6"
          placeholder="请输入"
          v-model:value="formState.newPass"
          autocomplete="off" />
      </a-form-item>
      <a-form-item class="width-260" required has-feedback label="确认密码" name="password">
        <a-input
          size="small"
          type="password"
          maxLength="6"
          placeholder="请输入"
          v-model:value="formState.password"
          autocomplete="off" />
      </a-form-item>
      <a-form-item class="width-170" required has-feedback label="验证码" name="code">
        <a-input
          size="small"
          maxLength="6"
          class="width-170"
          autocomplete="off"
          v-model:value="formState.code"
          placeholder="请输入验证码" />
      </a-form-item>
      <a-button
        type="primary"
        size="small"
        class="code-btn"
        :disabled="isSendBtn"
        @click.stop="handleSendCode">
        {{codeText}}
      </a-button>
      <a-form-item class="mt-16">
        <a-button
          size="small"
          type="primary"
          :loading="isLoading"
          :disabled="isLoginBtn"
          @click.stop="handleOnSubmit"
          block>
          登录
        </a-button>
      </a-form-item>
    </a-form>-->
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, computed, ComputedRef, onUnmounted, onBeforeMount } from 'vue';
import { RuleObject } from 'ant-design-vue/es/form/interface';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import NProgress from 'nprogress';
import { SIX_NUMBER } from '@/utils/constant';
import api from '@/api/fetchTest/index';

// import { useStore } from '@/store';

interface StateType {
    newPass: string;
    password: '';
    code: '';
}

let timer: number = 0,
    countDownCtrl: undefined | number;
export default defineComponent({
    name: 'LoginAuditPass',
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
        // const { state } = useStore();

        const validateNewPass = async (rule: RuleObject, value: string) => {
            // 账户验证
            // eslint-disable-next-line prefer-promise-reject-errors
            if (value === '') return Promise.reject('请输入密码');

            // eslint-disable-next-line prefer-promise-reject-errors
            if (!SIX_NUMBER.test(value)) return Promise.reject('请输入6位数字密码');

            return Promise.resolve();
        };
        const validatePassword = async (rule: RuleObject, value: string) => {
            // 密码验证
            // eslint-disable-next-line prefer-promise-reject-errors
            if (value === '') return Promise.reject('请输入密码');

            // eslint-disable-next-line prefer-promise-reject-errors
            if (!SIX_NUMBER.test(value)) return Promise.reject('请输入6位数字密码');

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
            /* api.fetchMsgCode({ codeType: '10' }).then(() => {
                message.success('验证码发送成功!');
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
            }); */
        };

        const formRules = {
            // 验证规则
            newPass: [{ validator: validateNewPass, trigger: 'blur', required: true }],
            password: [{ validator: validatePassword, trigger: 'blur', required: true }],
            code: [{ validator: validateCode, trigger: 'blur', required: true }],
        };
        const handleOnSubmit = () => {
            // 提交表单数据
            /* formRef.value.validate().then(() => {
                NProgress.start();
                isLoading.value = true;
                const { password, code } = formState;
                api.setExaminePassword({ password, code }).then(() => {
                    message.success('审核密码设置成功!');
                    push('/');
                }).finally(() => {
                    NProgress.done();
                    isLoading.value = false;
                });
            }); */
        };

        const isLoginBtn: ComputedRef<boolean> = computed(() => {
            // 登录按钮是否可点
            const { newPass, password, code } = formState;
            return !newPass || !password || !code || newPass !== password;
        });

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
            isLoginBtn,
            handleOnSubmit,
            handleSendCode,
        };
    },
});
</script>

<style lang="scss" scoped>
.mt-16 {
    margin-top: 16px;
}

.code-btn {
    position: absolute;
    height: 32px;
    margin-left: 10px;
}
</style>
