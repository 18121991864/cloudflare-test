import type { TableQueryParams } from '@/interface/StateType';
import { queryDetailConfig } from './detail';
import { tabelConfigType } from './table';
import { ButtonTypes } from './button';
import { CustomSlotSlot, CustomSlotType } from './update';
import { PagingDefaultConf } from '@/use/useTableConf';
import { ManipulateType } from 'dayjs';
/** 表单控件类型，定义了所有支持的表单控件类型 */
export type FromType =
    | 'coinId' /** 币种ID选择器 */
    | 'cardId' /** 卡片ID选择器 */
    | 'input' /** 普通输入框 */
    | 'input-button' /** 带按钮的输入框 */
    | 'globalPhone' /** 国际电话号码输入 */
    | 'select' /** 下拉选择框 */
    | 'input-number' /** 数字输入框 */
    | 'radio' /** 单选框 */
    | 'radio-button' /** 单选按钮 */
    | 'radio-input' /** 带输入框的单选 */
    | 'checkbox' /** 复选框 */
    | 'date' /** 日期选择器 */
    | 'select-multiple' /** 多选下拉框 */
    | 'input-password' /** 密码输入框 */
    | 'textarea' /** 文本域 */
    | 'select-options' /** 选项选择器 */
    | 'span' /** 文本展示 */
    | 'tabs' /** 标签页 */
    | 'tabs-input' /** 带输入的标签页 */
    | 'timePicker' /** 时间选择器 */
    | 'text' /** 纯文本 */
    | 'upload-img' /** 图片上传 */
    | 'switch' /** 开关 */
    | 'slot' /** 插槽 */
    | 'labelId' /** 用户标签 */
    | 'label'
    | 'uid';

/** 金额统计项配置接口 */
export interface AmountStatisticsType {
    /** 统计项显示的标签文本 */
    label: string;
    /** 统计项的值 */
    value: string;
    /** 货币单位 */
    currenty?: string;
}

/** 全选功能配置接口 */
export interface isAllTypeSelect {
    /** 是否显示全选功能 */
    show: boolean;
    /** 全选功能的标签文本 */
    label?: string;
    /** 全选时的值 */
    value: any;
}

/** 构建选项配置接口 */
export interface ConstructionOptions {
    /** 选项的标签文本 */
    label: string;
    /** 选项的后缀标签 */
    suffixLable?: string;
    /** 选项的值 */
    value: string | number | null;
    /** 是否禁用该选项 */
    disabled?: boolean;
    /** 选项的附加数据 */
    data?: string | number;
    /** 选项的显示颜色 */
    color?: string;
}

/** 构建表单项配置接口 */
export interface ConstructionItem {
    /** 表单项的标签文本 */
    label: string;
    /** 表单项的值 */
    value: string;
    /** 表单项的类型 */
    type: FromType;
    /** 表单项的占位符文本 */
    placeholder: string;
    /** 表单项的宽度 */
    width?: string;
    /** 表单项的自定义类名 */
    className?: string;
    isAll?: 1 | 2; // 2不显示
    /** 选项列表配置 */
    options?: ConstructionOptions[] | Ref<ConstructionOptions[]>;
    /** 时间格式化方式 */
    timeFormat?: 'date' | 'timeStamp';
    /** 时间值数组 */
    timeValue?: Array<any>;
    /** 全选配置 */
    allSelectAll?: isAllTypeSelect;
    /** 日期选择器模式 */
    mode?: 'time' | 'date' | 'month' | 'year' | 'decade';
    defaultSelectOption?: {
        time: number;
        format?: ManipulateType;
    };
    //
    ditchCode?: string;
}

/** 标签页活动数据配置接口 */
export interface activeDataType {
    /** 唯一标识键 */
    key: string;
    /** 标签页显示文本 */
    tab: string;
    /** 构建配置对象 */
    activeConstring: Partial<ConstructionFrom>;
    /** 角色权限标识 */
    role?: string;
}

/** 标签页完整配置接口 */
export interface TabsPangeConfig {
    /** 活动数据列表 */
    activeData: activeDataType[];
    /** 是否显示标签页 */
    show: true;
    /** 当前激活的标签页键值 */
    activeKey: string;
    /** 回调 */
    callback?: (...args: any) => void;
    // 需要查询的key
    queryKey?: string[] | number[];
    // 默认不需要查询可以
    noQueryKey?: string[] | number[];
}

/** 标签页部分配置接口 */
export interface PartialTabsPangeConfig {
    /** 是否显示标签页 */
    show: false;
    /** 活动数据列表 */
    activeData?: activeDataType[];
    /** 当前激活的标签页键值 */
    activeKey?: string;
    /** 回调 */
    callback?: (...args: any) => void;
    // 需要查询的key
    queryKey?: string[] | number[];
    // 默认不需要查询可以
    noQueryKey?: string[] | number[];
}

/** 标签页配置联合类型 */
export type TabsConfig = TabsPangeConfig | PartialTabsPangeConfig;

/** 构建页面主配置 包含 表单 按钮 表格 详情 统计 */
export interface ConstructionFrom<T = any, P = any> {
    /** 表单项配置列表 */
    construction: ConstructionItem[] | [];
    /** 全选配置 */
    allSelectAll?: isAllTypeSelect;
    /** 构建器自定义类名 */
    constrClassName?: string;
    /** 控制所有按钮显示 */
    btnShow?: boolean;
    /** 按钮配置 */
    btns: ButtonTypes<T, P>;
    /** 自定义插槽配置 */
    slotType?: CustomSlotSlot<T>;
    /** 统计功能配置 */
    statistics?: {
        isType: 1 | 2; // 不需要自己组装数组
        /** 金额统计列表 */
        AmountList: AmountStatisticsType[];
        /** 是否显示统计 */
        show: boolean;
        /** 查询总额的异步方法 */
        queryAmoutTotal: (params: TableQueryParams<T>) => Promise<T | any>;
    };
    /** 表格配置 */
    tabelConfig: tabelConfigType;
    /** 查询详情配置 */
    queryDetailConfig?: queryDetailConfig;
    /** 数据字段 */
    formState?: any;
    /** 标签页配置 */
    tabsPangeConfig?: TabsConfig;
    /** 分页配置 */
    PagingDefaultConf?: typeof PagingDefaultConf;
}
