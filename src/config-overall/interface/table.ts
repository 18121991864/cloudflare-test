/** 行选择配置类型 */
type RowSelectionType = {
    /** 选择改变时的回调函数 */
    onChange: (changableRowKeys: any[]) => void;
    /** 已选择的行键值数组 */
    selectedRowKeys: any[];
    /** 是否隐藏默认选择项 */
    hideDefaultSelections: boolean;
};

/** 表格列头配置类型 */
export interface HeadersType {
    /** 列标题 */
    title: string;
    /** 列数据字段名 */
    dataIndex: string;
    /** 列键值 */
    key?: string;
    /** 列宽度 */
    width?: string | number;
    /** 列固定方向 */
    fixed?: 'left' | 'right';
    /** 排序函数 */
    sorter?: (a: any, b: any) => any;
    /** 设置列的对齐方式 */
    align?: 'left' | 'right' | 'center';
    /** 自定义样式 */
    style?: Record<string, any>;
}

/** 自定义表头字段数组类型 */
export type HeadersCustom = string[];

/** 分页配置类型 */
export interface PaginationConfType {
    /** 分页大小 */
    size: string;
    /** 是否显示分页大小切换器 */
    showSizeChanger: boolean;
    /** 每页显示条目数选项 */
    pageSizeOptions: number[] | string[];
    /** 是否显示快速跳转 */
    showQuickJumper: boolean;
    /** 显示总数的函数 */
    showTotal: (total: number) => string;
    /** 总条目数 */
    total: number;
    /** 当前页码 */
    current: number;
    /** 每页显示条数 */
    pageSize: number;
    /** 是否有显示翻页 */
    showPagination: boolean;
}

/** 提示框配置类型 */
export interface ConfigTooltip {
    /** 是否显示提示框 */
    show: boolean;
    /** 提示框弹出位置 */
    placement:
        | 'top'
        | 'left'
        | 'right'
        | 'bottom'
        | 'topLeft'
        | 'topRight'
        | 'bottomLeft'
        | 'bottomRight'
        | 'leftTop'
        | 'leftBottom'
        | 'rightTop'
        | 'rightBottom';
}

/** 表格配置类型 */
export interface tabelConfigType {
    /** 表格列配置 */
    headers: HeadersType[];
    /** 自定义表头字段 */
    headersCustom?: HeadersCustom;
    /** 图片自定义字段 */
    imgCustom?: HeadersCustom;
    /** 表格滚动配置 */
    scroll?: { x?: number; y?: number };
    /** 提示框配置 */
    tooltip?: ConfigTooltip;
    /** 复制功能自定义字段 */
    copyCustom?: HeadersCustom;
    /** 行选择配置 */
    rowSelection?: ComputedRef<RowSelectionType>;
    /** 行数据的唯一键字段 */
    rowKey?: string;
    /** 设置列的对齐方式 */
    align?: 'left' | 'right' | 'center';
    /** width宽度统一设置 默认120px */
    width?: string | number;
}
