export interface _SnapshotParams {
    pageNo: number | string;
    pageSize: number | string;
    coinId?: string;
    startTime?: string;
    endTime?: string;
}

export interface PlatformList {
    accountType: number;
    balance: string;
    createDate: string;
    createTime: string;
    frozenBalance: string;
    hash: string;
    id: number;
    manualFrozenBalance: string;
    platformAccountId: number;
    riskFrozenBalance: string;
    snapshotType: number;
    symbol: string;
    version: number;
}
export interface WalletAssetList {
    accountType: number;
    balance: string;
    createDate: string;
    createTime: string;
    frozenBalance: string;
    id: number;
    snapshotType: number;
    symbol: string;
    walletId: string;
    walletUserId: string;
}

export interface CutListTypeData {
    accountId?: number;
    userId?: number;
    accountType: number;
    afterBalance: string;
    afterFrozenBalance: string;
    afterManualFrozenBalance: string;
    afterRiskFrozenBalance: string;
    amount: string;
    beforeBalance: string;
    beforeFrozenBalance: string;
    beforeManualFrozenBalance: string;
    beforeRiskFrozenBalance: string;
    createTime: string;
    date: string;
    hash: string;
    id: number;
    reason: string;
    remarks: string;
    symbol: string;
}
export interface AssetSnapshotAmountTotal {
    balance: string; //可用总金额;
    frozenBalance: string; //冻结总金额
    manualFrozenBalance: string; //手动冻结金额
    riskFrozenBalance: string; //风控冻结总金额
    symbol: string; //币种
    swapFrozenBalance: string;
    borrowFrozenBalance: string;
}
