import type { TableDataPages, TableQueryParams } from '@/interface/StateType';
import type { TronenergyParams, TronenergyData } from './index.d';
import { Api } from '../api';

class FrozenEnergy extends Api {
    constructor(url: string) {
        super(url);
    }
    // 能量订单
    getFrozenEnergyList(params: TableQueryParams<TronenergyParams>): Promise<TableDataPages<TronenergyData>> {
        return this.api.post('/list', params);
    }
}
export default new FrozenEnergy('/tron/frozen/energy');
