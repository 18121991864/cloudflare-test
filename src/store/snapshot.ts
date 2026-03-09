import { defineStore } from 'pinia';
import { isRef, ref, watch } from 'vue';
import type { Ref } from 'vue';
export default defineStore('snapshot', () => {
    const fromScreen = ref<any[]>([]);
    const setfromScreen = (value: number, type: boolean, formState: any) => {
        Object.keys(fromScreen.value[Number(value) - 1]).forEach((key) => {
            if (type) {
                // @ts-ignore
                fromScreen.value[Number(value - 1)][key] = formState[key];
            }
            if (!type) {
                // @ts-ignore
                formState[key] = fromScreen.value[Number(value - 1)][key];
            }
        });
    };
    interface activeDataType {
        key: string;
        tab: string;
    }
    const setQueryData = (activeData: Ref<activeDataType[]>, formState: any) => {
        clearFromScreen();
        const data = isRef(formState) ? formState.value : formState;
        activeData.value.forEach(() => {
            fromScreen.value.push({ ...data });
        });
    };
    const resetQueryData = (activeIndex: string, formState: any) => {
        fromScreen.value[Number(activeIndex) - 1] = { ...formState };
    };

    interface KEY {
        activeKey: Ref<string>;
        handleOnSubmit: () => void;
        formState: any;
        autoSubmit?: boolean | Ref<boolean>;
        isFlag?: boolean;
    }
    const changeActiveKey = ({ activeKey, autoSubmit = true, formState, handleOnSubmit, isFlag }: KEY, callback?: (flag: any) => void) => {
        const flag = watch(
            () => activeKey.value,
            (val, old) => {
                const data = isRef(formState) ? formState.value : formState;
                const submit = isRef(autoSubmit) ? autoSubmit.value : autoSubmit;
                if (val !== old) {
                    setfromScreen(Number(old), true, data);
                }
                setfromScreen(Number(val), false, data);
                if (callback) {
                    return callback(flag);
                }

                if (submit) {
                    handleOnSubmit();
                    if (isFlag) {
                        flag();
                    }
                }
            }
        );
    };
    const clearFromScreen = () => {
        fromScreen.value = [];
    };
    return {
        setfromScreen,
        setQueryData,

        clearFromScreen,
        resetQueryData,
        changeActiveKey,
        fromScreen,
    };
});
