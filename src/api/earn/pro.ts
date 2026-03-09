import { Api } from '../api';
import { TableDataPages, TableQueryParams } from '@/interface/StateType';
class ProEarn extends Api {
    constructor(url: string) {
        super(url);
    }
    // 理财产品列表
    getProEarnList(params: TableQueryParams<ProEarnParams>): Promise<TableDataPages<ProEarnData>> {
        return this.api.post('/list', params);
    }
    // 获取理财产品列表
    getProEarnProList(): Promise<ProEarnData[]> {
        return this.api.get('/proList');
    }
    // 新增/编辑理财产品列表
    addProEarnList(params: ProaddEarnList): Promise<any> {
        return this.api.post('/addOrUpDate', params);
    }
    // 编辑曝光范围列表
    updateExposure(params: ProaddEarnList): Promise<any> {
        return this.api.post('/updateExposure', params);
    }
    // 理财产品详情列表
    addProEarnInfoList(params: { id: string }): Promise<ProInfoData> {
        return this.api.get('/info', { params });
    }
    // 获取手动结算利率列表
    getSettleRateList(params: { productId: string }): Promise<ProRateList[]> {
        return this.api.get('/rateList', { params });
    }
    // 新增结算利率
    setAddManualRate(params: { productId: string; rate: any; type: any }): Promise<any> {
        return this.api.post('/addManualRate', params);
    }
    // 统计
    getProCountPro(params: TableQueryParams<ProEarnParams>): Promise<ProCountProList> {
        return this.api.post('/countPro', params);
    }
    // 发布
    Setpublish(params: { id: number }): Promise<any> {
        return this.api.get('/publish', { params });
    }
    // 持仓详情
    getHoldListDetails(params: TableQueryParams<ProHoldParams>): Promise<TableDataPages<ProHoldData>> {
        return this.api.post('/holdList', params);
    }
    // 新增或修改banner
    addOrUpdateBanner(params: { bannerSort: number; bannerUrl: string; id: string }): Promise<any> {
        return this.api.post('/addOrUpdateBanner', params);
    }
    // 理财产品限额限次
    getProLimitList(params: TableQueryParams<ProLimitParams>): Promise<TableDataPages<ProLimitData>> {
        return this.api.post('/set/list', params);
    }
    // 理财产品限额限次
    getProLimitAddOrUpdate(params: TableQueryParams<ProSetAddOrUpdate>): Promise<any> {
        return this.api.post('/set/addOrUpdate', params);
    }
    //编辑记录列表
    getProEditLogList(params: { id: string }): Promise<ProEditLogListData[]> {
        return this.api.get('/logList', { params });
    }
    // 选择理财产品
    getEarnProList(): Promise<ProEarnData[]> {
        return this.api.get('/proList');
    }
    // 删除
    deleteEditLogList(params: { id: string }): Promise<any> {
        return this.api.get('/set/delete', { params });
    }
}
export default new ProEarn('/earn/pro');
