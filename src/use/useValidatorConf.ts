import { EMAIL, INTER_NUMBER, IS_EN_NUM, SIX_NUMBER, IS_EN_NUMBER, IS_EN_SPACE, IS_EN, PASSWORD, TWO_NUM, MAX_NUM_99, IS_NOT_CN } from '@/utils/constant';

export default function useValidatorConf() {
    // 验证email
    const validateEmail = (rule: any, value: string) => {
        if (rule.required && !value) return Promise.reject('请输入邮箱号'); // 请输入邮箱号
        if (!!value && !EMAIL.test(value)) return Promise.reject('请输入正确的邮箱'); // 请输入正确的邮箱
        return Promise.resolve();
    };

    // 验证用户密码
    const validatePass = (rule: any, value: string) => {
        if (!value) return Promise.reject('请输入密码'); // 请输入密码
        if (!PASSWORD.test(value)) return Promise.reject('6-18位数字字母组合，支持特殊符号，至少含一个大写字母、一个小写字母和一个数字'); // 6-18位数字字母组合，支持特殊符号，至少含一个大写字母、一个小写字母和一个数字
        return Promise.resolve();
    };

    // 验证验证码
    const validateCode = (rule: any, value: string) => {
        if (!value) return Promise.reject('请输入验证码'); // 请输入验证码
        if (!SIX_NUMBER.test(value)) return Promise.reject('请输入6位整数验证码'); // 请输入6位整数验证码
        return Promise.resolve();
    };

    // 验证验证码
    const validateFounds = (rule: any, value: string) => {
        if (!value) return Promise.reject('请输入资金密码'); // 请输入资金密码
        if (!SIX_NUMBER.test(value)) return Promise.reject('请输入6位整数密码'); // 请输入6位整数密码
        return Promise.resolve();
    };

    // 验证是否是纯英文
    const validateEn = (rule: any, value: string) => {
        if (!value) return Promise.reject('请输入英文'); // 请输入
        if (!IS_EN.test(value)) return Promise.reject('请输入英文'); // 请输入英文
        return Promise.resolve();
    };

    // 验证是否是数字
    const validateNum = (rule: any, value: string) => {
        if (value && !INTER_NUMBER.test(value)) return Promise.reject('请输入正整数'); // 请输入数字
        return Promise.resolve();
    };

    // 仅英文、空格、特殊字符
    const validateEnStr = (rule: any, value: string) => {
        if (!IS_EN_SPACE.test(value)) return Promise.reject('仅支持英文、空格、特殊字符'); // 仅支持英文、空格、特殊字符，且不能超过50个字符
        return Promise.resolve();
    };

    // 仅英文、数字、空格、特殊字符
    const validateNotCn = (rule: any, value: string) => {
        if (!IS_NOT_CN.test(value)) return Promise.reject('仅支持英文、空格、数字、特殊字符'); // 仅支持英文、空格、数字、特殊字符
        return Promise.resolve();
    };

    const validateFile = (rule: any, value: string[]) => {
        if (!value.length) return Promise.reject('请上传文件'); // 请上传文件
        return Promise.resolve();
    };

    const validateEnHasNum = (rule: any, value: string) => {
        if (!IS_EN_NUM.test(value)) return Promise.reject('请输入输入数字或英文'); // 请输入输入数字或英文
        return Promise.resolve();
    };
    // 只能输入英文和空格
    const validateEnAndSpace = (rule: any, value: string) => {
        if (/[^a-zA-Z\s]/g.test(value)) return Promise.reject('仅支持英文及空格'); // 请输入输入英文
        return Promise.resolve();
    };

    const validateNumber = (rule: any, value: string) => {
        if (!value) return Promise.reject('请输入邀请码名称'); // 请输入
        if (!IS_EN_NUMBER.test(value)) return Promise.reject('仅支持英文、数字，3-8个字符'); // 仅支持英文、数字，3-8个字符
        return Promise.resolve();
    };

    // 验证地址姓名
    function validateAddressName(_: any, value: string, callback: (error?: Error) => void) {
        if (!/^[a-zA-Z0-9\s\-.]*$/.test(value)) {
            return Promise.reject(new Error('请输入英文姓名'));
        }
        if (value.length > 120) {
            return Promise.reject(new Error('长度不超过120位'));
        }
        return Promise.resolve();
    }

    // 验证地址管理详细地址字段
    function validatorAddressLine1(_: any, value: string, callback: (error?: Error) => void) {
        // eslint-disable-next-line no-useless-escape
        if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~` ]*$/.test(value) && value) {
            return Promise.reject(new Error('请输入英文地址'));
        }
        if (value.length > 200 && value) {
            return Promise.reject(new Error('长度不超过200位'));
        }

        return Promise.resolve();
    }

    // 验证邮编
    function validatorPostCode(_: any, value: string, callback: (error?: Error) => void) {
        if (_.required && !value.trim()) return Promise.reject(new Error('请输入邮政编码'));
        if (!!value && !/^[a-zA-Z0-9\s\-.]*$/.test(value)) {
            return Promise.reject(new Error('请输入英文或数字'));
        }
        if (!!value && value.length < 3) {
            return Promise.reject(new Error('长度不低于3位'));
        }
        if (!!value && value.length > 10) {
            return Promise.reject(new Error('长度不超过10位'));
        }

        return Promise.resolve();
    }

    const validatorTwoNum = (_: any, value: string) => {
        if (!TWO_NUM.test(value) && value) return Promise.reject(new Error('请输入最多两位小数的数字')); // 请输入最多两位小数的数字
        return Promise.resolve();
    };

    const validatorMaxNum = (_: any, value: string) => {
        if (!MAX_NUM_99.test(value) && value) return Promise.reject(new Error('请输入最多两位小数的数字')); // 请输入最多两位小数的数字
        return Promise.resolve();
    };

    return {
        validateEn,
        validateNum,
        validateFile,
        validateCode,
        validatePass,
        validateEmail,
        validateEnStr,
        validateNotCn,
        validateFounds,
        validateNumber,
        validatorTwoNum,
        validatorMaxNum,
        validateEnHasNum,
        validatorPostCode,
        validateEnAndSpace,
        validateAddressName,
        validatorAddressLine1,
    };
}
