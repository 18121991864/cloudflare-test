/** 平台账单参数 */
declare interface BillPlatformParams {
    /** 币种ID */
    coinId: number;
    /** 结束时间 */
    endTime: string;
    /** ID */
    id: number;
    /** 产品ID */
    productId: number;
    /** 开始时间 */
    startTime: string;
}

/** 平台账单数据 */
declare interface BillPlatformData {
    /** 本金数量 */
    amount: string;
    /** 币种ID */
    coinId: number;
    /** 创建时间 */
    createTime: string;
    /** 哈希值 */
    hash: string;
    /** ID */
    id: number;
    /** 利息数量 */
    income: string;
    /** 产品ID */
    productId: number;
    /** 产品名称 */
    productName: string;
    /** 币种符号 */
    symbol: string;
    /** 总数量 */
    total: string;
    /** 更新时间 */
    updateTime: string;
    /** 版本号 */
    version: number;
}

/** 用户账单参数 */
declare interface BillUserParams {
    /** 用户ID */
    accountId: string;
    /** ID */
    id: string;
    /** 标签ID */
    labelId: string;
    /** 页码 */
    pageNo: number;
    /** 每页条数 */
    pageSize: number;
    /** 产品ID */
    productId: string;
}

/** 用户账单数据 */
declare interface BillUserData {
    /** 用户ID */
    accountId: number;
    /** 本金数量 */
    amount: string;
    /** 币种ID */
    coinId: number;
    /** 创建时间 */
    createTime: string;
    /** 哈希值 */
    hash: string;
    /** ID */
    id: number;
    /** 利息数量 */
    income: string;
    /** 产品ID */
    productId: number;
    /** 产品名称 */
    productName: string;
    /** 币种符号 */
    symbol: string;
    /** 总数量 */
    total: string;
    /** 更新时间 */
    updateTime: string;
    /** 版本号 */
    version: number;
}

/** 平台快照参数 */
declare interface BillPlatformSnapshotParams {
    /** 币种ID */
    coinId: number;
    /** 平台账户ID */
    earnPlatformAccountId: number;
    /** 结束时间 */
    endTime: string;
    /** 产品ID */
    productId: number;
    /** 开始时间 */
    startTime: string;
    /** 快照类型 */
    type: number;
}

/** 平台快照数据 */
declare interface BillPlatformSnapshotData {
    /** 本金数量 */
    amount: string;
    /** 币种ID */
    coinId: number;
    /** 创建日期 */
    createDate: string;
    /** 创建时间 */
    createTime: string;
    /** 平台账户ID */
    earnPlatformAccountId: number;
    /** ID */
    id: number;
    /** 利息数量 */
    income: string;
    /** 产品ID */
    productId: number;
    /** 产品名称 */
    productName: number;
    /** 币种符号 */
    symbol: string;
    /** 总数量 */
    total: string;
    /** 快照类型 */
    type: number;
}

/** 用户快照参数 */
declare interface BillUserSnapshotParams {
    /** 用户ID */
    accountId: number;
    /** 币种ID */
    coinId: number;
    /** 结束时间 */
    endTime: string;
    /** 页码 */
    pageNo: number;
    /** 每页条数 */
    pageSize: number;
    /** 产品ID */
    productId: number;
    /** 开始时间 */
    startTime: string;
    /** 快照类型 */
    type: number;
}

/** 用户快照数据 */
declare interface BillUserSnapshotData {
    /** 本金数量 */
    amount: string;
    /** 币种ID */
    coinId: number;
    /** 创建日期 */
    createDate: string;
    /** 创建时间 */
    createTime: string;
    /** 平台账户ID */
    earnAccountId: number;
    /** ID */
    id: number;
    /** 利息数量 */
    income: string;
    /** 产品ID */
    productId: number;
    /** 产品名称 */
    productName: number;
    /** 币种符号 */
    symbol: string;
    /** 总数量 */
    total: string;
    /** 快照类型 */
    type: number;
}

/** 平台对账参数 */
declare interface BillPlatformCutParams {
    /** 币种ID */
    coinId: number;
    /** 平台账户ID */
    earnPlatformAccountId: number;
    /** 结束时间 */
    endTime: string;
    /** 产品ID */
    productId: number;
    /** 开始时间 */
    startTime: string;
}

/** 平台对账数据 */
declare interface BillPlatformCutData {
    /** 对账后本金 */
    afterAmount: string;
    /** 对账后利息 */
    afterIncome: string;
    /** 对账后总额 */
    afterTotalAmount: string;
    /** 对账前本金 */
    beforeAmount: string;
    /** 对账前利息 */
    beforeIncome: string;
    /** 对账前总额 */
    beforeTotalAmount: string;
    /** 币种ID */
    coinId: number;
    /** 创建日期 */
    createDate: string;
    /** 创建时间 */
    createTime: string;
    /** 平台账户ID */
    earnPlatformAccountId: number;
    /** ID */
    id: number;
    /** 产品ID */
    productId: number;
    /** 产品名称 */
    productName: number;
    /** 币种符号 */
    symbol: string;
    /** 总金额 */
    totalAmount: string;
}

/** 用户对账参数 */
declare interface BillUserCutParams {
    /** 用户ID */
    accountId: number;
    /** 币种ID */
    coinId: number;
    /** 结束时间 */
    endTime: string;
    /** 产品ID */
    productId: number;
    /** 开始时间 */
    startTime: string;
}

/** 用户对账数据 */
declare interface BillUserCutData {
    /** 对账后本金 */
    afterAmount: string;
    /** 对账后利息 */
    afterIncome: string;
    /** 对账后总额 */
    afterTotalAmount: string;
    /** 对账前本金 */
    beforeAmount: string;
    /** 对账前利息 */
    beforeIncome: string;
    /** 对账前总额 */
    beforeTotalAmount: string;
    /** 币种ID */
    coinId: number;
    /** 创建日期 */
    createDate: string;
    /** 创建时间 */
    createTime: string;
    /** 平台账户ID */
    earnAccountId: number;
    /** ID */
    id: number;
    /** 产品ID */
    productId: number;
    /** 产品名称 */
    productName: number;
    /** 币种符号 */
    symbol: string;
    /** 总金额 */
    totalAmount: string;
}
