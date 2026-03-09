import { Api } from '@/api/api';

class FetchTest extends Api {
    // 法币币种
    choose(): Promise<{
        id: string;
        symbol: string;
    }[]> {
        return this.api.get('/fiatMoney/choose');
    }
}

export default new FetchTest();
