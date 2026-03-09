import annualAudit from '@/assets/images/icon-annual-audit.svg';
const digitAssetList = {
    path: '/digitAsset',
    name: 'digitAsset',
    redirect: 'noRedirect',
    component: () => import(/* webpackChunkName: "digitAsset" */ '@/Main.vue'),
    meta: { title: '数字资产管理', icon: annualAudit, role: 'digitAsset', requiresAuth: false },

    children: [
        {
            path: 'coin',
            name: 'coin',
            component: () => import(/* webpackChunkName: "coin" */ '@/views/DigitalMange/Coin/index.vue'),
            meta: { title: '币种管理', role: 'coin', requiresAuth: true },
        },

        {
            path: 'address',
            name: 'address',
            component: () => import(/* webpackChunkName: "address" */ '@/views/DigitalMange/Address/index.vue'),
            meta: { title: '地址管理', role: 'address', requiresAuth: true },
        },
        {
            path: 'deposit',
            name: 'deposit',
            component: () => import(/* webpackChunkName: "deposit" */ '@/views/DigitalMange/DepositCoins/index.vue'),
            meta: { title: '充值', role: 'deposit', requiresAuth: true },
        },
        {
            path: 'withdrawCoins',
            name: 'withdrawCoins',
            component: () => import(/* webpackChunkName: "withdrawCoins" */ '@/views/DigitalMange/WithdrawCoins/index.vue'),
            meta: { title: '提币', role: 'withdrawCoins', requiresAuth: true },
        },
        {
            path: 'withdrawalPath',
            name: 'withdrawalPath',
            component: () => import(/* webpackChunkName: "withdrawLimitList" */ '@/views/DigitalMange/WithdrawalPath/index.vue'),
            meta: { title: '提币路径配置列表', role: 'withdrawalPath', requiresAuth: true },
        },
        {
            path: 'withdrawLimitList',
            name: 'withdrawLimitList',
            component: () => import(/* webpackChunkName: "withdrawLimitList" */ '@/views/DigitalMange/WithdrawLimit/index.vue'),
            meta: { title: '提币额度配置列表', role: 'withdrawLimitList', requiresAuth: true },
        },
        {
            path: 'withdrawCheckConfigList',
            name: 'withdrawCheckConfigList',
            component: () => import(/* webpackChunkName: "withdrawCheckConfigList" */ '@/views/DigitalMange/WithdrawCheck/index.vue'),
            meta: { title: '提币审核配置列表', role: 'withdrawCheckConfigList', requiresAuth: true },
        },
        {
            path: 'tronenergyOrder',
            name: 'tronenergyOrder',
            component: () => import(/* webpackChunkName: "rechargeRecords" */ '@/views/DigitalMange/TronenergyOrder/index.vue'),
            meta: { title: 'Tron能量订单', role: 'tronenergyOrder', requiresAuth: true },
        },
        {
            path: 'troAddressActivation',
            name: 'troAddressActivation',
            component: () => import(/* webpackChunkName: "rechargeRecords" */ '@/views/DigitalMange/TroAddressActivation/index.vue'),
            meta: { title: 'Tron地址激活', role: 'troAddressActivation', requiresAuth: true },
        },
    ],
};

export default digitAssetList;
