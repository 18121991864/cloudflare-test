import { Api } from '../api';
import { TableResultType } from "@/interface/StateType";

class FlashExchange extends Api {
    // 卡赎回订单列表
    ransomList(params: {
        accountId: string; // 用户id
        agentId: string; // 代理商名称
        cardName: string; // 卡片名称
        cardNo: string; // 卡号
        coinSymbol: string; // 赎回币种
        customerNo: string; // 客户编号
        ditchCode: string; // 渠道编码
        endCreateTime: string; // 创建结束时间
        endUpdateTime: string; // 更新结束时间
        labelId: string; // 标签ID
        orderNo: string; // 订单号
        pageNo: number; // 页码
        pageSize: number; // 页面大小
        startCreateTime: string; // 创建开始时间
        startUpdateTime: string; // 更新开始时间
    }): Promise<
        {
            list: {
                accountId: string; // 用户ID
                agentName: string; // 代理商名称
                cardName: string; // 卡片名称
                cardNo: string; // 卡号
                createTime: string; // 创建时间
                customerNo: string; // 客户编号
                ditchCode: string; // 渠道编码
                ditchName: string; // 卡片渠道
                id: string; // id
                labelIds: string; // 标签id
                labelList: {
                    accountIds: string; // 包含用户
                    color: string; // 颜色
                    createTime: string; // 创建日期
                    id: string; // id
                    name: string; // 名称
                    operatorName: string; // 修改人
                    sort: number; // 顺序
                    updateTime: string; // 修改日期
                }[];
                labelNames: string; // 用户标签
                orderNo: string;// 订单号
                orderTypeName: string; // 订单类型名称
                ransomAmount: string; // 赎回可用金额
                ransomCoin: string; // 赎回币种
                ransomFee: string; // 赎回预扣手续费
                ransomFeeRate: string; // 预扣手续费费率
                sourceName: string; // 来源
                state: number; // 订单状态
                stateName: string; // 订单状态名称
                updateTime: string; // 修改时间
            }[]
        } & TableResultType
    > {
        return this.api.post('/card/ransom/list', params);
    }

    // 卡赎回订单列表
    ransomExport(params: {
        accountId: string; // 用户id
        agentId: string; // 代理商名称
        cardName: string; // 卡片名称
        cardNo: string; // 卡号
        coinSymbol: string; // 赎回币种
        customerNo: string; // 客户编号
        ditchCode: string; // 渠道编码
        endCreateTime: string; // 创建结束时间
        endUpdateTime: string; // 更新结束时间
        labelId: string; // 标签ID
        orderNo: string; // 订单号
        pageNo: number; // 页码
        pageSize: number; // 页面大小
        startCreateTime: string; // 创建开始时间
        startUpdateTime: string; // 更新开始时间
    }): Promise<
        {
            list: {
                accountId: string; // 用户ID
                agentName: string; // 代理商名称
                cardName: string; // 卡片名称
                cardNo: string; // 卡号
                createTime: string; // 创建时间
                customerNo: string; // 客户编号
                ditchCode: string; // 渠道编码
                ditchName: string; // 卡片渠道
                id: string; // id
                labelIds: string; // 标签id
                labelList: {
                    accountIds: string; // 包含用户
                    color: string; // 颜色
                    createTime: string; // 创建日期
                    id: string; // id
                    name: string; // 名称
                    operatorName: string; // 修改人
                    sort: number; // 顺序
                    updateTime: string; // 修改日期
                }[];
                labelNames: string; // 用户标签
                orderNo: string;// 订单号
                orderTypeName: string; // 订单类型名称
                ransomAmount: string; // 赎回可用金额
                ransomCoin: string; // 赎回币种
                ransomFee: string; // 赎回预扣手续费
                ransomFeeRate: string; // 预扣手续费费率
                sourceName: string; // 来源
                state: number; // 订单状态
                stateName: string; // 订单状态名称
                updateTime: string; // 修改时间
            }[]
        } & TableResultType
    > {
        return this.api.post('/card/ransom/export', params, { responseType: 'blob' });
    }
}

export default new FlashExchange();
