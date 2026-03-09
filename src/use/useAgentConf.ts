import { useRequest } from "vue-request";
import api from '@/api/agent';

export function useAgentConf() {
    // 获取状态
    const { data: status, runAsync: getStatus } = useRequest(async () => {
        const r = await api.transferApplicationStatusList();
        return r.map(({ desc: label, code: value }) => ({ label, value }));
    }, { manual: true });

    // 获取代理商名称
    const { data: agents, runAsync: getAgents } = useRequest(async (code = '') => {
       const r = await api.listAgent({ code });
       return r.map(({ name: label, id: value }) => ({ label, value }));
    }, { manual: true });

    // 获取代理类型
    const { data: agentTypes, runAsync: getAgentTypes } = useRequest(async () => {
        const r = await api.listAgentType();
        return r.map(({ desc: label, code: value }) => ({ label, value }));
    }, { manual: true });

    // 获取代理商客户
    const { data: agentCustomers, runAsync: getAgentCustomers } = useRequest(async (groupIds = '') => {
        const r = await api.listAgentCustomer({ groupIds });
        return r.map((item) => ({ label: item, value: item }));
    }, { manual: true });

    // 获取代理商客户组
    const { data: agentCustomerGroup, runAsync: getAgentCustomerGroup } = useRequest(async (agentId = '') => {
        const r = await api.listAgentCustomerGroup({ agentId });
        return r.map(({ name: label, id: value }) => ({ label, value }));
    }, { manual: true });

    // 复制获取代理商客户组
    const { data: copyAgentGroups, runAsync: getCopyAgentGroups } = useRequest(async (agentId = '') => {
        const r = await api.listAgentCustomerGroup({ agentId });
        return r.map(({ name: label, id: value }) => ({ label, value }));
    }, { manual: true });

    // 复制代理商名称
    const { data: copyAgents, runAsync: getCopyAgents } = useRequest(async (code = '') => {
        const r = await api.listAgent({ code });
        return r.map(({ name: label, id: value }) => ({ label, value }));
    }, { manual: true });

    return {
        agents,
        status,
        getAgents,
        getStatus,
        agentTypes,
        copyAgents,
        getCopyAgents,
        getAgentTypes,
        agentCustomers,
        copyAgentGroups,
        getAgentCustomers,
        agentCustomerGroup,
        getCopyAgentGroups,
        getAgentCustomerGroup
    }
 }
