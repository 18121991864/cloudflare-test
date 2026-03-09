import { Api } from '../api';
import { TableDataPages, TableQueryParams } from '@/interface/StateType';
class ProEarn extends Api {
    constructor(url: string) {
        super(url);
    }
    // 流水明细列表
    getAccLogCoinList(params: TableQueryParams<AccLogParams>): Promise<TableDataPages<AccLogData>> {
        return this.api.post('/accLog/list', params);
    }
    // 流水明细导出
    getAccLogCoinExport(params: TableQueryParams<AccLogParams>): Promise<any> {
        return this.api.post('/accLog/export', params, { responseType: 'blob' });
    }
    // 用户理财账户表
    getAccountAssetList(params: TableQueryParams<AccountAssetParams>): Promise<TableDataPages<AccountAssetData>> {
        return this.api.post('/bill/accountAssetList', params);
    }
    // 用户理财账户导出
    getAccountAccountAssetExport(params: TableQueryParams<AccountAssetParams>): Promise<any> {
        return this.api.post('/bill/accountAssetExport', params, { responseType: 'blob' });
    }
    // 理财资金转出记录
    getTransferListPro(params: TableQueryParams<TransferListProParams>): Promise<TableDataPages<TransferListProData>> {
        return this.api.post('/transfer/list', params);
    }
    // 理财资金转出记录-导出
    getTransferExportPro(params: TableQueryParams<TransferListProParams>): Promise<any> {
        return this.api.post('/transfer/export', params, { responseType: 'blob' });
    }
    // 理财资金转出设置列表
    getProTransferSettingList(params: TableQueryParams<ProTransferSettingParams>): Promise<TableDataPages<ProTransferSettingData>> {
        return this.api.post('/proTransfer/set/list', params);
    }
    // 理财资金转出设置新增或修改
    addUpdateProTransferSetting(params: UpdateProTransferSetting): Promise<any> {
        return this.api.post('/proTransfer/set/addOrUpdate', params);
    }
    // 理财资金转账设置
    getProTransferPushList(): Promise<ProTransferPushList[]> {
        return this.api.get('/proTransfer/set/pushList');
    }
    // 理财提币申请
    withdrawEarnCoin(params: { address: string; chainId: string; coinId: string; loginPassword: string; orderNo: string }): Promise<any> {
        return this.api.post('/transfer/withdrawEarnCoin', params);
    }
}
export default new ProEarn('/earn');
