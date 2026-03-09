<script setup lang="ts">
import { getI18nLanguage } from '@/setup/i18n-setup';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import enUS from 'ant-design-vue/es/locale/en_US';
import ja_JP from 'ant-design-vue/es/locale/ja_JP';
import { computed, onBeforeMount } from 'vue';
import i18n from './setup/i18n-setup';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import 'dayjs/locale/ja';
import dayjs from 'dayjs';
import { startCheckVesion } from './utils/checkVesion';

const renderKey = computed(() => `app-key-${i18n.global.locale.value}-${Math.random()}`);

const currLang = computed(() => {
    const localeMap = new Map([
        ['zh-CN', zhCN],
        ['en-US', enUS],
        ['ja-JP', ja_JP],
    ]);
    return localeMap.get(i18n.global.locale.value);
}); // antd-vue国际化语言key

onBeforeMount(() => {
    const localeMap = new Map([
        ['zh-CN', 'zh-cn'],
        ['en-US', 'en'],
        ['ja-JP', 'ja'],
    ]);

    dayjs.locale(localeMap.get(getI18nLanguage()));
});
onMounted(() => {
    if (import.meta.env.PROD) {
        startCheckVesion();
    }
});
</script>

<template>
    <div id="app">
        <a-config-provider
            :locale="currLang"
            :theme="{
                token: {
                    colorPrimary: '#FF9050',
                },
                components: {
                    Menu: {
                        colorPrimary: '#000',
                        colorItemBg: '#000',
                        colorText: '#fff',
                        colorItemText: '#fff',
                        colorItemBgHover: '#FF9050',
                        colorItemBgSelected: '#fff',
                        colorItemTextHover: '#fff',
                        colorItemTextSelected: '#FF9050',
                    },
                },
            }"
        >
            <transition name="fade" mode="out-in" appear>
                <router-view :key="renderKey" />
            </transition>
        </a-config-provider>
    </div>
</template>

<style lang="scss">
#app {
    width: 100%;
    min-height: 100%;
    min-width: 1200px;
    background: #f5f6f8;

    /* min-width: 1310px; */
}
</style>
<style lang="scss" scoped>
@import url('@/assets/stylesheet/transition.scss');
</style>
