import type { CallbackInfo, queryDetailConfig, viewPageDetail } from '@/config-overall/interface/detail';
import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';
export default defineStore('detailStore', () => {
    const title = ref('详情');
    const spinning = ref(false);
    const formState = ref<any>({});
    const customSlots = ref<string[]>([]);
    const allcustomSlots = ref<string[]>([]);
    const labelList = ref<viewPageDetail[]>([]);
    const Headerconfig = ref<queryDetailConfig>();
    const setParams = (configHeader: queryDetailConfig, params1: any) => {
        const config = configHeader?.callback?.CallbackConfig;
        if (config?.params) {
            config.params = params1;
        }

        Headerconfig.value = configHeader;
    };
    const openCallback = (configHeader: queryDetailConfig<viewPageDetail[]>, params?: any, params1?: any) => {
        const detailData = configHeader.detailConfig.detailData;
        labelList.value = configHeader.detailConfig.detailLabel;
        setParams(configHeader, params1);

        if (detailData) {
            SetformState(detailData);
        } else {
            getCallbackInfo(configHeader.callback, params);
        }
    };
    const getCallbackInfo = async (callback?: CallbackInfo, params?: any) => {
        const handelDetailInfo = callback?.handelDetailInfo;
        if (!handelDetailInfo || (handelDetailInfo && typeof handelDetailInfo !== 'function')) {
            throw new Error('请传入详情的函数');
        }
        spinning.value = true;
        handelDetailInfo(params)
            .then((res: any) => {
                SetformState(res);
            })
            .finally(() => {
                spinning.value = false;
            });
    };
    const SetformState = (detailData: any) => {
        Object.keys(detailData).forEach((key) => {
            // @ts-ignore
            formState.value[key] = detailData[key];
        });
    };
    const setTitle = (t: string) => {
        title.value = t;
    };
    const claerData = () => {
        formState.value = {};
        spinning.value = false;
        customSlots.value = [];
    };
    const setCustomSlots = (slots: string[]) => {
        customSlots.value = slots;
    };
    const setAllcustomSlots = (slots: string[]) => {
        allcustomSlots.value = slots;
    };
    // 将数组转换为树形结构
    const ArrayTransTree = (newInfo: viewPageDetail[]) => {
        let currentAssort = {};
        const result: any[] = [];
        newInfo.forEach((item) => {
            if (item.isAssort) {
                // 如果是父级，创建一个新的对象并添加到结果数组
                currentAssort = {
                    label: item.label,
                    value: item.value,
                    bold: item.bold,
                    isAssort: item.isAssort,
                    children: [],
                };
                result.push(currentAssort);
            } else if (currentAssort) {
                // 如果是子级，添加到当前父级的 children 数组中
                currentAssort.children.push(item);
            }
        });
        return result;
    };
    // 将树型转换为数组
    const treeTransArray = (result: any, detailData: any) => {
        result.forEach((item) => {
            let index = 0;
            item.children.forEach((data) => {
                if (!detailData[data.value]) {
                    index += 1;
                }

                if (index === item.children.length) {
                    item.show = true;
                }
            });
        });
        const data = result.flatMap((item) => {
            const { children, ...rest } = item; // 解构出 children
            return [rest, ...children]; // 返回 rest 和 children 的组合
        });

        return data;
    };
    return {
        formState,
        spinning,
        labelList,
        customSlots,
        allcustomSlots,
        openCallback,
        setCustomSlots,
        setAllcustomSlots,
        setTitle,
        claerData,
        ArrayTransTree,
        treeTransArray,
    };
});
