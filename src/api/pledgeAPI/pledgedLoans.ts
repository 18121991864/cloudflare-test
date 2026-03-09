import { Api } from '../api';
import {
    PleAmoutCount,
    ParamsPledgedLoans,
    PledgedLoansList,
    UpdatePledgedLoansList,
    OrderPageParams,
    OrderPageList,
    SettlementInfo,
    InterestParams,
    InterestData,
    OrderInfoParams,
    OrderInfoData,
    CreditListParams,
    CreditListData,
    addOrUpdateParams,
    CoinListType,
} from './pledgedLoans.d';
import { TableDataPages, TableQueryParams } from '@/interface/StateType';
class PledgedLoans extends Api {
    // 质押借贷-币种列表
    fetchPledgeGetCoinConfigList(params: TableQueryParams<ParamsPledgedLoans>): Promise<TableDataPages<PledgedLoansList>> {
        return this.api.post('/pledge/coin/config/list', params);
    }
    // 质押借贷-币种总可借数量和剩余总量
    fetchPledgeGetcountCashPooling(params: TableQueryParams<ParamsPledgedLoans>): Promise<PleAmoutCount> {
        return this.api.post('/pledge/coin/config/countCashPooling', params);
    }
    // 质押借贷-币种新增/修改
    fetchPledgeUpatecountCashPooling(params: UpdatePledgedLoansList): Promise<any> {
        return this.api.post('/pledge/coin/config/addOrUpdate', params);
    }
    // 质押借贷-币种 状态修改
    fetchPledgechangeState(params: { id: string }): Promise<any> {
        return this.api.get('/pledge/coin/config/changeState', { params });
    }
    //质押币种列表
    fetcGetStakeCoinList(): Promise<CoinListType[]> {
        return this.api.get('/pledge/coin/config/stakeCoinList');
    }
    // 获取全局手续费率
    fetchGetGlobalProcessRate(): Promise<any> {
        return this.api.get('/pledge/coin/config/getGlobalProcessRate');
    }
    // 修改全局手续费率
    fetchUpdateGlobalProcessRate(params: { value: string | number }): Promise<any> {
        return this.api.get('/pledge/coin/config/updateGlobalProcessRate', { params });
    }
    // 订单列表
    fetchGetBorrowOrderList(params: TableQueryParams<OrderPageParams>): Promise<TableDataPages<OrderPageList>> {
        return this.api.post('/borrow/order/list', params);
    }
    // 订单导出
    fetchExportBorrowOrderList(params: TableQueryParams<OrderPageParams>): Promise<any> {
        return this.api.post('/borrow/order/export', params, { responseType: 'blob' });
    }
    // 手动结算
    fetchUpdateManualSettlement(params: { orderNo: string }): Promise<any> {
        return this.api.get('/borrow/order/manualSettlement', { params });
    }
    // 手动结算详情
    fetchGetmanualSettlementInfo(params: { orderNo: string }): Promise<SettlementInfo> {
        return this.api.get('/borrow/order/manualSettlementInfo', { params });
    }
    // 利息明细列表
    fetchGetOrderInterestList(params: TableQueryParams<InterestParams>): Promise<TableDataPages<InterestData>> {
        return this.api.post('/borrow/order/interestList', params);
    }
    // 订单明细列表
    fetchGetOrderInfoList(params: TableQueryParams<OrderInfoParams>): Promise<TableDataPages<OrderInfoData>> {
        return this.api.post('/borrow/order/infoList', params);
    }
    // 订单明细列表-导出
    fetchInfoExportOrderInfoList(params: TableQueryParams<OrderInfoParams>): Promise<TableDataPages<OrderInfoData>> {
        return this.api.post('/borrow/order/infoExport', params, { responseType: 'blob' });
    }
    // 用户列表
    fetchGetUserCreditList(params: TableQueryParams<CreditListParams>): Promise<TableDataPages<CreditListData>> {
        return this.api.post('/borrow/credit/list', params);
    }
    // 获取交易对
    fetchGetTradingPairList(): Promise<
        {
            tradingPair: string;
            id: number;
        }[]
    > {
        return this.api.get('/borrow/credit/tradingPair');
    }
    // 开启/关闭
    fetchCreditChangeState(params: { id: string }): Promise<any> {
        return this.api.get('/borrow/credit/changeState', { params });
    }
    // 新增/修改
    fetcAddOrUpdate(params: addOrUpdateParams): Promise<any> {
        return this.api.post('/borrow/credit/addOrUpdate', params);
    }
    // 订单明细业务类型
    fetcOrderInfoTypeList(): Promise<any[]> {
        return this.api.get('/borrow/order/orderInfoTypeList');
    }
    // 是否有再借订单
    fetChasBorrowOrder(params: { accountId: string; borrowCryptoId: string | number }): Promise<any[]> {
        return this.api.get('/borrow/credit/hasBorrowOrder', { params });
    }

    // 代理商列表
    creditAgents(): Promise<{
        category: 1 | 2 | 3; // 类型 1:白标,2:代理商,3:商户
        id: string; // ID
        name: string; // 名称
    }[]> {
        return this.api.get('/borrow/credit/agents')
    }
}

export default new PledgedLoans();
