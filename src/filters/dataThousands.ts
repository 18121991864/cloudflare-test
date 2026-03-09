import { App } from 'vue';
const THOUSANDS_REGULAR = /\B(?=(\d{3})+(?!\d))/g;
const NUMBER = /^\d+$/;
export function dataThousands(value: string) {
    const amountArr = String(value).split('.');
    // Handle the integer part
    const integerPart = amountArr[0];
    const decimalPart = amountArr[1] ? `.${amountArr[1]}` : '';

    if (NUMBER.test(integerPart)) {
        const formattedIntegerPart = integerPart.replace(THOUSANDS_REGULAR, ',');
        return formattedIntegerPart + decimalPart;
    }
    return value;
}

export default {
    install: (app: App): void => {
        const { $filters: filters } = app.config.globalProperties;
        if (process.env.NODE_ENV === 'development')
            console.warn('过滤器在当前版本已不受支持，查看迁移指南：', 'https://v3.vuejs.org/guide/migration/filters.html#migration-strategy');
        app.config.globalProperties.$filters = Object.assign(Object.create(null), filters, {
            dataThousands,
        });
    },
};
