import { Api } from '@/api/api';

class FetchTest extends Api {
    countryList(): Promise<
        {
            arName: string; // 阿拉伯语
            code: string; // code
            enName: string; // 英文
            name: string; // 中文
            ruName: string; // 俄语
        }[]
    > {
        // pobo国家列表
        return this.api.get('/country/list');
    }
}

export default new FetchTest();
