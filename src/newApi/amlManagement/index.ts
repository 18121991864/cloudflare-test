import { Api } from '@/newApi/index';
import { Pagination } from '@/api/type';

class Asset extends Api {
    constructor() {
        super('/risk/rule');
    }

    // 模拟接口
    fetchUpdateAMLRule(params: {
        // 编辑状态
        id: string;
        state: 1 | 2; // 1=启用,2=禁用
    }) {
        return this.api.post('/status/set', params);
    }

    
    // AML规则配置 模拟接口
    fetchAMLRuleList(params: {
        agentId: string | null;
        name: string; // 名称
        status: 1 | 2 | null; // 状态：1=启用,2=禁用
        pageNo: number;
        pageSize: number;
    }) {
        // 代理商列表
        interface _Response extends Pagination {
            list: {
                createTime: string;
                id: string;
                levelInfo: Array<{
                    level: number;
                    levelName: string;
                    maxScore: string;
                    minScore: string;
                }>;
                name: string;
                range: number;
                rangeName: string;
                state: number;
                stateName: string;
                weightInfo: Array<{
                    ditchCode: string;
                    ditchName: string;
                    weight: string;
                }>;
            };
        }

        return this.api.post('/page', params).then((result: any) => result as _Response);
    }

    // 添加或编辑AML规则配置 模拟接口
    fetchAddAMLRule(params: any) {
        return this.api.post('/edit', params);
    }

    // 选择列表(AML渠道) /ditch/select
    fetchDitchSelect() {
        return this.api.get('/ditch/select');
    }

    // 选择列表(AML等级) /level/select
    fetchRiskLevelSelect() {
        return this.api.get('/level/select');
    }

    // 选择列表(应用范围) /range/select
    fetchRangeSelect() {
        return this.api.get('/range/select');
    }

}

export default new Asset();
