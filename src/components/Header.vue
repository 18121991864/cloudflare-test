<template>
    <div class="flex-justify-content-space-between flex-align-items-center header">
        <div class="flex-direction-row flex-align-items-center">
            <div class="sidebar-btn-active" @click.stop="handleIsSidebar(isSidebar)">
                <MenuUnfoldOutlined v-if="isSidebar" :style="{ fontSize: '18px' }" />
                <MenuFoldOutlined v-else :style="{ fontSize: '18px' }" />
            </div>
            <a-breadcrumb>
                <a-breadcrumb-item v-for="(item, index) in routes" :key="item.path">
                    <span v-if="item.redirect === 'noRedirect' || index === routes.length - 1" class="no-redirect">{{
                        t(`common.${item.meta.title}`)
                    }}</span>
                    <a v-else @click.prevent="handleLink(item)">{{ t(`common.${item.meta.title}`) }}</a>
                </a-breadcrumb-item>
            </a-breadcrumb>
        </div>

        <div class="flex-direction-row flex-align-items-center">
            <!-- <TimezoneSelector class="mr-10" /> -->
            <Language class="mr-10" />
            <a-dropdown overlayClassName="w-[150px] text-center">
                <div class="flex cursor-pointer flex-direction-row flex-align-items-center" @click.prevent>
                    <div class="user-header">{{ fetchUserName }}</div>
                    <p class="user-text">{{ fetchName }}</p>
                </div>
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="1" @click="changeYourPassword">{{ t(`common.ChangePassword`) }}</a-menu-item>
                        <a-menu-item v-if="userStore.userInfo?.isFACode === 0" key="2" @click="change2FA('add')">{{
                            t(`login.Bind2FA`)
                        }}</a-menu-item>
                        <a-menu-item v-if="userStore.userInfo?.isFACode === 1" key="3" @click="change2FA('edit')">{{
                            t(`login.Change2FA`)
                        }}</a-menu-item>

                        <a-menu-item key="0" @click="handleLoginOut">{{ t(`common.Logout`) }}</a-menu-item>
                        <!-- <a-menu-item key="4" @click="handelSetOPPassword"
                            >{{ !userStore.userInfo.isSetOPPassword ? '设置支付密码' : '修改支付密码' }}
                        </a-menu-item> -->
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </div>
    <template>
        <SettingsModal :visible="isPassWordModalOpen" :type="'edit'" :active-data="{}" @onClose="handleClosePassWordModal" @onSuccess="() => {}" />
        <Settings2FA
            v-if="is2FAModalOpen"
            :visible="is2FAModalOpen"
            :type="modalType"
            :active-data="{}"
            @onClose="handleClose2FAModal"
            @onSuccess="() => {}"
        />
    </template>
</template>
<script lang="ts" setup>
import { defineComponent, ref, watch, onBeforeMount, ComputedRef, computed, getCurrentInstance } from 'vue';
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import cookies from 'cookies-js';
import { storeToRefs } from 'pinia';
import api from '@/api/fetchTest/index';
import useSidebar from '@/store/sideBar';
import useTagsView from '@/store/tagsView';
import useUser from '@/store/user';
import SettingsModal from './SettingsPassword.vue';
import Settings2FA from './Settings2FA.vue';
import { useI18n } from 'vue-i18n';

const { proxy } = getCurrentInstance();
const hasRoute = useRoute();
const routes = ref<RouteRecordRaw[]>([]);
const { t } = useI18n();
const store = useSidebar();
const userStore = useUser();
const { push } = useRouter();
const { isSidebar } = storeToRefs(store);
const emits = defineEmits<{
    (e: 'setOPPassword'): void;
}>();

const handleIsSidebar = (status: boolean) => {
    // 开关左侧列表
    store.updateIsSidebar(!status);
};

const isHome = (route: RouteRecordRaw) => {
    // 是否是首页
    const name = route && route.name;
    if (!name) return false;
    return String(name).trim().toLocaleLowerCase() === 'main'.toLocaleLowerCase();
};

const fetchBreadcrumb = () => {
    // 获取routes
    let hasMatched: RouteRecordRaw[] = hasRoute.matched.filter((item: RouteRecordRaw) => item.meta && item.meta.title);
    const hasRouteList: RouteRecordRaw[] = [{ path: '/', meta: { title: 'frontpage' }, redirect: '/Home' }];

    if (!isHome(hasMatched[0])) {
        hasMatched = hasRouteList.concat(hasMatched);
    }

    routes.value = hasMatched.filter((item: RouteRecordRaw) => item.meta && item.meta.title);
};

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
const storeTagsView = useTagsView();
const handleLoginOut = (): void => {
    // 退出登录
    api.loginOut().then(() => {
        cookies.expire('walletToken');
        storeTagsView.clearVisitedView();
        push('/login');
    });
};

const fetchName: ComputedRef<string> = computed(() => userStore.userInfo?.fullName);
const fetchUserName: ComputedRef<string> = computed(() => userStore.userInfo?.fullName?.substr(0, 1) || '');

watch(
    () => hasRoute.path,
    () => {
        // 监听路由变化
        if (hasRoute.path.startsWith('/redirect/')) return;
        fetchBreadcrumb();
    }
);

onBeforeMount(() => {
    fetchBreadcrumb();
    userStore.fetchUserInfo();
});

const isPassWordModalOpen = ref<boolean>(false);
const changeYourPassword = () => {
    if (proxy.$is2FA()) {
        [isPassWordModalOpen.value] = [true];
    }
};
const handleClosePassWordModal = () => {
    // 关闭弹框
    [isPassWordModalOpen.value] = [false];
};

const modalType = ref<'edit' | 'add'>('edit');
const is2FAModalOpen = ref<boolean>(false);
const change2FA = (type: 'edit' | 'add') => {
    [is2FAModalOpen.value] = [true];
    [modalType.value] = [type];
};
const handleClose2FAModal = () => {
    // 关闭弹框
    [is2FAModalOpen.value] = [false];
};
const handelSetOPPassword = () => {
    emits('setOPPassword');
};
</script>

<style lang="scss" scoped>
.header {
    height: 55px;
    overflow: hidden;
    position: relative;
    padding-left: 15px;
    background: #fff;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
}

.sidebar-btn-active {
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    background: #e5e9f1;
    border-radius: 8px;
    cursor: pointer;
    margin-right: 10px;
    margin-left: 4px;
}

.user-header {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    margin-right: 8px;
    background: var(--primary-color);
    color: #fff;
    font-size: 15px;
    text-align: center;
    line-height: 32px;
}

.user-text {
    font-size: 14px;
    color: rgb(0 0 0 / 60%);
    margin-right: 30px;
}

.no-redirect {
    color: #97a8be;
    cursor: text;
}
</style>
