import { Api } from '@/api/api';

class FetchTest extends Api {
    tag(params: { id?: string; name?: string; }): Promise<{
        color: string; // 颜色
        id: string; // id
        name: string; // 名称
        isEdit: boolean;
        isType: 'ADD' | 'EDIT' | 'DEFAULT';
    }[]> {
        return this.api.get('/tag/list', { params });
    }

    addOrUpdate(params: { // 添加或修改标签
        color: string; // 颜色
        id?: string; //
        name: string; // 名称
    }): Promise<any> {
        return this.api.post('/tag/addOrUpdate', params);
    }

    userAddOrUpdateLabel(params: { // 添加或修改标签
        accountId: string; // 颜色
        labelId: string; // 名称
    }): Promise<any> {
        return this.api.get('/tag/userAddOrUpdateLabel', { params });
    }
}

export default new FetchTest();
