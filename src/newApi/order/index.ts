import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/order');
    }
    getOrderList(params: TableQueryParams<OrderPoistParams>): Promise<TableDataPages<OrderPoistList>> {
        return this.api.post('/list', params);
    }
    sourceSelect(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/source/select');
    }
    
    // 导出
    orderListExport(params: any): Promise<Blob> {
        return this.api.post('/list/export', params, { responseType: 'blob' });
    }
    cancelReasonSelect(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/cancelReason/select');
    }
    statusSelect(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/status/select');
    }
    orderTypeSelec(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/orderType/select');
    }
}

export default new Asset();
