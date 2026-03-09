import http from '@/servers/index';
import { TableResultType } from '@/interface/TableType';

abstract class Api {
    protected api: http;

    constructor() {
        const url = import.meta.env.VITE_APP_BASE_URL;
        const baseUrl: string = `${url}/shippingInformation`;
        this.api = new http({
            baseURL: baseUrl,
        });
    }

    // protected abstract verifyParamsSchema<T>(params: object, schema: object): T | null;  // 如果需要中间件拦截(参数验证等服务)，可以使用Joi集成服务
}

class FetchTest extends Api {
    list(params: {
        // 列表
        id?: string | null; //
        pageNo: number;
        pageSize: number;
    }): Promise<
        {
            list: {
                addressLine1: string; // 地址1
                addressLine2: string; // 地址2
                id: string; //
                city: string; // 城市
                country: string; // 国家
                createTime: string; // 时间
                email: string; // 邮箱
                fullName: string; // 全称
                phone: string; // 手机
                phoneArea: string; // 电话区号
                postCode: string; // 邮编
            }[];
        } & TableResultType
    > {
        // 风控列表
        return this.api.get('/list', { params });
    }

    export(params: {
        // 列表
        id?: string | null; //
        pageNo: number;
        pageSize: number;
    }): Promise<
        {
            list: {
                addressLine1: string; // 地址1
                addressLine2: string; // 地址2
                id: string; //
                city: string; // 城市
                country: string; // 国家
                createTime: string; // 时间
                email: string; // 邮箱
                fullName: string; // 全称
                phone: string; // 手机
                phoneArea: string; // 电话区号
                postCode: string; // 邮编
            }[];
        } & TableResultType
    > {
        // 风控列表
        return this.api.get('/export', { params, responseType: 'blob' });
    }
}

export default new FetchTest();
