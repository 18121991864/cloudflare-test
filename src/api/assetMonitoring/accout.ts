import { Api } from '../api';
import type { TableQueryParams, TableDataPages } from '@/interface/StateType';
class AccoutMonitoringList extends Api {
    constructor() {
        super('/earn/monitor/account');
    }
    /**
     * 理财子账户列表
     */
    getAccountMonitoringList(
        params: TableQueryParams<{
            productId: string;
            source: string;
            teamId: string;
            uid: string;
        }>
    ): Promise<TableDataPages<AccoutMonitoringData>> {
        return this.api.post('/list', params);
    }
    /**
     * 添加子账户列表
     */
    AddAccountList(params: {
        accountId: string;
        key: string;
        secret: string;
        source: string;
        uid: string;
    }): Promise<TableDataPages<AccoutMonitoringData>> {
        return this.api.post('/add', params);
    }

    /**
     * 管理资金详情
     */
    getManagedFundAccountList(params: { days: string; id: string }): Promise<TendsMonitoDetail> {
        return this.api.get('/managedFund', { params });
    }
    /**
     * 管理资金详情
     */
    getAccountTotalValue(
        params: TableQueryParams<{
            productId: string;
            source: string;
            teamId: string;
            uid: string;
        }>
    ): Promise<any> {
        return this.api.get('/totalValue', { params });
    }
}
export default new AccoutMonitoringList();
