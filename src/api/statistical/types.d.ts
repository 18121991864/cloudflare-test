
// 收益统计数据
export interface RevenueStatisticsData {
    count: number; // 总成交笔数
    buyCount: number; // 买入笔数
    sellerCount: number; // 卖出笔数
    buyProfitCount: number; // 买入盈利笔数
    buyLossCount: number; // 买入亏损笔数
    sellProfitCount: number; // 卖出盈利笔数
    sellLossCount: number; // 卖出亏损笔数
    profitCountPct: string; // 盈利笔数占比(%)
    lossCountPct: string; // 亏损笔数占比(%)
    buyProfitAmount: string; // 买入盈利额
    buyLossAmount: string; // 买入亏损额
    sellProfitAmount: string; // 卖出盈利额
    sellLossAmount: string; // 卖出亏损额
    profitAmountPct: string; // 盈利额占比(%)
    lossAmountPct: string; // 亏损额占比(%)
    contractId: string; // 合约ID
    contractName: string; // 合约名称
    buySumAmount: string; // 总买入额
    sellSumAmount: string; // 总卖出额
    buySumVolume: string; // 总买入数量
    sellSumVolume: string; // 总卖出数量
}

export interface RevenueStatisticsParams {
    /** 合约ID(参考接口:/v1/order/contract/select) */
    contractId?: string;
    /** 第三方用户ID */
    thirdAccountId: string; // required, not blank
    /** 开始时间(时间戳,毫秒) */
    beginTime: string | number | null; // required, not blank
    /** 结束时间(时间戳,毫秒) */
    endTime: string | number | null; // required, not blank
}

