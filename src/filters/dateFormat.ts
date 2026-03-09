import { App } from 'vue';
import dayjs from 'dayjs';

export function timeStampToDate(timeStamp: string | number, reg: string = 'YYYY-MM-DD HH:mm:ss'): string { // 时间戳转时间
    if (!timeStamp) return '';
    return dayjs(timeStamp).format(reg);
}

export default {
    install: (app: App): void => {
        const { $filters: filters } = app.config.globalProperties;
        if (process.env.NODE_ENV === 'development') console.warn('过滤器在当前版本已不受支持，查看迁移指南：', 'https://v3.vuejs.org/guide/migration/filters.html#migration-strategy');
        app.config.globalProperties.$filters = Object.assign(Object.create(null), filters, {
            timeStampToDate
        });
    }
};
