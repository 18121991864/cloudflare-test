import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/tron/activate');
    }

    getTrozenActivateParams(params: TableQueryParams<TrozenActivateParams>): Promise<TableDataPages<TrozenActivateListData>> {
        return this.api.post('/address/page', params);
    }
    getTrozenActivateStatus(): Promise<
        {
            label: string;
            value: string;
            extend: any;
        }[]
    > {
        return this.api.get('/address/status/select');
    }
}

export default new Asset();
