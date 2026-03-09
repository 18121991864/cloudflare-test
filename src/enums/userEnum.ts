export enum userAuthStatusEnum {
  None,
  Resolve = 2,
  Reject,
}

export interface UserAuthStatus {
  label: string;
  value: userAuthStatusEnum;
  color?: string;
  colorName?: string;
}

export const userAuthStatusMap = new Map<userAuthStatusEnum, UserAuthStatus>([
    [
        userAuthStatusEnum.None,
        { label: '未认证', value: userAuthStatusEnum.None },
    ],
    [
        userAuthStatusEnum.Resolve,
        {
            label: '认证成功',
            value: userAuthStatusEnum.Resolve,
            colorName: 'text-color-green',
        },
    ],
    [
        userAuthStatusEnum.Reject,
        {
            label: '认证失败',
            value: userAuthStatusEnum.Reject,
            colorName: 'text-color-red',
        },
    ],
]);

export enum userIdTypeEnum {
  ID_CARD = 1, // 身份证
  PASSPORT, // 护照
  DRVING_LICENSE, // 驾照
  RESIDENCE_PERMIT, // 居留许可证
}

export interface IUserIdType {
  label: string;
  value: userIdTypeEnum;
}

export const userIdTypeMap = new Map<userIdTypeEnum, IUserIdType>([
    [userIdTypeEnum.ID_CARD, { label: '身份证', value: userIdTypeEnum.ID_CARD }],
    [userIdTypeEnum.PASSPORT, { label: '护照', value: userIdTypeEnum.PASSPORT }],
    // [
    //   userIdTypeEnum.DRVING_LICENSE,
    //   { label: "驾照", value: userIdTypeEnum.DRVING_LICENSE },
    // ],
    // [
    //   userIdTypeEnum.RESIDENCE_PERMIT,
    //   { label: "居留许可证", value: userIdTypeEnum.RESIDENCE_PERMIT },
    // ],
]);

export enum subSumStatusEnum {
  None = 'none',
  Init = 'init',
  Pending = 'pending',
  Completed = 'completed',
}

export interface ISubSumStatus {
  label: string;
  value: subSumStatusEnum;
  colorName?: string;
}

export const subSumStatusMap = new Map<subSumStatusEnum, ISubSumStatus>([
    [subSumStatusEnum.None, { label: '未认证', value: subSumStatusEnum.None }],
    [subSumStatusEnum.Init, { label: '初始化', value: subSumStatusEnum.Init }],
    [
        subSumStatusEnum.Pending,
        { label: '待定', value: subSumStatusEnum.Pending },
    ],
    [
        subSumStatusEnum.Completed,
        { label: '已完成', value: subSumStatusEnum.Completed },
    ],
]);


export enum genderEnum {
  Male = 1,
  Female = 2,
}

export interface IGender {
  label: string;
  value: genderEnum;
}

export const genderMap = new Map<genderEnum, IGender>([
    [genderEnum.Male, { label: '男', value: genderEnum.Male }],
    [genderEnum.Female, { label: '女', value: genderEnum.Female }],
]);
