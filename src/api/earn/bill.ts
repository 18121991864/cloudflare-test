import { Api } from '../api';
import { TableDataPages, TableQueryParams } from '@/interface/StateType';
class Bill extends Api {
    constructor(url: string) {
        super(url);
    }
    // 平台理财账户账务列表
    getPlatformList(params: TableQueryParams<BillPlatformParams>): Promise<TableDataPages<BillPlatformData>> {
        return this.api.post('/platform/list', params);
    }
    // 平台理财账户账务-手动快照
    getPlatformSnapshot(): Promise<any> {
        return this.api.get('/platform/snapshot');
    }
    // 平台理财账户账务快照列表
    getPlatformSnapshotList(params: TableQueryParams<BillPlatformSnapshotParams>): Promise<TableDataPages<BillPlatformSnapshotData>> {
        return this.api.post('/platform/snapshot/list', params);
    }
    // 平台理财账户账务快照-导出
    getPlatformSnapshotExport(params: TableQueryParams<BillPlatformSnapshotParams>): Promise<any> {
        return this.api.post('/platform/snapshot/export', params, { responseType: 'blob' });
    }
    // 平台理财账户账务日切列表
    getPlatformCutList(params: TableQueryParams<BillPlatformCutParams>): Promise<TableDataPages<BillPlatformCutData>> {
        return this.api.post('/platform/cut/list', params);
    }
    // 平台理财账户账务快照-导出
    getPlatformCutExport(params: TableQueryParams<BillPlatformCutParams>): Promise<any> {
        return this.api.post('/platform/cut/export', params, { responseType: 'blob' });
    }
    // 用户理财账户账务列表
    getUserAccoutList(params: TableQueryParams<BillUserParams>): Promise<TableDataPages<BillUserData>> {
        return this.api.post('/list', params);
    }
    // 用户理财账户账务-手动快照
    getUserSnapshot(): Promise<any> {
        return this.api.get('/snapshot');
    }
    // 用户理财账户账务快照列表
    getUserSnapshotList(params: TableQueryParams<BillUserSnapshotParams>): Promise<TableDataPages<BillUserSnapshotData>> {
        return this.api.post('/snapshot/list', params);
    }
    // 用户理财账户账务快照-导出
    getUserSnapshotExport(params: TableQueryParams<BillUserSnapshotParams>): Promise<any> {
        return this.api.post('/snapshot/export', params, { responseType: 'blob' });
    }
    // 用户理财账户账务日切列表
    getUserCutList(params: TableQueryParams<BillUserCutParams>): Promise<TableDataPages<BillUserCutData>> {
        return this.api.post('/cut/list', params);
    }
    // 用户理财户日切列表-导出
    getUserCutExport(params: TableQueryParams<BillUserCutParams>): Promise<any> {
        return this.api.post('/cut/export', params, { responseType: 'blob' });
    }
}
export default new Bill('/earn/bill');
