import type { RouteRecordRaw } from 'vue-router';
import { systemManageList, userManageList } from './user/index';
import orderManage from './orderManagement/index';
import policyManage from './policyManagement';
import statisticalManagement from './statisticalManagement';

const constantRoutes: RouteRecordRaw[] = [statisticalManagement, userManageList, orderManage, policyManage, systemManageList];

export default constantRoutes;
