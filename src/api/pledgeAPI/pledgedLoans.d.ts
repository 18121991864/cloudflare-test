export interface ParamsPledgedLoans {
    borrowCoinId?: string;
    stakeCoinId?: string;
    state?: number | '';
}

export interface PledgedLoansList extends ParamsPledgedLoans {
    amountMax: number;
    borrowAmountMax: number;
    borrowAmountMin: number;
    borrowSymbol: string;
    cashPooling: number;
    createTime: string;
    dailyRate: number;
    id: string;
    liquidationRate: number;
    ltv: number;
    operator: string;
    restOfCashPooling: number;
    stakeSymbol: string;
    sysUserId: string;
    tradingPair: string;
    updateTime: string;
    warningRate: number;
}

export interface UpdatePledgedLoansList extends ParamsPledgedLoans {
    amountMax: number | '';
    borrowAmountMax: number | '';
    borrowAmountMin: number | '';
    borrowSymbol?: string;
    cashPooling: number | '';
    dailyRate: number | '';
    id?: string;
    liquidationRate: number | '';
    ltv: number | '';
    stakeSymbol?: string;
    warningRate: number | '';
    state?: undefined;
    value: string;
    cashPoolingRest: string;
}

export interface PleAmoutCount {
    countAmount: number;
    countRemainingAmount: number;
}

export interface OrderPageParams {
    accountId: string;
    channelId: string;
    cryptoName: string;
    endTime: string;
    id: string;
    loanState: number;
    orderNo: string;
    orderState: number;
    startTime: string;
}

export interface OrderPageList extends Omit<OrderPageParams, 'endTime' | 'startTime'> {
    borrowRest: number;
    borrowTime: string;
    borrowValue: number;

    collateralReturn: number;

    currentExchangeRate: number;
    dailyRate: number;
    fee: number;

    interest: number;
    interestRest: number;
    liquidationPrice: number;

    loanStateName: string;

    orderStateName: string;
    stakeRest: number;
    stakeValue: number;
    updateTime: string;
}

export interface SettlementInfo {
    countInterest: number;
    cryptoName: string;
    currentPrice: number;
    handlingCharge: number;
    id: string;
    orderNo: string;
    returnQuantity: number;
    settlementQuantity: number;
}

export interface InterestParams {
    borrowOrderId?: string;
    endTime?: string;
    orderNo?: string;
    startTime?: string;
    state?: number;
}
export interface InterestData extends Omit<InterestParams, 'endTime' | 'startTime'> {
    accountId: string;
    at: string;
    dailyRate: string;
    id: string;
    interest: string;
    principal: string;
    stateName: string;
}

export interface OrderInfoParams {
    accountId: string;
    cryptoName: string;
    endTime: string;
    orderNo: string;
    pageNo: number;
    pageSize: number;
    startTime: string;
    type: number;
}
export interface OrderInfoParams {
    cryptoName: string;
    endTime: string;
    orderNo: string;
    startTime: string;
    type: number;
}
export interface OrderInfoData extends Omit<OrderInfoParams, 'endTime' | 'startTime'> {
    accountId: string;
    borrowOrderId: string;
    borrowValue: number;
    createTime: string;
    exchangeRate: number;
    feeValue: number;
    id: string;
    liquidationValue: number;
    operatorType: number;
    operatorTypeName: string;
    rate: number;
    repayInterest: number;
    repayPrincipal: number;
    repayValue: number;
    stakeValue: number;
    state: number;
    stateName: string;
    typeName: string;
    updateTime: string;
}

export interface CreditListParams {
    accountId?: string;
    agentId?: string;
    borrowCryptoId?: number;
    stakeCoinId?: number;
    state?: number;
}
export interface CreditListData extends Omit<Required<CreditListParams>, 'stakeCoinId'> {
    agentName: string;
    createTime: string;
    creditLine: number;
    dailyRate: number;
    givenName: string;
    id: string;
    lastName: string;
    liquidationRate: number;
    ltv: number;
    primaryKycState: number;
    tradingPair: string;
    updateTime: string;
    warningRate: number;
}

export interface addOrUpdateParams {
    accountId: string;
    borrowCryptoId: string;
    creditLine: number;
    dailyRate: number;
    id: string;
    liquidationRate: number;
    ltv: number;
    warningRate: number;
}

export interface CoinListType {
    id: string;
    symbol: string;
    logo: string;
    name: string;
    walletCoinId: string;
    decimals: number;
    inStatus: number;
    outStatus: number;
    status: number;
    type: number;
    showState: number;
    inMinAmount: number;
    inAccountAmount: number;
    showDecimals: number;
}
