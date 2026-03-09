import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'user.ID', dataIndex: 'id' },
        { title: 'policy.Ditch', dataIndex: 'ditchName', fixed: 'left' },
        { title: 'user.UserUID', dataIndex: 'uid' },
        { title: 'policy.ContractName', dataIndex: 'contractName' },
        // { title: 'policy.IsGridTrade', dataIndex: 'isGridTrade' },
        { title: 'policy.GridTradeStatus', dataIndex: 'gridTradeStatus' },
        { title: 'policy.PolicyName', dataIndex: 'strategyName' },
        { title: 'policy.VersionName', dataIndex: 'versionName' },
        { title: 'policy.AllocatedFunds', dataIndex: 'allocateFunds' },
        { title: 'common.Status', dataIndex: 'statusName' },
        { title: 'common.CreateTime', dataIndex: 'createTime' },
        { title: 'common.UpdateTime', dataIndex: 'updateTime' },
        { title: 'common.Operate', dataIndex: 'operate', fixed: 'right', width: 240 },
    ];
    return {
        headers,
    };
};
