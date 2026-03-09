import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'ID', dataIndex: 'id', fixed: 'left' },
        { title: 'policy.PolicyName', dataIndex: 'name', fixed: 'left' },
        { title: 'policy.VersionName', dataIndex: 'versionName', fixed: 'left' },
        { title: 'policy.Title', dataIndex: 'title' },
        { title: 'policy.BaseCoin', dataIndex: 'baseCoin' },
        { title: 'policy.QuoteCurrency', dataIndex: 'valuationCoin' },
        { title: 'policy.BasePositionRatio', dataIndex: 'basePositionSize' },
        { title: 'policy.ContractName', dataIndex: 'contractName' },
        { title: 'policy.DeviationThreshold', dataIndex: 'deviationThreshold' },
        { title: 'policy.InitialBalance', dataIndex: 'initialBalance' },
        { title: 'policy.MediumTermMAperiod', dataIndex: 'maPeriod' },
        { title: 'policy.MaxTradeInterval', dataIndex: 'maxTradeInterval' },
        { title: 'policy.MaxDailyTrades', dataIndex: 'maxTradesPerDay' },
        { title: 'policy.MinTradeInterval', dataIndex: 'minTradeInterval' },
        { title: 'policy.TradeType', dataIndex: 'orderTypeName' },
        { title: 'common.Status', dataIndex: 'statusName' },
        { title: 'policy.StopLossRatio', dataIndex: 'stopLossPct' },
        { title: 'policy.TradingPair', dataIndex: 'symbol' },
        { title: 'policy.TakeProfitRatio', dataIndex: 'takeProfitPct' },
        { title: 'policy.TargetVolatility', dataIndex: 'targetVolatility' },
        { title: 'policy.TradeIntervalSeconds', dataIndex: 'timeframe' },
        { title: 'common.CreateTime', dataIndex: 'createTime' },
        { title: 'common.UpdateTime', dataIndex: 'updateTime' },
    ];
    return {
        headers,
    };
};
