import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/asset');
    }

    getAccountList(params: TableQueryParams<AccountListParams>): Promise<TableDataPages<AccountListData>> {
        return this.api.post('/account/list', params);
    }
    getAMLList(params: TableQueryParams<AMLListParams>): Promise<TableDataPages<AMLListData>> {
        return this.api.post('/aml/list', params);
    }
    getAddressList(params: TableQueryParams<AddressListParams>): Promise<TableDataPages<AddressListData>> {
        return this.api.post('/address/list', params);
    }
}

export default new Asset();
