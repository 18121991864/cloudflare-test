import { storeToRefs } from 'pinia';
import useSideBar from '@/store/sideBar';
import { useRoute } from 'vue-router';

export default function useButtonRole() { // 按钮权限列表获取
    const route = useRoute();
    const { roleMenu } = storeToRefs(useSideBar());
    const isShowBtn = (btnRole: string): boolean => roleMenu.value.findIndex(({ name }) => name === `${String(route.name)}-${btnRole}`) > 0;

    const getButtonsForMenu = (menuId: string) => {
        return roleMenu.value.filter(({ parentId }) => parentId === menuId);
    };

    const isRoleBtn = (btn: string) => {
        const menuId = roleMenu.value.find(({ component }) => component === route.name)?.menuId || '';
        const btnArr = getButtonsForMenu(menuId);
        // 返回按钮对应的权限
        return btnArr.find(({ component }: { component: string }) => component === btn)?.menuId || '';
    };

    return {
        isRoleBtn,
        isShowBtn,
    };
}
