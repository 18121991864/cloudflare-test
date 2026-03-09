import { ConstructionFrom } from '@/config-overall/interface';
import { ButtonTypes } from '@/config-overall/interface/button';
import type { HeadersType, tabelConfigType } from '@/config-overall/interface/table';
import useTableConf from '@/use/useTableConf';
import nProgress from 'nprogress';
import _ from 'lodash';
interface ConfingType {
    ConfigData: tabelConfigType;
    queryConfigBtns: ButtonTypes<any, any>;
    configSetFrom?: ConstructionFrom;
}
export default defineStore('selectStoreCard', () => {
    const tableData = ref(Object.create([]));
    const formState = ref({});
    const open = ref(false);
    const queryButtonConfig = ref<ButtonTypes<any, any>>(Object.create({}));
    const configTable = ref<tabelConfigType>(Object.create({}));
    const configFrom = ref<ConstructionFrom>(Object.create({}));
    const setOpenCallback = async (params: any, { ConfigData, queryConfigBtns, configSetFrom }: ConfingType) => {
        open.value = true;
        Object.keys(params).forEach((key) => {
            // @ts-ignore
            formState.value[key] = params[key];
        });
        // @ts-ignore
        configTable.value = ConfigData;
        // @ts-ignore
        queryButtonConfig.value = queryConfigBtns;
        Object.keys(configSetFrom).forEach((key) => {
            configFrom.value[key] = configSetFrom[key];
        });

        await handelSubmit();
    };
    const handelSubmit = () => {
        tableData.value = [];
        isLoading.value = true;
        nProgress.start();

        const { current, pageSize } = paginationConfig;
        const { handelSubmit } = queryButtonConfig.value.queryBtns;
        handelSubmit({
            ...formState.value,
            pageNo: current,
            pageSize,
        })
            .then(({ list, totalSize, pageSize, pageNo }) => {
                updatePagination(pageNo, pageSize, totalSize);
                tableData.value = list.map((item) => ({ ...item, isLoading: false }));
            })
            .finally(() => {
                isLoading.value = false;
                nProgress.done();
            });
    };
    const { isLoading, onSearch, paginationConfig, formReset, handleSizeChange, updatePagination, handelRest } = useTableConf(handelSubmit);
    const deepformState = _.cloneDeep(formState.value);
    const handelUseRest = () => {
        formState.value = _.cloneDeep(deepformState);
        handelRest();
    };
    return {
        open,
        queryButtonConfig,
        configTable,
        paginationConfig,
        isLoading,
        tableData,
        formState,
        configFrom,
        formReset,
        onSearch,
        handelRest,
        setOpenCallback,
        handelSubmit,
        handleSizeChange,
        handelUseRest,
    };
});
