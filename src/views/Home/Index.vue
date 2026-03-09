<template>
    <div class="dashboard">
        <!-- 欢迎区域 -->
        <div class="welcome-container">
            <div class="welcome-card">
                <div class="welcome-content">
                    <h1>{{ greeting }} {{ fetchName }}</h1>
                    <p class="subtitle">{{ t('common.WelcomeToSmartClickManagementSystem', { name: 'Smart Click' }) }}</p>
                    <p class="platform-desc">{{ t('common.WalletAssetManagementPlatform') }}</p>
                </div>
                <div class="date-time">
                    <div class="date">{{ currentDate }}</div>
                    <div class="time">
                        {{ currentTime }}<span>:{{ currentMinute }}</span>
                        <span>:{{ currentSeconds }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import useUser from '@/store/user';
import i18n from '@/setup/i18n-setup';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const userStore = useUser();
const currentDate = ref('');
const currentTime = ref('');
const currentSeconds = ref('');
const currentMinute = ref<string | number>('0');
const currentHour = ref(0);
let timer: number | null = null;
let secondsTimer: number | null = null;
const fetchName: ComputedRef<string> = computed(() => userStore.userInfo?.fullName);
// 根据时间生成问候语
const greeting = computed(() => {
    if (currentHour.value >= 5 && currentHour.value < 12) {
        return t('common.GoodMorning');
    } else if (currentHour.value >= 12 && currentHour.value < 14) {
        return t('common.GoodAfternoon');
    } else if (currentHour.value >= 14 && currentHour.value < 18) {
        return t('common.GoodEvening');
    } else if (currentHour.value >= 18 && currentHour.value < 22) {
        return t('common.GoodNight');
    } else {
        return t('common.GoodNight');
    }
});

const updateDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    currentDate.value = now.toLocaleDateString(i18n.global.locale.value, options);
    currentTime.value = now.toLocaleTimeString(i18n.global.locale.value, { hour: '2-digit', minute: '2-digit' }).replace(/:\d{2}$/, '');
    currentHour.value = now.getHours();
    currentMinute.value = now.getMinutes() > 10 ? now.getMinutes() : `0${now.getMinutes()}`;
};

const updateSeconds = () => {
    const now = new Date();
    currentSeconds.value = now.getSeconds().toString().padStart(2, '0');
};

onMounted(() => {
    updateDateTime();
    updateSeconds();
    timer = window.setInterval(updateDateTime, 60000); // 每分钟更新一次
    secondsTimer = window.setInterval(updateSeconds, 1000); // 每秒更新一次
});

onBeforeUnmount(() => {
    if (timer) {
        clearInterval(timer);
    }
    if (secondsTimer) {
        clearInterval(secondsTimer);
    }
});
</script>

<style lang="scss" scoped>
// 颜色变量
$color-primary: #333333;
$color-primary-light: #555555;
$color-primary-dark: #111111;
$color-accent: #ff9050;
$color-accent-light: #ff9050;
$color-text-light: #ffffff;
$color-text-dark: #333333;
$color-text-secondary: #757575;
$color-background: #f8f9fa;
$color-card-bg: #ffffff;

// 基础样式
.dashboard {
    padding: 40px;
    background-color: $color-background;
    min-height: calc(100vh - 80px);
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
}

// 欢迎容器
.welcome-container {
    width: 100%;
    max-width: 1280px;
    margin: 0 auto;
}

// 欢迎卡片
.welcome-card {
    background: linear-gradient(135deg, $color-primary-dark, $color-primary);
    border-radius: 20px;
    padding: 50px;
    color: $color-text-light;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, $color-accent, $color-accent-light);
    }

    .welcome-content {
        position: relative;
        z-index: 1;

        h1 {
            font-size: 48px;
            font-weight: 700;
            margin: 0 0 20px 0;
            letter-spacing: 1px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

            &::after {
                content: '';
                display: block;
                width: 80px;
                height: 4px;
                background: $color-accent;
                margin-top: 15px;
            }
        }

        .subtitle {
            font-size: 28px;
            opacity: 0.9;
            margin: 0 0 10px 0;
            font-weight: 500;
        }

        .platform-desc {
            font-size: 18px;
            opacity: 0.7;
            margin: 0;
            font-weight: 300;
        }
    }

    .date-time {
        position: relative;
        z-index: 1;
        text-align: right;

        .date {
            font-size: 18px;
            margin-bottom: 16px;
            opacity: 0.8;
        }

        .time {
            font-size: 64px;
            font-weight: 700;
            letter-spacing: 2px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

            .seconds {
                font-size: 36px;
                opacity: 0.8;
                font-weight: 400;
            }
        }
    }
}

// 响应式调整
@media (max-width: 1200px) {
    .welcome-card {
        padding: 40px;

        .welcome-content {
            h1 {
                font-size: 42px;
            }

            .subtitle {
                font-size: 24px;
            }

            .platform-desc {
                font-size: 16px;
            }
        }

        .date-time {
            .date {
                font-size: 16px;
            }

            .time {
                font-size: 54px;

                .seconds {
                    font-size: 30px;
                }
            }
        }
    }
}

@media (max-width: 768px) {
    .dashboard {
        padding: 30px;
    }

    .welcome-card {
        flex-direction: column;
        align-items: flex-start;
        padding: 30px;

        .welcome-content {
            h1 {
                font-size: 36px;
                margin-bottom: 15px;

                &::after {
                    margin-top: 10px;
                }
            }

            .subtitle {
                font-size: 22px;
            }

            .platform-desc {
                font-size: 16px;
            }
        }

        .date-time {
            text-align: left;
            margin-top: 40px;
            width: 100%;

            .date {
                font-size: 16px;
            }

            .time {
                font-size: 48px;

                .seconds {
                    font-size: 28px;
                }
            }
        }
    }
}

@media (max-width: 480px) {
    .dashboard {
        padding: 20px;
    }

    .welcome-card {
        padding: 25px;

        .welcome-content {
            h1 {
                font-size: 28px;

                &::after {
                    width: 60px;
                    margin-top: 8px;
                }
            }

            .subtitle {
                font-size: 18px;
            }

            .platform-desc {
                font-size: 14px;
            }
        }

        .date-time {
            margin-top: 30px;

            .date {
                font-size: 14px;
                margin-bottom: 10px;
            }

            .time {
                font-size: 36px;

                .seconds {
                    font-size: 22px;
                }
            }
        }
    }
}
</style>
