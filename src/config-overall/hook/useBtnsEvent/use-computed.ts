import {ConstructionFrom} from '@/config-overall/interface';
import updateStore from "@/config-overall/views/store/updateStore";
import useTabsRole from "@/use/useTabsRole";

export default () => {
    const showBtns = ref<Record<string, boolean>>({});
    // @ts-ignore
    const { proxy, appContext } = getCurrentInstance();
    const store = updateStore();
    const route = useRoute();
    const { isShowTabsBtn } = useTabsRole();

    const checkButtonPermissions = async (configFrom: ConstructionFrom, val: string) => {
        //   @ts-ignore
        const priomiess = configFrom?.btns[val]?.buttonPermissions;
        let show = true;
        const tabsPangeConfig = configFrom.tabsPangeConfig;
        const activeKey = tabsPangeConfig?.activeKey;

        if (priomiess && (store.tabsActiveKey || (tabsPangeConfig && activeKey))) {
            //  @ts-ignore
            const role = tabsPangeConfig?.activeData[Number(activeKey) - 1].role;

            show = store.tabsActiveKey && route.name === 'mortgageOrder' ? isShowTabsBtn(priomiess) : await proxy.isRoleBtn(role, priomiess, appContext);
        } else if (priomiess) {
            const res = proxy.buttonPermissions(priomiess);
            show = res ? true : false;
        }

        return show;
    };
    const showButton = async (configFrom: ConstructionFrom, val: string) => {
        if (configFrom.btnShow === false) return false;

        const show = await checkButtonPermissions(configFrom, val);

        // @ts-ignore
        const showBtn = configFrom?.btns[val]?.show;
        let hide = false;
        if (val !== 'setshotBtns') {
            hide = showBtn === false ? false : true;
        } else {
            hide = !showBtn ? false : true;
        }

        // @ts-ignore
        return show && hide;
    };
    const getShowButton = (configFrom: ConstructionFrom) => {
        const btns: string[] = [];
        Object.keys(configFrom.btns).forEach((key) => {
            btns.push(key);
        });
        btns.forEach(async (item) => {
            showBtns.value[item] = await showButton(configFrom, item);
        });
    };

    return {
        showButton,
        showBtns,
        getShowButton,
    };
};
