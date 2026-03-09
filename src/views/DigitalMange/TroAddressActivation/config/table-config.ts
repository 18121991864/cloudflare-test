import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'ID', dataIndex: 'id', width: 80 },
        { title: '订单号', dataIndex: 'orderNo', width: 200 },
        { title: '激活地址', dataIndex: 'activateAddress', width: 200 },
        { title: '转账金额', dataIndex: 'amount' },
        { title: '消费金额', dataIndex: 'consumeAmount' },
        { title: '出币地址', dataIndex: 'fromAddress', width: 160 },
        { title: '时间', dataIndex: 'createTime', width: 160 },
        { title: 'hash', dataIndex: 'txHash', width: 200 },
        { title: '状态', dataIndex: 'statusName' },
    ];
    return {
        headers,
    };
};
