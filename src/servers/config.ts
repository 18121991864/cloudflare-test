import { whiteEncryptionList, whiteKeys } from '@/hooks/encryption/while-index';
import { getCiphertext } from '@/hooks/encryption';
import type { AxiosRequestConfig } from 'axios';
export { AcceptType, SetHeaders } from './configHeader';
export async function transformData(data: { [key: string]: any }, config: AxiosRequestConfig, headers: any) {
    if (whiteEncryptionList.includes(config.url as string)) {
        for (const key in data) {
            if (whiteKeys.includes(key) && data[key]) {
                const pass = await getCiphertext(data[key]);
                data[key] = pass;
            }
        }
    }
}
