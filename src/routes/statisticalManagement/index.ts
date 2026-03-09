import temporary from '@/assets/images/icon-statisticalManagement.svg';


const statisticalManagement = {
    path: '/statisticalManagement', // 统计管理
    name: 'statisticalManagement',
    redirect: 'noRedirect', // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
    component: () => import(/* webpackChunkName: "userManage" */ '@/Main.vue'),
    meta: { title: 'StatisticalManagement', icon: temporary, role: 'statisticalManagement', requiresAuth: true },
    children: [
        {
            path: 'revenueStatistics',
            name: 'revenueStatistics',
            component: () => import(/* webpackChunkName: "userManage" */ '@/views/StatisticalManagement/RevenueStatistics/index.vue'),
            meta: { title: 'RevenueStatistics', role: 'revenueStatistics', requiresAuth: true },
        },
    ],
};
export default statisticalManagement;
