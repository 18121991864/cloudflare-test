import http from '@/servers/index';
import type {
    CardList,
    CardListInfo,
    CountListData,
    CouponWriteOffList,
    CouponWriteOffListParams,
    CreateDiscountType,
    discountUseListData,
    discountUseListParams,
    DiscountDxListParams,
    DiscountDxList,
    infolData,
    QueryDiscountType,
} from './types';
import { TableDataPages, TableQueryParams } from '@/interface/StateType';
abstract class Api {
    protected api: http;

    constructor() {
        const url = String(import.meta.env.VITE_APP_BASE_URL);
        const baseUrl: string = `${url}/discount`;
        this.api = new http({
            baseURL: baseUrl,
        });
    }
}
class DisCount extends Api {
    /**
     * @description 创建优惠码
     * */
    CreateDisCountData(params: CreateDiscountType): Promise<any> {
        return this.api.post('/create', params);
    }
    /**
     *  @description 编辑
     * */
    UpdateDisCountData(params: CreateDiscountType): Promise<any> {
        return this.api.post('/update', params);
    }
    /**
     * @description 优惠码列表
     * */
    QueryDisCountData(params: TableQueryParams<QueryDiscountType>): Promise<TableDataPages<CountListData>> {
        return this.api.post('/discountList', params);
    }
    /**
     * @description 获取优惠码
     * */
    generateCouponCode(): Promise<any> {
        return this.api.get('/generateCouponCode');
    }
    /**
     * @description 卡片列表
     * */
    getditchCardList(params: TableQueryParams<{ cardName?: string }>): Promise<TableDataPages<CardList[]>> {
        return this.api.get('/ditchCardList', { params });
    }
    /**
     * @description 查看卡片详情列表
     * */
    getditchCardListInfo(params: TableQueryParams<{ discountInfoId: string }>): Promise<TableDataPages<CardListInfo>> {
        return this.api.get('/cardInfo', { params });
    }
    /**
     * @description 优惠码详情
     * */
    getdiscountInfo(params: { id: string }): Promise<infolData> {
        return this.api.get('/discountInfo', { params });
    }
    /**
     * @description 审核
     * */
    getditchCheck(params: { id: string; checkInfo: string }): Promise<any> {
        return this.api.post('/check', params);
    }
    /**
     *  @description 优惠码核销列表
     * */
    getDitchCouponWriteOffList(params: TableQueryParams<CouponWriteOffListParams>): Promise<TableDataPages<CouponWriteOffList>> {
        return this.api.get('/couponWriteOffList', { params });
    }
    /**
     *  @description 优惠码核销列表导出
     * */
    getDitchCouponWriteOffListExport(params: CouponWriteOffListParams): Promise<any> {
        return this.api.get('/couponWriteOffList/excelWriter', { params, responseType: 'blob' });
    }
    /**
     *  @description 定向码列表
     * */
    getDitchDiscountDxList(params: TableQueryParams<DiscountDxListParams>): Promise<TableDataPages<DiscountDxList>> {
        return this.api.get('/discountDxList', { params });
    }
    /**
     *  @description 失效
     * */
    SettDitchExpire(params: { id: number }): Promise<any> {
        return this.api.get('/expire', { params });
    }
    /**
     *  @description 优惠码效果数据
     * */
    discountUseInfo(params: { id: number }): Promise<any> {
        return this.api.get('/discountUseInfo', { params });
    }
    /**
     *  @description 优惠码使用明细列表
     * */
    discountUseList(params: TableQueryParams<discountUseListParams>): Promise<TableDataPages<discountUseListData>> {
        params.times = '';
        return this.api.get('/discountUseList', { params });
    }
    /**
     *  @description 优惠码使用明细列表
     * */
    getPromotion(params: { id: number }): Promise<any> {
        return this.api.get('/promotion', { params });
    }
    /**
     *  @description 失效
     * */
    takeBack(params: { grantId: number }): Promise<any> {
        return this.api.get('/takeBack', { params });
    }
    /**
     *  @description 查看卡片详情列表
     * */
    discountCardInfo(params: { grantId: number }): Promise<any> {
        return this.api.get('/cardInfo', { params });
    }

    // 下载模板文件
    discountTemplate() {
        return this.api.get('/download/template');
    }

    // 查询所有代理商
    agentList() {
        return this.api.get('/agent/list');
    }

    // 上传excel解析
    uploadExcel(params: { file: any }): Promise<string[]> {
        return this.api.post('/upload/excel', params, {
            headers: { Accept: 'application/json, ext/plain' },
        });
    }

    // 优惠卷标签列表
    labelList(params: {
        agents: { id: string; children: string[] }[]
    }) {
        return this.api.post('/labelList', params);
    }

    // 优惠卷用户列表
    accountList(params: {
        agents: { id: string; children: string[] }[]
    }): Promise<{ id: string; email: string; phone: string }[]> {
        return this.api.post('/accountList', params);
    }
}
export default new DisCount();
