import { Api } from '../api';
import type { TableQueryParams, TableDataPages } from '@/interface/StateType';
class AssetWarningList extends Api {
    constructor() {
        super('/earn/monitor/warning');
    }
    /**
     * 资金归还列表
     */
    getWarningList(params: TableQueryParams<{ type: 1 }>): Promise<TableDataPages<WarningListData>> {
        return this.api.post('/list', params);
    }
    /**
     * 新增/编辑预警设置
     */
    addOrUpdateWarningList(params: TableQueryParams<{ type: 1 }>): Promise<TableDataPages<AddWarningListData>> {
        return this.api.post('/addOrUpdate', params);
    }
    /**
     * 预警类型列表
     */
    getWarningTypeList(): Promise<{ code: number; desc: string }[]> {
        return this.api.get('/typeList');
    }
    /**
     * 启用/禁用预警
     */
    updateWarningState(params: { id: string }): Promise<any> {
        return this.api.get('/unEnable', { params });
    }
}
export default new AssetWarningList();
