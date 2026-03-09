export interface listTypeParams {
    companyName: string;
    country: string;
    email: string;
    name: string;
    phone: string;
    type: number;
}

/**
 * 代理商准入列表数据
 * {
 *   "address": "",
 *   "agentCategoryName": "",
 *   "auditRemark": "",
 *   "auditTime": "",
 *   "auditUserId": "",
 *   "auditUserName": "",
 *   "businessLicense": "",
 *   "category": 0,
 *   "categoryName": "",
 *   "companyName": "",
 *   "contacts": "",
 *   "countryName": "",
 *   "createTime": "",
 *   "email": "",
 *   "globalCode": "",
 *   "id": "",
 *   "name": "",
 *   "phone": "",
 *   "status": 0,
 *   "statusName": "",
 *   "updateTime": ""
 * }
 */
export interface listTypeData {
    /** 地址 */
    address: string;
    /** 代理商类型名称 */
    agentCategoryName: string;
    /** 审核备注 */
    auditRemark: string;
    /** 审核时间 */
    auditTime: string;
    /** 审核人ID */
    auditUserId: string;
    /** 审核人名称 */
    auditUserName: string;
    /** 营业执照 */
    businessLicense: string;
    /** 代理商类型 */
    category: number;
    /** 代理商类型名称 */
    categoryName: string;
    /** 公司名称 */
    companyName: string;
    /** 联系人 */
    contacts: string;
    /** 国家名称 */
    countryName: string;
    /** 创建时间 */
    createTime: string;
    /** 邮箱 */
    email: string;
    /** 国际区号 */
    globalCode: string;
    /** 主键ID */
    id: string;
    /** 代理商名称 */
    name: string;
    /** 联系电话 */
    phone: string;
    /** 状态 */
    status: number;
    /** 状态名称 */
    statusName: string;
    /** 更新时间 */
    updateTime: string;
}

export interface AuditParams {
    auditRemark: string;
    id: number;
    status: number;
}

export interface AddAgentApply {
    address: string;
    businessLicense: string;
    companyName: string;
    contacts: string;
    country: string;
    email: string;
    globalCode: string;
    name: string;
    phone: string;
    type: number;
}

export interface RolesList {
    id: string;
    isDefault: number;
    name: string;
    status: number;
}
export interface PermissionsList {
    id: string;
    title: string;
    route: string;
    name: string;
    type: number;
    parentId: string;
    checkState: number;
}
export type PermissionsMenuList = Omit<PermissionsList, 'id'> & {
    menuId: string;
    uri: string;
    remark: string;
    titleEn: string;
};
export interface TeamListParams {
    agentId: string;
    agentName: string;
    id: string;
}

export interface TeamListData {
    agentId: string;
    agentName: string;
    id: string;
    leaderName: string;
    name: string;
    status: number;
}
export interface MemberListData {
    agentId: string;
    agentName: string;
    createTime: string;
    email: string;
    id: string;
    name: string;
    roleName: string;
    status: number;
}

export interface CustomerGroupParams {
    agentId: string;
    agentName: string;
    groupName: string;
}

export interface CustomerGroupData {
    agentId: string;
    agentName: string;
    groupName: string;
    groupNo: string;
    id: string;
    remark: string;
}

export interface customerTypeParams {
    accountNo: string;
    agentId: string;
    agentName: string;
    groupName: string;
    name: string;
}
export interface customerTypeData extends Omit<customerTypeParams, 'accountNo' | 'name'> {
    address: string;
    countryName: string;
    customerNo: string;
    email: string;
    globalCode: string;
    id: string;
    kycName: string;
    kycState: number;
    kycSurname: string;
    registerState: number;
    source: number;
    sourceName: string;
}

export interface customerInfo {
    accountId: string;
    address: string;
    agentId: string;
    agentName: string;
    annualIncome: string;
    annualIncomeSymbol: string;
    applyTime: string;
    backUri: string;
    countryName: string;
    createTime: string;
    customerNo: string;
    dob: string;
    documentNumber: string;
    documentType: number;
    documentTypeName: string;
    email: string;
    expirationDate: string;
    frontUri: string;
    globalCode: string;
    groupName: string;
    id: string;
    issuingDate: string;
    kycName: string;
    kycStateName: string;
    kycSurname: string;
    kycType: number;
    kycTypeName: string;
    name: string;
    nationalityName: string;
    occupation: string;
    phone: string;
    registerState: number;
    remark: string;
    reviewAnswer: string;
    selfUri: string;
    source: number;
    sourceName: string;
    state: number;
    surname: string;
}

export interface RateParams {
    agentId: string;
    agentName: string;
    groupId: string;
    groupName: string;
    groupNo: string;
    id: string;
    name: string;
}

export interface RateData extends RateParams {
    brokerName: string;
    id: string;
    openFee: number;
    rechargeRate: number;
    remark: string;
}

export interface SettingListParams {
    agentId: string;
    agentName: string;
}

export interface SettingListData extends SettingListParams {
    apiKey: string;
    id: string;
    secretKey: string;
    webhook: string;
    whiteList: string;
}

export interface CallbackParams {
    businessType: 1 | null;
    msgType: 1 | 2 | null;
    orderNo: string;
    state: 1 | 2 | 3 | 4 | null;
}

export interface CallbackData extends CallbackParams {
    agentId: string;
    body: string;

    businessTypeName: string;
    id: string;
    lastTime: string;

    msgTypeName: string;

    stateName: string;
    type: number;
    typeName: string;
}

export interface CallbackInfo {
    actTimes: number;
    body: string;
    businessType: number;
    businessTypeName: string;
    createTime: string;
    id: string;
    lastResponse: string;
    lastTime: string;
    msgType: number;
    msgTypeName: string;
    orderNo: string;
    resTimes: number;
    sentTimes: number;
    state: number;
    stateName: string;
    type: number;
    typeName: string;
    updateTime: string;
}

export interface RateInfoListParams {
    cardName: string;
    depositFee: string;
    name: string;
    no: string;
    openFee: string;
}

export interface AgentAuthPermissions {
    agentNo: string;
    apiState: number;
    brokerState: number;
    caasState: number;
    category: number;
    categoryName: string;
    createTime: string;
    id: string;
    iframeState: number;
    name: string;
    updateTime: string;
    walletState: number;
}
