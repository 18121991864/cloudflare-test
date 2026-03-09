import type { FromType, ConstructionOptions, ConstructionItem, ConstructionFrom } from '@/config-overall/interface/index';
import { ButtonTypes } from './button';
import { tabelConfigType } from './table';
import { SwitchConfig } from './swtich';

/** 表单校验规则类型 */
export interface rulesType {
    /** 是否必填 */
    required: boolean;
    /** 校验失败提示信息 */
    message?: string;
    /** 自定义校验函数 */
    validator?: (rule: any, value: any, callback: () => void) => void;
    /** 触发校验的时机 */
    trigger?: 'blur' | 'change' | string[];
}

/** 上传配置类型 */
export interface UploadType {
    /** 文件类型 */
    fileType?: number;
    /** 接受的文件类型 */
    accept?: string;
    /** 是否限制大小 */
    limitSize?: boolean;
    /** 最大文件大小 */
    maxFileSize?: number;
    /** 平台 */
    platform?: string;
    /** 是否自定义大小 */
    customSize?: boolean;
    /** 比例 */
    proportion?: number;
    /** 是否显示删除按钮 */
    isdeleteBtn: boolean;
    /** 高度 */
    height?: string;
}

/** 上传列表项类型 */
export interface UploadTypeList {
    /** 值1 */
    value1?: string;
    /** 值 */
    value: string;
    /** 描述文本 */
    descText?: string;
}

/** 选择器属性类型 */
export interface SelectAttType {
    /** 字段名配置 */
    fieldNames: { label: string; value: string; options?: any[] };
    /** 是否显示搜索框 */
    showSearch?: boolean;
    /** 选择模式 */
    mode?: 'multiple' | 'tags' | 'combobox';
    /** 搜索时过滤对应的 option 属性 */
    optionFilterProp?: string;
}

/** 输入按钮选项类型 */
export interface InputButtonOptionsType {
    /** 按钮标题 */
    title: string;
    /** 点击回调 */
    callback: (item: UpdateConstructionItem) => void;
    /** 失焦回调 */
    blur?: (item: UpdateConstructionItem) => void;
    /** 加载状态 */
    loading: boolean;
    /** 宽度 */
    width?: string;
}

/** 组件类型 */
export interface componentTypes {
    /** 动态组件名称 */
    componentName: any;
    /** 构造表单 */
    ConstructionFrom: ConstructionFrom;
}

/** 单选按钮选项类型 */
export interface RedioButtonOptionsType {
    /** 标题 */
    title?: string;
    /** 选择回调 */
    callback: (item: UpdateConstructionItem, value: string | number) => void;
    /** 是否显示 */
    show?: boolean;
    /** 点击回调 */
    clickCallback?: (item: UpdateConstructionItem) => void;
    /** 是否禁用 */
    disabled?: boolean;
    /** 动态组件 */
    components?: componentTypes;
}

/** 单选输入选项类型 */
export interface RediInputOptionsType {
    /** 回调函数 */
    callback: (item: UpdateConstructionItem, value: string | number, item1?: UpdateConstructionItem) => void;
    /** 改变事件 */
    change: (item: UpdateConstructionItem, value: string | number) => void;
}

/** 更新构造项类型 */
export interface UpdateConstructionItem {
    /** 标签名字 */
    label: string;
    /** 值1 */
    value: string;
    /** 值2 */
    value1?: string;
    /** 是否必填 */
    isRuqire?: boolean;
    /** 表单类型 */
    type: FromType;
    /** 占位符 */
    placeholder: string;
    /** 宽度 */
    width?: string;
    /** 选择框选项 */
    selectOptions?: ConstructionOptions[];
    /** 后缀 */
    suffix?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否显示表单 */
    isForm?: boolean;
    /** 是否显示 */
    isFormItem?: boolean;
    /** 校验规则 */
    rules?: rulesType;
    /** 值改变事件 */
    change?: (params: any) => void;
    /** 上传配置 */
    uploadOptions?: UploadType;
    /** 多图片上传列表 */
    uploadList?: UploadTypeList[];
    /** 图片提示 */
    descText?: string;
    /** 区号选择器属性 */
    selectAttribute?: SelectAttType;
    /** 第二占位符 */
    placeholder1?: string;
    /** 输入按钮选项 */
    inputButtonOptions?: InputButtonOptionsType;
    /** 单选按钮选项 */
    redioButtonOptions?: RedioButtonOptionsType;
    /** 单选输入选项 */
    redioInputOptions?: RediInputOptionsType;
    /** 标签页选项 */
    tabsOptions?: {
        callback: (item: UpdateConstructionItem, value: string | number) => void;
    };
    /** 时间选项 */
    timeOptions?: {
        dates: string;
    };
    /**  插槽配置 */
    slotOptions?: {
        name: string;
    };
    /** 提示 */
    tips?: string;
    /** 开关 */
    switchConfig?: SwitchConfig;
    ditchCode?: string;
}

/** 更新构造类型 */
export interface UpdateConstructionType<T = any> {
    /** 字段名列表 */
    fieldNames: UpdateConstructionItem[];
    /** 字段插槽名 */
    fieldSlots?: string[];
    /** 标题名称 */
    titleName: string;
    /** 更新接口 */
    updateInterface: (params: T) => Promise<any>;
    /** 表单校验规则 */
    formRules?: Record<string, rulesType[]>;
    /** 排序 */
    order?: number;
    /** 表单重置 */
    formReset?: any;
    /** 表单状态 */
    formState?: any;
    /** 宽度 */
    width?: number;
    /** 回调函数 */
    callback?: (config: any, data: any) => void;
    /** 确认按钮文本 */
    okText?: string;
    /** 取消按钮文本 */
    cancelText?: string;
}

/** 按钮信息接口 */
export interface BtnsInfo {
    /** 标题 */
    title?: string;
    /** 按钮权限标识 */
    buttonPermissions?: string;
}

/** 自定义插槽类型 */
export type CustomSlotType<T = any> = BtnsInfo & UpdateConstructionType<T>;

/** 自定义插槽配置类型 */
export type CustomSlotSlot<T = any> = {
    /** 插槽名称 */
    slotName: string;
    /** 插槽数据 */
    slotData: {
        /** 按钮列表 */
        buttons: CustomSlotType<T>[];
    }[];
};

/** 显示按钮类型 */
export interface BtnsTypeTrue extends BtnsInfo {
    /** 是否显示 */
    show: true;
}

/** 隐藏按钮类型 */
export interface BtnsTypeFalse extends Partial<BtnsInfo> {
    /** 是否显示 */
    show: false;
}

/** 必需的更新类型 */
export type UpdateRequired<T = any> = BtnsTypeTrue & UpdateConstructionType<T>;

/** 可选的更新类型 */
export type UpdatePartial<T = any> = BtnsTypeFalse & Partial<UpdateConstructionType<T>>;

/** 更新常量类型 */
export type UpdateConstType<T = any> = UpdatePartial<T> | UpdateRequired<T>;
