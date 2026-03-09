import type { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '../api';
import type { SiteData, SiteParams } from './site.d';
class Sitewallet extends Api {
    constructor(url: string) {
        super(url);
    }
    // 钱包设置
    getSiteWalletList(params: TableQueryParams<SiteParams>): Promise<TableDataPages<SiteData>> {
        return this.api.post('/list', params);
    }
    // 钱包名称筛选
    // @ts-ignore
    getChooseListList(params?: { walletType?: number; state?: 1 } = {}): Promise<{ id: string; name: string; walletType: 1 | 2 }[]> {
        return this.api.get('/chooseList', { params });
    }
    // 新增钱包设置
    addSiteWallet(params: { name: string; walletType: number }): Promise<any> {
        return this.api.post('/add', params);
    }
    // 编辑钱包设置
    updateSiteWallet(params: { name: string }): Promise<any> {
        return this.api.post('/update', params);
    }
    // 更新钱包设置状态
    updateStateSiteWallet(params: { googleCode: string; id: string; state: 1 | 2 | 3 }): Promise<any> {
        return this.api.post('/updateState', params);
    }
}

export default new Sitewallet('/wallet/site');
