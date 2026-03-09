import type { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '../api';
import type { AddressData, AddressParams } from './address.d';
class FrozenEnergy extends Api {
    constructor(url: string) {
        super(url);
    }
    // 地址激活
    getAccountList(params: TableQueryParams<AddressParams>): Promise<TableDataPages<AddressData>> {
        return this.api.post('/account/list', params);
    }
    // 查询详情
    getissueInfo(): Promise<{ balance: string; fromAddress: string }> {
        return this.api.post('/issue/info');
    }
    // 地址下拉列表
    addressChooseList(): Promise<{ address: string; walletSystemId: string; walletSystemName: string }[]> {
        return this.api.post('/issue/addressChooseList');
    }
    // 设置地址
    addIssueSet(params: { fromAddress: string; walletSystemId: string }): Promise<any> {
        return this.api.post('/issue/set', params);
    }
    // 查询余额
    getIssueBlance(params: { address: string }): Promise<any> {
        return this.api.post('/issue/balance', params);
    }
}
export default new FrozenEnergy('/tron/activate');
