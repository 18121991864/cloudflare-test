import { Api } from '../api';
import type { TableQueryParams, TableDataPages } from '@/interface/StateType';
class AssetCutCommonList extends Api {
    constructor() {
        super('/earn/monitor');
    }
    /**
     * 投资账户日切列表
     */
    getAccountingSnapshotList(params: TableQueryParams<AccountCutCommonParams>): Promise<TableDataPages<AccountCutCommonData>> {
        return this.api.post('/accountCut/list', params);
    }
    /**
     * 投资账户日切列表-导出
     */
    getAccountingSnapshotExport(params: TableQueryParams<AccountCutCommonParams>): Promise<any> {
        return this.api.post('/accountCut/export', params, { responseType: 'blob' });
    }
}
export default new AssetCutCommonList();
