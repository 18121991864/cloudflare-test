<template>
    <div class="login-container">
        <div class="login-overlay">
            <div class="language-box">
                <Language />
            </div>

            <img class="logo" src="../../assets/images/logo.png" alt="Logo" />
            <!-- 品牌信息 -->
            <div class="brand-info">
                <!-- <img class="logo" src="../../assets/images/logo.png" alt="Logo"> -->
                <h1 class="system-name">Smart Click {{ t('login.SmartClickManagementSystem') }}</h1>
                <p class="brand-slogan">{{ t('login.SafeAndReliableBlockchainForm') }}</p>
            </div>

            <!-- 登录表单区 -->
            <div class="login-form-container">
                <div class="login-form">
                    <div class="login-box">
                        <h2 class="login-title">{{ t('login.AdminLogin') }}</h2>
                        <Login v-if="isStatus === 'login'" @editStatus="fetchStatus" />
                        <LoginPass v-if="isStatus === 'initPass'" />
                    </div>
                    <p class="copyright">Copyright © {{ dayjs().startOf('year').format('YYYY') }} Smart Click Admin System</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import dayjs from 'dayjs';
import { CopyrightOutlined } from '@ant-design/icons-vue';
import Login from './Login.vue';
import LoginPass from './LoginPass.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: 'LoginIndex',
    components: { Login, LoginPass /* , CopyrightOutlined */ },
    setup() {
        const isStatus = ref<string>('login');
        const { t } = useI18n();
        const fetchStatus = (val: string): void => {
            isStatus.value = val;
        };

        return {
            dayjs,
            isStatus,
            fetchStatus,
            t,
        };
    },
});
</script>

<style lang="scss" scoped>
// 全局变量定义 - 橙色主题
$color-primary: #ff9050;
$color-primary-dark: #ff7a33;
$color-primary-light: #ffa366;
$color-secondary: #ff6b1a;
$color-accent: #ffb380;
$color-black: #1a1a1a;
$color-dark-gray: #2a2a2a;
$color-light-gray: #cccccc;
$color-white: #ffffff;
$color-bg-dark: #0f0f0f;

// 登录页面容器
.login-container {
    height: 100vh;
    width: 100%;
    position: relative;
    min-width: 1200px;
    font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
    overflow: scroll;
    // background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 25%, rgba(255, 144, 80, 0.05) 50%, #1a1a1a 75%, #0f0f0f 100%);
    background: #000;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 20% 80%, rgba($color-primary, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba($color-secondary, 0.08) 0%, transparent 50%);
        pointer-events: none;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('../../assets/images/login-bg.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        opacity: 0.1;
        pointer-events: none;
    }
}

// 半透明遮罩层
.login-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // display: flex;
    // flex-direction: column;
    // align-items: center;
    // justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(1px);
    overflow: scroll;
}

// 品牌信息样式
.brand-info {
    text-align: center;
    animation: fadeInDown 1.2s ease-out;
    position: relative;
    z-index: 2;
    top: 30px;
    left: 0;
}

.logo {
    position: absolute;
    left: 30px;
    top: 30px;
    width: 160px;
    display: block;
    filter: drop-shadow(0 4px 8px rgba($color-primary, 0.3));
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }
}

.system-name {
    font-size: 42px;
    font-weight: 700;
    background: linear-gradient(135deg, $color-primary 0%, $color-primary-light 50%, $color-accent 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 20px;
    // letter-spacing: 3px;
    text-shadow: 0 0 30px rgba($color-primary, 0.5);
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 3px;
        background: linear-gradient(90deg, transparent, $color-primary, transparent);
        border-radius: 2px;
    }
}

.brand-slogan {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 15px;
    text-shadow: 0 2px 8px rgba($color-primary, 0.2);
    font-weight: 300;
    letter-spacing: 1px;
}

// 登录表单容器
.login-form-container {
    display: flex;
    justify-content: center;
    width: 100%;
    animation: fadeInUp 1.2s ease-out 0.3s both;
    position: relative;
    z-index: 2;
    top: 10%;
}

.login-form {
    width: 440px;
    // background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    padding: 48px 40px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2);
    // backdrop-filter: blur(20px);
    // -webkit-backdrop-filter: blur(20px);
    position: relative;
    overflow: scroll;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        border-radius: 16px;
        pointer-events: none;
    }
}

.login-title {
    font-size: 26px;
    font-weight: 400;
    color: #ff9050;
    margin-bottom: 32px;
    text-align: center;
    position: relative;
}

.login-box {
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
}

.copyright {
    font-size: 13px;
    line-height: 18px;
    color: #999999;
    text-align: center;
    margin-top: 32px;
    user-select: none;
    font-weight: 300;
}

// 动画效果
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// 简化动画效果

// 响应式布局
@media (max-width: 1024px) {
    .login-container {
        min-width: 800px;
    }
}

@media (max-width: 768px) {
    .login-container {
        min-width: 100%;
        padding: 20px;
    }

    .login-form {
        width: 90%;
        max-width: 420px;
        padding: 40px 35px;
    }

    .system-name {
        font-size: 32px;
        letter-spacing: 2px;
    }

    .logo {
        width: 120px;
        left: 20px;
        top: 20px;
    }
}

@media (max-width: 480px) {
    .brand-info {
        margin-bottom: 30px;
    }

    .system-name {
        font-size: 28px;
        letter-spacing: 1px;
    }

    .brand-slogan {
        font-size: 16px;
    }

    .login-form {
        padding: 30px 25px;
        border-radius: 15px;
    }

    .logo {
        width: 100px;
        left: 15px;
        top: 15px;
    }
}
.language-box {
    position: absolute;
    top: 3%;
    right: 4%;
    z-index: 999;
}
</style>
