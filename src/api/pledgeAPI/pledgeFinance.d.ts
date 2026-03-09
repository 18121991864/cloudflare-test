export interface AssetListParams {
    accountId: string;
    coinId: string;
    state: number;
}

export interface AssetListData extends AssetListParams {
    borrowingCostAmount: number;

    coinSymbol: string;
    createTime: string;
    id: string;
    loanAmount: number;
    pledgeFreezing: number;
    quantityPledged: number;

    stateName: string;
    updateTime: string;
    version: number;
}

export interface PageToAssetParams {
    acctId: string;
    coinId: string;
}

export interface PageToAssetData extends PageToAssetParams {
    coinSymbol: string;
    createTime: string;
    hash: string;
    id: string;
    loanBalance: string;
    loanIncomeBalance: string;
    pledgeBalance: string;
    pledgeFreezeBalance: string;
    receivableInterestBalance: string;
    snapshotTime: string;
    type: number;
    typeName: string;
    updateTime: string;
    version: number;
}

export interface borrowUserAssetLogParams {
    accountId: string;
    businessType: number;
    endTime: string;
    masterOrder: string;
    orderNo: string;
    startTime: string;
}
export interface borrowUserAssetLogData extends borrowUserAssetLogParams {
    afterAmountBorrowingCost: number;
    afterBalance: number;
    afterInterestPayable: number;
    afterPledgeFreeze: number;
    afterQuantityPledge: number;
    beforeAmountBorrowingCost: number;
    beforeBalanceOfBorrowings: number;
    beforeInterestPayable: number;
    beforePledgeFreeze: number;
    beforeQuantityPledgePeriod: number;
    businessTypeName: string;
    coinId: string;
    coinSymbol: string;
    createTime: string;
    hash: string;
    id: string;
    operatorType: number;
    operatorTypeName: string;
    serviceDescription: string;
    transactionName: string;
    transactionType: number;
    transferAmount: number;
    version: number;
}

export interface PageToAssetLogParams {
    acctId: string;
    createTimeBegin: string;
    createTimeEnd: string;
    orderNo: string;
    transactionType: number;
}
export interface PageToAssetLogData extends PageToAssetLogParams {
    afterLoanBalance: string;
    afterLoanIncomeBalance: string;
    afterPledgeBalance: string;
    afterPledgeFreezeBalance: string;
    afterReceivableInterestBalance: string;
    amount: string;
    assetId: string;
    beforeLoanBalance: string;
    beforeLoanIncomeBalance: string;
    beforePledgeBalance: string;
    beforePledgeFreezeBalance: string;
    beforeReceivableInterestBalance: string;
    businessRemark: string;
    businessType: number;
    businessTypeName: string;
    coinId: string;
    coinSymbol: string;
    createTime: string;
    hash: string;
    id: string;
    operatorType: number;
    operatorTypeName: string;
    transactionTypeName: string;
    version: number;
}

export interface labelTypes {
    label: string;
    value: string;
}

export interface ToAssetParamsType {
    acctId: string;
    coinId: string;
    snapshotTimeBegin: string;
    snapshotTimeEnd: string;
    type: number;
}

export interface ToAssetDataType extends ToAssetParamsType {
    coinSymbol: string;
    createTime: string;
    hash: string;
    id: string;
    loanBalance: string;
    loanIncomeBalance: string;
    pledgeBalance: string;
    pledgeFreezeBalance: string;
    receivableInterestBalance: string;
    snapshotTime: string;
    typeName: string;
    updateTime: string;
    version: number;
}

export interface PageSnapshotParams extends Omit<ToAssetParamsType, 'acctId'> {}
export interface PageSnapshotData extends PageSnapshotParams {
    borrowingCostAmount: number;
    coinSymbol: string;
    createTime: string;
    id: string;
    loanAmount: number;
    pledgeFreezing: number;
    quantityPledged: number;
    snapshotTime: string;
    typeName: string;
    updateTime: string;
}

export interface ToAssetCutParams {
    coinId: string;
    cutTimeBegin: string;
    cutTimeEnd: string;
}
export interface ToAssetCutData extends ToAssetCutParams {
    acctId: string;
    afterLoanBalance: string;
    afterLoanIncomeBalance: string;
    afterPledgeBalance: string;
    afterPledgeFreezeBalance: string;
    afterReceivableInterestBalance: string;
    beforeLoanBalance: string;
    beforeLoanIncomeBalance: string;
    beforePledgeBalance: string;
    beforePledgeFreezeBalance: string;
    beforeReceivableInterestBalance: string;
    coinSymbol: string;
    createTime: string;
    cutTime: string;
    id: string;
    loanBalance: string;
    loanIncomeBalance: string;
    pledgeBalance: string;
    pledgeFreezeBalance: string;
    receivableInterestBalance: string;
    updateTime: string;
}

export interface AssetCutListParams {
    accountId: string;
    coinId: string;
    endTime: string;
    startTime: string;
}
export interface AssetCutListData extends AssetCutListParams {
    afterBorrowingCostAmount: number;
    afterInterestPayable: number;
    afterLoanAmount: number;
    afterPledgeFreezing: number;
    afterQuantityPledged: number;
    beforeBorrowingCostAmount: number;
    beforeInterestPayable: number;
    beforeLoanAmount: number;
    beforePledgeFreezing: number;
    beforeQuantityPledged: number;
    borrowingCostAmount: number;
    coinSymbol: string;
    createTime: string;
    cutTime: string;
    id: string;
    interestPayable: number;
    loanAmount: number;
    pledgeFreezing: number;
    quantityPledged: number;
    updateTime: string;
}
