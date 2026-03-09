import { Api } from '../api';
import type { TableQueryParams, TableDataPages } from '@/interface/StateType';
class AssetReturnList extends Api {
    constructor() {
        super('/earn/monitor/return');
    }
    /**
     * 资金归还列表
     */
    getMonitorReturnList(params: TableQueryParams<AssetReturnListParams>): Promise<TableDataPages<AssetReturnListData>> {
        return this.api.post('/list', params);
    }
    /**
     * 资金归还详情
     */
    getMonitorReturnDetail(params: { id: string }): Promise<TendsAppendsDetail> {
        return this.api.get('/get', { params });
    }
    /**
     * 编辑备注
     */
    getReturnEidtRemark(params: { remark: string; id: string }): Promise<TendsAppendsDetail> {
        return this.api.post('/remark/edit', params);
    }
    // 资金明细
    getTendsRestutionamountInfo(params: { tendId: string }): Promise<TendsAmoutInfo[]> {
        return this.api.get('/amountInfo', { params });
    }
}
export default new AssetReturnList();
