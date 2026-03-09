import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/agent');
    }

    getAgentChoose(): Promise<
        {
            category: number;
            id: number;
            name: string;
        }[]
    > {
        return this.api.get('/choose');
    }
}

export default new Asset();
