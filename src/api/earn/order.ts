import { Api } from '../api';
import { TableDataPages, TableQueryParams } from '@/interface/StateType';
class ProEarn extends Api {
    constructor(url: string) {
        super(url);
    }
    // 订单详情列表
    getOrderEarnList(params: TableQueryParams<OrderParamsEarn>): Promise<TableDataPages<OrderDataEarn>> {
        return this.api.post('/list', params);
    }
    // 订单详情-导出
    getOrderEarnExport(params: TableQueryParams<OrderParamsEarn>): Promise<any> {
        return this.api.post('/export', params, { responseType: 'blob' });
    }
    // 订单管理统计
    getCountOrder(params: TableQueryParams<OrderParamsEarn>): Promise<any> {
        return this.api.post('/countOrder', params);
    }
    // 订单详情列表
    getOrderInfoList(params: { accountId?: string; productId?: string; orderNo?: string }): Promise<OrderInfoList> {
        return this.api.get('/infoList', { params });
    }
}
export default new ProEarn('/earn/order');
