import http from '@/servers/index';
import { Api } from '../api';
import type { RevenueStatisticsParams, RevenueStatisticsData } from './types';

class statistical extends Api {
    constructor() {
        super();
        const url = String(import.meta.env.VITE_APP_BASE_URL);
        const baseUrl: string = `${url}/order`;
        this.api = new http({
            baseURL: baseUrl,
        });
    }
    // 收益统计
    featchRevenueStatistics(params: RevenueStatisticsParams): Promise<any> {
        return this.api.post('/trade/detail/statistics', params).then((res) => res as any as RevenueStatisticsData[]);
    }
    // /select  contractId 选择
    contractIdSelect(): Promise<any> {
        return this.api.get('/contract/select');
    }
}
export default new statistical();
