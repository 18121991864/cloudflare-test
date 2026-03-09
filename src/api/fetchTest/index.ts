// eslint-disable-next-line max-classes-per-file
import { Api } from '../api';
import axios from 'axios';
// import useEncryptionStore from '@/store/encryption';
// import useSideBarStore from '@/store/sideBar';
import { RolePermissionsType, TreeDataType } from '@/interface/StateType';

export interface Pagination {
    pageNo: number;
    pageSize: number;
    totalPages: number;
    totalSize: number;
}

class FetchTest extends Api {
    sysUserLogin(params: { account: string; password: string; facode: string }): Promise<{
        initLogin: boolean; // 是否首次登陆 首次需要强制重新设置登陆密码
        opPassword: boolean; // 是否设置了操作密码 true false
        opPasswordSetting: boolean; // 是否有设置操作密码权限 true false
        passwordError: boolean; // 是否密码错误
        passwordErrorNum: number; // 密码错误次数 及提示消息
        token: string; // token
        googleState: number; // 谷歌验证码状态 0 未开启 1 已开启
    }> {
        // 登陆
        return this.api.post('/sys/login', params);
    }

    loginOut(): Promise<any> {
        // 退出登录
        return this.api.get('/sys/user/loginOut');
    }

    userInfo() {
        interface _Response {
            account: string; // 账号
            bindAccount: string; // 绑定账号
            fullName: string; // 姓名
            roleId: string; // 角色ID
            roleName: string; // 角色名称
            state: 1 | 2; // 状态 1、启用 2、禁用
            userId: string; // 用户ID
            isFACode: number;
            isSetOPPassword: boolean;
        }

        return this.api.get('/sys/user/getInfo').then((result: any) => result as _Response);
    }

    sysUserList(params: {
        pageNo: number;
        pageSize: number;
        account: string;
        realName: string; // 姓名
    }) {
        // 管理员-列表
        interface _Response extends Pagination {
            list: {
                account: string; // 账户
                bindAccount: string; // 绑定账号
                lastLoginTime: string; // 最后登陆时间
                realName: string; // 姓名
                roleId: string; // 角色ID
                roleName: string; // 角色
                state: string; // 账号状态
                userId: string; // 用户ID
            };
        }

        return this.api.get('/sys/user/list', { params }).then((result: any) => result as _Response);
    }

    sysUserAddOrUpdate(params: {
        account?: string; // 账号
        id?: string | undefined; // ID
        fullName?: string; // 姓名
        roleId?: string | undefined; // 角色ID
        state?: number; // 状态 1启用 2禁用
    }): Promise<any> {
        // 添加编辑管理员
        return this.api.post('/sys/user/addOrUpdate', params);
    }

    sysUserInfo(params: { userId: string | undefined }): Promise<{
        account: string; // 账户
        createTime: string; // 创建时间
        fullName: string; // 昵称
        id: string;
        newsletter: string; // 邮箱
        remark: string; // 备注
        roleId: string; // 角色ID
        roleName: string; // 角色
        state: number; // 账号状态:1、启用 2、禁用 3、密码错误冻结
        updateTime: string; // 修改时间
    }> {
        // 查看管理员详情
        return this.api.get('/sys/user/getUserInfo', { params });
    }

    sysRoleList() {
        // 角色列表
        interface _Response {
            roleId: string; // 角色ID
            roleName: string; // 角色
        }

        return this.api.get('/sys/role/list').then((result: any) => result as _Response);
    }

    sysRoleMenuList(): Promise<TreeDataType[]> {
        // 获取权限菜单数据
        return this.api.get('/sys/menu/permissions/list');
    }

    sysUserMenuList(): Promise<TreeDataType[]> {
        // 获取菜单
        return this.api.get('/sys/menu/list');
    }


    sysRoleAddUpdate(params: {
        // 添加/编辑角色
        checkOpPassword: boolean;
        menuIdList: {
            checkUserPassword: number; // 1、免密 2、校验
            menuId: number; // 菜单ID
        }[];
        roleId?: string;
        remark?: string;
        state?: 1 | 2;
        roleName: string;
    }): Promise<any> {
        return this.api.post('/sys/role/addOrUpdate', params);
    }

    sysInfoCheckMenuList(params: { roleId: string }): Promise<TreeDataType[]> {
        // 编辑获取权限角色 及 已勾选权限菜单数据
        return this.api.get('/sys/menu/permissions/check/list', { params });
    }

    sysRoleInfo(params: { roleId: string }): Promise<RolePermissionsType> {
        // 获取角色信息
        return this.api.get('/sys/role/getInfo', { params });
    }

    sysUserResetPassword(params: {
        password?: string;
        type: 1 | 2 | 3; // 1、重置登陆密码 2、重置审核密码 3、重置锁屏密码
        userId: string;
        facode: string;
    }): Promise<any> {
        // 重置登陆密码
        return this.api.post('/sys/user/resetPassword', params);
    }


    sysUserUpdatePassword(params: {
        password?: string;
        type: 1 | 2 | 3; // 1、重置登陆密码 2、重置审核密码 3、重置锁屏密码
        oldPassword: string | null;
        facode: string;
    }): Promise<any> {
        // 修改登陆密码
        return this.api.post('/sys/user/updatePassword', params);
    }

    getSetLoginPwdMsgCode() {
        // 获取设置密码验证码
        return this.api.get('/sysUser/getSetLoginPwdMsgCode');
    }

    setLoginPass(params: { code?: string; password: string }): Promise<{ opPassword: boolean; opPasswordSetting: boolean }> {
        // 设置登录密码
        return this.api.post('/sys/setLoginPassword', params);
    }

    setSysUserResetSecret(params: {
        code?: string;
        password: string;
        userId: string;
        facode: string;
    }): Promise<{ opPassword: boolean; opPasswordSetting: boolean }> {
        // 重置秘钥
        return this.api.post('/sys/user/resetSecret', params);
    }

    uploadFile(params: { file: any; fileType: any }): Promise<{
        // fileType 1=卡片
        fullUrl: string;
        uri: string;
    }> {
        // 上传文件、图片等
        return this.api.post('/file/upload', params, {
            headers: { Accept: 'application/json, ext/plain' },
        });
    }

    uploadBanner(params: { file: any; fileType: any; platform: 1 | 2 }): Promise<{
        // fileType 1=卡片
        fullUrl: string;
        uri: string;
    }> {
        // 上传文件、图片等
        return this.api.post('/file/uploadBanner', params, {
            headers: { Accept: 'application/json, ext/plain' },
        });
    }

    userUploadFile(
        params: { file: any; fileType: any },
        onUploadProgress: any
    ): {
        promise: Promise<{
            // fileType 1=卡片
            fullUrl: string;
            uri: string;
        }>;
        cancel: () => void;
    } {
        const cancelTokenSource = axios.CancelToken.source();
        // 上传文件、图片等
        return {
            promise: this.api.post('/file/upload', params, {
                headers: { Accept: 'application/json, ext/plain' },
                onUploadProgress,
                cancelToken: cancelTokenSource.token,
            }),
            cancel: cancelTokenSource.cancel,
        };
    }

    fetchTypeList() {
        // 交易类型下拉
        return this.api.get('/ditchAssetsDetails/messageTypeList').then((result: any) => result as string[]);
    }
}

export default new FetchTest();
