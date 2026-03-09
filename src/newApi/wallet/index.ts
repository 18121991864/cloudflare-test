import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/wallet');
    }

    getwalletChoose(params?: { state?: 1 | null; walletType?: 1 }): Promise<
        {
            id: string;
            name: string;
            walletType: number;
        }[]
    > {
        return this.api.get('/site/chooseList', { params });
    }
}

export default new Asset();
