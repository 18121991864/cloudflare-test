import { TableResultType } from '@/interface/TableType';
import { Api } from '../api';
import { TableDataPages, TableQueryParams } from '@/interface/StateType';

class RiskAPI extends Api {
    constructor() {
        super('/card/risk');
    }
    // 风控配置列表
    getriskConfigList(params: TableQueryParams<RiskConfigParams>): Promise<TableDataPages<RiskConfigData>> {
        return this.api.post('/riskConfigList', params);
    }
    //获取风控类别
    getQueryRiskConfig(): Promise<QueryRiskCodeData[]> {
        return this.api.get('/queryRiskCode');
    }
    //添加风控配置
    addRiskConfig(params: UpdateRiskParams): Promise<any> {
        return this.api.post('/addRisk', params);
    }
    // 风控记录列表
    getRiskRecordList(params: TableQueryParams<RiskRecordListParams>): Promise<TableDataPages<RiskRecordListData>> {
        return this.api.post('/riskRecordList', params);
    }
}

export default new RiskAPI();
