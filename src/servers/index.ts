import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { UserCustomAxiosRequestConfig } from './types';
import { AcceptType, SetHeaders, transformData } from './config';
import { message } from 'ant-design-vue';
import responseData from './response';
import header from '@/components/Header.vue';

class UserRequest {
    instance: AxiosInstance;
    constructor(config: UserCustomAxiosRequestConfig) {
        this.instance = axios.create(config);
        // 请求拦截器
        this.instance.interceptors.request.use(
            async (config) => {
                // 加密
                await transformData(config.data, config, config.headers);
                const data = {
                    ...config,
                    transformRequest: [
                        (data: { [key: string]: any }, headers: { [key: string]: any }) => {
                            const currData = JSON.stringify(data);
                            switch (true) {
                                case headers.Accept === AcceptType.Json:
                                    return currData;
                                case headers.Accept === AcceptType.Plain:
                                    return currData;
                                case headers.Accept === AcceptType.Multipart:
                                    return Object.entries(currData).reduce((acc: FormData, cur: [string, any]): FormData => {
                                        acc.append(...cur);
                                        return acc;
                                    }, new FormData());
                                case headers.Accept === AcceptType.Ext:
                                    return Object.entries(data).reduce((acc: FormData, cur: [string, any]): FormData => {
                                        acc.append(...cur);
                                        return acc;
                                    }, new FormData());
                                default:
                                    break;
                            }
                        },
                    ],
                };

                return data;
            },
            (err) => {
                return Promise.reject(err);
            }
        );
        // 响应拦截器
        this.instance.interceptors.response.use(
            (response) => {
                const responseType = response.config.responseType;
                if (responseType) {
                    return Promise.resolve(response.data);
                }
                return responseData(response.data);
            },
            (err) => {
                return Promise.reject(err);
            }
        );
    }
    request<T = any>(config: UserCustomAxiosRequestConfig<T>) {
        config.headers = {
            ...SetHeaders(config as any as UserCustomAxiosRequestConfig),
        };
        if (config.interceptors?.requestSuccessFn) {
            config = config.interceptors?.requestSuccessFn(config);
        }

        return new Promise<T>((resolve, reject) => {
            this.instance
                .request<any, T>(config)
                .then((res) => {
                    if (config.interceptors?.responseSuccessFn) {
                        config.interceptors?.responseSuccessFn(res as any);
                    }
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    get<T = any>(url: string, data?: Omit<AxiosRequestConfig, 'url' | 'method' | 'baseURL' | 'data'>) {
        return this.request({
            url,
            method: 'get',
            ...data,
        });
    }
    post<T = any>(url: string, data?: any, useHeader?: Omit<AxiosRequestConfig, 'url' | 'method' | 'baseURL' | 'data' | 'params'>) {
        return this.request({
            method: 'post',
            url,
            data,
            ...useHeader,
        });
    }
    put<T = any>(url: string, data?: any, useHeader?: Omit<AxiosRequestConfig, 'url' | 'method' | 'baseURL' | 'data' | 'params'>) {
        return this.request({
            method: 'put',
            url,
            data,
            ...useHeader,
        });
    }
    static default() {
        return axios.defaults.headers.common['Accept-Language'];
    }
    usebaseURL(baseURL: string) {
        this.instance.defaults.baseURL = baseURL;
    }
}

export default UserRequest;
