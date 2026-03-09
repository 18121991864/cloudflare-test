import type { UpdateConstructionType } from '@/config-overall/interface/update';

export default (updateRef: Ref<ComponentInstance['UpdateData']>) => {
    const handelUpateData = (type: 'add' | 'info' | 'edit', item: UpdateConstructionType, data?: any) => {
        updateRef.value?.openCallback(item, type, data);
    };
    return {
        handelUpateData,
    };
};
