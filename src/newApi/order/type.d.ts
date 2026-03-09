declare interface OrderPoistParams {
    accountId: string;
    contractName: string;
    createEndTime: string;
    createStartTime: string;
    orderNo: string;
    pageNo: number;
    pageSize: number;
    status: string;
    thirdOrderId: string;
    uid: string;
}
declare interface OrderPoistList {
    cancelReason: string;
    contractName: string;
    createTime: string;
    cumLiquidateFee: string;
    cumMatchFee: string;
    cumMatchSize: string;
    cumMatchValue: string;
    cumRealizePnl: string;
    id: string;
    maxFillPrice: string;
    maxLeverage: string;
    minFillPrice: string;
    orderNo: string;
    side: string;
    size: string;
    status: string;
    strategyId: string;
    strategyName: string;
    thirdOrderId: string;
    type: string;
    uid: string;
}
