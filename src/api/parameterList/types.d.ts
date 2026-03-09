import { iteratee } from 'lodash-es';

export interface ParameterList {
    key: string;
}
export interface ParameterData {
    createTime: string;
    id: number;
    key: string;
    value: number;
    remark: string;
    updateTime: string;
}

export interface ParameterEdit {
    id: number | null;
    key: string;
    value: number | null;
    remark: string;
}
