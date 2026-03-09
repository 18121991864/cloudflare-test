import { Api } from '../api';
import type { ParameterData, ParameterEdit, ParameterList } from '@/api/parameterList/types.d';
import { Pagination } from '../fetchTest';

class Parameter extends Api {
    fetchgetReteList(params: ParameterList) {
        // 汇率
        return this.api.post('/rate/list', params).then((result: any) => result as ParameterData[]);
    }

    fetchgetReteUpdatet(params: ParameterEdit) {
        // 卡片-金额
        return this.api.post('/rate/update', params).then((result: any) => result);
    }
}

export default new Parameter();
