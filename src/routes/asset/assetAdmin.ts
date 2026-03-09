import temporary from '@/assets/images/icon-temporary.svg';
const assetList = {
    path: '/asset',
    name: 'asset',
    redirect: 'noRedirect',
    component: () => import(/* webpackChunkName: "asset" */ '@/Main.vue'),
    meta: { title: '资产管理', icon: temporary, role: 'asset', requiresAuth: true },
    children: [
        {
            path: 'userAssetList',
            name: 'userAssetList',
            component: () => import(/* webpackChunkName: "userAssetList" */ '@/views/Asset/UserAssetList/index.vue'),
            meta: { title: '用户资产', role: 'userAssetList', requiresAuth: true },
        },
        {
            path: 'AMLAssetList',
            name: 'AMLAssetList',
            component: () => import(/* webpackChunkName: "userAssetList" */ '@/views/Asset/AMLAssetList/index.vue'),
            meta: { title: 'AML资产', role: 'AMLAssetList', requiresAuth: true },
        },
        {
            path: 'AddressAssetList',
            name: 'AddressAssetList',
            component: () => import(/* webpackChunkName: "userAssetList" */ '@/views/Asset/AddressAssetList/index.vue'),
            meta: { title: '地址资产', role: 'AddressAssetList', requiresAuth: true },
        },
    ],
};
export default assetList;
