declare interface ProEarnParams {
    coinId: string;
    incomeType: number;
    name: string;
    pageNo: number;
    pageSize: number;
    publish: number;
    recommend: number;
    state: number;
    type: number;
}
declare interface ProEarnData {
    accountLimit: string;
    actualTotalRaise: string;
    annualRate: string;
    coinId: string;
    coinName: string;
    createTime: string;
    endDate: string;
    id: string;
    incomeType: number;
    interestEndDate: string;
    interestStartDate: string;
    interestType: number;
    lockDays: string;
    lockCycles: ProLockCycle[];
    name: string;
    poseRansom: number;
    publish: number;
    publishTime: string;
    ransomInterestRecovery: string;
    ransomRate: string;
    recommend: number;
    riskType: number;
    settleType: number;
    settledInterest: string;
    settledInterestClear: string;
    singleMinRaise: string;
    singleMinRaiseOrTotal: string;
    sort: number;
    startDate: string;
    state: number;
    totalRaise: string;
    type: number;
    updateTime: string;
    validityDays: number;
    names: ProName[];
}

declare interface ProLockCycle {
    cycle: number;
    interestYear: number;
}

declare interface ProName {
    language: string;
    name: string;
}

declare interface ProaddEarnList {
    accountIds: string;
    accountLimit: number;
    coinId: string;
    id: string;
    incomeType: number;
    interestType: number;
    labelIds: string;
    lockCycles: ProLockCycle[];
    names: ProName[];
    poseRansom: number;
    rangeType: string;
    ransomRate: number;
    ransomRefundDays: number;
    recommend: number;
    riskType: number;
    settleType: number;
    singleMax: number;
    singleMin: number;
    sort: number;
    state: number;
    totalRaise: number;
    type: number;
    validityDays: number;
}

declare interface ProRateList {
    createDate: string;
    createTime: string;
    rate: number;
}

declare interface ProCountProList {
    holdCount: number;
    holdTotal: string;
    totalClearInterest: string;
    totalInterest: string;
    yesterdayInterest: string;
}

declare interface ProHoldParams {
    accountId: string;
    id: string;
    productId: string;
    state: number;
}

declare interface ProHoldData {
    accountId: string;
    cycle: number;
    id: string;
    interestEndDate: string;
    interestStartDate: string;
    interestYear: number;
    lockupPeriod: number;
    orderNo: string;
    platformFee: number;
    predictIncome: number;
    productId: string;
    quantity: number;
    state: number;
    totalIncome: number;
    yesterdayIncome: number;
}

declare interface ProLockCycle {
    cycle: number;
    interestYear: number;
}

declare interface ProLabelList {
    color: string;
    createBy: string;
    createTime: string;
    id: string;
    name: string;
    updateTime: string;
}
declare interface ProInfoData {
    accountIds: string;
    accountLimit: string;
    actualTotalRaise: string;
    annualRate: string;
    coinId: string;
    coinName: string;
    createTime: string;
    endDate: string;
    id: string;
    incomeType: number;
    interestEndDate: string;
    interestStartDate: string;
    interestType: number;
    labelIds: string;
    labelList: ProLabelList[];
    lockCycles: ProLockCycle[];
    lockDays: string;
    name: string;
    names: ProName[];
    poseRansom: number;
    publish: number;
    publishTime: string;
    rangeType: string;
    ransomInterestRecovery: number;
    ransomRate: string;
    ransomRefundDays: number;
    recommend: number;
    riskType: number;
    settleType: number;
    settledInterest: number;
    settledInterestClear: number;
    singleMax: number;
    singleMin: number;
    singleMinRaise: string;
    singleMinRaiseOrTotal: string;
    sort: number;
    startDate: string;
    state: number;
    totalRaise: string;
    type: number;
    updateTime: string;
    validityDays: number;
}

declare interface ProLimitParams {
    exposureRange: string;
    proName: string;
    productId: string;
    state: number;
}

declare interface ProLimitData {
    amountLimit: string;
    amountMax: string;
    amountMin: string;
    dayLimit: string;
    daysLimit: number;
    daysMax: string;
    daysMin: string;
    exposureRange: string;
    exposureRangeInfo: string;
    exposureRangeName: string;
    id: string;
    proName: string;
    productId: string;
    singleLimit: string;
    singleMax: string;
    singleMin: string;
    state: number;
}

declare interface ProSetAddOrUpdate {
    accountIds: string;
    amountMax: string;
    amountMin: string;
    daysLimit: number;
    daysMax: string;
    daysMin: string;
    exposureRange: string;
    id: string;
    labelIds: string;
    productId: string;
    singleMax: string;
    singleMin: string;
    state: number;
}

declare interface ProEditLogListData {
    afterContent: string;
    beforeContent: string;
    changeType: number;
    changeTypeName: string;
    createTime: string;
    id: string;
    productId: string;
    title: string;
    type: number;
    typeName: string;
}
