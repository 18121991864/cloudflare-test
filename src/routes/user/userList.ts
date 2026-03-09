import userSvg from '@/assets/images/user.svg';
const userManageList = {
    path: '/userManage', // 系统管理
    name: 'userManage',
    redirect: 'noRedirect', // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
    component: () => import(/* webpackChunkName: "userManage" */ '@/Main.vue'),
    meta: { title: 'UserManagement', icon: userSvg, role: 'user', requiresAuth: true },
    children: [
        {
            // 角色与权限
            path: 'userList',
            name: 'userList',
            component: () => import(/* webpackChunkName: "userManage" */ '@/views/UserManage/UserList/index.vue'),
            meta: { title: 'UserList', role: 'userList', requiresAuth: true },
        },
        {
            path: 'accountKeyList',
            name: 'accountKeyList',
            component: () => import(/* webpackChunkName: "userList" */ '@/views/UserManage/UserKey/index.vue'),
            meta: { title: 'UserKey', role: 'accountKeyList', requiresAuth: true },
        },
    ],
};
export default userManageList;
