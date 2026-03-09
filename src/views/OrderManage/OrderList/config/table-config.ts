import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'ID', dataIndex: 'id', width: 80 },
        { title: 'user.UserUID', dataIndex: 'uid', width: 200 },
        // { title: 'user.UserID', dataIndex: 'accountId', width: 200 },
        { title: 'user.UserMailbox', dataIndex: 'email', width: 200 },
        { title: 'user.Ditch', dataIndex: 'ditchCode', width: 120 },
        { title: 'user.Third-party user ID', dataIndex: 'thirdAccountId', width: 200 },
        { title: 'common.source', dataIndex: 'sourceName', width: 120 },
        { title: 'order.OrderID', dataIndex: 'orderNo', width: 200 },
        { title: 'common.orderType', dataIndex: 'type', width: 120 },
        { title: 'order.ThirdPartyOrderID', dataIndex: 'thirdOrderId', width: 200 },
        { title: 'order.Direction', dataIndex: 'side', width: 120 },
        { title: 'order.Quantity', dataIndex: 'size', width: 120 },
        { title: 'order.StrategyName', dataIndex: 'strategyName', width: 120 },
        { title: 'order.TradingPair', dataIndex: 'contractName', width: 120 },
        { title: 'order.ClearingFee', dataIndex: 'cumLiquidateFee', width: 120 },
        { title: 'order.TransactionFee', dataIndex: 'cumMatchFee', width: 120 },
        { title: 'order.Volume', dataIndex: 'cumMatchSize', width: 120 },
        { title: 'order.TransactionAmount', dataIndex: 'cumMatchValue', width: 120 },
        { title: 'order.RealizedPnL', dataIndex: 'cumRealizePnl', width: 120 },
        { title: 'common.Status', dataIndex: 'status', width: 120 },
        { title: 'order.HighestPrice', dataIndex: 'maxFillPrice', width: 120 },
        { title: 'order.Leverage', dataIndex: 'maxLeverage', width: 120 },
        { title: 'order.LowestPrice', dataIndex: 'minFillPrice', width: 120 },
        { title: 'common.cancelReason', dataIndex: 'cancelReason', width: 120 },
        { title: 'common.CreateTime', dataIndex: 'createTime', width: 120 },
    ];
    return {
        headers,
    };
};
