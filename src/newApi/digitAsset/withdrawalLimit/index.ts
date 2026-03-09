import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/withdraw/limit');
    }
    // 提币额度配置列表
    getWithdrawList(params: TableQueryParams<WithdrawlimitListParams>): Promise<TableDataPages<WithdrawlimitLisData>> {
        return this.api.get('/list', { params });
    }
    //修改提币额度配置
    updateWithdrawLimit(params: UpdateWithdrawlimitParams): Promise<any> {
        return this.api.post('/update', params);
    }
    //添加提币额度配置
    addWithdrawLimit(params: UpdateWithdrawlimitParams): Promise<any> {
        return this.api.post('/add', params);
    }
}

export default new Asset();
