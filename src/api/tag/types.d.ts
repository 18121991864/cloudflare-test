export interface TypeTagList {
    color?: string; // 颜色
    id: string; // id
    name?: string; // 名称
    isEdit?: boolean;
    isType?: 'ADD' | 'EDIT' | 'DEFAULT';
}
