declare interface PolicyManageList {
    baseCoin: string;
    basePositionSize: string;
    contractId: number;
    contractName: string;
    createTime: string;
    deviationThreshold: string;
    id: string;
    initialBalance: string;
    maPeriod: number;
    maxTradeInterval: number;
    maxTradesPerDay: number;
    minTradeInterval: number;
    name: string;
    orderType: string;
    orderTypeName: string;
    status: number;
    statusName: string;
    stopLossPct: string;
    symbol: string;
    takeProfitPct: string;
    targetVolatility: string;
    timeframe: number;
    title: string;
    updateTime: string;
    valuationCoin: string;
    versionName: string;
    strategyId: string;
    versionId: string;
    isGridTrade: string;
    gridTradeStatus: string;
    mutualTradeStatus: string;
}

declare interface UpdateStrategyPage {
    basePositionSize: string;
    deviationThreshold: string;
    id: string;
    initialBalance: string;
    maPeriod: number;
    maxTradeInterval: number;
    maxTradesPerDay: number;
    minTradeInterval: number;
    status: number;
    stopLossPct: string;
    takeProfitPct: string;
    targetVolatility: string;
    versionName: string;
}


declare interface StrategyVersionList {
    baseCoin: string;
    basePositionSize: string;
    contractName: string;
    createTime: string;
    deviationThreshold: string;
    id: string;
    initialBalance: string;
    maPeriod: number;
    maxTradeInterval: number;
    maxTradesPerDay: number;
    minTradeInterval: number;
    name: string;
    orderType: string;
    orderTypeName: string;
    status: number;
    statusName: string;
    stopLossPct: string;
    symbol: string;
    takeProfitPct: string;
    targetVolatility: string;
    timeframe: number;
    title: string;
    updateTime: string;
    valuationCoin: string;
    versionName: string;
}
