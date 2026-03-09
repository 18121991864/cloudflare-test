/** 详情标签接口 */
export interface detailLabel {
    /** 标签文本 */
    label: string;
    /** 标签值 */
    value: string;
}

/** 回调信息接口 */
export interface CallbackInfo<P = any, D = any> {
    /** 处理详情信息的异步方法 */
    handelDetailInfo?: (params: P) => Promise<D>;
    /** 回调配置 */
    CallbackConfig?: {
        /** 成功提示信息 */
        success?: string;
        /** 回调参数 */
        params: any;
        /** 处理回调的异步方法 */
        handelCallback: (params: P) => Promise<any>;
    };
}

/** 查询详情配置接口 */
export interface queryDetailConfig<T = detailLabel[]> {
    /** 详情配置 */
    detailConfig: {
        /** 详情标签配置 */
        detailLabel: T;
        /** 详情数据 */
        detailData?: any;
    };
    /** 回调配置 */
    callback?: CallbackInfo;
}

/** 视图页面详情接口 */
export interface viewPageDetail extends detailLabel {
    /** 是否加粗显示 */
    bold?: boolean;
    /** 是否进行分类排序 */
    isAssort?: boolean;
    /** 是否显示横线分割 */
    isLine?: boolean;
    /** 自定义插槽名称 */
    slotName?: string;
    /** 是否显示该项 */
    show?: boolean;
}
