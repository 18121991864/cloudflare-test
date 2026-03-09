declare interface CoinListParams {
    symbol: string;
}
declare interface CoinListData {
    chainSymbol: string;
    createTime: string;
    decimals: number;
    id: string;
    name: string;
    platformFee: string;
    rechargeStatus: number;
    symbol: string;
    withdrawMin: string;
    withdrawStatus: number;
}
declare interface UpdateCoinParams {
    id: string;
    platformFee: string;
    rechargeStatus: number;
    withdrawMin: string;
    withdrawStatus: number;
}
