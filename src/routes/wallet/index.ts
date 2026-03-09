import temporary from '@/assets/images/icon-annual-audit.svg';

export default {
    path: '/walletManage',
    name: 'walletManage',
    redirect: 'noRedirect',
    component: () => import(/* webpackChunkName: "user" */ '@/Main.vue'),
    meta: { title: '钱包管理', icon: temporary, role: 'asset', requiresAuth: true },
    children: [
        {
            path: 'wallet-setup',
            name: 'wallet-setup',
            component: () => import(/* webpackChunkName: "wallet-setup" */ '@/views/Wallet/Setup/Index.vue'),
            meta: { title: '钱包设置', role: 'wallet-setup', requiresAuth: true },
        },
    ],
};
