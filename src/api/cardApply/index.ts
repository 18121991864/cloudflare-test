import { Api } from '../api';

class FlashExchange extends Api {
    // 获取持卡人信息
    cardHolderGet(params: { orderNo: string }): Promise<{
        accountId: string; // UID
        accountKycLevel: number; // 用户当前等级
        address: string; // 详细地址
        addressCallingCode: string; // 地址国际区号
        addressEmail: string; // 地址邮箱
        addressName: string; // 地址姓名
        addressPhone: string; // 地址电话号码
        annualIncome: string; // 年收入
        callingCode: string; // 国际区号
        cardName: string; // 卡名称
        cardType: 1 | 2; // 卡片类型1:虚拟卡2实体卡
        cityId: string; // 城市ID
        company: string; // 公司
        countryId: string; //  国家ID
        documentInfoList: {
            country: string; // 国家名称
            countryCode: string; // 国家代码 ISO-3166 alpha3
            dob: string; // 出生日期
            documentBackPath: string; // 证件背面路径
            documentFrontPath: string; // 证件正面路径
            documentNo: string; // 证件号码
            documentType: 1 | 2; // 证件类型 1.身份证 2.护照
            documentValidThru: string; // 证件有效期至
            middle: string; // 中间名 (当地语言)
            ming: string; // 名 (当地语言)
            xing: string; // 姓 (当地语言)
        }[];
        needAddress: string; // 是否需要地址,多个地址类型逗号隔开 1 收卡地址2居住地址3账单地址
        documentType: string; // 当前卡支持kyc证件，多个类型逗号隔开：1身份证 2护照
        email: string; // 邮箱
        faceKyc: 1 | 2 | 3; // 人脸kyc是否通过 1 成功 2 失败 3 未认证
        givenName: string; // 英文名字
        holdBackPath: string; // 身份证手持背面照片
        holdFrontPath: string; // 身份证手持正面面照片
        holdPassportPath: string; // 护照手持照片
        id: string; // ID
        idCardKyc: 1 | 2 | 3 | 4; // 身份证kyc是否通过 1 成功 2 失败 3 未认证 4 已提交
        idCardRestrictCountry: string[]; // 身份证限制国家
        kycLevel: number; // 需要的等级
        lastName: string; // 英文姓氏
        orderNo: string; // 订单号
        passportKyc: 1 | 2 | 3 | 4; // 护照kyc是否通过 1 成功 2 失败 3 未认证 4 已提交
        passportRestrictCountry: string[]; // 护照限制国家
        phone: string; // 电话号码
        position: string; // 职位
        postalCode: string; // 邮政编码
        profession: string; // 职业
        provinceId: string; // 省/州ID
        restrictedCallingCodes: []; // 渠道限制部分呼叫代码，格式 ['+1', '+86']array
        selfie: string; // 高级认证图片
        signPath: string; // 签名图片
        symbol: string; // 币种
        workingYears: string; // 工作年限
        showFields: string[];
        source: number;
        infoState: number;
    }> {
        return this.api.get('/cardApply/cardHolder/get', { params });
    }

    // 提交持卡人kyc
    cardHolderKyc(params: {
        accountId: string; // UID
        backPath: string; // 证件背面图片
        countryCode: string; // 国家代码 Alpha-3 代码
        documentType: 1 | 2; // 证件类型 1身份证 2护照
        facePath: string; // 人脸
        frontPath: string; // 证件正面图片
    }): Promise<boolean> {
        return this.api.post('/cardApply/cardHolder/kyc', params);
    }

    // 提交持卡人信息
    cardHolderSubmit(params: {
        addressReq: {
            accountId: string; // 账户编号
            addressLine1: string; // 地址1
            country: string; // 国家
            email: string; // 邮箱
            fullName: string; // 全称
            phone: string; // 手机
            phoneArea: string; // 电话区号
            postCode: string; // 邮编
            city: string; // 城市
            province: string; // 省
        };
        annualIncome: string; // 年收入
        company: string; // 公司名
        defaultType: string; // 默认使用资料 1身份证2护照
        givenName: string; // 英文名
        holdBackPath: string; // 身份证手持背面照片
        holdFrontPath: string; // 身份证手持正面面照片
        holdPassportPath: string; // 护照手持照片
        lastName: string; // 英文姓
        orderNo: string; // 卡片申请号
        position: string; // 职位
        profession: string; // 职业
        signPath: string; // 签名照片
        workingYears: string; // 工作年限
    }): Promise<boolean> {
        return this.api.post('/cardApply/cardHolder/submit', params);
    }
    // 提交持卡人信息
    cardHolderReSubmit(params: {
        addressReq: {
            accountId: string; // 账户编号
            addressLine1: string; // 地址1
            country: string; // 国家
            email: string; // 邮箱
            fullName: string; // 全称
            phone: string; // 手机
            phoneArea: string; // 电话区号
            postCode: string; // 邮编
            city: string; // 城市
            province: string; // 省
        };
        annualIncome: string; // 年收入
        company: string; // 公司名
        defaultType: string; // 默认使用资料 1身份证2护照
        givenName: string; // 英文名
        holdBackPath: string; // 身份证手持背面照片
        holdFrontPath: string; // 身份证手持正面面照片
        holdPassportPath: string; // 护照手持照片
        lastName: string; // 英文姓
        orderNo: string; // 卡片申请号
        position: string; // 职位
        profession: string; // 职业
        signPath: string; // 签名照片
        workingYears: string; // 工作年限
    }): Promise<boolean> {
        return this.api.post('/cardApply/cardHolder/resubmit', params);
    }

    // 资料暂存
    cardHolderTemporary(params: {
        addressReq: {
            accountId: string; // 账户编号
            addressLine1: string; // 地址1
            country: string; // 国家
            email: string; // 邮箱
            fullName: string; // 全称
            phone: string; // 手机
            phoneArea: string; // 电话区号
            postCode: string; // 邮编
            city: string; // 城市
            province: string; // 省
        };
        annualIncome: string; // 年收入
        company: string; // 公司名
        defaultType: string; // 默认使用资料 1身份证2护照
        givenName: string; // 英文名
        holdBackPath: string; // 身份证手持背面照片
        holdFrontPath: string; // 身份证手持正面面照片
        holdPassportPath: string; // 护照手持照片
        lastName: string; // 英文姓
        orderNo: string; // 卡片申请号
        position: string; // 职位
        profession: string; // 职业
        signPath: string; // 签名照片
        workingYears: string; // 工作年限
    }): Promise<boolean> {
        return this.api.post('/cardApply/cardHolder/temporary', params);
    }

    // 查询kyc状态
    kycStatus(params: { accountId: string }) {
        return this.api.get('/cardApply/cardHolder/kyc/status', { params });
    }

    // 客户进行kyc
    getKyc(params: { accountId?: string; orderNo: string }): Promise<{
        documentType: 1 | 2; // 需要的证件类型 1身份证 2 护照 1,2二选一
        face: 1 | 2 | 3 | 4; // 人脸是否通过 true 通过 false 不通过
        facePath: string; // 人脸
        idCard: 1 | 2 | 3 | 4; // 身份证是否通过 true 通过 false不通过
        idCardBackPath: string; // 身份证反面
        idCardCountryCode: string; // 身份证国家alph3
        idCardCountryName: string; // 身份证件国家
        idCardExpirationDate: string; // 身份证件有效期
        idCardFrontPath: string; // 身份证正面
        needKycLevel: 0 | 1 | 2; // 需要的认证等级0 不需要 1 需要 2 高级
        passport: 1 | 2 | 3 | 4; // 护照是否通过 true 通过 false 不通过
        passportCountryCode: string; // 护照证件国家alpha3
        passportCountryName: string; // 护照证件国家
        passportExpirationDate: string; // 护照证件有效期
        passportFrontPath: string; // 护照正面
    }> {
        return this.api.get('/cardApply/cardHolder/kyc/get', { params });
    }

    cardAddressList(params: { accountId: string }): Promise<
        {
            addressLine1: string; // 地址1
            addressLine2: string; // 地址2
            city: string; // 城市
            cityName: string; // 城市名称
            country: string; // 国家
            countryName: string; // 国家名称
            email: string; // 邮箱
            fullName: string; // 全称
            id: string; // ID
            isAcquiesce: 0 | 1; // 是否默认 0:否 1:是
            phone: string; // 手机
            phoneArea: string; // 电话区号
            postCode: string; // 邮编
            province: string; // 省
            provinceName: string; // 省名称
        }[]
    > {
        return this.api.get('/cardApply/cardHolder/address/list', { params });
    }

    cardDocStates(): Promise<
        {
            code: string; // 状态码
            name: string; // 状态描述
            symbol: string; //
        }[]
    > {
        return this.api.get('/cardApply/docStates');
    }
}

export default new FlashExchange();
