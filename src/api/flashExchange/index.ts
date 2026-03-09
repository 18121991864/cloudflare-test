import { Api } from '../api';
import type { TableDataPages, TableQueryParams, TypeList } from '@/interface/StateType';
import type {
    AddSwapLimitData,
    AddSwapRateData,
    AddSwapRateDataRetrun,
    AddTradingPairs,
    PageDealDetail,
    ParamsPageDealDetail,
    ParamsPageOraderData,
    ParamsPageOraderHostiryData,
    ParamsPageToEntrust,
    ParamsPageToEntrustHostiry,
    ParamsSwapRate,
    SwapLimitData,
    SwapRateData,
    TradingPairsData,
    TradingPairsDataParams,
    TyperadeLimit,
    TotalAmout,
} from '@/api/flashExchange/types.d';

class FlashExchange extends Api {
    // 交易对列表
    featchGetFlashList(params: TableQueryParams<TradingPairsDataParams>): Promise<TableDataPages<TradingPairsData>> {
        return this.api.post('/swapTrade/getPage', params);
    }
    //查询交易对
    featchGetTradeList(): Promise<TypeList[]> {
        return this.api.get('/swapTrade/getTrade');
    }
    //查询外部交易对
    featchgetExternalTrade(): Promise<TypeList[]> {
        return this.api.get('/swapTrade/getExternalTrade');
    }
    // 获取排序值
    featchGetSort(params: { id?: string }): Promise<TypeList[]> {
        return this.api.get('/swapTrade/getSort', { params });
    }
    // 添加/编辑交易对
    featchUpdateExternalTrade(params: AddTradingPairs): Promise<any> {
        return this.api.post('/swapTrade/edit', params);
    }
    // 查询费率
    featchGetPage(params: TableQueryParams<ParamsSwapRate>): Promise<TableDataPages<SwapRateData>> {
        return this.api.post('/swapRate/getPage', params);
    }
    // 新增/编辑费率
    featchUpdatePage(params: AddSwapRateData): Promise<AddSwapRateDataRetrun> {
        return this.api.post('/swapRate/edit', params);
    }
    // 删除费率
    featchDeletePage(params: { id: string }): Promise<any> {
        return this.api.post('/swapRate/delete', params);
    }

    // 查询限额限次
    featchGetSwapLimit(params: TableQueryParams<ParamsSwapRate>): Promise<TableDataPages<SwapLimitData>> {
        return this.api.post('/swapLimit/getPage', params);
    }
    // 新增限额限次
    featchUpdateSwapLimit(params: AddSwapLimitData): Promise<AddSwapRateDataRetrun> {
        return this.api.post('/swapLimit/edit', params);
    }
    // 获取外部交易对限制数据
    featchGetExternalTradeLimit(params: { id: string }): Promise<TyperadeLimit> {
        return this.api.post('/swapLimit/getExternalTradeLimit', params);
    }
    // 删除限额限次
    featchDeleteExternalTradeLimit(params: { id: string }): Promise<any> {
        return this.api.post('/swapLimit/delete', params);
    }
    // 委托订单
    featchGetPageToEntrust(params: TableQueryParams<ParamsPageToEntrust>): Promise<TableDataPages<ParamsPageOraderData>> {
        return this.api.post('/swapEntrust/getPageToEntrust', params);
    }
    // 委托订单-统计
    featchGetStatisticsToEntrust(params: TableQueryParams<ParamsPageToEntrust>): Promise<TotalAmout> {
        return this.api.post('/swapEntrust/getStatisticsToEntrust', params);
    }
    // 委托订单-导出
    featchExportToEntrust(params: TableQueryParams<ParamsPageToEntrust>): Promise<any> {
        return this.api.post('/swapEntrust/exportToEntrust', params, { responseType: 'blob' });
    }
    // 历史委托订单
    featchgetPageToEntrustHistory(params: TableQueryParams<ParamsPageToEntrustHostiry>): Promise<TableDataPages<ParamsPageOraderHostiryData>> {
        return this.api.post('/swapEntrust/getPageToEntrustHistory', params);
    }
    // 历史委托-统计
    featchGetStatisticsToEntrustHistory(params: TableQueryParams<ParamsPageToEntrustHostiry>): Promise<TotalAmout> {
        return this.api.post('/swapEntrust/getStatisticsToEntrustHistory', params);
    }
    // 历史委托订单-导出
    featchExportToEntrustHistory(params: TableQueryParams<ParamsPageToEntrustHostiry>): Promise<any> {
        return this.api.post('/swapEntrust/exportToEntrustHistory', params, { responseType: 'blob' });
    }
    // 成交详情
    featchGetPageToEntrustDealDetail(params: TableQueryParams<ParamsPageDealDetail>): Promise<TableDataPages<PageDealDetail>> {
        return this.api.post('/swapEntrust/getPageToEntrustDealDetail', params);
    }
    // 成交详情-统计
    featchGetStatisticsToEntrustDealDetail(params: TableQueryParams<ParamsPageToEntrustHostiry>): Promise<TotalAmout> {
        return this.api.post('/swapEntrust/getStatisticsToEntrustDealDetail', params);
    }
    // 成交详情-导出
    featchExportToEntrustDealDetail(params: TableQueryParams<ParamsPageDealDetail>): Promise<any> {
        return this.api.post('/swapEntrust/exportToEntrustDealDetail', params, { responseType: 'blob' });
    }
    //获得币种
    featchGetCurrency(): Promise<TypeList[]> {
        return this.api.get('/swapEntrust/getCurrency');
    }
    //获取委托类型;
    featchGetEntrustType(): Promise<TypeList[]> {
        return this.api.get('/swapEntrust/getEntrustType');
    }
    //获取有效期
    featchGetValidPeriod(): Promise<TypeList[]> {
        return this.api.get('/swapEntrust/getValidPeriod');
    }
    //获取订单状态
    featchGetOrderStatus(): Promise<TypeList[]> {
        return this.api.get('/swapEntrust/getOrderStatus');
    }
    //委托中订单-取消
    featchSwapEntrustCancel(params: { id: string; password: string }): Promise<any> {
        return this.api.post('/swapEntrust/cancel', params);
    }
}

export default new FlashExchange();
