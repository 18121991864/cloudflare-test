import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'ID', dataIndex: 'id', fixed: 'left', width: 50 },
        { title: 'policy.Ditch', dataIndex: 'ditchName', fixed: 'left' },
        { title: 'policy.PolicyName', dataIndex: 'name' },
        { title: 'policy.QuoteCurrency', dataIndex: 'valuationCoin' },
        { title: 'policy.TradeType', dataIndex: 'orderTypeName' },
        { title: 'policy.TradingPair', dataIndex: 'symbol' },
        { title: 'policy.ContractID', dataIndex: 'contractId' },
        { title: 'policy.ContractName', dataIndex: 'contractName' },


        { title: 'policy.BasePositionRatio', dataIndex: 'basePositionSize' },
        { title: 'policy.DeviationThreshold', dataIndex: 'deviationThreshold' },
        { title: 'policy.InitialBalance', dataIndex: 'initialBalance' },
        { title: 'policy.MediumTermMAperiod', dataIndex: 'maPeriod' },
        { title: 'policy.MaxTradeInterval', dataIndex: 'maxTradeInterval' },
        { title: 'policy.MaxDailyTrades', dataIndex: 'maxTradesPerDay' },
        { title: 'policy.MinTradeInterval', dataIndex: 'minTradeInterval' },
        { title: 'policy.StopLossRatio', dataIndex: 'stopLossPct' },
        { title: 'policy.TakeProfitRatio', dataIndex: 'takeProfitPct' },
        { title: 'policy.TargetVolatility', dataIndex: 'targetVolatility' },
        { title: 'common.Status', dataIndex: 'statusName' },

        { title: 'policy.TradeIntervalSeconds', dataIndex: 'timeframe' },

        { title: 'common.CreateTime', dataIndex: 'createTime' },
        { title: 'common.UpdateTime', dataIndex: 'updateTime' },
        { title: 'common.Operate', dataIndex: 'operate', fixed: 'right' },
    ];
    return {
        headers,
    };
};
