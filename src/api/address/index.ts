import { TableResultType } from '@/interface/TableType';
import { Api } from '../api';

class FetchTest extends Api {
    fetchAddressList(params: {
        address: string; // 地址
        status: 1 | 0 | ''; // 状态：1=启用，2=禁用
        pageNo: number;
        pageSize: number;
    }): Promise<
        {
            list: {
                address: string; // 地址
                agentId: string; // 代理商Id
                chainTag: string; // 链
                clientUserId: string; // 客户端用户ID
                coinId: string; // 币种id
                coinSymbol: string; // 币种简称
                id: string;
                itemId: string; // 钱包币种ID
                walletUserId: string; // 钱包用户UID
                status: 1 | 0; // 状态：状态 1正常 0禁用
            }[];
        } & TableResultType
    > {
        // 地址-列表

        return this.api.get('/address/list', { params });
    }

    fetchAddressState(params: {
        // 地址-编辑状态
        id: string;
    }): Promise<any> {
        return this.api.get('/address/updateState', { params });
    }

    fetchAddressCreate(params: {
        // 地址-创建地址
        agentId: string; // 代理商ID
        coinId: string; // 币种id
        chainId: string; // 链id
        address?: string; // 平台地址
        num: string; // 数量
    }): Promise<any> {
        return this.api.post('/address/createAddress', params);
    }

    fetchAddressDisuse(params: {
        // 弃用
        id: string; // id
        info: string; // 弃用原因
    }): Promise<any> {
        return this.api.post('/address/disuse', params);
    }

    // 代理商地址管理
    agentAddressList(params: {
        agentName: string; // 地址
        chainId: null | string; // 状态：1=启用，2=禁用
        coinId: null | string;
        pageNo: number;
        pageSize: number;
    }): Promise<
        {
            list: {
                agentId: number; // 代理商Id
                agentName: string; // 代理商
                chainId: string; // 链ID
                chainTag: string; // 网络
                coinId: number; // 币种ID
                coinSymbol: string; // 币种简称
                minLimit: number; // 阈值数量
                remainingNum: number; // 剩余数量
                replenishNum: number; // 补充数量
                state: 1 | 2; // 代理商状态 1、开启 2、关闭
                totalNum: number; // 总分配数量
                usedNum: number; // 已使用数量
            }[];
        } & TableResultType
    > {
        return this.api.get('/address/agentAddressList', { params });
    }

    // 自动补充设置
    agentReplenishSet(params: {
        agentId: string; // 代理商ID
        coinId: string; // 币种id
        chainId: string; // 链id
        address?: string; // 平台地址
        minLimit: string; // 数量
        replenishNum: string;
    }): Promise<any> {
        return this.api.post('/address/agentReplenishSet', params);
    }
}

export default new FetchTest();
