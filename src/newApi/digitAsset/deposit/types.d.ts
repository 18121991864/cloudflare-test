declare interface DepositListParams {
    accountNo: string;
    agentId: string;
    amlLevel: string;
    chainId: string;
    state: string | null | number;
}
declare interface DepositListData {
    accountId: string;
    accountNo: string;
    agentId: string;
    amlCoefficient: string;
    amlLevel: number;
    amlLevelName: string;
    amount: string;
    chainId: number;
    chainSymbol: string;
    coinId: number;
    coinSymbol: string;
    createTime: string;
    formAddress: string;
    id: string;
    orderNo: string;
    state: number;
    stateName: string;
    toAddress: string;
    txHash: string;
    walletSiteId: number;
    walletSiteName: string;
    withdrawState: number;
    withdrawStateName: string;
    withdraw?: 1 | 2;
}
