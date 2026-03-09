import audit from '@/assets/images/icon-audit.svg';
const agentList = {
    path: '/agentManage',
    name: 'agentManage',
    redirect: 'noRedirect',
    component: () => import(/* webpackChunkName: "agentManage" */ '@/Main.vue'),
    meta: { title: '代理商管理', icon: audit, role: 'agentManage', requiresAuth: true },
    children: [
        {
            path: 'admission',
            name: 'admission',
            component: () => import(/* webpackChunkName: "agent" */ '@/views/Agent/Admission/index.vue'),
            meta: { title: '代理商准入', role: 'admission', requiresAuth: true },
        },
        {
            path: 'agent-list',
            name: 'agent-list',
            component: () => import(/* webpackChunkName: "agent" */ '@/views/Agent/Agent.vue'),
            meta: { title: '代理商管理', role: 'agent-list', requiresAuth: true },
        },
    ],
};
export default agentList;
