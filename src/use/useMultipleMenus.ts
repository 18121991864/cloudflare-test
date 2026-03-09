import { storeToRefs } from 'pinia';
import useSidebar from '@/store/sideBar';

export default function useMultipleMenus() {
    const { roleMenu } = storeToRefs(useSidebar());

    const isMoreRoleBtn = (parentKey: string, btnKey: string) => { // 跨菜单查找按钮权限
        const menuId = roleMenu.value.find(({ component }) => component === parentKey)?.menuId || [];

        const curArr = roleMenu.value.filter(({ parentId }) => parentId === menuId);

        return curArr.findIndex((item) => item.component === btnKey) > 0;
    };

    return {
        isMoreRoleBtn,
    };
}
