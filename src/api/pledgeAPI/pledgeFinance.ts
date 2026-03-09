import http from '@/servers/index';
import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import type {
    AssetCutListData,
    AssetListData,
    AssetListParams,
    borrowUserAssetLogData,
    borrowUserAssetLogParams,
    labelTypes,
    PageSnapshotData,
    PageSnapshotParams,
    PageToAssetData,
    PageToAssetLogData,
    PageToAssetLogParams,
    PageToAssetParams,
    ToAssetCutData,
    ToAssetCutParams,
    ToAssetDataType,
    ToAssetParamsType,
} from './pledgeFinance.d';
abstract class Api {
    protected api: http;
    constructor() {
        const url = import.meta.env.VITE_APP_BASE_URL;
        const baseUrl: string = `${url}`;
        this.api = new http({
            baseURL: baseUrl,
        });
    }
}
class Pledgfinance extends Api {
    //用户质押借贷账户列表
    fetchBorrowUserAssetList(params: TableQueryParams<AssetListParams>): Promise<TableDataPages<AssetListData>> {
        return this.api.post('/borrow/user/asset/list', params);
    }
    //用户质押借贷账户-导出
    fetchExportBorrowUserAssetList(params: TableQueryParams<AssetListParams>): Promise<any> {
        return this.api.post('/borrow/user/asset/export', params, { responseType: 'blob' });
    }
    //平台质押借贷账户列表
    fetchGetPageToAsset(params: TableQueryParams<PageToAssetParams>): Promise<TableDataPages<PageToAssetData>> {
        return this.api.post('/borrowPlatformAsset/getPageToAsset', params);
    }
    //平台质押借贷账户列表-导出
    fetchExportPageToAsset(params: TableQueryParams<PageToAssetParams>): Promise<any> {
        return this.api.post('/borrowPlatformAsset/exportToAsset', params, { responseType: 'blob' });
    }
    //用户质押借贷账户流水
    fetchBorrowUserAssetLogList(params: TableQueryParams<borrowUserAssetLogParams>): Promise<TableDataPages<borrowUserAssetLogData>> {
        return this.api.post('/borrow/user/asset/borrowUserAssetLogList', params);
    }
    //用户质押借贷账户流水-导出
    fetchExportBorrowUserAssetLogList(params: TableQueryParams<borrowUserAssetLogParams>): Promise<TableDataPages<borrowUserAssetLogData>> {
        return this.api.post('/borrow/user/asset/exportBorrowUserAssetLogList', params, { responseType: 'blob' });
    }
    //平台质押借贷账户流水
    fetchGetPageToAssetLog(params: TableQueryParams<PageToAssetLogParams>): Promise<TableDataPages<PageToAssetLogData>> {
        return this.api.post('/borrowPlatformAsset/getPageToAssetLog', params);
    }
    //平台质押借贷账户流水-导出
    fetchExportPageToAssetLog(params: TableQueryParams<PageToAssetLogParams>): Promise<TableDataPages<PageToAssetLogData>> {
        return this.api.post('/borrowPlatformAsset/exportToAssetLog', params, { responseType: 'blob' });
    }
    // 平台-查询动账类型
    getTransactionType(): Promise<labelTypes[]> {
        return this.api.get('/borrowPlatformAsset/getTransactionType');
    }
    // 流水-查询业务类型
    getBusinessType(): Promise<labelTypes[]> {
        return this.api.get('/borrow/user/asset/getBusinessType');
    }
    // 平台生成快照
    setPlatformAssetSnapshot(params?: { ids: string }): Promise<labelTypes[]> {
        return this.api.post('/borrowPlatformAsset/exportToEntrustDealDetail', params);
    }
    // 用户生成快照
    setUserAssetSnapshot(): Promise<labelTypes[]> {
        return this.api.get('/borrow/user/asset/snapshot');
    }
    //查询快照类型
    getSnapshotType(): Promise<labelTypes[]> {
        return this.api.get('/borrowPlatformAsset/getSnapshotType');
    }
    //平台质押借贷账户快照-分页查询
    getPageToAssetSnapshot(params: TableQueryParams<ToAssetParamsType>): Promise<TableDataPages<borrowUserAssetLogData>> {
        return this.api.post('/borrowPlatformAsset/getPageToAssetSnapshot', params);
    }
    //平台质押借贷账户快照-导出
    fetchExportToAssetSnapshot(params: TableQueryParams<ToAssetDataType>): Promise<TableDataPages<any>> {
        return this.api.post('/borrowPlatformAsset/exportToAssetSnapshot', params, { responseType: 'blob' });
    }
    //用户质押借贷账户快照-分页查询
    getPageSnapshotList(params: TableQueryParams<PageSnapshotParams>): Promise<TableDataPages<PageSnapshotData>> {
        return this.api.post('/borrow/user/asset/snapshotList', params);
    }
    //用户质押借贷账户快照-导出
    fetchExportSnapshotList(params: TableQueryParams<PageSnapshotParams>): Promise<TableDataPages<any>> {
        return this.api.post('/borrow/user/asset/exportSnapshotList', params, { responseType: 'blob' });
    }

    //平台质押借贷账户日切-分页查询
    getPageToAssetCut(params: TableQueryParams<ToAssetCutParams>): Promise<TableDataPages<ToAssetCutData>> {
        return this.api.post('/borrowPlatformAsset/getPageToAssetCut', params);
    }
    //平台质押借贷账户日切-导出
    fetchExportToAssetCut(params: TableQueryParams<ToAssetCutParams>): Promise<TableDataPages<any>> {
        return this.api.post('/borrowPlatformAsset/exportToAssetCut', params, { responseType: 'blob' });
    }
    //用户质押借贷账户日切-分页查询
    getUserAssetCutList(params: TableQueryParams<PageSnapshotParams>): Promise<TableDataPages<AssetCutListData>> {
        return this.api.post('/borrow/user/asset/cutList', params);
    }
    //用户质押借贷账户日切-导出
    ExportUserAssetCutList(params: TableQueryParams<PageSnapshotParams>): Promise<TableDataPages<any>> {
        return this.api.post('/borrow/user/asset/exportCutList', params, { responseType: 'blob' });
    }
}

export default new Pledgfinance();
