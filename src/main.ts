import { createApp } from 'vue';
import { message } from 'ant-design-vue/lib/index.js';
import { createFromIconfontCN } from '@ant-design/icons-vue';
import dataThousands from '@/filters/dataThousands';
import tabsBtnRole from '@/filters/tabsBtnRole';
import { setGlobalOptions } from 'vue-request';
import { menuMixin } from '@/mixins/menuMixin';
import treeMenu from '@/hooks/treeMenu';
import { hasBtm } from '@/directives/hasBtm';
import timezone from 'dayjs/plugin/timezone';
import router from './setup/router-setup';
import i18n from './setup/i18n-setup';
import AppComponent from './App.vue';
import utc from 'dayjs/plugin/utc';
import useUser from '@/store/user';
import pinia from './store/Index';
import dayjs from 'dayjs';

import 'nprogress/nprogress.css';
import 'ant-design-vue/dist/reset.css';
import './assets/stylesheet/global.scss';
import './assets/stylesheet/common.scss';
import './assets/stylesheet/cover.scss';
import 'tailwindcss/tailwind.css';

const userStore = useUser();

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai'); // 设置时区为上海，东八区，UTC + 8

setGlobalOptions({
    pagination: {
        currentKey: 'pageNo',
        pageSizeKey: 'pageSize',
        totalKey: 'totalSize',
        totalPageKey: 'totalPages',
    },
});

// 配置icon
const IconFont = createFromIconfontCN({ scriptUrl: '//at.alicdn.com/t/font_2554033_p7hji4t9gh.js' });
const app = createApp(AppComponent);
app.config.globalProperties.$is2FA = () => {
    if (userStore.userInfo?.isFACode === 0) {
        message.warning('请绑定2FA再操作');
        return false;
    }
    return true;
};

app.use(treeMenu)
    .use(i18n)
    .mixin(menuMixin)
    .use(router)
    .use(treeMenu)
    .use(pinia)

    .use(dataThousands)
    .use(tabsBtnRole)
    .component('IconFont', IconFont)
    .directive('hasBtm', hasBtm)
    .mount('#app');
