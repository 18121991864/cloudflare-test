declare interface WithdrawCheckListParams {
    state: string;
}
declare interface WithdrawCheckListData {
    amount: string; // 金额
    coinId: string; // 币种id
    id: string;
    type: string; // 1、初审 2、复审
    userId: string; // 用户UID
    createTime: string; // 创建时间
    updateTime: string; // 更新时间
}
