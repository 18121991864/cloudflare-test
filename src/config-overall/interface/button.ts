import type { TableDataPages, TableQueryParams } from '@/interface/StateType';
import type { UpdateConstType } from './update';
import type { InfoDataConstType } from './info';

/**
 * 按钮基础类型接口
 */
export interface BtnsType {
    /** 是否显示按钮  */
    show?: boolean;
    /** 按钮标题 */
    title?: string;
    /** 按钮权限标识 */
    buttonPermissions?: string;
}

/**
 * 查询按钮接口
 * @template T - 查询参数类型
 * @template P - 返回数据类型
 */
export interface queryButton<T, P> {
    /** 提交查询处理函数 */
    handelSubmit: (params: TableQueryParams<T>) => Promise<TableDataPages<P>>;
    // [key: string]: (params?: any) => void;
}

/**
 * 导出按钮接口
 * @template T - 导出参数类型
 */
export interface ExportButton<T> {
    /** 导出处理函数 */
    handExport: (params: TableQueryParams<T>) => Promise<any>;
    /** 导出文件标题 */
    exportFileTitle: string;
    /** 导出按钮是否要求传参 true接收参数 false不接收参数 */
    isParams?: boolean;
}

/**
 * 快照设置接口
 */
export interface SetSnapshotTypes {
    /** 设置快照按钮处理函数 */
    handelSetShotBtns: (params?: any) => Promise<any>;
}

/**
 * 按钮组合类型接口
 * @template T - 通用参数类型
 * @template P - 通用返回类型
 */
export interface ButtonTypes<T = any, P = any> {
    /** 添加按钮配置 */
    addBtns?: UpdateConstType;
    /** 编辑按钮配置 */
    editBtns?: UpdateConstType;
    /** 信息按钮配置 */
    infoButs?: InfoDataConstType;
    /** 查询按钮配置 */
    queryBtns: BtnsType & queryButton<T, P>;
    /** 重置按钮配置 */
    resetBtns?: BtnsType;
    /** 导出按钮配置 */
    exportBtns?: BtnsType & ExportButton<T>;
    /** 占位设置按钮配置 */
    setshotBtns?: BtnsType & SetSnapshotTypes;
    /** 其它按钮配置 */
    [key: string]: any;
}
