import audit from '@/assets/images/icon-yygl.svg';
const amlManagementList = {
    path: '/amlManagement',
    name: 'amlManagement',
    redirect: 'noRedirect',
    component: () => import(/* webpackChunkName: "agent" */ '@/Main.vue'),
    meta: { title: 'AML管理', icon: audit, role: 'amlManagement', requiresAuth: true },
    children: [
        {
            path: 'aml-rule-configuration',
            name: 'aml-rule-configuration',
            component: () => import(/* webpackChunkName: "agent" */ '@/views/AMLManagement/AMLRuleConfiguration/index.vue'),
            meta: { title: 'AML规则配置', role: 'aml-rule-configuration', requiresAuth: true },
        },
    ],
};
export default amlManagementList;
