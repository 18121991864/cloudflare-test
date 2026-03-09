import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/strategy');
    }

    getStrategyPage(params: TableQueryParams<{ name: string }>): Promise<TableDataPages<PolicyManageList>> {
        return this.api.get('/page', { params });
    }
    getStrategyAccountPage(params: TableQueryParams<{ uid: string; status: number }>): Promise<TableDataPages<PolicyManageList>> {
        return this.api.get('/account/page', { params });
    }
    getStatusySelect(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/account/status/select');
    }
    updateStrategyPage(params: UpdateStrategyPage): Promise<any> {
        return this.api.post('/update', params);
    }
    // 策略版本列表(分页) /version/page
    getStrategyVersionPage(params: TableQueryParams<{ strategyId: string; pageNo?: number; pageSize?: number }>): Promise<TableDataPages<StrategyVersionList>> {
        return this.api.get('/version/page', { params });
    }
    getStrategyVersionList(params?: { accountId: string }): Promise<{ id: string, name: string, strategyVersionId: string, versionList: { versionName: string; id: string}, gridTradeStatus: string, isGridTrade: string, isMutualTrade: string;  }[]> {
        return this.api.get('/version/select', { params });
    }
    // /updateAccountVersion
    updateAccountVersion(params: { id: string; strategyVersionId: string }): Promise<any> {
        return this.api.post('/updateAccountVersion', params);
    }
    // 开启/关闭网格交易 grid/status/update
    updateGridStatus(params: { accountStrategyId: string; status: string }): Promise<any> {
        return this.api.post('/grid/status/update', params);
    }
    // 开启/关闭对刷刷量 grid/status/update
    updateMutualStatus(params: { accountStrategyId: string; status: string }): Promise<any> {
        return this.api.post('/mutual/status/update', params);
    }
}

export default new Asset();
