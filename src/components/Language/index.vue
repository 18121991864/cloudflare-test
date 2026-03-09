<script setup lang="ts">
import { getI18nLanguage, setI18nLanguage } from '@/setup/i18n-setup';
import { CaretDownOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue/es';
import cookies from 'cookies-js';
import useUser from '@/store/user';
const userStore = useUser();
const { t } = useI18n();
const route = useRoute();

// 语言列表
const langArr = [
    { lang: 'zh-CN', value: '中文', icon: 'icon-zhongwen' },
    { lang: 'en-US', value: 'EN', icon: 'icon-yingguo' },
    { lang: 'ja-JP', value: '日本語', icon: 'icon-ribenguoqi' },
    // { lang: 'ar-AE', value: 'اللغة العربية', icon: 'icon-alaboyu' },
    // { lang: 'ru-RU', value: 'Русский', icon: 'icon-eluosi' },
];

const setDirection = (direction: 'rtl' | 'ltr') => {
    document.documentElement.setAttribute('dir', direction);
};

const onLange = async (val: string) => {
    console.log(val);

    await setI18nLanguage(val as 'en-US' | 'zh-CN');
    cookies.set('lang', val);
    setDirection(val === 'ar-AE' ? 'rtl' : 'ltr');
    window.document.title = t(`common.${route.meta.title}`); // 动态修改窗口标题
    message.success(t('switchLanguageSuccess'));
};

// 语言文字
const formatLangText = computed(() =>
    langArr.find(({ lang }) => {
        return lang === getI18nLanguage();
    })
);
</script>

<template>
    <a-dropdown>
        <div class="flex items-center cursor-pointer">
            <!-- <a-button class="p-1.5 text-lg"> -->
            <div class="flex flex-row items-center select-text">
                <span><Icon :icon-type="formatLangText?.icon || 'icon-Vector'" class="lang-text" /></span>
                <span class="mx-2 lang-text-span" :style="{ color: userStore?.userInfo?.userId ? 'black' : 'white' }">
                    {{ formatLangText?.value || '--' }}
                </span>
                <CaretDownOutlined />
            </div>
            <!-- </a-button> -->
        </div>
        <template #overlay>
            <a-menu>
                <a-menu-item
                    v-for="item of langArr"
                    :key="item.lang"
                    :class="[item.lang === getI18nLanguage() ? 'bg-primary hover:bg-primary-700' : '']"
                    :style="{ color: item.lang === getI18nLanguage() ? '#FF9050' : 'black' }"
                    @click.stop="onLange(item.lang)"
                >
                    <div class="flex flex-row items-center w-full">
                        <Icon class="mr-2 text-2xl" :icon-type="item.icon" />
                        <span>{{ item.value }}</span>
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<style scoped>
.lang-text {
    font-size: 30px;
    vertical-align: -6px;
}
.select-text {
    font-size: 18px;
    color: #fff;
}
</style>
