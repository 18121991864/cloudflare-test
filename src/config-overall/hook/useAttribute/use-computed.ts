import { ConstructionFrom, ConstructionItem } from '../../interface';

export default () => {
    const instance = getCurrentInstance();
    const { buttonPermissions, $filters } = instance!.appContext.config.globalProperties;
    // 统计的数据
    const amountTotal = computed(() => {
        return (value: string | number) => {
            return $filters?.dataThousands(String(value));
        };
    });

    return {
        amountTotal,
    };
};
