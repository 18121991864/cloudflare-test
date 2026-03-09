export interface TradingPairsDataParams {
    limitPriceBuySwitch: number | '';
    limitPriceSellSwitch: number | '';
    marketPriceBuySwitch: number | '';
    marketPriceSellSwitch: number | '';
    marketShow: number | '';
    status: number | '';
    tradeId?: string | '';
    transactionShow: number | '';
}

export interface TradingPairsData extends TradingPairsDataParams {
    coinFormSymbol: string;
    coinFromId: string;
    coinToId: string;
    coinToSymbol: string;
    countPrecision: number;
    createTime: string;
    id: string;
    marketPriceRate: string;
    pricePrecision: number;
    quotaPrecision: number;
    sort: number;
    tradeName: string;
    updateTime: string;
}

export interface AddTradingPairs extends TradingPairsDataParams {
    countPrecision: number | '';
    id?: string;
    marketPriceRate: number | '';
    pricePrecision: number | '';
    quotaPrecision: number | '';
    sort?: number;
}
// 查询费率
export interface ParamsSwapRate {
    limitRange: 1 | 2 | 3 | '';
    status: 1 | 2 | '';
    tradeId?: string;
}
// 费率数据
export interface SwapRateData extends ParamsSwapRate {
    createTime: string;
    id: string;
    limitValue: string;
    limitValueName: string;
    maker: string;
    taker: string;
    tradeName: string;
    updateTime: string;
    tradeStatus: number;
    rebateRangeValue?: string;
}
// 新增编辑
export interface AddSwapRateData extends ParamsSwapRate {
    id: string;
    limitValue?: string;
    maker: number | '';
    taker: number | '';
}
// 新增编辑返回值
export interface AddSwapRateDataRetrun {
    alreadySetLimitValue: string[];
    errorLimitValue: string[];
    notSetLimitValue: string[];
    alreadyUserSetLimitValue: string[];
    errorUserLimitValue: string[];
    notSetUserLimitValue: string[];
    result: boolean;
}

export interface SwapLimitData extends ParamsSwapRate {
    amountLimitMax: string;
    amountLimitMin: string;
    createTime: string;
    id: string;
    limitValue?: string;
    limitValueName: string;
    maxBuyRate: string;
    maxSellRate: string;
    minBuyRate: string;
    minSellRate: string;
    priceLimitMax: string;
    priceLimitMin: string;
    tradeLimitDay?: number;
    tradeLimitHour?: number;
    tradeName: string;
    updateTime: string;
}

export interface TyperadeLimit {
    minTrade: string;
    maxTrade: string;
}

export type AddSwapLimitData = Omit<SwapLimitData, 'updateTime' | 'createTime' | 'limitValueName'>;

// 委托订单-请求
export interface ParamsPageToEntrust {
    accountId: string;
    accountLabelId: string;
    endTimeBegin: string;
    endTimeEnd: string;
    gainCurrency: string;
    orderNo: string;
    orderTimeBegin: string;
    orderTimeEnd: string;
    tradeId: string;
    type?: string | number;
    sellCurrency: string;
    platformFeeCurrency: string;
    validPeriod: string;
    orderStatus: string | number;
}

// 委托订单-返回数据
export type ParamsPageOraderData = Omit<ParamsPageToEntrust, 'orderTimeBegin' | 'orderTimeEnd' | 'endTimeBegin' | 'endTimeEnd'> & {
    accountLabel: string;
    accountLabelColor: string;
    createTime: string;
    ditchFee: string;
    ditchFeeCurrency: string;
    endTime: string;
    estimateFee: string;
    estimateFeeCurrency: string;
    exchangeAfterCurrency: string;
    exchangeAfterPrice: string;
    exchangeBeforeCurrency: string;
    exchangeBeforePrice: string;
    exchangePrice: string;
    gainNum: string;
    id: string;
    orderNo: string;
    orderTime: string;
    platformFee: string;
    platformFeeCurrency: string;
    realGainNum: string;
    realSellNum: string;
    sellCurrency: string;
    sellNum: string;
    tradeId: string;
    tradeName: string;
    type?: number;
    typeName: string;
    validPeriod: number;
    validPeriodName: string;
};

export interface ParamsPageToEntrustHostiry extends ParamsPageToEntrust {
    platformFeeCurrency: string;
    refundCurrency: string;
    sellCurrency: string;
    tradeId: string;
}

export interface ParamsPageOraderHostiryData extends ParamsPageOraderData {
    dealAvgPrice: string;
    dealTime: string;
    orderStatusName: string;
    refundNum: string;
}

export interface ParamsPageDealDetail extends ParamsPageToEntrust {
    dealTimeBegin: string;
    dealTimeEnd: string;
    detailOrderNo: string;
}

export interface PageDealDetail extends ParamsPageOraderData {
    dealAvgPrice: string;
    dealTime: string;
    detailOrderNo: string;
    gainCurrency: string;
    gainNum: string;
}

export interface TotalAmout {
    ditchFeeTotal: string;
    gainNumTotal: string;
    platformFeeTotal: string;
    realGainNumTotal: string;
    realSellNumTotal: string;
    sellNumTotal: string;
    refundNumTotal?: string;
}
