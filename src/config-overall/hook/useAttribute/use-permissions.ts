import type { ConstructionFrom, TabsConfig } from '@/config-overall/interface';
import useSidebar from '@/store/sideBar';
import pinia from '@/store/Index';
export default (configFrom: Ref<ConstructionFrom>, queryButtonRef: Ref<any>, handelSubmit: () => void) => {
    const store = useSidebar(pinia);

    // @ts-ignore
    const { proxy } = getCurrentInstance();
    const { roleMenu } = storeToRefs(store);
    const isTabs = ref(true);
    const setAtiveIndex = async () => {
        const tabsPangeConfig = configFrom.value.tabsPangeConfig;
        proxy.getQueryButtonRef(queryButtonRef);
        if (!tabsPangeConfig) {
            queryButtonRef.value.getShowButtons(configFrom.value);
            return false;
        }

        const activeData = tabsPangeConfig?.activeData;
        const item = activeData?.find((item) => {
            let show = true;
            if (item.role) {
                show = proxy.buttonPermissions(item.role);
            }
            return show;
        });
        if (!item) {
            isTabs.value = false;
            return false;
        }
        tabsPangeConfig.activeKey = item.key;
        isTabs.value = true;

        await nextTick();
        queryButtonRef.value.getShowButtons(configFrom.value);
    };

    onActivated(async () => {
        await nextTick();
        setAtiveIndex();
    });
    return {
        isTabs,
    };
};
