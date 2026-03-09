import { Api } from '../api';
import type { TableQueryParams, TableDataPages } from '@/interface/StateType';
class AssetSnapCommonList extends Api {
    constructor() {
        super('/earn/monitor');
    }
    /**
     * 投资账户快照
     */
    getAccountingSnapshotList(params: TableQueryParams<AssetSnapCommonParams>): Promise<TableDataPages<AssetSnapCommonData>> {
        return this.api.post('/account/snap/list', params);
    }
    /**
     * 投资账户快照-导出
     */
    getAccountingSnapshotExport(params: TableQueryParams<AssetSnapCommonParams>): Promise<any> {
        return this.api.post('/account/snap/export', params, { responseType: 'blob' });
    }
    /**
     * 子投资账户快照
     */
    getSubAccountSnapList(params: TableQueryParams<SubSnapAccountParams>): Promise<TableDataPages<SubSnapAccountData>> {
        return this.api.post('/subAccountSnap/list', params);
    }
    /**
     * 子投资账户生成快照
     */
    getSubAccountSnapshot(): Promise<any> {
        return this.api.get('/subAccountSnap/snapshot');
    }
    /**
     * 子投资账户快照-导出
     */
    getSubAccountSnapExport(params: TableQueryParams<SubSnapAccountParams>): Promise<any> {
        return this.api.post('/subAccountSnap/export', params, { responseType: 'blob' });
    }
    /**
     * 子投资账户明细
     */
    getSubAccountSnapInfo(params: { id: string }): Promise<{ amount: string; quantity: string; symbol: string }[]> {
        return this.api.get('/subAccountSnap/info', { params });
    }
    /**
     * 投资账户快照-手动快照
     */
    getAccountSnapshot(): Promise<any> {
        return this.api.get('/account/snap/snapshot');
    }
}
export default new AssetSnapCommonList();
