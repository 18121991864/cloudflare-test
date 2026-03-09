import http from '@/servers/index';
import { Api } from '../api';
import type { _SnapshotParams, CutListTypeData, PlatformList, WalletAssetList, AssetSnapshotAmountTotal } from './types';
import { Pagination } from '../fetchTest';

class Snapshot extends Api {
    constructor() {
        super();
        const url = String(import.meta.env.VITE_APP_BASE_URL);
        const baseUrl: string = `${url}/virtual/bill`;
        this.api = new http({
            baseURL: baseUrl,
        });
    }
    // 平台数字资产快照列表
    featchPlatformAssetSnapshotList(params: _SnapshotParams): Promise<any> {
        interface _Response extends Pagination {
            list: PlatformList[];
        }
        return this.api.get('/platformAssetSnapshotList', { params }).then((res) => res as any as _Response);
    }
    // 平台数字资产快照统计
    featchPlatformAssetSnapshotCount(params: _SnapshotParams): Promise<any> {
        interface _Response extends Pagination {
            data: AssetSnapshotAmountTotal;
        }
        return this.api.get('/platformAssetSnapshotCount', { params }).then((res) => res as any as _Response);
    }
    // 平台数字资产快照导出
    featchPlatformAssetExcelWriter(params: _SnapshotParams): Promise<any> {
        return this.api.get('/platformAssetSnapshotList/excelWriter', { params, responseType: 'blob' }).then((res) => res);
    }
    //币币渠道资产快照列表
    featchWalletAssetSnapshotListt(params: _SnapshotParams): Promise<any> {
        interface _Response extends Pagination {
            list: WalletAssetList[];
        }
        return this.api.get('/walletAssetSnapshotList', { params }).then((res) => res as any as _Response);
    }
    // 币币渠道资产快照统计
    featchWalletAssetSnapshotCount(params: _SnapshotParams): Promise<any> {
        interface _Response extends Pagination {
            data: AssetSnapshotAmountTotal;
        }
        return this.api.get('/walletAssetSnapshotCount', { params }).then((res) => res as any as _Response);
    }
    // 币币快照导出
    featchWalletAssetExcelWriter(params: _SnapshotParams): Promise<any> {
        return this.api.get('/walletAssetSnapshotList/excelWriter', { params, responseType: 'blob' }).then((res) => res);
    }

    // 币币日切  平台日切
    featchPlatformAssetLogCutList(params: _SnapshotParams): Promise<any> {
        interface _Response extends Pagination {
            list: CutListTypeData[];
        }
        return this.api.get('/platformAssetLogCutList', { params }).then((res) => res as any as _Response);
    }
    // 币币日切  平台日切导出
    featchPlatformAssetLogExcelWriter(params: _SnapshotParams): Promise<any> {
        interface _Response extends Pagination {
            list: CutListTypeData[];
        }
        return this.api.get('/platformAssetLogCutList/excelWriter', { params, responseType: 'blob' }).then((res) => res as any);
    }
    // 币币日切  用户日切
    featchUserAssetLogCutList(params: _SnapshotParams): Promise<any> {
        interface _Response extends Pagination {
            list: CutListTypeData[];
        }
        return this.api.get('/userAssetLogCutList', { params }).then((res) => res as any as _Response);
    }
    // 币币日切   用户日切导出
    featchUserAssetLogExcelWriter(params: _SnapshotParams): Promise<any> {
        interface _Response extends Pagination {
            list: CutListTypeData[];
        }
        return this.api.get('/userAssetLogCutList/excelWriter', { params, responseType: 'blob' }).then((res) => res as any);
    }
}
export default new Snapshot();
