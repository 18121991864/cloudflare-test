import cookies from 'cookies-js';
import router from '@/setup/router-setup';
import { message } from 'ant-design-vue';

const responseData = async (newData: { [key: string]: any }) => {
    // Handle login timeout and token expiration
    const handleLoginTimeout = (errorMessage: string) => {
        cookies.expire('walletToken');
        router.replace('/login');
        return Promise.reject(new Error(errorMessage));
    };

    switch (true) {
        case newData.code === 10005 || newData.code === 10021:
            return handleLoginTimeout(`${newData.code} 登录超时`);
        case newData.code === 10024:
            cookies.expire('walletToken');
            message.warning('账号登录冻结，请联系客服人员!');
            router.replace('/login');
            return handleLoginTimeout(`${newData.code} 账号登录冻结，请联系客服人员！`);
        case newData.code === 20006:
            message.warning(newData?.msg || newData?.message);
            return Promise.reject(new Error(`${newData.code} 账户已冻结，请联系管理员!`));
        case newData.code === 200:
            return Promise.resolve(newData.data);
        case newData.code === 500:
            message.warning('服务器繁忙  请稍后重试!');
            return Promise.reject(new Error(`${newData.code} 服务器异常`));
        case newData.result === 'success':
            return newData.content;
        default:
            message.error(newData?.msg || newData?.message);
            return Promise.reject(new Error(newData?.msg || newData?.message));
    }
};

export default responseData;
