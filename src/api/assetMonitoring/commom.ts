import { Api } from '../api';
import type { TableQueryParams, TableDataPages } from '@/interface/StateType';
class AssetCommonList extends Api {
    constructor() {
        super('/earn/monitor');
    }
    /**
     * 预警信息列表
     */
    getWarningList(params: TableQueryParams<{ endTime: string; startTime: string }>): Promise<TableDataPages<WarningCommonLog>> {
        return this.api.post('/warningLog/list', params);
    }
    /**
     * 流水明细
     */
    getFlowListData(params: TableQueryParams<FlowCommonParams>): Promise<TableDataPages<FlowCommonListData>> {
        return this.api.post('/flow/list', params);
    }
    /**
     * 币种类型
     */
    getFlowListCoins(): Promise<{ id: string; name: string }[]> {
        return this.api.get('/flow/coins');
    }
    /**
     * 流水类型
     */
    getFlowTypesCoins(): Promise<{ id: string; name: string }[]> {
        return this.api.get('/flow/flowTypes');
    }
    /**
     * 产品类型
     */
    getProductTypesCoins(): Promise<{ id: string; name: string }[]> {
        return this.api.get('/flow/productTypes');
    }

    /**
     * 投资账户列表
     */
    getInvestmentData(params: TableQueryParams<InvestmentCommonParams>): Promise<TableDataPages<InvestmentCommonData>> {
        return this.api.post('/investment/list', params);
    }
    /**
     * 投资账务列表
     */
    getAccountingCommonList(params: TableQueryParams<AccountCommonParams>): Promise<TableDataPages<AccountCommonData>> {
        return this.api.post('/accounting/list', params);
    }
}
export default new AssetCommonList();
