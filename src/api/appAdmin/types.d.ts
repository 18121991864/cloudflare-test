export interface VersionList {
    constructNo: string; // 构建号
    createTime: string; // 创建时间
    id: string; // ID
    state: 1 | 2; // 状态:1、上架中 2、已下架
    type: 1 | 2; // 应用类型:1=iOS,2=Android
    url: string; // 下载URL
    versionNo: string; // 版本号
    force: 1 | 2; // 更新类型: 1.强制更新 2.普通更新
}

export interface VersionParams {
    constructNo?: string; // 构建号
    startTime?: string; // 创建时间
    endTime?: string; // 结束时间
    state?: null | 1 | 2; // 状态:1、上架中 2、已下架
    type?: null | 1 | 2; // 应用类型:1=iOS,2=Android
    versionNo?: string; // 版本号
    force?: null | 1 | 2; // 更新类型: 1.强制更新 2.普通更新
    pageSize: number;
    pageNo: number;
    marketType?: '' | null | 1 | 2 | 3; // 市场类型:1=AppStore,2=谷歌,3=APK
    range?: null | number; // 作用范围code
}
export interface ContentType {
    'zh-CN': string;
    'en-US': string;
    'ar-AE': string;
    'ru-RU': string;
    'zh-TW': string;
}
export interface VersionAdd {
    constructNo?: string; // 构建号,新增时传入
    content: ContentType; // 升级方案,JSON格式,{zh-CN:1.中文,en-US:1.Abc}
    force: 1 | 2; // 是否强制更新:1=是,2=否
    id?: string; // ID,修改时传入
    marketType: '' | 1 | 2 | 3; // 市场类型:1=AppStore,2=谷歌,3=APK
    type: 1 | 2; // 应用类型:1=Android,2=iOS,新增时传入
    url: string; // 下载URL
    versionNo?: string; //   版本号,新增时传入
    upUserType: {
        range?: number; //  针对用户类型
        migratedUserType?: number; //  迁移用户类型
        uids?: string; //   uids
        importBatchNo?: string; //  导入批次号
    };
}

export interface AppMessageCommons {
    accId: string; // 用户ID
    state: null | 0 | 1; // 状态 0.unsend(未发送) 1.send(已经发送)
    transmission: null | 0 | 2; // 推送类型 0.unicast(局部) 2.broadcast(全局)
}
// App活动推送入参
export interface AppMessageParams extends Partial<AppMessageCommons> {
    pageSize: number;
    pageNo: number;
    gt?: string; // 开始时间
    lt?: string; // 结束时间
    subtitle?: string; // 活动简述
}
// App活动推送出参
export interface AppMessageList extends AppMessageCommons {
    createTime: string; // 创建时间
    id: number;
    overview: string; // 活动简述
    updateTime: ''; // 发送时间
}

export interface AppMessagePush {
    accId?: string;
    body: string; // 内容详情
    bodyTw: string;
    bodyEn: string; // 通知详情英文
    bodyRu: string; //活动标题俄语
    bodyAr: string; //  活动标题阿拉伯
    id?: number; // 活动推送 ID
    overview: string; // 活动简述
    send: 0 | 1; // send: 推送时间 0.草稿箱 1.立即发送
    title: string; // 活动标题
    titleTw: string; // 活动标题英文
    titleEn: string; // 活动标题英文
    titleAr: string; // 活动标题阿拉伯
    titleRu: string; // 活动标题俄语
    transmission: number; // 0 局部 2 全局
    url?: string; // 超链接
    urlTw?: string;
    urlEn?: string; //  超链接英文
    urlAr?: string; //  超链接阿拉伯
    urlRu?: string; //  超链接俄语
}

export interface AppMenuList {
    icon: string; // 图标
    darkIcon: string; // 黑夜模式图标
    id?: number;
    key: string; // 字符串，唯一标识
    loginRequired: boolean; // 是否需要登录
    name: ContentType | string; //  国际化名称
    path: string; // 路径
    position: number | ''; // 位置,在首页菜单列表的位置
    state: number; // 状态, 0.default(默认) 1.hide(隐藏) 2.deleted(已删除)
    type: number; // 类型, 0.default(默认) 1.hyperlink(超链接) 2.local(flutter 本地屏幕) 3.switch tab(切换标签) 4.todo
    url: string; // 超链接
    language?: string;
    parentId?: number | string;
}
export interface AppMenuParams {
    pageSize: number;
    pageNo: number;
    loginRequired: boolean | null; // 是否需要登录
    name: string;
    state: null | 0 | 1;
    type: null | 1 | 2;
    path: string; // 路径
    url: string; // 超链接
    key: null | string;
    parentId?: number | string;
}

export interface AdvertisingSpaceList {
    btnText: string;
    id?: number | null;
    image: string;
    language: string;
    state: number;
    updateTime?: string;
    url: string;
}

export interface AdvertisingSpaceParams {
    state: null | 1 | 2; // .全部, 1.显示中, 2.已禁用
}

export interface AdvertisingPatch {
    id: number;
    mode: 'enable' | 'disable';
}

export interface PinCheckRuleData {
    errorCount: number | string;
    featureCodes: string | Array<any>;
    id?: number | null;
    influenceFunctions: string | Array<any>;
    intros: string;
    restrictDuration: number | string;
    scope: string | null;
    validDuration: number | string;
}
export interface PinCheckRuleParams {
    featureCodes: Array<any>;
    intros: string;
}

export interface languageType {
    language: string;
    value: string;
}

export interface AppContactlistType {
    contactAddress: string;
    contactInformation: string;
    createTime: string;
    id: string;
    language: string;
    languageSymbol: string;
    show: number;
    sort: number;
    state: number;
    updateTime: string;
}

export interface AppAddContactlist {
    contactAddress: string;
    contactInformation: string;
    id?: string;
    language?: string;
    languageSymbol?: string;
    operator: string;
    show: number;
    sort?: number;
    state: number;
}
export interface AppMenuAreaList {
    id: number | string;
    language: string;
    name: string;
}
