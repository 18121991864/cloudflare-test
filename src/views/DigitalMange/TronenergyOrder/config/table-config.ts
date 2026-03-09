import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'ID', dataIndex: 'id' },
        { title: '外部订单号', dataIndex: 'serial' },
        { title: '消耗Trx', dataIndex: 'amount' },
        { title: '来源订单号', dataIndex: 'sourceOrderNo' },
        { title: '能量获取地址', dataIndex: 'receiveAddress' },
        { title: '获得能量', dataIndex: 'energyAmount' },
        { title: '时间', dataIndex: 'createTime' },
        { title: '状态', dataIndex: 'stateName' },
    ];
    return {
        headers,
    };
};
