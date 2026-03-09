import type { Locale } from '@intlify/core-base';
import { createI18n } from 'vue-i18n';
import http from 'axios';

// eslint-disable-next-line camelcase
import en_US from '../lang/en/index';
import zh_CN from '../lang/zh/index';
import ja_JP from '../lang/jp/index';
import cookies from 'cookies-js';

type MessageSchema = typeof en_US | typeof zh_CN;

const isProduction: boolean = process.env.NODE_ENV === 'production';
const localeDefault: string = cookies.get('lang') || 'en-US' || window.navigator.language;

const messages: {
    [key in 'en-US' | 'zh-CN' | 'ja-JP']: MessageSchema;
} = {
    // 语言包
    'en-US': en_US,
    'zh-CN': zh_CN,
    'ja-JP': ja_JP,
};

const languages: Locale[] = Object.keys(messages);

const fallbackLocale /* FallbackLocale */ = (
    languages.includes(localeDefault)
        ? localeDefault
        : languages.find((lan: string) => lan.indexOf(localeDefault.split('-')[0]) > -1) ?? localeDefault
) as keyof typeof messages;

const i18n = createI18n({
    locale: fallbackLocale, // 设置语言环境
    fallbackLocale, // 如果未找到key,需要回溯到语言包的环境
    silentTranslationWarn: isProduction, // 警告信息
    messages, // 设置语言环境信息
    legacy: false, // 是否不使用 composition-api 模式
    globalInjection: true, // 是否为每个组件注入全局属性和函数
});

export type LangKeyString = typeof fallbackLocale;

export const getI18nLanguage = (): LangKeyString => i18n.global.locale.value; // 获取语言

export function setI18nLanguage(lang: LangKeyString = fallbackLocale): Locale {
    // 设置规则：完全匹配 -> 模糊匹配 -> 默认语言
    const {
        global: { locale, availableLocales },
        mode,
    } = i18n;

    if (locale.value === lang) return lang; // 不允许重复设置语言
    lang = lang?.value ?? lang;
    const language: LangKeyString = availableLocales.includes(lang)
        ? lang
        : availableLocales.find((lan: Locale) => lan.indexOf(lang.split('-')[0]) > -1) ?? (localeDefault as LangKeyString);

    // set i18n
    if (i18n.mode === 'legacy') {
        i18n.global.locale.value = language;
    } else {
        (i18n.global.locale as unknown as WritableComputedRef<LangKeyString>).value = language;
    }

    http.defaults.headers.common['Accept-Language'] = language; // set http

    document.documentElement?.setAttribute('lang', language.split(/-/)[0]); // set html

    return language;
}

export default i18n;
