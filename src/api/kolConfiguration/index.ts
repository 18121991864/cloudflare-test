import { Api } from '../api';
import type {
    ParameterData,
    ParameterList,
    ParameterEdit,
    KOLList,
    ParamsKOLList,
    KolRebateConfListParams,
    KolRebateConfList,
    AddOrUpdateKolRebateConfListParams,
    KOLInvitationList,
} from '@/api/kolConfiguration/types.d';
import type { Pagination } from '@/api/type';
import { TableQueryParams } from '@/interface/StateType';

class Parameter extends Api {
    fetchgetOpenConfigAddOrUpdate(params: ParameterEdit) {
        // 新增编辑
        return this.api.post('/agent/openConfig/addOrUpdate', params).then((result: any) => result);
    }

    fetchgetOpenConfigList(params: ParameterList) {
        // 管理员-列表
        interface _Response extends Pagination {
            list: ParameterData[];
        }
        // 列表
        return this.api.get('/agent/openConfig/list', { params }).then((result: any) => result as _Response);
    }
    fetchgetAccountId(params: { id: string }) {
        // 查询用户信息
        return this.api.get(`account/${params.id}`).then((result: any) => result);
    }
    fetchgetOpenConfigDel(params: { id: string }) {
        // 列表
        return this.api.get(`/agent/openConfig/del`, { params }).then((result: any) => result);
    }
    fetchGetKolInfluencerList(params: ParamsKOLList) {
        // 用户管理KOL列表
        interface _Response extends Pagination {
            list: KOLList[];
        }
        return this.api.post(`/kolInfluencer/list`, params).then((result: any) => result as _Response);
    }
    fetchGetKolRebateConfList(params: KolRebateConfListParams) {
        // 返佣配置列表
        interface _Response extends Pagination {
            list: KolRebateConfList[];
        }
        return this.api.post(`/KolRebateConf/list`, params).then((result: any) => result as _Response);
    }
    fetchGetKOLInvitationList(params: TableQueryParams<{ email: undefined | String; grade: undefined | number }>) {
        // KOL邀请列表
        interface _Response extends Pagination {
            list: KOLInvitationList[];
        }
        return this.api.get(`/kolApply/list`, { params }).then((result: any) => result as _Response);
    }
    // 查询用户是否存在 存在:true 不存在:false
    fetchGetKolInfluencerExistUser(params: { accountId: string }) {
        // 列表
        return this.api.get(`/kolInfluencer/existUser`, { params }).then((result: any) => result);
    }
    // KOL列表新增
    fetchGetKolInfluencerAdd(params: { accountId: String; email: String; globalCode: String; phone: String }) {
        // 列表
        return this.api.post(`/kolInfluencer/add`, params).then((result: any) => result);
    }
    // KOL启用/禁用
    fetchEnableKolInfluencer(params: { id: String; state: 1 | 2 | 3 }) {
        // 列表
        return this.api.get(`/kolInfluencer/enable`, { params }).then((result: any) => result);
    }
    // KOL启用/禁用
    fetchEnableKolRebateConfBatchOpenOrClose(params: { ids: string; state: 1 | 2 }) {
        // 列表
        return this.api.post(`/KolRebateConf/batchOpenOrClose`, params).then((result: any) => result);
    }
    // 批量删除 传id多个,隔开
    fetchKolRebateConfBatchDelete(params: { ids: string }) {
        // 列表
        return this.api.post(`/KolRebateConf/batchDelete`, params).then((result: any) => result);
    }
    // 添加/编辑返佣配置
    fetchGetKolRebateConfAddOrUpdate(params: AddOrUpdateKolRebateConfListParams) {
        // 列表
        return this.api.post(`/KolRebateConf/addOrUpdate`, params).then((result: any) => result);
    }

    // kol申请列表daochu
    kolApplyExport(params: { email: string; grade: number }) {
        return this.api.get('/kolApply/export', { params, responseType: 'blob' });
    }
}

export default new Parameter();
