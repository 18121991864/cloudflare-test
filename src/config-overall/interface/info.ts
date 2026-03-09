import { BtnsInfo, UpdateConstructionType } from './update';

/** 信息数据构造项接口 */
export interface InfoDataeConstructionItem {
    /** 标签文本 */
    label: string;
    /** 值 */
    value: string;
    /** 宽度 */
    width?: string;
    /** 后缀 */
    suffix?: string;
    /** 跨度 */
    span?: number;
}

/** 标签页数据常量类型接口 */
export interface TabsDataConstType {
    /** 名称 */
    name: string;
    /** 字段名称列表 */
    fieldNames: InfoDataeConstructionItem[];
}

/** 查看信息数据接口 */
export interface LookInfoData<T = any> extends Omit<UpdateConstructionType<T>, 'formReset' | 'updateInterface' | 'formRules' | 'fieldNames'> {
    /** 处理信息数据的异步方法 */
    handelInfoData?: (params: T) => Promise<any>;
    /** 自定义插槽列表 */
    customSlots?: string[];
    /** 标签插槽列表 */
    lableSlots?: string[];
    /** 列数 */
    column?: number;
}

/** 信息字段名称接口 */
export interface InfofieldNames<T = any> extends LookInfoData<T> {
    /** 字段名称列表 */
    fieldNames: InfoDataeConstructionItem[];
}

/** 信息标签页接口 */
export interface InfoTabs<T = any> extends LookInfoData<T> {
    /** 标签页列表 */
    tabs: TabsDataConstType[];
}

/** 信息类型列表数据类型 */
export type InfoTypesListData<T = any> = InfofieldNames<T> | InfoTabs<T>;

/** 信息类型显示类型 */
export type infoTypeTrue<T> = InfoTypesListData<T> & {
    /** 是否显示 */
    show: true;
};

/** 信息类型隐藏类型 */
export type infoTypeFalse<T> = Partial<InfoTypesListData<T>> & {
    /** 是否显示 */
    show: false;
};

/** 必需的信息数据类型 */
export type InfoDataRequired<T = any> = infoTypeTrue<T> & LookInfoData<T> & BtnsInfo;

/** 部分信息数据类型 */
export type InfoDataPartial<T = any> = infoTypeFalse<T> & Partial<LookInfoData<T>> & BtnsInfo;

/** 信息数据常量类型 */
export type InfoDataConstType<T = any> = InfoDataPartial<T> | InfoDataRequired<T>;
