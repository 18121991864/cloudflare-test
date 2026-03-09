import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'user.UserUID', dataIndex: 'uid' },
        { title: 'user.UserID', dataIndex: 'accountId' },
        { title: 'user.Ditch', dataIndex: 'ditchCode', width: 120 },
        // { title: 'policy.Confidence', dataIndex: 'confidence' },
        { title: 'policy.TradingPair', dataIndex: 'contractName' },
        { title: 'policy.Direction', dataIndex: 'direction' },
        { title: 'policy.Price', dataIndex: 'price' },
        { title: 'common.source', dataIndex: 'sourceName', width: 120 },
        { title: 'policy.StopLossPrice', dataIndex: 'stopLoss' },
        { title: 'policy.TakeProfitPrice', dataIndex: 'takeProfit' },
        // { title: 'policy.PolicyName', dataIndex: 'strategyName' },
        { title: 'common.CreateTime', dataIndex: 'createTime' },
    ];
    return {
        headers,
    };
};
