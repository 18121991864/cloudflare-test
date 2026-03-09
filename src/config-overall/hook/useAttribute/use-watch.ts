import { activeDataType, ConstructionFrom } from '../../interface';
import _ from 'lodash';
import useSnapshot from '@/store/snapshot';
import useSidebar from '@/store/sideBar';
import pinia from '@/store/Index';
import useTableConf from '@/use/useTableConf';
import callback from '@/views/OperationsManage/DiscountCode/config/Edit/callback';
export default (configFrom: Ref<ConstructionFrom>, handelSubmit: () => void) => {
    const { isLoading, onSearch: handelSearch, paginationConfig, formReset, updatePagination, handelRest } = useTableConf(handelSubmit);
    const store = useSidebar(pinia);
    const { roleMenu } = storeToRefs(store);
    const snapshot = useSnapshot();
    const pagination = reactive({
        pageSize: paginationConfig.pageSize,
        pageNo: paginationConfig.current,
    });
    const formState = ref({ ...configFrom.value.formState, ...pagination });
    const copyformState = ref(_.cloneDeep(formState.value));
    const activeKey = ref('1');
    // 监听 formState
    watch(
        () => configFrom.value.formState,
        (item: any) => {
            if (!item) return false;
            formState.value = { ...item, ...pagination };
            // 浅拷贝 初始化空值
            // copyformState.value = _.cloneDeep(formState.value);
            Object.keys(formState.value).forEach((key) => {
                copyformState.value[key] = formState.value[key];
            });
            copyformState.value.pageSize = pagination.pageSize;
            copyformState.value.pageNo = pagination.pageNo;
        },
        {
            deep: true,
            immediate: true,
        }
    );
    // 监听 tabs 数据
    watch(
        () => configFrom.value.tabsPangeConfig?.activeData,
        (data) => {
            const activeData = ref(data);
            if (!activeData.value) return false;
            //  初始化值
            snapshot.setQueryData(activeData as Ref<activeDataType[]>, {
                ...configFrom.value.formState,
                ...pagination,
            });
        }
    );
    const pageConfig = () => {
        if (configFrom.value.PagingDefaultConf) {
            Object.keys(configFrom.value.PagingDefaultConf).forEach((item) => {
                // @ts-ignore
                paginationConfig[item] = configFrom.value.PagingDefaultConf[item];
            });
        }
    };
    watch(
        () => configFrom.value.PagingDefaultConf,
        () => {
            pageConfig();
        }
    );
    // 监听activeKey 重新赋值activeKey
    // watch(
    //     () => configFrom.value.tabsPangeConfig?.activeKey,
    //     (index) => {
    //         activeKey.value = index as string;
    //     }
    // );
    const setObject = (item: ConstructionFrom, activeConstring: ConstructionFrom) => {
        const btns = activeConstring.btns;
        const tabelConfig = activeConstring.tabelConfig;
        Object.keys(tabelConfig).forEach((key) => {
            // @ts-ignore
            item.tabelConfig[key] = tabelConfig[key];
        });
        if (!btns || (btns && !Object.keys(btns).length)) return false;
        const setshotBtns = btns.setshotBtns;
        if (!setshotBtns) {
            // @ts-ignore
            btns.setshotBtns = {
                show: false,
            };
        }
        Object.keys(btns).forEach((key) => {
            // @ts-ignore
            item.btns[key] = btns[key];
        });
    };
    // 设置配置项
    const setConfig = (item: ConstructionFrom, config: activeDataType) => {
        const activeConstring = config.activeConstring;
        const tabelConfig = activeConstring.tabelConfig;
        // @ts-ignore
        const construction = activeConstring!.construction;
        if (!construction || !tabelConfig) return false;
        item.construction = construction;
    };
    // 监听key变化 设置配置
    watch(
        () => configFrom.value.tabsPangeConfig?.activeKey,
        (index) => {
            if (!index) return false;
            const item = configFrom.value;
            activeKey.value = index;
            const tabsPangeConfig = item.tabsPangeConfig;
            if (!tabsPangeConfig?.show) return false;
            const activeData = tabsPangeConfig.activeData;
            // 得到当前 配置项的东西
            const config = activeData.find((item) => item.key === index) as activeDataType;
            setConfig(item, config);
            setObject(item, config.activeConstring as ConstructionFrom);
        },
        {
            deep: true,
            immediate: true,
        }
    );

    snapshot.changeActiveKey({ activeKey, handleOnSubmit: handelSubmit, formState }, (flag) => {
        const callback = configFrom.value.tabsPangeConfig?.callback;
        // 没有时间默认就调用
        if (!callback) {
            handelSubmit();
            return;
        }
        // 有callback 就传入
        if (callback) {
            callback(handelSubmit, flag);
        }
        // 查询key 请求
        const queryKey = configFrom.value.tabsPangeConfig?.queryKey;
        // @ts-ignore
        if (queryKey && queryKey?.includes(activeKey.value)) {
            handelSubmit();
        }
    });

    const onSearch = () => {
        formState.value.pageNo = 1;
        handelSearch();
    };
    return {
        formState,
        copyformState,
        activeKey,
        onSearch,
        isLoading,
        formReset,
        paginationConfig,
        updatePagination,
        handelRest,
    };
};
