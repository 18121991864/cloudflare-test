import type { AxiosRequestConfig, AxiosResponse } from 'axios';
export interface UserInterceptors<T = AxiosResponse> {
    requestSuccessFn?: (config: AxiosRequestConfig) => AxiosRequestConfig;
    requestErrorFn?: (err: any) => any;
    responseSuccessFn?: (config: T) => T;
    responseErrorFn?: (err: any) => any;
}
export interface UserCustomAxiosRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
    interceptors?: UserInterceptors<T>;
}
