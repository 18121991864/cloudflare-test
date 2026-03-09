import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'user.UserUID', dataIndex: 'uid' },
        { title: 'user.Third-party user ID', dataIndex: 'thirdAccountId', width: 200 },
        { title: 'user.UserMailbox', dataIndex: 'email', width: 200 },
        { title: 'order.StrategyName', dataIndex: 'strategyName', width: 120 },
        { title: 'common.exchangeType', dataIndex: 'exchangeType', width: 120 },
        { title: 'common.TradingPair', dataIndex: 'contractName', width: 120 },
        { title: 'common.skipReason', dataIndex: 'skipReason', width: 120 },
        { title: 'common.netExposure', dataIndex: 'netExposure', width: 120 },
        { title: 'common.exposureLimit', dataIndex: 'exposureLimit', width: 120 },
        { title: 'common.Balance', dataIndex: 'balance', width: 120 },
        { title: 'common.midPrice', dataIndex: 'midPrice', width: 120 },
        { title: 'common.CreateTime', dataIndex: 'createTime' },
    ];
    return {
        headers,
    };
};
