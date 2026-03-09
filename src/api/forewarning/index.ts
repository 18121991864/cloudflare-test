import { Api } from '@/api/api';

class FetchTest extends Api {
    // 预警配置列表
    forewarning(params: {
        ditchId: string; // 渠道id
        id: string; // id
        noticeType: 1 | 2; // 预警方式 1:邮件 2:tg
        pageNo: number; // 页码
        pageSize: number; // 页面大小
        state: 1 | 2; // 状态 1:启用 2:禁用
        templateType: null | 1 | 2 | 3; // 模版类型 1.渠道头寸不足 2.用户大额充值 3.用户卡片拒付
    }): Promise<{
        id: string;
        symbol: string;
    }[]> {
        return this.api.post('/forewarning/list', params);
    }

    // 新增或修改
    addOrUpdate(params: {
        ditchId: string; // 渠道ID
        emails: string; // 预警邮箱
        id: string; // id
        noticeType: string; // 预警方式 1:邮件 2:tg
        operator: string; //
        scale: string; // 比例
        state: 1 | 2 | null; // 状态 1:启用 2:禁用
        templateType: 1 | 2 | 3 | null; // 模版类型 1.渠道头寸不足 2.用户大额充值 3.用户卡片拒付
        value: string; // 值
        warningExample: string; // 预警说明
    }): Promise<boolean> {
        return this.api.post('/forewarning/addOrUpdate', params);
    }
}

export default new FetchTest();
