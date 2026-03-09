import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/api/api';
class Accountwallet extends Api {
    constructor(url: string) {
        super(url);
    }
    // 钱包账户列表
    getAccountWalletList(params: TableQueryParams<GasParams>): Promise<TableDataPages<GasUpdataData>> {
        return this.api.post('/list', params);
    }
    // 钱包账户消耗类型列表
    getAccountWalletType(): Promise<{ code: number; name: string }[]> {
        return this.api.get('/type');
    }
}
export default new Accountwallet('/wallet/supplement');
