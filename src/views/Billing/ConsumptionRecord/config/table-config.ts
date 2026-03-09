import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'ID', dataIndex: 'id' },
        { title: '消耗类型', dataIndex: 'typeName' },
        { title: '价值(USD)', dataIndex: 'convertUsd' },
        { title: 'Gas支出', dataIndex: 'amount' },
        { title: '币种', dataIndex: 'coinSymbol' },
        { title: '网络', dataIndex: 'chainName' },
        { title: 'From', dataIndex: 'fromAddress', width: 240 },
        { title: 'To', dataIndex: 'toAddress', width: 240 },
        { title: 'Hash', dataIndex: 'txHash', width: 240 },
        { title: '创建时间', dataIndex: 'createTime' },
        { title: '状态', dataIndex: 'stateName' },
        { title: '操作', dataIndex: 'operate' },
    ];
    return {
        headers,
    };
};
