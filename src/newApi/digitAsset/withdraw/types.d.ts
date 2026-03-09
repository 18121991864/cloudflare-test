declare interface WithdrawListParams {
    agentNo: string;
    depositOrderNo: string;
    reviewStatus: string;
    status: string;
    uid: string;
    withdrawOrderNo: string;
}
declare interface WithdrawListData {
    actualReceivedAmount: string;
    agentNo: string;
    applyAmount: string;
    chainId: string;
    chainSymbol: string;
    coinId: string;
    coinSymbol: string;
    createTime: string;
    depositOrderNo: string;
    fee: string;
    fromAddress: string;
    id: string;
    isPreReview: boolean;
    isReexamination: boolean;
    networkFee: string;
    reviewStatus: number;
    reviewStatusName: string;
    status: number;
    statusName: string;
    toAddress: string;
    txHash: string;
    uid: string;
    walletStatus: number;
    walletStatusName: string;
    withdrawAddressName: string;
    withdrawOrderNo: string;
    withdrawType: number;
    withdrawTypeName: string;
}
