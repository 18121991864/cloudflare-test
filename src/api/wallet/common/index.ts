import { Api } from '@/api/api';

class Commonwallet extends Api {
    constructor(url: string) {
        super(url);
    }
    // 钱包品牌
    // @ts-ignore
    getTypeWalletList(params?: { ignoreUe?: boolean } = { ignoreUe: true }): Promise<{ code: number; name: string }[]> {
        return this.api.get('/type', { params });
    }
    // 系统钱包-钱包类型
    getsystemList(): Promise<{ code: number; name: string }[]> {
        return this.api.get('/system/type');
    }
}
export default new Commonwallet('/wallet');
