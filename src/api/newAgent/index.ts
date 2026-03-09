import { TableDataPages, TableQueryParams, TypeList } from '@/interface/StateType';
import { Api } from '../api';
import {
    AddAgentApply,
    AgentAuthPermissions,
    AuditParams,
    CallbackData,
    CallbackInfo,
    CallbackParams,
    CustomerGroupData,
    CustomerGroupParams,
    customerInfo,
    customerTypeData,
    customerTypeParams,
    listTypeData,
    listTypeParams,
    MemberListData,
    PermissionsList,
    PermissionsMenuList,
    RateData,
    RateInfoListParams,
    RateParams,
    RolesList,
    SettingListData,
    SettingListParams,
    TeamListData,
    TeamListParams,
} from './types.d';
class NewAgent extends Api {
    // 代理商准入列表
    fetchgetPageList(params: TableQueryParams<listTypeParams>): Promise<TableDataPages<listTypeData>> {
        return this.api.post('/agentApply/list', params);
    }
    // 代理商审核
    fetchSetAudit(params: AuditParams): Promise<any> {
        return this.api.post('/agentApply/audit', params);
    }
    // 代理商类型
    fetchGetOrderInfoList(): Promise<TypeList[]> {
        return this.api.get('/agentApply/chooseCategory');
    }

    // 代理商删除 agentApply/delete
    fetchDeleteAgentApply(params: { id: string }): Promise<any> {
        return this.api.post('/agentApply/delete', params);
    }

    
    // 新增代理商
    fetchAddAgentApply(params: AddAgentApply): Promise<any> {
        return this.api.post('/agentApply/save', params);
    }



    // 所属国家
    fetchGetCountry(): Promise<TypeList[]> {
        return this.api.get('/agentApply/getCountry');
    }
    
}

export default new NewAgent();
