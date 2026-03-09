// eslint-disable-next-line max-classes-per-file
import { Api } from '../api';
import { Pagination } from '../type';

class User extends Api {

    cardOpenFirstConfigAdd(params: {
        // 新增首次开卡减免
        accountId: string; // 账号id
        beginTime: string; // 开始时间
        endTime: string; // 结束时间
        maxAmount: string; // 最大金额
        minAmount: string; // 最小金额
    }) {
        return this.api.post('/cardOpenFirstConfig/add', params);
    }

    cardOpenFirstConfigUpdate(params: {
        // 新增首次开卡减免
        accountId: string; // 账号id
        beginTime: string; // 开始时间
        endTime: string; // 结束时间
        maxAmount: string; // 最大金额
        minAmount: string; // 最小金额
        id: string;
    }) {
        return this.api.post('/cardOpenFirstConfig/update', params);
    }

    fetchTransactionSetTradePwd(params: {
        // 设置提币钱包密码
        againTradePwd: string; // 确认交易密码
        newTradePwd: string; // 交易密码
    }) {
        return this.api.post('/transaction/setTradePwd', params);
    }

    fetchTransactionUpdatePaymentPwd(params: {
        // 修改交易密码
        againTradePwd: string; // 确认交易密码
        newTradePwd: string; // 交易密码
        oldTradePwd: string; // 原交易密码
    }) {
        return this.api.post('/transaction/updatePaymentPwd', params);
    }

    fetchTransactionResetPaymentPwd(params: {
        // 重置交易密码
        againTradePwd: string; // 确认交易密码
        newTradePwd: string; // 交易密码
    }) {
        return this.api.post('/transaction/resetPaymentPwd', params);
    }


    fetchBannerUpdate(params: {
        // 编辑BANNER
        accountId: string; // 账号id
        createTime: string; // 创建时间
        id: string; //
        rangeType: string; // 1、全局 2、用户
        scale: string; // 返佣百分比
        scaleType: string; // 1、开卡 2、充值 3、开卡减免
    }) {
        return this.api.post('/banner/update', params);
    }

    fetchReferralCreateReferralConfig(params: {
        // 创建返佣配置
        accountId?: string; // 账号id，全局类型可以不用传
        rangeType: 1 | 2; // 1、全局 2、用户
        scale: string; // 返佣百分比
        scaleType: 1 | 2 | 3; // 1、开卡 2、充值 3、开卡减免
    }) {
        return this.api.post('/referral/createReferralConfig', params);
    }

    fetchReferralUpdateReferralConfig(params: {
        // 修改返佣配置
        accountId?: string; // 账号id，全局类型可以不用传
        scale: string; // 返佣百分比
        scaleType: 1 | 2 | 3; // 1、开卡 2、充值 3、开卡减免
        id?: string; // id
    }) {
        // 资产-冻结
        return this.api.post('/referral/updateReferralConfig', params);
    }

    fetchSysUserCheckCipher(params: {
        // 校验密码绑定2FA
        password: string; //
        userId: string; //
    }) {
        // 资产-冻结
        return this.api.post('/sys/user/checkCipher', params);
    }

    fetchSysUserCheckCipherAnd2FA(params: {
        // 校验密码2FA更换2FA
        password: string; //
        userId: string; //
        facode: string;
    }) {
        // 资产-冻结
        return this.api.post('/sys/user/checkCipherAnd2FA', params);
    }

    fetchReferralReferralConfigList(params: {
        // 邀请返佣配置列表
        scaleType: string | null; //
        rangeType: string | null; //
        accountId: number | string;
        pageNo: number;
        pageSize: number;
    }) {
        // 风控列表
        interface _Response extends Pagination {
            list: {
                accountId: string; // 账号id
                createTime: string; // 创建时间
                id: string; //
                rangeType: string; // 1、全局 2、用户
                scale: string; // 返佣百分比
                scaleType: string; // 1、开卡 2、充值 3、开卡减免
            };
        }

        return this.api.get('/referral/referralConfigList', { params }).then((result: any) => result as _Response);
    }

    fetchBannerList(params: {
        // banner列表
        state: string | null; // 状态
        pageNo: number;
        pageSize: number;
    }) {
        // 风控列表
        interface _Response extends Pagination {
            list: {
                language: string; // 语言：zh-CN en-US
                platform: string; // 平台：1=web,2=pc
                id: string; //
                state: string; // 1启用，2禁用
                updateTime: string; // 修改时间
                uri: string; // URI
                small: string;
            };
        }

        return this.api.post('/banner/list', params).then((result: any) => result as _Response);
    }

    shippingInformationLst(params: {
        // banner列表
        id?: string | null; //
        pageNo: number;
        pageSize: number;
    }) {
        // 风控列表
        interface _Response extends Pagination {
            list: {
                addressLine1: string; // 地址1
                addressLine2: string; // 地址2
                id: string; //
                city: string; // 城市
                country: string; // 国家
                createTime: string; // 时间
                email: string; // 邮箱
                fullName: string; // 全称
                phone: string; // 手机
                phoneArea: string; // 电话区号
                postCode: string; // 邮编
            };
        }

        return this.api.get('/shippingInformation/list', { params }).then((result: any) => result as _Response);
    }

    cardOpenFirstConfigList(params: {
        // 首次开卡减免列表
        accountId?: string | null; // 账号ID
        pageNo: number;
        pageSize: number;
    }) {
        // 列表
        interface _Response extends Pagination {
            list: {
                account: string; // 账号
                accountId: string; // 账号ID
                id: string; //
                beginTime: string; // 开始时间
                createTime: string; // 创建时间
                endTime: string; // 结束时间
                maxAmount: string; // 最大金额
                fullName: string; // 全称
                minAmount: string; // 最小金额
                updateTime: string; // 修改时间
            };
        }

        return this.api.get('cardOpenFirstConfig/list', { params }).then((result: any) => result as _Response);
    }

    fetchBannerUpdateState(params: {
        // 编辑状态
        id: string;
        state: 1 | 2 | ''; // 状态：1=启用,2=禁用
    }) {
        return this.api.get('/banner/updateState', { params });
    }

    fetchSysUserQrcode() {
        return this.api.get('/sys/user/qrcode').then(
            (result: any) =>
                result as {
                    qrcode: string;
                    secret: string;
                }
        );
    }

    fetchSysUserCheckGoogleCodeAnd(params: {
        // 校验谷歌验证码，并绑定谷歌二维码
        code: string;
    }) {
        return this.api.get('/sys/user/checkGoogleCodeAnd', { params });
    }
    // 登录验证Google
    fetchSysUserCheckGoogleCode(params: {
        // 登录验证Google
        googleCode: string;
    }) {
        return this.api.post('/sys/validateGoogle', params);
    }
}

export default new User();
