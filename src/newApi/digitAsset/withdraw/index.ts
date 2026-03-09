import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/withdraw');
    }
    // 提币列表
    getWithdrawList(params: TableQueryParams<WithdrawListParams>): Promise<TableDataPages<WithdrawListData>> {
        return this.api.post('/page', params);
    }
    // 提币状态
    getWithdrawStateSelect(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/status/select');
    }
    // 审核状态
    getWithdrawReviewStatusSelect(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/review/status/select');
    }
    // 重新提币
    getWithdrawApplyReturn(params: { id: string }): Promise<any> {
        return this.api.post('/re/withdraw', params);
    }
    // 审核
    updateReview(params: { id: string; opPassword: string; reason: string; status: string; type: number }): Promise<any> {
        return this.api.post('/review', params);
    }
    // 审核列表
    getWithdrawReviewList(params: { id: string }): Promise<any> {
        return this.api.get('/review/list', { params });
    }
    // 提币类型
    getWithdrawTypeSelect(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/type/select');
    }
    // 提交转账结果
    submitTransferResult(params: { remark?: string; id: string; formAddress?: string; state: string | number; txHash?: string }): Promise<any> {
        return this.api.post('/submitResult', params);
    }
}

export default new Asset();
