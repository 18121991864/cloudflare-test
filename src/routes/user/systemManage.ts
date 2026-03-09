import systemManage from '@/assets/images/icon-systemManage.svg';
const systemManageList = {
    path: '/systemManage', // 系统管理
    name: 'systemManage',
    redirect: 'noRedirect', // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
    component: () => import(/* webpackChunkName: "systemManage" */ '@/Main.vue'),
    meta: { title: 'SystemManagement', icon: systemManage, role: 'systemManage', requiresAuth: true },
    children: [
        // {
        //     // 角色与权限
        //     path: 'operationLog',
        //     name: 'operationLog',
        //     component: () => import(/* webpackChunkName: "systemManage" */ '@/views/SystemManage/OperationLog.vue'),
        //     meta: { title: '操作日志', role: 'operationLog', requiresAuth: true },
        // },

        {
            // 角色与权限
            path: 'rolePermissions',
            name: 'rolePermissions',
            component: () => import(/* webpackChunkName: "systemManage" */ '@/views/SystemManage/RolePermissions.vue'),
            meta: { title: 'RolePermissions', role: 'rolePermissions', requiresAuth: true },
        },
        {
            // 角色与权限
            path: 'addRolePermissions',
            name: 'addRolePermissions',
            component: () => import(/* webpackChunkName: "addRolePermissions" */ '@/views/SystemManage/AddRolePermissions.vue'),
            meta: { title: 'RoleAdd', role: 'rolePermissions', isShow: true, requiresAuth: true },
        },
        {
            // 角色与权限-查看
            path: 'viewRolePermissions/:id/:see',
            name: 'viewRolePermissions',
            component: () => import(/* webpackChunkName: "viewRolePermissions" */ '@/views/SystemManage/AddRolePermissions.vue'),
            meta: { title: 'RoleView', role: 'rolePermissions', isShow: true, requiresAuth: true },
        },
        {
            // 角色与权限-编辑
            path: 'editRolePermissions/:id',
            name: 'editRolePermissions',
            component: () => import(/* webpackChunkName: "editRolePermissions" */ '@/views/SystemManage/AddRolePermissions.vue'),
            meta: { title: 'RoleEdit', role: 'rolePermissions', isShow: true, requiresAuth: true },
        },
        {
            // 账号管理
            path: 'accountManage',
            name: 'accountManage',
            component: () => import(/* webpackChunkName: "addRolePermissions" */ '@/views/SystemManage/AccountManage.vue'),
            meta: { title: 'AccountManagement', role: 'accountManage', requiresAuth: true },
        },
        {
            // 账号管理-新增
            path: 'addAccount',
            name: 'addAccount',
            component: () => import(/* webpackChunkName: "addAccount" */ '@/views/SystemManage/AddAccount.vue'),
            meta: { title: 'AccountAdd', role: 'accountManage', requiresAuth: true, isShow: true },
        },
        {
            // 账号管理-编辑
            path: 'editAccount/:id',
            name: 'editAccount',
            component: () => import(/* webpackChunkName: "editAccount" */ '@/views/SystemManage/AddAccount.vue'),
            meta: { title: 'AccountEdit', role: 'accountManage', requiresAuth: true, isShow: true },
        },
    ],
};
export default systemManageList;
