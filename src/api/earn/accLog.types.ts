declare interface AccLogParams {
    accountId: string;
    coinId: string;
    endTime: string;
    id: string;
    opType: number;
    orderNo: string;
    proType: number;
    startTime: string;
}

declare interface AccLogData {
    accountId: string;
    afterBalance: number;
    amount: number;
    beforeBalance: number;
    coinId: string;
    createTime: string;
    currency: string;
    direction: string;
    id: string;
    opType: number;
    opTypeName: string;
    orderNo: string;
    proName: string;
    proType: number;
    proTypeName: string;
    productId: string;
}

declare interface AccountAssetParams {
    accountId: string;
    id: string;
    labelId: string;
    productId: string;
}

declare interface AccountAssetData {
    accountId: string;
    amount: number;
    coinId: string;
    createTime: string;
    currency: string;
    holdCount: number;
    id: string;
    income: number;
    labelColor: string;
    labelId: string;
    labelName: string;
    productId: string;
    productName: string;
    settledIncome: number;
    updateTime: string;
    yesterdayIncome: number;
}

declare interface TransferListProParams {
    coinId: string;
    endTime: string;
    id: string;
    orderNo: string;
    proName: string;
    productId: string;
    startTime: string;
    txHash: string;
    walletState: number;
}
declare interface TransferListProData {
    chainId: string;
    chainName: string;
    coinId: string;
    createTime: string;
    currency: string;
    from: string;
    id: string;
    orderNo: string;
    proName: string;
    productId: string;
    state: number;
    stateName: string;
    to: string;
    txHash: string;
    walletState: number;
    walletStateName: string;
}

declare interface ProTransferSettingParams {
    coinId: string;
    id: string;
    proName: string;
    productId: string;
}
declare interface ProTransferSettingData {
    amountMin: number;
    chainId: string;
    chainName: string;
    coinId: string;
    currency: string;
    id: string;
    noticeEmail: string;
    proName: string;
    productId: string;
    state: number;
}
declare interface UpdateProTransferSetting {
    amountMin: number;
    id: string;
    noticeEmail: string;
    productId: string;
    state: number;
}

declare interface ProTransferPushList {
    chainId: string;
    chainName: string;
    coinId: string;
    currency: string;
    proName: string;
    productId: string;
}
