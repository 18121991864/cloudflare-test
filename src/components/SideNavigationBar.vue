<template>
    <div>
        <div class="logo" :style="{ padding: !isSidebar ? '' : '15px 0 15px 30px' }">
            <img src="../assets/images/logo.png" alt="" v-if="!isSidebar" />
            <!-- <span v-show="!isSidebar">hermes管理系统</span> -->
            <img src="../assets/images/mini-logo.png" alt="" v-else style="width: 50%" />
        </div>
        <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" mode="inline" theme="dark">
            <template v-for="item of routes" :key="item.path">
                <a-menu-item v-if="hasOneShowingChild(item.children, item)" :key="item.path">
                    <div class="display-flex flex-align-items-center" @click="handleClickItem(item.path)">
                        <img v-if="item.meta.icon" class="icon-svg" onload="SVGInject(this)" :src="item.meta.icon" />
                        <span class="title">{{ t(`common.${item.meta.title}`) }}</span>
                    </div>
                </a-menu-item>
                <a-sub-menu v-if="!hasOneShowingChild(item.children, item) && !item.meta.isShow" :key="item.path">
                    <template #title>
                        <div class="display-flex flex-align-items-center">
                            <img v-if="item.meta.icon" class="icon-svg" onload="SVGInject(this)" :src="item.meta.icon" />
                            <span class="title">{{ t(`common.${item.meta.title}`) }}</span>
                        </div>
                    </template>
                    <div v-for="childItem of item.children" :key="childItem.path">
                        <template v-if="isShowChild(childItem.children) && !childItem.meta.isShow">
                            <a-menu-item :key="childItem.path">
                                <div class="display-flex flex-align-items-center" @click.stop="handleClickItem(item.path, childItem.path)">
                                    <IconFont v-if="childItem.meta.icon" :type="childItem.meta.icon" />
                                    <span class="title">{{ t(`common.${childItem.meta.title}`) }}</span>
                                </div>
                            </a-menu-item>
                        </template>
                        <a-sub-menu v-if="!isShowChild(childItem.children)" :key="childItem.path">
                            <template #title>
                                <IconFont v-if="childItem.meta.icon" :type="childItem.meta.icon" />
                                <span class="title">{{ t(`common.${childItem.meta.title}`) }}</span>
                            </template>
                            <a-menu-item v-for="child of childItem.children" :key="child.path">
                                <div @click.stop="handleClickItem(childItem.path, child.path)">
                                    <IconFont v-if="child.meta.icon" :type="child.meta.icon" />
                                    <span class="title">{{ t(`common.${child.meta.title}`) }}</span>
                                </div>
                            </a-menu-item>
                        </a-sub-menu>
                    </div>
                </a-sub-menu>
            </template>
        </a-menu>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick, computed, onMounted } from 'vue';
import { useRoute, useRouter, RouteRecordNormalized } from 'vue-router';
import { storeToRefs } from 'pinia';
import useSidebar from '@/store/sideBar';
import '@iconfu/svg-inject';
import useTagsView from '@/store/tagsView';
import { useI18n } from 'vue-i18n';
import fetchApi from '@/api/fetchTest/index';

export default defineComponent({
    name: 'SideNavigationBar',
    setup() {
        const { t } = useI18n();
        const hasRoute = useRoute();
        const storeTagsView = useTagsView();
        const selectedKeys = ref<string[]>(['/']);
        const isShowSidebar = ref<boolean>(true);

        const store = useSidebar();
        const { push } = useRouter();
        const { routes, roleMenu, isSidebar } = storeToRefs(store);

        // const openKeys = computed(() => routes.value?.map(({ path }) => path));

        const openKeys = computed(() => []);

        const isShowChild = (children = []) => !children.length; // 判断子路由的item还是menu的显示
        const hasOneShowingChild = (children = [], item: RouteRecordNormalized) => children.length === 1 && item.meta.hidden; // 根路由不显示子路由
        const handleClickItem = (parentPath: string, childPath: string): void => {
            storeTagsView.isAdd = false;

            const path = childPath ? `${parentPath}/${childPath}` : parentPath;

            storeTagsView.ignoreKeepAlive = path;

            // 根据菜单切换路由
            push(path).finally(() => {
                storeTagsView.ignoreKeepAlive = null;
            });
        };

        // const fetchSidebarList: ComputedRef<RouteRecordRaw[]> = computed(() => );

        watch(
            () => hasRoute.path,
            (o: string, n?: string) => {
                if (o !== n) {
                    selectedKeys.value = [String(o === '/' ? '/' : o.split('/').pop())];
                }
            },
            { deep: true, immediate: true }
        ); // 监听路由重置selectedKeys

        watch(
            () => roleMenu.value,
            (o: PromiseReturnType<typeof fetchApi.sysUserMenuList>, n?: PromiseReturnType<typeof fetchApi.sysUserMenuList>) => {
                // 监听权限列表的变动
                if (o.length) {
                    isShowSidebar.value = false;
                    nextTick(() => {
                        isShowSidebar.value = true;
                    });
                }
            },
            { deep: true, immediate: true }
        );

        return {
            routes,
            openKeys,
            isShowChild,
            selectedKeys,
            handleClickItem,
            hasOneShowingChild,
            isSidebar,
            t,
        };
    },
});
</script>

<style lang="scss" scoped>
.logo {
    display: flex;
    align-items: center;
    // justify-content: center;
    // padding: 12px 0 18px;
    padding: 15px 0 15px 20px;
    background: var(--primary-color-black);

    img {
        width: 55%;
    }

    span {
        font-size: 18px;
        color: #fff;
    }
}

.icon-svg {
    width: 16px;
    margin-right: 5px;
}
</style>
