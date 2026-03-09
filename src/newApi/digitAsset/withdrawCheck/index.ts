import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/withdraw/check');
    }
    // 提币审核配置列表
    getWithdrawCheckList(params: TableQueryParams<WithdrawCheckListParams>): Promise<TableDataPages<WithdrawCheckListData>> {
        return this.api.get('/config/list', { params });
    }
    // 新增提币审核配置
    addWithdrawCheck(params: { amount: number; coinId: string; type: number; userId: string }): Promise<any> {
        return this.api.post('/config/add', params);
    }
    // 修改提币审核配置
    updateWithdrawCheck(params: { amount: number; id: string; userId: string }): Promise<any> {
        return this.api.post('/config/update', params);
    }
    // 删除
    deleteWithdrawCheck(params: { id: string }): Promise<any> {
        return this.api.post('/config/del', params);
    }
    // 修改状态
    updateWithdrawCheckState(params: { id: string }): Promise<any> {
        return this.api.post('/config/updateState', params);
    }
}

export default new Asset();
