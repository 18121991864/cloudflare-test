import i18n from '@/setup/i18n-setup';

export const NUMBER_MAX = Number.MAX_SAFE_INTEGER; // 安全区域内的最大数值[Java = Integer.MAX_VALUE = 2 ** 31 - 1]
export const NUMBER_MIN = Number.MIN_SAFE_INTEGER; // 安全区域内的最小数值
export const PASSWORD = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d!@#$%^&*().,;?`'"/\[\]{}\-_+=|:<>~\\ ]{6,30}$/; // 6-15位数字 + 大小写字母密码
export const SIX_NUMBER = /^[0-9]{6}$/; // 6为正实数密码 / code
export const THOUSANDS_REGULAR = /\B(?=(\d{3})+(?!\d))/g; // 千分符
export const NUMBER = /^(1|[1-9][0-9]*)$/; // 只能输入1和非零开头的数字
export const INTER_NUMBER = /^[0-9]\d*$/; // 0和正整数限制输入
export const IS_NUMBER_OR_DECIMAL = /^\d+(\.\d+)?$/; // 只能数字或小数
export const IP_V4 =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/; // ip地址校验
export const IP_V6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$/; // ip v6地址校验
export const GREATER_THAN_ZERO_NUMBER = /^(0\.\d+|[1-9]\d*(\.\d+)?)$/; // 大于0的正则
export const EMAIL = /^(?!\.)(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // 邮箱
export const VERSION_NUMBER_RULES = /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}(\+([a-zA-z0-9]*[0-9]+[a-zA-z0-9]*))$/; // 版本号正则
export const IS_EN_SPACE = /^[A-Za-z\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]*$/; // 仅支持英文、空格、特殊字符
export const IS_EN_NUM = /^[a-zA-Z0-9]*$/; // 支持英文或数字
export const IS_NOT_CN = /^[a-zA-Z0-9\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/; // // 仅支持英文、数字、空格、特殊字符
export const IS_EN = /^[A-Za-z\s]+$/; // 判断是否是纯英文
export const IS_EN_NUMBER = /^[A-Za-z0-9]{3,8}$/;
export const TWO_NUM = /^\d+(\.\d{1,2})?$/;
export const MAX_NUM_99 = /^[1-9][0-9]?$|^0$/;

export const PHONE_CHINA = /^[1][3-9][0-9]{9}$/; // 中国大陆手机号
export const PHONE_INTERNATIONAL = /^[0-9]{5,13}$/; // 国际手机号
// 只能输入数字
export const IS_NUMBER = /^[0-9]+$/;
export const NOT_ZERPO_INTER_NUMBER = /^[1-9]\d*$/; //正整数限制输入
// 最多只能输入两位小数
export const MAX_TWO_DECIMALS = /^\d+(\.\d{1,2})?$/;
// 密码校验规则
export const PASSWORD_REG = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const MAX_VAKUE_DECIMALS = (value: number) => {
    return new RegExp(`^\\d+(\\.\\d{1,${value}})?$`);
};

interface PagingType {
    size: string;
    showSizeChanger: boolean;
    pageSizeOptions: number[];
    showQuickJumper: boolean;
    showTotal: (val: number) => void;
    total: number;
    pageTotal: number;
    current: number;
    pageSize: number;
    class?: string;
    pageNo: number;
}

export const PagingDefaultConf: PagingType = {
    // paging 默认数据
    size: 'small',
    showSizeChanger: true,
    pageSizeOptions: [20, 30, 40, 50],
    showQuickJumper: true,
    showTotal: (total: number) => i18n.global.t('totalText', { total }),
    total: 0,
    pageTotal: 0,
    current: 1,
    pageNo: 1,
    pageSize: 20,
    class: 'broker-pagination-small',
};

// 用户标签颜色
export const colorArr = [
    '#E3CCC6',
    '#C68977',
    '#B66852',
    '#A25742',
    '#F4E9D7',
    '#E3C89D',
    '#CB924F',
    '#BA7E42',
    '#80552A',
    '#F3EDCB',
    '#EFE19A',
    '#E3CA65',
    '#BB9F4C',
    '#735F2C',
    '#EAEDB4',
    '#D2DA84',
    '#A0A94D',
    '#888F42',
    '#666B31',
    '#E4F1D7',
    '#C3DEA7',
    '#90B46A',
    '#7E9E5D',
    '#7A994B',
    '#DFEFEC',
    '#90B6AB',
    '#7DA195',
    '#516A64',
    '#BFD8F6',
    '#83ABDE',
    '#6F91BF',
    '#50688C',
    '#E7E8FD',
    '#CAD4F8',
    '#91A1EF',
    '#6E84EA',
    '#4259DB',
    '#DFC9DE',
    '#BC87B1',
    '#AA6D9E',
    '#884772',
    '#D5CEF7',
    '#A699EB',
    '#8A79E1',
    '#604ADB',
    '#92959C',
    '#676A71',
    '#3B3C41',
];

export const langArr = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'zh-TW', label: '繁体中文' },
    { value: 'en-US', label: '英语' },
    { value: 'ar-AE', label: '阿拉伯语' },
    { value: 'ru-RU', label: '俄语' },
];
