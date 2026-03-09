export interface SiteParams {
    name: string | null;
    state: number | null;
    walletType: number | null;
}

export interface SiteData {
    /**
     * ApiKey
     */
    apiKey: string;
    /**
     * 创建时间
     */
    createTime: string;
    /**
     * 钱包ID
     */
    id: string;
    /**
     * 钱包名称
     */
    name: string;
    /**
     * SecretKey
     */
    secretKey: string;
    /**
     * 状态:1=启用，2=禁用，3=弃用
     */
    state: number;
    /**
     * 钱包品牌
     */
    walletType: number;
    /**
     * 钱包品牌名称
     */
    walletTypeName: string;
}
