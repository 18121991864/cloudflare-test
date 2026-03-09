import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/withdraw/address/config/');
    }
    // 提币路径列表
    getaddressWithdrawPage(params: TableQueryParams<WithdrawPathAddressListParams>): Promise<TableDataPages<WithdrawPathAddressListData>> {
        return this.api.post('page', params);
    }
    // 提币地址配置
    getAddressConfigSelect(params?: { chainId?: string; coinId?: string; status?: 1 | 2 }): Promise<
        {
            extend: any;
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('select', { params });
    }
    // 地址状态
    getaWithdrawStatus(): Promise<
        {
            extend: any;
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('status/select');
    }
    // 新增提币路径
    addWithdraPath(params: { address: string; chainId: string; coinId: string; name: string; opPassword: string }): Promise<any> {
        return this.api.post('add', params);
    }
    // 审核
    AuditWithdraPath(params: { id: string; opPassword: string; status: string }): Promise<any> {
        return this.api.post('audit', params);
    }
    // 更改状态
    UpateWithdraPathState(params: { id: string; status: number }): Promise<any> {
        return this.api.post('status/update', params);
    }
}

export default new Asset();
