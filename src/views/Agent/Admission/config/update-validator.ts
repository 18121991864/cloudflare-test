import { RuleObject } from 'ant-design-vue/lib/form';
import queryConfig from './query-item';
import { PHONE_CHINA, PHONE_INTERNATIONAL, EMAIL } from '@/utils/constant';
const phoneRegCallback = () => {
    const add = queryConfig.value.btns.addBtns;
    const formState = add?.formState;
    const phoneReg = formState.globalCode === '+86' ? PHONE_CHINA : PHONE_INTERNATIONAL;
    const message = formState.globalCode === '+86' ? '请输入11位有效手机号' : '请输入5-13位的有效手机号';
    return {
        phoneReg,
        message,
    };
};
export const formatValidator = (type: 1 | 2) => (rule: RuleObject, value: string) => {
    const name = ['手机号', '邮箱'][type - 1];

    if (!value) return Promise.reject(`请输${name}`);
    if (type === 1) {
        const item = phoneRegCallback();
        if (!item.phoneReg.test(value)) return Promise.reject(`${item.message}`);
    } else if (type === 2) {
        if (!EMAIL.test(value)) return Promise.reject(`请输入正确${name}格式`);
    }

    return Promise.resolve();
};
