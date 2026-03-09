import { TableResultType } from '@/interface/TableType';
import { Api } from '../api';

class FetchTest extends Api {
    fetchCoinList(params: {
        symbol: string; // 币种
        pageNo: number;
        pageSize: number;
    }): Promise<
        {
            list: {
                balance: string; // 钱包余额
                chainTag: string; // 链
                decimals: number; // 小数位
                id: string;
                inStatus: 1 | 0; // 转入状态 1正常 0禁止
                name: string; // 币种全名称
                outStatus: 1 | 0; // 转出状态 1正常 0禁止
                symbol: string; // 币种
                status: 1 | 0; // 状态：状态 1正常 0禁用
            }[];
        } & TableResultType
    > {
        // 币种-列表

        return this.api.get('/coin/list', { params });
    }

    fetchCoinInfo(params: { coinId: string; chainId: string }): Promise<{
        balance: string; // 钱包余额
        chainTag: string; // 链
        decimals: number; // 小数位
        id: string;
        inStatus: 1 | 0; // 转入状态 1正常 0禁止
        name: string; // 币种全名称
        outStatus: 1 | 0; // 转出状态 1正常 0禁止
        symbol: string; // 币种
        status: 1 | 0; // 状态：状态 1正常 0禁用
        coinId: string;
        chainId: string;
        rechargeText: any;
    }> {
        // 币种-列表
        return this.api.get('/coin/info', { params });
    }

    coinUpdate(params: {
        // 编辑币种
        coinId: string;
        chainId: string;
        maxOutAmount: string;
        minOutAmount: string;
        rechargeText: any;
        walletFee: string;
        withdrawFee: string;
        inStatus: 1 | 0;
        outStatus: 1 | 0;
        status: 1 | 0;
    }): Promise<any> {
        return this.api.post('/coin/update', params);
    }

    fetchCoinState(params: {
        // 编辑状态
        coinId: string;
        chainId: string;
    }): Promise<any> {
        return this.api.get('/coin/updateState', { params });
    }

    fetchCoinUpdateOutState(params: {
        // 修改提币状态
        coinId: string;
        chainId: string;
    }): Promise<any> {
        return this.api.get('/coin/updateOutState', { params });
    }

    coinSetWithdrawFee(params: {
        // 编辑提币手续费
        coinId: string;
        chainId: string;
        walletFee: string | number; // 优易钱包手续费
        withdrawFee: string | number; // 平台手续费
    }): Promise<any> {
        return this.api.post('/coin/setWithdrawFee', params);
    }

    fetchCoinUpdateInState(params: {
        // 编辑充值状态
        coinId: string;
        chainId: string;
    }): Promise<any> {
        return this.api.get('/coin/updateInState', { params });
    }

    fetchCoinSync(): Promise<any> {
        // 同步币种
        return this.api.get('/coin/synchCoinInfo');
    }

    fetchCoinChoose(): Promise<
        {
            itemId: string; // 钱包币种id
            symbol: string; // 币种
        }[]
    > {
        // 币种下拉
        return this.api.get('/coin/coinListSel');
    }

    fetchChainChoose(params: { coinId: string }): Promise<
        {
            chainTag: string; // 链
            itemId: string; // 钱包链id
            maxout: string; // 单笔最大提币额
            minout: string; // 单笔最小提币额
        }[]
    > {
        // 链下拉
        return this.api.get('/coin/chainListSel', { params });
    }

    fetchgetAssetSnapshotAmountTotal(params: {
        snapshotType?: null | 0 | 1 | 2; // 快照类型 0、全部 1、自动 2、手动
        startTime?: string; // 开始时间
        endTime?: string; // 结束时间
        pageNo: number;
        pageSize: number;
        coinId: string;
    }) {
        // 用户资产快照金额
        return this.api.get('/coin/getAssetSnapshotAmountTotal', { params });
    }

    // 币种资产手动快照导出
    fetchCoinAssetSnapshotExport(params: {}): Promise<any> {
        return this.api.get('/coin/assetSnapshot', { params, responseType: 'blob' });
    }
}

export default new FetchTest();
