import { Api } from '../api';
import { TableDataPages, TableQueryParams } from '@/interface/StateType';
class ProEarn extends Api {
    constructor(url: string) {
        super(url);
    }
    // 币种-统计
    getStatisticalCoinList(params: { endTime: string; startTime: string }): Promise<StatisticalCoinData[]> {
        return this.api.post('/coin', params);
    }
    // 币种-导出
    getStatisticalCoinExport(params: { endTime: string; startTime: string }): Promise<any> {
        return this.api.post('/exportCoin', params, { responseType: 'blob' });
    }
    // 产品-统计
    getStatisticalProductList(params: { endTime: string; startTime: string }): Promise<StatisticalProduct[]> {
        return this.api.post('/product', params);
    }
    // 产品-导出
    getStatisticalProductExport(params: { endTime: string; startTime: string }): Promise<any> {
        return this.api.post('/exportProduct', params, { responseType: 'blob' });
    }
    // 产品类型-统计
    getStatisticalProductTypeList(params: { endTime: string; startTime: string }): Promise<StatisticalProductType[]> {
        return this.api.post('/productType', params);
    }
    // 产品类型-导出
    getStatisticalProductExportType(params: { endTime: string; startTime: string }): Promise<any> {
        return this.api.post('/exportProductType', params, { responseType: 'blob' });
    }
}
export default new ProEarn('/earn/statistical');
