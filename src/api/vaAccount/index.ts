import { Api } from '@/api/api';
import { TableResultType } from '@/interface/StateType';

class FetchTest extends Api {
    // 用户资金账户表
    vaUserAssetList(params: {
        pageNo: number; // 页数
        pageSize: number; // 条数
        currency: string; // 账户币种类型
        endTime: string; // 结束时间
        externalAccount: string; // 外部账户（账户号）
        internalAccount: string; // 内部账户
        labelId: null | string; // 用户标签ID
        startTime: string; // 开始时间
        state: null | 1 | 2 | 3; // 状态 1、正常 2、冻结 3、销户
        userId: string; // 用户ID
    }): Promise<
        {
            list: {
                accountId: string; // 用户ID
                accountType: string; // 账户类型
                accountTypeName: string; // 账户类型名称
                balance: string; // 可用余额
                channelId: string; // 渠道ID
                channelName: string; // 渠道名称
                createTime: string; // 创建时间
                currency: string; // 账户币种
                externalAccount: string; // 外部账户
                frozenBalance: string; // 冻结余额
                hash: string; // hash
                id: number; // ID
                internalAccount: string; // 账户号
                labelId: number; // 账户标签ID
                labelName: string; // 账户标签
                state: number; // 状态 1、正常 2、冻结 3、销户 4、禁用
                stateName: string; // 状态 1、正常 2、冻结 3、销户 4、禁用
                updateTime: string; // 更新时间
                version: number; // 版本号
            }[];
        } & TableResultType
    > {
        return this.api.get('/va/bill/vaUserAssetList', { params });
    }

    // 用户资金流水表
    vaUserAssetLogList(params: {
        pageNo: number; // 页数
        pageSize: number; // 条数
        currency: string; // 账户币种类型
        endTime: string; // 结束时间
        opType: null | string; // 动账类型
        internalAccount: string; // 内部账户
        orderNo: string; // 用户标签ID
        startTime: string; // 开始时间
        state: null | 1 | 2 | 3; // 状态 1、正常 2、冻结 3、销户
        userId: string; // 用户ID
        toCurrency: string; // 到账币种
    }): Promise<
        {
            list: {
                accountId: string; // 用户ID
                accountType: string; // 账户类型
                accountTypeName: string; // 账户类型名称
                afterBalance: string; // 期末额
                afterFrozenBalance: string; // 期末冻结额
                amount: string; // 动账金额
                beforeBalance: string; // 期初额
                beforeFrozenBalance: string; // 期初冻结额
                createTime: string; // 时间
                currency: string; // 账户币种
                fee: string; // 手续费
                hash: string; // hash
                id: number; // ID
                internalAccount: string; // 账户号
                opType: number; // 动账类型
                opTypeName: number; // 动账类型名称
                opUserName: string; // 操作人
                orderNo: string; // 订单号
                rate: string; // 汇率
                reason: string; // 动账原因(说明)
                toAmount: string; // 到账金额
                toCurrency: string; // 到账币种
                version: number; // 版本
            }[];
        } & TableResultType
    > {
        return this.api.get('/va/bill/vaUserAssetLogList', { params });
    }

    // va资金账户币种类型下拉
    currencySelList(): Promise<
        {
            currency: string; // 币种类型
        }[]
    > {
        return this.api.get('/va/bill/currencySelList');
    }

    // va资金账户流水表-禁用-启用
    enableDisable(params: { id: string }): Promise<boolean> {
        return this.api.get('/va/bill/enableDisable', { params });
    }

    // VA资金账户-冻结-取消冻结
    freeze(params: { id: string }): Promise<boolean> {
        return this.api.get('/va/bill/freeze', { params });
    }

    // VA资金账户-销户
    cancellation(params: { id: string }): Promise<boolean> {
        return this.api.get('/va/bill/cancellation', { params });
    }

    // VA 平台资金账户表（VA平台账务）
    vaPlatformAssetList(params: {
        pageNo: number; // 页数
        pageSize: number; // 条数
        accountType: string; // 账户类型
        channelAccountId: string; // 渠道账户ID
        currency: string; // 账户币种
        endTime: string; // 结束时间
        internalAccount: string; // 账户ID
        startTime: string; // 开始时间
    }): Promise<
        {
            list: {
                accountType: number; // 账户类型
                accountTypeName: string; // 账户类型名称
                balance: string; // 可用余额
                channelAccountId: string; // 渠道账户ID
                channelId: string; // 渠道ID
                channelName: string; // 渠道名称
                createTime: string; // 创建时间
                currency: string; // 账户币种
                frozenBalance: string; // 冻结余额
                hash: string; // hash
                id: number; // ID
                internalAccount: string; // 账户ID
                updateTime: string; // 更新时间
                version: number; // 版本号
            }[];
        } & TableResultType
    > {
        return this.api.get('/va/bill/vaPlatformAssetList', { params });
    }

    // va渠道资金账户
    vaChannelAssetList(params: {
        pageNo: number; // 页数
        pageSize: number; // 条数
        accountType: string; // 账户类型
        channelId: string; // 渠道ID
        currency: string; // 账户资金类型
        endTime: string; // 结束时间
        startTime: string; // 开始时间
    }): Promise<
        {
            list: {
                balance: string; // 渠道账户余额
                channelAccountId: string; // 渠道账户ID
                channelId: string; // 渠道ID
                channelName: string; // 渠道名称
                channelState: 1 | 2; // 渠道账户状态 1、正常 2、禁用
                channelType: string; // 渠道账户类型
                createTime: string; // createTime
                currency: string; // 账户资金类型
                frozenBalance: string; // 冻结余额
                id: number; // id
                state: 1 | 2; // 账户状态 1、正常 2、禁用
                updateTime: string; // update_time
            }[];
        } & TableResultType
    > {
        return this.api.get('/va/bill/vaChannelAssetList', { params });
    }

    // va用户资金账户快照
    vaUserAssetSnapshot(params: {
        pageNo: number; // 页数
        pageSize: number; // 条数
        currency: string; // 账户币种类型
        endTime: string; // 结束时间
        externalAccount: string; // 外部账户（账户号）
        internalAccount: string; // 内部账户
        labelId: string; // 用户标签ID
        startTime: string; // 开始时间
        state: 1 | 2 | 3; // 状态 1、正常 2、冻结 3、销户
        userId: string; // 用户ID
    }): Promise<
        {
            list: {
                accountId: string; // 用户ID
                accountType: string; // 账户类型
                accountTypeName: string; // 账户类型名称
                balance: string; // 可用余额
                channelId: string; // 渠道ID
                channelName: string; // 渠道名称
                createTime: string; // 创建时间
                currency: string; // 账户币种
                externalAccount: string; // 外部账户
                frozenBalance: string; // 冻结余额
                hash: string; // hash
                id: string; // ID
                internalAccount: string; // 账户号
                labelColor: string; // 用户标签颜色
                labelId: number; // 用户标签Id
                labelName: string; // 用户标签
                state: 1 | 2 | 3 | 4; // 状态 1、正常 2、冻结 3、销户 4、禁用
                stateName: 1 | 2 | 3 | 4; // 状态 1、正常 2、冻结 3、销户 4、禁用
                updateTime: string; // 更新时间
                version: number; // 版本号
            }[];
        } & TableResultType
    > {
        return this.api.get('/va/bill/vaUserAssetSnapshot', { params });
    }

    // VA 平台资金账户快照
    vaPlatformAssetSnapshot(params: {
        pageNo: string; // 页数
        pageSize: number; // 条数
        accountType: string | null; // 账户类型
        channelAccountId: string; // 渠道账户ID
        currency: string | null; // 账户币种
        endTime: string; // 结束时间
        internalAccount: string; // 账户ID
        startTime: string; // 开始时间
    }): Promise<
        {
            list: {
                accountType: string; // 账户类型
                accountTypeName: string; // 账户类型名称
                balance: string; // 可用余额
                channelAccountId: string; // 渠道账户ID
                channelId: string; // 渠道ID
                channelName: string; // 渠道名称
                createTime: string; // 创建时间
                currency: string; // 账户币种
                frozenBalance: string; // 冻结余额
                hash: string; // hash
                id: number; // ID
                internalAccount: string; // 账户ID
                updateTime: string; // 更新时间
                version: number; // 版本号
            }[];
        } & TableResultType
    > {
        return this.api.get('/va/bill/vaPlatformAssetSnapshot', { params });
    }

    // 渠道资金账户快照
    vaChannelAssetSnapshot(params: {
        pageNo: number; // 页数
        pageSize: number; // 条数
        accountType: string; // 账户类型
        channelId: string; // 渠道ID
        currency: string; // 账户资金类型
        endTime: string; // 结束时间
        startTime: string; // 开始时间
    }): Promise<
        {
            list: {
                balance: string; // 渠道账户余额
                channelAccountId: string; // 渠道账户ID
                channelId: string; // 渠道ID
                channelName: string; // 渠道名称
                channelState: 1 | 2; // 渠道账户状态 1、正常 2、禁用
                channelStateName: 1 | 2; // 渠道账户状态 1、正常 2、禁用
                channelType: string; // 渠道账户类型
                createTime: string; // createTime
                currency: string; // 账户资金类型
                frozenBalance: string; // 冻结余额
                id: number; // id
                state: 1 | 2; // 账户状态 1、正常 2、禁用
                stateName: 1 | 2; // 账户状态 1、正常 2、禁用
                updateTime: string; //
            }[];
        } & TableResultType
    > {
        return this.api.get('/va/bill/vaChannelAssetSnapshot', { params });
    }

    // va用户资金日切表
    vaUserAssetLogCutList(params: {
        pageNo: number; // 页数
        pageSize: number; // 条数
        currency: string; // 账户币种
        endTime: string; // 结束时间
        internalAccount: string; // 内部账户
        opType: string; // 动账类型
        orderNo: string; // 订单号
        startTime: string; // 开始时间
        toCurrency: string; // 到账户币种
        userId: string; // 用户ID
    }): Promise<
        {
            list: {
                accountId: string; // 用户Id
                accountType: string; // 账户类型
                accountTypeName: string; // 账户类型名称
                afterBalance: string; // 期末额
                afterFrozenBalance: string; // 期末冻结额
                amount: string; // 发生金额
                beforeBalance: string; // 期初额
                beforeFrozenBalance: string; // 期初冻结额
                createTime: string; // create_time
                currency: string; // 账户币种
                externalAccount: string; // 外部账户
                fee: string; // 手续费
                hash: string; // hash
                id: number; // id
                internalAccount: string; // 内部账户
                opType: number; // 动账类型
                opTypeName: string; // 动账类型名称
                opUserId: string; // 操作人ID
                orderNo: string; // 订单号
                rate: string; // 汇率
                reason: string; // 原因
                toCurrency: string; // 到账币种
                version: number;
            }[];
        } & TableResultType
    > {
        return this.api.get('/va/bill/vaUserAssetLogCutList', { params });
    }

    // va用户资金日切表
    vaPlatformAssetCutList(params: {
        pageNo: number; // 页数
        pageSize: number; // 条数
        currency: string; // 账户币种
        endTime: string; // 结束时间
        internalAccount: string; // 内部账户
        orderNo: string; // 订单号
        startTime: string; // 开始时间
        toCurrency: string; // 到账户币种
    }): Promise<
        {
            list: {
                accountId: string; // 用户ID
                accountType: string; // 账户类型
                afterBalance: number; // 期末额
                afterFrozenBalance: number; // 期末冻结额
                amount: string; // 金额
                beforeBalance: number; // 期初额
                beforeFrozenBalance: number; // 期初冻结额
                channelAccountId: string; // 渠道账户ID
                channelId: string; // 渠道Id
                channelName: string; // 渠道名称
                createTime: string; // create_time
                currency: string; // 账户币种
                hash: string; // hash
                id: number; // ID
                opType: number; // 动账类型
                opTypeName: string; // 动账类型名称
                opUserId: string; // 操作人ID
                orderNo: string; // 订单号
                reason: string; // 原因
                toCurrency: string; // 到账币种
                vaPlatformAssetId: number; // 资产id
                version: number; // version
            }[];
        } & TableResultType
    > {
        return this.api.get('/va/bill/vaPlatformAssetCutList', { params });
    }

    // va资金动账类型下拉
    freezeTypeList(): Promise<
        {
            opType: number;
            opTypeName: string;
        }[]
    > {
        return this.api.get('/va/bill/freezeTypeList');
    }

    // va用户资产快照
    userVaAssetSnapshot(): Promise<boolean> {
        return this.api.get('/va/bill/userVaAssetSnapshot');
    }

    // va平台资产快照
    platformVaAssetBalanceSnapshot(): Promise<boolean> {
        return this.api.get('/va/bill/platformVaAssetBalanceSnapshot');
    }

    // VA渠道类型-名称下拉
    channelTypeSel(): Promise<
        {
            code: number;
            desc: string;
        }[]
    > {
        return this.api.get('/va/bill/channelTypeSel');
    }

    // va渠道资产快照
    vaChannelAssetBalanceSnapshot(): Promise<boolean> {
        return this.api.get('/va/bill/vaChannelAssetBalanceSnapshot');
    }
}

export default new FetchTest();
