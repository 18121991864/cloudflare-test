import type { App, AppContext, ComponentOptions } from 'vue';
import { storeToRefs } from 'pinia';
import useSidebar from '@/store/sideBar';
import pinia from '@/store/Index';
import useUser from '@/store/user';
import { TreeDataType } from '@/interface/StateType';

const store = useSidebar(pinia);
const { roleMenu } = storeToRefs(store);
const userStore = useUser();
const queryButtonRef = ref<ComponentInstance['QueryButton']>();
export const menuMixin: ComponentOptions = {
    data() {
        return {
            queryButtonRef: {},
            show: false,
        };
    },

    methods: {
        is2FA() {
            if (userStore.userInfo?.isFACode === 0) {
                return true;
            }
            return false;
        },
        // 获取当前路由下的按钮权限数组
        getButtonsForMenu() {
            const menuId = roleMenu.value.find(({ component }) => component === this.$route.name)?.menuId || '';
            return roleMenu.value.filter(({ parentId }) => parentId === menuId) || [];
        },

        // 返回按钮对应的权限
        buttonPermissions(btn: string) {
            return this.getButtonsForMenu()?.findIndex(({ component }: { component: string }) => component === btn) > -1;
        },
        // 判断是否有该路由页面
        buttonPermissionsRoute(pageRoute: string) {
            const route = roleMenu.value.find(({ component }) => component === pageRoute);

            return route ? true : false;
        },

        // 获取当前tabs 路由权限
        async isRoleBtn(component: string, btn: string, appContext: AppContext) {
            // @ts-ignore
            const proxy = appContext.config.globalProperties;
            const item = await proxy.$getRoleMenu();
            const data = proxy.$buildArrTree(item, 'parentId') as TreeDataType[];
            const parentPath = this.$route.path.split('/')[1];
            const parent = data.find((item) => item.component === parentPath);

            if (!parent) return false; // 添加检查，确保 parent 存在
            // @ts-ignore
            proxy.$getChildren(parent, this.$route.name as string, (data: TreeDataType) => {
                const btns = (data.children?.find((item) => item.component === component) || {}) as TreeDataType;
                if (!Object.keys(btns).length) return false;
                const item = btns.children?.find((item) => {
                    return item.component === btn;
                });
                this.show = item ? true : false;
            });
            return this.show;
        },
        // 获取 queryButtonRef
        getQueryButtonRef(queryRef: Ref<ComponentInstance['QueryButton']>) {
            if (Object.keys(queryRef.value).length) {
                queryButtonRef.value = queryRef.value;
            }
        },
    },
    computed: {
        permissionShow() {
            return (btns: string) => {
                let show = false;
                if (queryButtonRef.value) {
                    Object.keys(queryButtonRef.value.showBtns).forEach((key) => {
                        if (btns === key) {
                            // @ts-ignore
                            show = queryButtonRef.value.showBtns[key];
                        }
                    });
                }
                return show;
            };
        },
    },
};

export default {
    install: (app: App): void => {
        app.mixin(menuMixin);
    },
};
