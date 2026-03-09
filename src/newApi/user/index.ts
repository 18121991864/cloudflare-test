import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/account');
    }

    getAccountList(params: TableQueryParams<AccountListParams>): Promise<TableDataPages<AccountListData>> {
        return this.api.post('/list', params);
    }
    getAccountKeyList(params: TableQueryParams<AccountKeyListParams>): Promise<TableDataPages<AccountKeyListData>> {
        return this.api.post('/keyList', params);
    }
    updateAuditState(params: { id: string; remark: string; state: string }): Promise<any> {
        return this.api.post('/audit', params);
    }
    // 审核key
    updateKeyAuditState(params: { id: string; remark: string; state: string; strategyVersionList?: { strategyId: string; strategyVersionId: string }[] }): Promise<any> {
        return this.api.post('/auditKey', params);
    }
    // 设置付费用户
    categoryUpdate(params: { id: string; category: string }): Promise<any> {
        return this.api.post('/category/update', params);
    }
    // 导出
    keyListExport(params: any): Promise<Blob> {
        return this.api.post('/keyList/export', params, { responseType: 'blob' });
    }
}

export default new Asset();
