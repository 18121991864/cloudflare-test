import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/coin');
    }

    getCoinlList(params: TableQueryParams<CoinListParams>): Promise<TableDataPages<CoinListData>> {
        return this.api.post('/list', params);
    }
    updateCoin(params: UpdateCoinParams): Promise<any> {
        return this.api.post('/update', params);
    }
    getSymbolSelect(params: { status?: number }): Promise<
        {
            label: string;
            value: string;
            extend: any;
        }[]
    > {
        return this.api.get('/symbol/select', { params });
    }
    getChainSelect(params: { status?: number }): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/chain/select', { params });
    }
    getCoinSelect(params: { status?: number; chainId?: string }): Promise<
        {
            label: string;
            value: string;
            extend: any;
        }[]
    > {
        return this.api.get('/select', { params });
    }
}

export default new Asset();
