import { TableDataPages, TableQueryParams } from '@/interface/StateType';
import { Api } from '@/newApi/index';

class Asset extends Api {
    constructor() {
        super('');
    }
    getpositionList(params: TableQueryParams<PositionParams>): Promise<TableDataPages<PositionList>> {
        return this.api.post('/position/list', params);
    }
    // 导出
    positionListExport(params: any): Promise<Blob> {
        return this.api.post('/position/list/export', params, { responseType: 'blob' });
    }
    skipList(params: TableQueryParams<PositionParams>): Promise<TableDataPages<PositionList>> {
        return this.api.post('/strategy/skip/list', params);
    }
    // 导出
    skipListExport(params: any): Promise<Blob> {
        return this.api.post('/strategy/skip/list/export', params, { responseType: 'blob' });
    }
}

export default new Asset();
