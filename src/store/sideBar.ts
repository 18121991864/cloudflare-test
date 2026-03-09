import { ref } from 'vue';
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import asyncRoutes from '@/routes/asyncRoutes';
import constantRoutes from '@/routes/constantRoutes';

import api from '../api/fetchTest';

export default defineStore('sideBar', () => {
    const isSidebar = ref<boolean>(false); // 侧边栏开关状态
    const routes = ref<RouteRecordRaw[]>([]); // 路由权限列表
    const roleMenu = ref<PromiseReturnType<typeof api.sysUserMenuList>>(Object.create([]));

    const updateIsSidebar = (status: boolean): void => {
        // 更新isSidebar状态
        isSidebar.value = status;
    };

    const getAsyRouter = (routes: RouteRecordRaw[], fetchRoleObj: any) =>
        routes.filter((route: any) => {
            const {
                children,
                meta: { role },
            } = route;

            if (children != null && children && children.length) {
                route.children = getAsyRouter(children, fetchRoleObj);
            }
            return fetchRoleObj[role];
        });

    // 遍历后台传来的路由字符串，转换为组件对象
    const filterAsyRouter = (roleList: PromiseReturnType<typeof api.sysUserMenuList>) => {
        // 获取role列表比对的component name 转换为对象
        const fetchRoleObj = Object.fromEntries(roleList.map((item: any) => [item.component, item.component]));
        return getAsyRouter(JSON.parse(JSON.stringify(asyncRoutes)), fetchRoleObj);
    };

    // 获取sidebar 列表路由
    const fetchSidebarRoutes = async () => {
        NProgress.start();

        return api
            .sysUserMenuList()
            .then((r: PromiseReturnType<typeof api.sysUserMenuList>) => {
                roleMenu.value = r;

                routes.value = [...constantRoutes, ...filterAsyRouter(r)];
            })
            .finally(() => {
                NProgress.done();
            });
    };
    const clearRoutes = () => {
        routes.value = [];
        roleMenu.value = [];
    };

    return {
        routes,
        roleMenu,
        isSidebar,
        clearRoutes,
        updateIsSidebar,
        fetchSidebarRoutes,
    };
});
