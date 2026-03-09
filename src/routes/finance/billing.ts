import app from '@/assets/images/icon-app.svg';
const billingList = {
    path: '/billing',
    name: 'billing',
    redirect: 'noRedirect',
    component: () => import(/* webpackChunkName: "billing" */ '@/Main.vue'),
    meta: { title: '财务管理', icon: app, role: 'asset', requiresAuth: true },
    children: [
        // {
        //     path: 'coinPlatformAccounting',
        //     name: 'coinPlatformAccounting',
        //     component: () => import(/* webpackChunkName: "userAssetsJournal" */ '@/views/Billing/CoinPlatformAccounting.vue'),
        //     meta: { title: '平台币币账务', role: 'userAssetList', requiresAuth: true },
        // },
        {
            path: 'consumptionRecord',
            name: 'consumptionRecord',
            component: () => import(/* webpackChunkName: "userAssetsJournal" */ '@/views/Billing/ConsumptionRecord/index.vue'),
            meta: { title: '链上消耗记录', role: 'userAssetList', requiresAuth: true },
        },

    ],
};
export default billingList;
