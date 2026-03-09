import { HeadersType } from '@/config-overall/interface/table';

export default () => {
    const headers: HeadersType[] = [
        { title: 'ID', dataIndex: 'id', width: 80 },
        { title: '代理商', dataIndex: 'name', width: 150 },
        { title: '联系人', dataIndex: 'contacts', width: 120 },
        { title: '联系人邮箱', dataIndex: 'email', width: 150 },
        { title: '联系人手机', dataIndex: 'phone', width: 150 },
        { title: '公司名称', dataIndex: 'companyName', width: 150 },
        // { title: '公司国家', dataIndex: 'countryName', width: 150 },
        { title: '公司地址', dataIndex: 'address', width: 150 },
        { title: '创建日期', dataIndex: 'createTime', width: 120 },
        { title: '审核日期', dataIndex: 'auditTime', width: 120 },
        { title: '代理商类别', dataIndex: 'categoryName', width: 120 },
        { title: '状态', dataIndex: 'statusName', width: 100 },
        { title: '操作', dataIndex: 'operate', width: 150, fixed: 'right' },
    ];
    return {
        headers,
    };
};
