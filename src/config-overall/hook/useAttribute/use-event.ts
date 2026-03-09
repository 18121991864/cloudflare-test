import { ConstructionFrom, ConstructionItem } from '@/config-overall/interface';
import _ from 'lodash';
interface updateEvent {
    handelRest: () => void;
    onSearch: () => void;
    formState: Ref<any>;
    emits: (params: any, ...args: any) => any;
    copyformState: Ref<any>;
    configFrom: Ref<ConstructionFrom>;
    handelSubmit: () => void;
}

export default ({ configFrom, handelRest, onSearch, formState, emits, copyformState, handelSubmit }: updateEvent) => {
    const instance = getCurrentInstance();
    // 设置config的值
    const SetConfigFrom = async (config: ConstructionFrom) => {
        (configFrom.value as ConstructionFrom) = { ...config };

        nextTick(() => {
            const activeKey = configFrom.value.tabsPangeConfig?.activeKey;
            if (activeKey) {
                const noQueryKey = configFrom.value.tabsPangeConfig?.noQueryKey;
                if (noQueryKey?.includes(activeKey)) return;
            }
            // 有时间默认值 就不能发送请求
            const defaultSelectOption = configFrom.value.construction.find((item) => item.defaultSelectOption);
            if (!defaultSelectOption) {
                handelSubmit();
            }
            emits('onSearch', formState.value);
        });
    };
    // 重置
    const handelResetFields = () => {
        formState.value = _.cloneDeep(copyformState.value);
        console.log(formState.value);

        emits('handelRest', formState.value);
        handelRest();
    };
    // 时间筛选
    const changeTime = (times: Array<number | string>, item: ConstructionItem) => {
        times.forEach((date, index) => {
            // @ts-ignore
            formState.value[item.timeValue[index]] = date;
        });
        console.log(formState.value);

        emits('changeTime', times, formState);
    };
    // 搜索
    const handelSearch = () => {
        onSearch();
        emits('onSearch', formState.value);
    };
    return {
        SetConfigFrom,
        handelResetFields,
        changeTime,
        handelSearch,
    };
};
