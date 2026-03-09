import { Api } from '../api';
import type { TableQueryParams, TableDataPages } from '@/interface/StateType';
class AssetTeamList extends Api {
    constructor() {
        super('/earn/monitor/team');
    }
    /**
     * 团队列表
     */
    getTeamList(params: TableQueryParams<{ name: string }>): Promise<TableDataPages<AssetTeamListData>> {
        return this.api.post('/list', params);
    }
    /**
     * 新增列表
     */
    AddOrUpdateTeamList(params: { id: string; name: string; remark: string }): Promise<any> {
        return this.api.post('/addOrUpdate', params);
    }
    /**
     * 获取团队资金详情
     */
    getListDataFund(params: { id: string }): Promise<getTeamFundData> {
        return this.api.get('/getFund', { params });
    }
    /**
     * 管理资金详情
     */
    getAccountTotalValue(params: TableQueryParams<{ name: string }>): Promise<any> {
        return this.api.get('/totalValue', { params });
    }
}
export default new AssetTeamList();
