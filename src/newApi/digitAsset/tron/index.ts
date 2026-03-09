import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/tron');
    }
    //
    getTrozenEnergyParams(params: TableQueryParams<TrozenEnergyParams>): Promise<TableDataPages<TrozenEnergyListData>> {
        return this.api.post('/energy/list', params);
    }
}

export default new Asset();
