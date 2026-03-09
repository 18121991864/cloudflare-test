import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'ID', dataIndex: 'id', width: 80 },
        { title: 'user.UserID', dataIndex: 'accountId', width: 120 },
        { title: 'user.UserMailbox', dataIndex: 'email', width: 200 },
        { title: 'user.Ditch', dataIndex: 'ditchName', width: 120 },
        { title: 'user.UserUID', dataIndex: 'uid', width: 180 },
        { title: 'user.Third-party user ID', dataIndex: 'thirdAccountId', width: 200 },
        { title: 'common.Status', dataIndex: 'status', width: 120 },
        { title: 'user.AuditStatus', dataIndex: 'auditStatusName', width: 140 },
        { title: 'common.Balance', dataIndex: 'balance', width: 120 },
        { title: 'common.orderNum', dataIndex: 'orderNum', width: 120 },
        { title: 'common.cumMatchValue', dataIndex: 'cumMatchValue', width: 120 },
        { title: 'common.cumMatchFee', dataIndex: 'cumMatchFee', width: 120 },
        { title: 'common.cumRealizePnl', dataIndex: 'cumRealizePnl', width: 120 },
        { title: 'common.CreateTime', dataIndex: 'createTime', width: 120 },
        { title: 'common.ErrorMsg', dataIndex: 'errorMsg', width: 120 },
        { title: 'common.Operate', dataIndex: 'operate', width: 120 }, // 操作
    ];
    return {
        headers,
    };
};
