import temporary from '@/assets/images/icon-annual-audit.svg';
const orderManage = {
    path: '/orderManage', // 系统管理
    name: 'orderManage',
    redirect: 'noRedirect', // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
    component: () => import(/* webpackChunkName: "userManage" */ '@/Main.vue'),
    meta: { title: 'OrderManagement', icon: temporary, role: 'orderManage', requiresAuth: true },
    children: [
        {
            path: 'orderList',
            name: 'orderList',
            component: () => import(/* webpackChunkName: "userManage" */ '@/views/OrderManage/OrderList/index.vue'),
            meta: { title: 'OrderList', role: 'orderList', requiresAuth: true },
        },
    ],
};
export default orderManage;
