import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'ID', dataIndex: 'id' },
        { title: 'user.UserUID', dataIndex: 'uid' },
        // { title: 'user.UserID', dataIndex: 'accountId' },
        { title: 'user.Category', dataIndex: 'categoryName' },
        { title: 'user.UserMailbox', dataIndex: 'email' },
        { title: 'user.InviteCode', dataIndex: 'inviteCode' },
        { title: 'user.NickName', dataIndex: 'nickName' },
        { title: 'common.Status', dataIndex: 'status' },
        // { title: 'user.AuditStatus', dataIndex: 'auditStatusName' },
        { title: 'common.CreateTime', dataIndex: 'createTime' },
        { title: 'common.UpdateTime', dataIndex: 'updateTime' },
        { title: 'common.Operate', dataIndex: 'operate' },
    ];
    return {
        headers,
    };
};
