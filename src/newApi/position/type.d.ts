declare interface PositionParams {
    accountId: string;
    contractName: string;
    createEndTime: string;
    createStartTime: string;
    pageNo: number;
    pageSize: number;
    uid: string;
}
declare interface PositionList {
    accountId: string;
    confidence: string;
    contractName: string;
    createTime: string;
    direction: number;
    id: string;
    price: string;
    stopLoss: string;
    strategyName: string;
    takeProfit: string;
    uid: string;
}
