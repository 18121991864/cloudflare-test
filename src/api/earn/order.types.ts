declare interface OrderParamsEarn {
    accountId: string;
    coinId: string;
    endTime: string;
    proName: string;
    proType: number;
    startTime: string;
    state: number;
}
declare interface OrderDataEarn {
    accountId: string;
    coinId: string;
    createTime: string;
    currency: string;
    cycle: number;
    earnType: number;
    earnTypeName: string;
    id: string;
    interestEndDate: string;
    interestStartDate: string;
    interestYear: number;
    lockupEndDate: string;
    orderNo: string;
    platformFee: number;
    predictIncome: number;
    proName: string;
    proType: number;
    proTypeName: string;
    productId: string;
    quantity: number;
    remainPeriod: string;
    state: number;
    stateName: string;
    totalIncome: number;
}

declare interface OrderInfoList {
    amount: string;
    createTime: string;
    opType: number;
    opTypeName: string;
}

declare interface StatisticalCoinData {
    buyAmount: string;
    buyNumber: number;
    coinSymbol: string;
    ransomAmount: string;
    ransomNumber: number;
    sedimentAmount: string;
}

declare interface StatisticalProductType {
    buyAmount: string;
    buyNumber: number;
    productType: string;
    ransomAmount: string;
    ransomNumber: number;
    sedimentAmount: string;
}
declare interface StatisticalProduct {
    buyAmount: string;
    buyNumber: number;
    coinSymbol: string;
    productId: string;
    productName: string;
    productType: string;
    ransomAmount: string;
    ransomNumber: number;
    sedimentAmount: string;
    state: number;
    stateName: string;
}
