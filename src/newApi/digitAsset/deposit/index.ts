//

import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('/order/deposit');
    }
    // 充币列表
    getDepositList(params: TableQueryParams<DepositListParams>): Promise<TableDataPages<DepositListData>> {
        return this.api.post('/list', params);
    }
    // 充值状态
    getDepositStateSelect(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/state/select');
    }
    // AML等级
    getDepositRiskLevelSelect(): Promise<
        {
            label: string;
            value: string;
        }[]
    > {
        return this.api.get('/risk/level/select');
    }
    // 退款
    getDepositApplyReturn(params: { address: string; orderNo: string; payPassword: string }): Promise<any> {
        return this.api.post('/apply/return', params);
    }
    // 申请提币
    getDepositApplyWithdraw(params: { withdrawConfigId: string; orderNo: string; payPassword: string }): Promise<any> {
        return this.api.post('/apply/withdraw', params);
    }
    // 风控列表
    getRiskInfo(params: { orderNo: string }): Promise<
        {
            ditchCode: string;
            ditchName: string;
            ditchValue: string;
            id: string;
            state: number;
            stateName: string;
        }[]
    > {
        return this.api.post('/risk/info', params);
    }
    // 提交AML结果
    getDepositSubmitAML(params: { orderNo: string; handleResult: number | null; payPassword: string }): Promise<any> {
        return this.api.post('/handle/risk', params);
    }
}

export default new Asset();
