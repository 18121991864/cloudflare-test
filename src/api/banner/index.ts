import http from '@/servers/index';
import { TableResultType } from '@/interface/TableType';

abstract class Api {
    protected api: http;

    constructor() {
        const url = import.meta.env.VITE_APP_BASE_URL;
        const baseUrl: string = `${url}/banner`;
        this.api = new http({
            baseURL: baseUrl,
        });
    }

    // protected abstract verifyParamsSchema<T>(params: object, schema: object): T | null;  // 如果需要中间件拦截(参数验证等服务)，可以使用Joi集成服务
}

class FetchTest extends Api {
    fetchBannerAdd(params: {
        // 创建BANNER
        accountId: string; // 账号id
        createTime: string; // 创建时间
        rangeType: string; // 1、全局 2、用户
        scale: string; // 返佣百分比
        scaleType: string; // 1、开卡 2、充值 3、开卡减免
    }) {
        return this.api.post('/add', params);
    }

    fetchBannerDelete(id: number) {
        return this.api.get(`/delete?id=${id}`);
    }

    list(params: {
        // banner列表
        state: string | null; // 状态
        pageNo: number;
        pageSize: number;
    }): Promise<
        {
            list: {
                language: string; // 语言：zh-CN en-US
                platform: string; // 平台：1=web,2=pc
                id: string; //
                state: string; // 1启用，2禁用
                updateTime: string; // 修改时间
                uri: string; // URI
                small: string;
            }[];
        } & TableResultType
    > {
        return this.api.post('/list', params);
    }

    fetchBannerUpdateState(params: {
        // 编辑状态
        id: string;
        state: 1 | 2 | ''; // 状态：1=启用,2=禁用
    }) {
        return this.api.get('/updateState', { params });
    }

    fetchBannerUpdate(params: {
        // 编辑BANNER
        accountId: string; // 账号id
        createTime: string; // 创建时间
        id: string; //
        rangeType: string; // 1、全局 2、用户
        scale: string; // 返佣百分比
        scaleType: string; // 1、开卡 2、充值 3、开卡减免
    }) {
        return this.api.post('/update', params);
    }
}

export default new FetchTest();
