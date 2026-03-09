import { RouteRecordRaw } from 'vue-router';
import home from '../assets/images/icon-home.svg';

// 常规路由

const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'main',
        component: () => import(/* webpackChunkName: "main" */ '../Main.vue'),
        meta: { requiresAuth: false, title: 'frontpage', hidden: true, icon: home },
        children: [
            {
                path: '',
                name: 'home',
                component: () => import(/* webpackChunkName: "home" */ '../views/Home/Index.vue'),
                meta: { title: 'frontpage', role: 'home', isShow: true, requiresAuth: false },
            },
        ],
    },
    {
        // 登录界面
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '../views/Login/Index.vue'),
        meta: { title: 'login', role: 'login', isShow: true, requiresAuth: false },
    },
    {
        path: '/error',
        name: 'error',
        component: () => import(/* webpackChunkName: "main" */ '../Main.vue'),
        meta: { title: 'error', icon: '', isShow: true, requiresAuth: false },
        children: [
            {
                path: '/:pathMatch(.*)*',
                name: 'error',
                component: () => import(/* webpackChunkName: "error" */ '../components/Error.vue'),
                meta: { title: '404', role: '404', isShow: true, requiresAuth: false },
            },
            {
                path: '403',
                name: 'notRole',
                component: () => import(/* webpackChunkName: "error" */ '../components/NotRolePurview.vue'),
                meta: { title: '403', role: '403', isShow: true, requiresAuth: false },
            },
        ],
    },
];

export default constantRoutes;
