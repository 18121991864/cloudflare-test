import type { App } from 'vue';
import { storeToRefs } from 'pinia';
import useSidebar from '@/store/sideBar';
import pinia from '@/store/Index';
import type { TreeDataType } from '@/interface/StateType';
import type { PermissionsList } from '@/api/newAgent/types.d';

const store = useSidebar(pinia);
const { roleMenu } = storeToRefs(store);
interface MenuType {
    type?: 'type' | 'menuType';
    id?: 'id' | 'menuId';
}
export interface PermissionsListTree {
    id: string;
    title: string;
    route: string;
    name: string;
    type: number;
    parentId: string;
    checkState: number;
    children: PermissionsListTree[];
}
const permissions = {
    setup() {
        const getRoleMenu = () => {
            return new Promise((resolve) => {
                watch(
                    () => roleMenu.value,
                    (item) => {
                        if (Object.keys(item).length > 0) {
                            resolve(item);
                        }
                    },
                    {
                        immediate: true,
                        deep: true,
                    }
                );
            });
        };
        // 构建树结构
        const buildArrTree = (items: TreeDataType[], { type = 'menuType', id = 'menuId' }: MenuType): TreeDataType[] => {
            function buildTree(items: TreeDataType[], parentId: string): TreeDataType[] {
                // 找到所有直接子节点
                const children = items.filter((item) => item.parentId === parentId);
                // 对于每个子节点，递归地处理它们的子节点
                return children.map((child) => {
                    if (child[id]) {
                        child.children = buildTree(items, child[id]);
                    }
                    return child;
                });
            }
            return buildTree(items, '0');
        };
        // 将树结构转换成数组
        const treeConvertArray = (tree: PermissionsListTree) => {
            const arrys: PermissionsList[] = [];
            const convertArray = (tree: PermissionsListTree) => {
                if (tree.children?.length) {
                    tree.children.forEach((item) => {
                        convertArray(item);
                    });
                }
                arrys.push(tree);
            };
            convertArray(tree);
            return arrys;
        };
        // 递归查找
        // @ts-ignore
        const getChildren = (parent: TreeDataType, name: string, callback: (params: any) => void) => {
            if (parent.component === name) {
                return parent;
            } else if (parent.children?.length) {
                // @ts-ignore
                return parent.children.find((item) => {
                    // @ts-ignore
                    const children = getChildren(item, name, callback);
                    if (children) {
                        return callback && callback(children);
                    }
                });
            }
        };
        return {
            getRoleMenu,
            buildArrTree,
            getChildren,
            treeConvertArray,
        };
    },
};
export default {
    install: (app: App): void => {
        const { getRoleMenu, buildArrTree, getChildren, treeConvertArray } = permissions.setup();
        app.config.globalProperties.$getRoleMenu = getRoleMenu;
        app.config.globalProperties.$buildArrTree = buildArrTree;
        app.config.globalProperties.$getChildren = getChildren;
        app.config.globalProperties.$treeConvertArray = treeConvertArray;
    },
};
