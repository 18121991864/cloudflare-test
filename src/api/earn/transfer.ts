import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '../api';
class TransferAddress extends Api {
    constructor(url: string) {
        super(url);
    }
    // 理财转出地址
    getTransAddressList(params: TableQueryParams<TransferAddressConfigParams>): Promise<TableDataPages<TransferAddressConfigData[]>> {
        return this.api.post('/config/list', params);
    }
    // 新增理财转出地址
    AddTransAddressList(params: AddTransAddressList): Promise<any> {
        return this.api.post('/config/add', params);
    }
    // 编辑理财转出地址
    UpdateTransAddressList(params: { chainId: string; id: string }): Promise<any> {
        return this.api.post('/config/update', params);
    }
    // 获取来源下拉
    getSourceList(): Promise<{ key: string; val: string }[]> {
        return this.api.get('/config/sourceList');
    }
    // 启用/禁用
    updateState(params: { id: string; googleCode: string }): Promise<any> {
        return this.api.get('/config/updateState', { params });
    }
}
export default new TransferAddress('/earn/transfer');
