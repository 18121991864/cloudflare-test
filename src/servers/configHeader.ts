import { getToken } from '@/utils/common';
import type { UserCustomAxiosRequestConfig } from './types';
import type { AxiosRequestConfig } from 'axios';
import i18n from '@/setup/i18n-setup';
import _ from 'lodash';
export enum AcceptType {
    Json = 'application/json ',
    Plain = 'ext/plain',
    Multipart = 'application/x-www-form-urlencoded',
    Ext = 'application/json, ext/plain',
}
export const xhrDefaultConfig: AxiosRequestConfig = {
    headers: {
        'Content-Type': `${AcceptType.Json};charset=UTF-8`,
        'Cache-Control': 'no-cache',
        deviceID: `WEB-${window.navigator.userAgent}`,
        Accept: AcceptType.Json,
    },
};

export const SetHeaders = (config: UserCustomAxiosRequestConfig) => {
    const xhrDepptConfig = _.cloneDeep(xhrDefaultConfig);
    const headers = xhrDepptConfig.headers;
    if (config.headers?.Accept) {
        headers!.Accept = config.headers?.Accept;
    }

    const mergedHeaders = {
        ...xhrDepptConfig.headers,
        pretreatment: true, // 是否进行数据预处理，不进行预处理将返回原始的数据结构到集成层（适用于获取完整的数据结构，而非仅获取需要的数据）
        'X-B3-Traceid': dayjs().valueOf() * 1000, // Traceid
        'X-B3-Spanid': dayjs().valueOf() * 1000, // Spanid
        Language: i18n.global.locale.value, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
        source: 'PC',
        appSystemType: 'pc',
        ...getToken(),
    };
    return mergedHeaders;
};
