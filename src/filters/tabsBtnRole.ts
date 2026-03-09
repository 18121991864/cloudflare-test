import type { App } from 'vue';
import { storeToRefs } from "pinia";
import sideBar from "@/store/sideBar";

export function isShowTabsBtn(btnRole: string): boolean {
    const { roleMenu } = storeToRefs(sideBar());
    return roleMenu.value.findIndex(({ component }) => component === btnRole) > 0;
}

export default {
    install: (app: App): void => {
        const { $filters: filters } = app.config.globalProperties;
        if (process.env.NODE_ENV === 'development') console.warn('过滤器在当前版本已不受支持，查看迁移指南：', 'https://v3.vuejs.org/guide/migration/filters.html#migration-strategy');
        app.config.globalProperties.$filters = Object.assign(Object.create(null), filters, { isShowTabsBtn });
    }
};
