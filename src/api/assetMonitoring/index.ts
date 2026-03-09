import { Api } from '../api';
class AssetMonitoring extends Api {
    constructor() {
        super('/earn/monitor/data');
    }
    /**
     * 监控中资产
     * @returns
     */
    getAssetsOverview(): Promise<AssetMonitoringOverviewList> {
        return this.api.get('/overview/assets');
    }
    /**
     * 资产走势
     * @returns
     */
    getAssetsTrend(params: { startDate: string; endDate: string }): Promise<AssetMonitoringTrend[]> {
        console.log(params);

        return this.api.get('/overview/assetsTrend', { params });
    }
}

export default new AssetMonitoring();
