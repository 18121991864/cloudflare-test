import type { RouteRecordRaw } from 'vue-router';
import asyncRoutes from '@/routes/asyncRoutes';
import constantRoutes from '@/routes/constantRoutes';

const routes: RouteRecordRaw[] = [...asyncRoutes, ...constantRoutes];

export default routes;
