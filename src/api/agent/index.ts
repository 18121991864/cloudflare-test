// eslint-disable-next-line max-classes-per-file
import { TableResultType } from '@/interface/TableType';
import { Api } from '../api';
import { Pagination } from '../type';

class Agent extends Api {
    fetchAgentChoose() {
        // 代理商下拉
        interface _Response {
            id: string;
            name: string; // 名称
            category: 1 | 2 | 3;
        }

        return this.api.get('/agent/choose').then((result: any) => result as _Response[]);
    }

    fetchUpdateState(params: {
        // 编辑状态
        id: string;
        state: 1 | 2; // 1=启用,2=禁用
    }) {
        return this.api.post('/agent/editStatus', params);
    }

    fetchAgentList(params: {
        agentId: string | null;
        name: string; // 名称
        status: 1 | 2 | null; // 状态：1=启用,2=禁用
        pageNo: number;
        pageSize: number;
    }) {
        // 代理商列表
        interface _Response extends Pagination {
            list: {
                createTime: string;
                id: string;
                name: string; // 名称
                inviterCode: string; // 邀请码
                state: 1 | 2; // 状态：1=启用,2=禁用
            };
        }

        return this.api.post('/agent/list', params).then((result: any) => result as _Response);
    }

    // 设置钱包 agent/updateWalletSite
    fetchUpdateWalletSite(params: {
        id: string;
        walletSiteId: string;
    }) {
        return this.api.post('/agent/updateWalletSite', params);
    }


}

export default new Agent();
