import type { TableQueryParams, TableDataPages } from '@/interface/StateType';
import { Api } from '../api';
class AssetTendsList extends Api {
    constructor() {
        super('/earn/monitor/tends');
    }
    /**
     * 资产动向列表
     */
    getMonitorTendsList(params: TableQueryParams<Partial<AssetTendsList>>): Promise<TableDataPages<AssetTendsData>> {
        return this.api.post('/list', params);
    }
    /**
     * 产品列表
     */
    getproductsList(): Promise<AssetproductsData[]> {
        return this.api.get('/products');
    }
    /**
     * 状态列表
     */
    getStatesList(): Promise<{ name: string; id: number }[]> {
        return this.api.get('/states');
    }
    /**
     * 子账户列表
     */
    getAccountsList(params: { isAdd: boolean }): Promise<{ name: string; id: number }[]> {
        return this.api.get('/accounts', { params });
    }

    /**
     * 币种列表
     */
    getCoinsList(): Promise<{ name: string; id: number }[]> {
        return this.api.get('/coins');
    }
    /**
     * 团队列表
     */
    getTeamsList(): Promise<{ name: string; id: number }[]> {
        return this.api.get('/teams');
    }
    /**
     * 添加资产动向
     */
    addMonitorTends(params: AddMonitorTendsData): Promise<any> {
        return this.api.post('/add', params);
    }
    /**
     * 归还资金
     */
    getMonitorReturnList(params: { id: string; remark: string; returnQuantity: string }): Promise<any> {
        return this.api.post('/return', params);
    }
    /**
     * 开始监控
     */
    getMonitorStartID(params: { id: string }): Promise<any> {
        return this.api.post('/start', params);
    }
    /**
     * 追加资金列表
     */
    getMonitoAppendsList(params: { monitorTendsId: string }): Promise<any> {
        return this.api.get('/appends', { params });
    }
    /**
     * 追加注入资金
     */
    getMonitoAppendsAdd(params: { appendQuantity: string; monitorTendsId: string }): Promise<any> {
        return this.api.post('/append/add', params);
    }
    /**
     * 详情
     */
    getMonitoAppendsDetail(params: { monitorTendsId: string }): Promise<TendsAppendsDetail> {
        return this.api.get('/get', { params });
    }
    /**
     * 明细
     */
    getMonitoTendsDetail(params: { days: string; id: string }): Promise<TendsMonitoDetail> {
        return this.api.get('/detail', { params });
    }
    /**
     * 编辑备注
     */
    getMonitoEidtRemark(params: { remark: string; id: string }): Promise<any> {
        return this.api.post('/remark/edit', params);
    }
    // 可选择范围
    getMonitoPullList(): Promise<TendsMonitoPullParams[]> {
        return this.api.get('/pullList');
    }
    // 获取子账户资金数量
    getTendsamountList(params: { id: string }): Promise<any> {
        return this.api.get('/amount', { params });
    }
    // 获取子账户资金列表
    getTendsRestutionamountList(params: { id: string }): Promise<TendsRestutionAmountList> {
        return this.api.get('/amountList', { params });
    }
}
export default new AssetTendsList();
