import { iteratee } from 'lodash-es';

export interface TreeDataType {
    checkPassword: boolean;
    menuId: string;
    menuName: string;
    menuType: number;
    parentId: string;
    component: string;
    showCheckPassword: boolean;
    children?: TreeDataType[];
}

export interface ColumnType {
    // column type
    title: string;
    dataIndex?: string;
    key?: string;
    slots?: {
        customRender: string;
    };
    children?: Array<{ title: string; dataIndex: string; key: string }>;
    className?: string;
    align?: string;
    width?: string | number;
    customRender?: (data: { index: number; text: string | number; record: any }) => void;
    fixed?: string;
    ellipsis?: boolean;
}

export interface FileItem {
    // 文件type
    uid: string;
    name?: string;
    status?: string;
    response?: string;
    url?: string;
    type?: string;
    size: number;
    originFileObj: any;
    preview?: string;
}

export interface RolePermissionsType {
    checkPassword: boolean;
    roleId?: string;
    roleName?: string;
    show?: boolean;
    state: boolean;
}

export interface TableResultType {
    pageNo: number;
    pageSize: number;
    totalSize: number;
    totalPages: number;
    prevPage: number;
    nextPage: number;
}

export interface RetrunData<T> {
    list: T[];
}
// table数据 列表
export interface TableDataPages<T> extends TableResultType, RetrunData<T> {}

export interface PaginationParams {
    pageNo: number | string;
    pageSize: number | string;
}
//  table请求参数
export type TableQueryParams<T> = PaginationParams & T;
export interface TypeList {
    label: string;
    value: number | string;
}
