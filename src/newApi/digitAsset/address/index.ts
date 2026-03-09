import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/wallet/address');
    }

    getAddressPage(params: TableQueryParams<AddressListParams>): Promise<TableDataPages<AddressListData>> {
        return this.api.post('/page', params);
    }
    addAddress(params: { agentId: string | null; chainId: string; number: string; walletSiteId: string | null }): Promise<any> {
        return this.api.post('/add', params);
    }
    updateStatusAddress(params: { discontinueReason?: string; id: string; status: number }): Promise<any> {
        return this.api.post('/status/update', params);
    }
    updateRemarkAddress(params: { id: string; remarks: string }): Promise<any> {
        return this.api.post('/remark', params);
    }
    getAddressStatus(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/status/select');
    }
    getAMLStatusSelect(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/aml/status/select');
    }
    //币种列表
    getAddressCoinList(params: AddressCoinListParams): Promise<AddressCoinListData[]> {
        return this.api.get('/coin/list', { params });
    }
    // 添加币种
    addAddressCoin(params: { id: string; coinId: string }): Promise<any> {
        return this.api.post('/coin/add', params);
    }
}

export default new Asset();
