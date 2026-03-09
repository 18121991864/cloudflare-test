import _ from 'lodash';
import useWatch from './useAttribute/use-watch';
import useComputed from './useAttribute/use-computed';
import useInitConfig from './useAttribute/use-init-config';
import useBtnsComputed from './useBtnsEvent/use-computed';
import type { ColumnType } from 'ant-design-vue/es/table';
import { HeadersType } from '../interface/table';

export default (handelSubmit: () => void) => {
    const { configFrom, deepConfigFrom } = useInitConfig();
    const { formState, copyformState, activeKey, onSearch, isLoading, formReset, paginationConfig, updatePagination, handelRest } = useWatch(
        configFrom,
        handelSubmit
    );
    const { amountTotal } = useComputed();
    const tabsRef = ref<ComponentInstance['TabsPane']>();
    const { showButton, showBtns } = useBtnsComputed();

    // onDeactivated(() => {
    //     formState.value = _.cloneDeep(copyformState.value);
    //     nextTick(() => {
    //         configFrom.value.tabsPangeConfig = _.cloneDeep(deepConfigFrom.value.tabsPangeConfig);
    //     });
    // });

    onUnmounted(() => {
        formState.value = _.cloneDeep(copyformState.value);
        nextTick(() => {
            configFrom.value.tabsPangeConfig = _.cloneDeep(deepConfigFrom.value.tabsPangeConfig);
        });
    });
    const tableStyle = computed(() => {
        return (column: HeadersType) => {
            const aligns = {
                center: 'center',
                left: 'flex-start',
                right: 'flex-end',
            };
            // @ts-ignore
            const justifyContent = aligns[column.align];
            const isoperate = column.dataIndex === 'operate';
            return {
                justifyContent,
                width: '100%',
                marginLeft: justifyContent && isoperate ? '10px' : '',
                ...column?.style,
            };
        };
    });

    return {
        showButton,
        showBtns,
        amountTotal,
        configFrom,
        formState,
        copyformState,
        tabsRef,
        activeKey,
        onSearch,
        isLoading,
        formReset,
        paginationConfig,
        updatePagination,
        handelRest,
        tableStyle,
    };
};
