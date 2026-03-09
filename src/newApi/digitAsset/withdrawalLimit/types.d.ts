declare interface WithdrawlimitListParams {
    accountId: string;
    range: string;
    state: string;
}
declare interface WithdrawlimitLisData {
    accountId: string;
    chainId: string;
    chainSymbol: string;
    coinId: string;
    createTime: string;
    day: string;
    hour: string;
    id: number;
    range: number;
    singleMax: string;
    singleMin: string;
    state: number;
    symbol: string;
    updateTime: string;
    userName: string;
}

declare interface UpdateWithdrawlimitParams {
    day: number;
    hour: number;
    id: number;
    singleMax: number;
    singleMin: number;
    state: number;
}
