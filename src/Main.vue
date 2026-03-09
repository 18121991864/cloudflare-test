<template>
    <a-layout>
        <a-layout-sider
            v-model:collapsed="isSidebar"
            width="235px"
            :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, zIndex: 3 }"
        >
            <SideNavigationBar />
        </a-layout-sider>
        <a-layout :style="{ marginLeft: isSidebar ? '80px' : '235px', mineHeight: '100vh' }">
            <a-layout-header :style="{ background: '#F0F2F5', padding: 0, position: 'fixed', zIndex: 3, width: fetchHeaderWidth }">
                <Header @setOPPassword="isSetOPPasswordOpen = true" />
                <TagsView />
            </a-layout-header>
            <a-layout-content :style="{ overflowY: 'auto', marginTop: '64px', mineWidth: '1200px', background: '#f5f6f8' }">
                <div :style="{ background: '#f5f6f8', minHeight: '730px' }">
                    <template v-if="store.roleMenu.length">
                        <router-view v-slot="{ Component, route }" :key="timeStore.timezone">
                            <transition name="fade" mode="out-in" appear>
                                <keep-alive :include="[...keepAlive, 'AllFees', 'TotalFees']">
                                    <component :is="nameComponent(Component, route.name)" :key="route.path" />
                                </keep-alive>
                            </transition>
                        </router-view>
                    </template>

                    <transition name="lodin" mode="out-in" appear v-else>
                        <div v-if="!breadcrumbLoaded" class="table-container display-flex flex-align-items-center" style="justify-content: center">
                            <a-spin :indicator="indicator" :spinning="!breadcrumbLoaded" size="large">
                                <div class="use-transform">{{ t('common.PageLoading') }}。。。。</div>
                            </a-spin>
                        </div>
                        <div v-else-if="!isOnline" class="flex-direction-column flex-align-items-center table-container">
                            <img src="./assets/images/no-network.png" class="network-img" />
                            <p class="network-text">{{ t('common.NetworkAnomaly') }}</p>
                            <p class="text-size-14">{{ t('common.PleaseCheckNetworkStatusAndRefresh') }}</p>
                        </div>

                        <div v-else-if="erroState" class="table-container display-flex flex-align-items-center" style="justify-content: center">
                            <a-result status="500" title="500" :sub-title="t('common.ServiceLost')"> </a-result>
                        </div>
                    </transition>
                </div>
            </a-layout-content>
        </a-layout>
        <!-- <SetPayPassword v-model:open="isSetOPPasswordOpen" @onSuccess="handleOnSuccess" /> -->
    </a-layout>
</template>

<script lang="ts" setup>
import { computed, watch, ref, ComputedRef } from 'vue';
import { RouteRecordRaw, useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useSidebar from '@/store/sideBar';
import useTagsView from '@/store/tagsView';
import Header from './components/Header.vue';
import TagsView from './components/TagsView.vue';
import SideNavigationBar from './components/SideNavigationBar.vue';
import { LoadingOutlined } from '@ant-design/icons-vue';
import useTimezoneStore from '@/store/timezone';
import useUser from '@/store/user';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const timeStore = useTimezoneStore();
const isOnline = ref<boolean>(true);
const erroState = ref(false);
const breadcrumbLoaded = ref(true);
const hasRoute = useRoute();
const routes = ref<RouteRecordRaw[]>([]);
const allRoutes = useRouter();
const store = useSidebar();
const { push } = useRouter();
const userStore = useUser();
const { isSidebar } = storeToRefs(store);
const timeId = ref<NodeJS.Timeout | null>(null);
const isSetOPPasswordOpen = ref(false);
const isHome = (route: RouteRecordRaw) => {
    // 是否是首页
    const name = route && route.name;
    if (!name) return false;
    return String(name).trim().toLocaleLowerCase() === 'main'.toLocaleLowerCase();
};
const route = useRoute();
const router = useRouter();
const fetchBreadcrumb = async () => {
    if (route.path === '/login') return;
    breadcrumbLoaded.value = false;

    // 获取routes
    store
        .fetchSidebarRoutes()
        .then(() => {
            let hasMatched: RouteRecordRaw[] = hasRoute.matched.filter((item: RouteRecordRaw) => item.meta && item.meta.title);
            const hasRouteList: RouteRecordRaw[] = [{ path: '/', meta: { title: '首页' }, redirect: '/Home' }];

            if (!isHome(hasMatched[0])) {
                hasMatched = hasRouteList.concat(hasMatched);
            }
            erroState.value = false;
            routes.value = hasMatched.filter((item: RouteRecordRaw) => item.meta && item.meta.title);
            clearInterval(timeId.value as NodeJS.Timeout);
            timeId.value = null;
        })
        .catch(() => {
            store.clearRoutes();
            erroState.value = true;
        })
        .finally(() => {
            breadcrumbLoaded.value = true;
        });
};

const fetchHeaderWidth: ComputedRef<string> = computed(() => (isSidebar.value ? 'calc(100% - 80px)' : 'calc(100% - 235px)'));

const nameComponent = computed(() => {
    return (Component: { type: { name: string } }, name: string) => {
        Component.type.name = name;
        return Component;
    };
});

const handleLink = (item: RouteRecordRaw) => {
    // 跳转路由
    const { redirect, path } = item;
    if (redirect) {
        const routePath = redirect === '/Home' ? '/' : redirect;
        push(String(routePath));
        return;
    }
    push(path);
};

const updateOnlineStatus = () => {
    console.log('网络变化了');
    isOnline.value = navigator.onLine;
};
onMounted(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
});

onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
});
watch(
    () => hasRoute.path,
    async () => {
        if (hasRoute.path.startsWith('/redirect/')) return;

        await fetchBreadcrumb();
    }
);
watch(
    () => erroState.value,
    (val) => {
        if (val) {
            timeId.value = setInterval(() => {
                fetchBreadcrumb();
            }, 5000);
        } else {
            clearInterval(timeId.value as NodeJS.Timeout);
            timeId.value = null;
        }
    }
);

const storeTagsView = useTagsView();

const { visitedViews, ignoreKeepAlive } = storeToRefs(storeTagsView);
const keepAlive = computed(() => {
    return unref(visitedViews).reduce((set: Set<string>, item: any) => {
        if ((typeof item.meta?.keepAlive === 'undefined' || !!item.meta?.keepAlive) && item.fullPath !== unref(ignoreKeepAlive)) {
            set.add(item.name);
        }
        return set;
    }, new Set());
});
onMounted(async () => {
    await fetchBreadcrumb();
});
const indicator = h(LoadingOutlined, {
    style: {
        fontSize: '50px',
    },
    spin: breadcrumbLoaded.value,
});
watch(
    () => userStore.userInfo.isSetOPPassword,
    (val) => {
        if (!val) {
            isSetOPPasswordOpen.value = true;
        }
    }
);
const handleOnSuccess = () => {
    userStore.fetchUserInfo();
};
</script>

<style lang="scss" scoped>
@import url('@/assets/stylesheet/transition.scss');
.main {
    &::after {
        content: '';
        display: table;
        clear: both;
    }

    position: relative;
    height: 100%;
    width: 100%;
}

.content {
    min-height: 100%;
    transition: margin-left 0.28s;
    margin-left: 210px;
    position: relative;
    background: #f0f2f5;

    &.close-sidebar {
        margin-left: 80px;
    }
}

.breadcrumb-wrapper {
    margin: 65px 30px 0;
    padding: 10px 20px;
    background: #fff;
}

.content-wrapper {
    min-height: calc(100vh - 64px);
    width: 100%;
    position: relative;
    overflow: hidden;
}

.site-layout .site-layout-background {
    background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
    background: #141414;
}

.network-img {
    width: 488px;
    height: 288px;
    margin-top: 100px;
}

.network-text {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 14px;
}
.use-transform {
    transform: translate(31px, 85px);
}
</style>
