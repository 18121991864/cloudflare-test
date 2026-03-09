import { ConstructionFrom, ConstructionItem } from '@/config-overall/interface';

export default () => {
    //    筛选框是否展示全部
    const showAll = computed(() => {
        return (configFrom: ConstructionFrom, item: ConstructionItem) => {
            let show = false;
            let label = 'ALL';
            let value = null;
            const allSelectAll = item.allSelectAll;
            const gobalSelectAll = configFrom.allSelectAll;
            if (allSelectAll?.show === undefined) {
                show = gobalSelectAll?.show || show;
                label = gobalSelectAll?.label || label;
                value = gobalSelectAll?.value;
            }
            if (allSelectAll?.show) {
                show = allSelectAll?.show;
                label = allSelectAll?.label || label;
                value = allSelectAll?.value;
            }

            return {
                show,
                label,
                value,
            };
        };
    });
    // 类名
    const className = computed(() => {
        return (val?: string) => {
            return val ? val.split(' ') : [];
        };
    });
    return {
        showAll,
        className,
    };
};
