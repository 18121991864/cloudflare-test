import temporary from '@/assets/images/icon-credentials.svg';
const policyManage = {
    path: '/strategyManage', // 策略管理
    name: 'strategyManage',
    redirect: 'noRedirect', // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
    component: () => import(/* webpackChunkName: "userManage" */ '@/Main.vue'),
    meta: { title: 'PolicyManagement', icon: temporary, role: 'strategyManage', requiresAuth: true },
    children: [
        {
            path: 'strategyList',
            name: 'strategyList',
            component: () => import(/* webpackChunkName: "userManage" */ '@/views/PolicyManage/PolicyMList/index.vue'),
            meta: { title: 'PolicyList', role: 'strategyList', requiresAuth: true },
        },
        {
            path: 'strategyAccountList',
            name: 'strategyAccountList',
            component: () => import(/* webpackChunkName: "userManage" */ '@/views/PolicyManage/UserPoliceList/index.vue'),
            meta: { title: 'UserPolicyList', role: 'strategyAccountList', requiresAuth: true },
        },
        {
            path: 'strategySignalHistory',
            name: 'strategySignalHistory',
            component: () => import(/* webpackChunkName: "userManage" */ '@/views/PolicyManage/StrategySignalHistory/index.vue'),
            meta: { title: 'strategySignalHistory', role: 'strategySignalHistory', requiresAuth: true },
        },
        {
            path: 'strategySignalLog',
            name: 'strategySignalLog',
            component: () => import(/* webpackChunkName: "userManage" */ '@/views/PolicyManage/StrategySignalLog/index.vue'),
            meta: { title: 'strategySignalLog', role: 'strategySignalLog', requiresAuth: true },
        },
        {
            path: 'strategyHistry',
            name: 'strategyHistry',
            component: () => import(/* webpackChunkName: "userManage" */ '@/views/PolicyManage/StrategyHistory/index.vue'),
            meta: { title: 'PolicyHistory', role: 'strategyHistry', requiresAuth: true },
        },
    ],
};
export default policyManage;
