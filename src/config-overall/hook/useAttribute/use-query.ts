import { ConstructionFrom } from '@/config-overall/interface';
import { PaginationConfType } from '@/config-overall/interface/table';
import { downloadExcel } from '@/utils/common';
import i18n from '@/setup/i18n-setup';

interface ExportType {
    handelSubmit: () => void;
    configFrom: Ref<ConstructionFrom>;
    formState: Ref<any>;
    emits: (params: any, ...args: any) => any;
    isLoading: Ref<boolean>;
}
export default ({ handelSubmit, configFrom, formState, emits, isLoading }: ExportType) => {
    const loadExportExcel = ref(false);
    const pleamoutCount = ref<any>({});
    // 导出
    const handExport = () => {
        if (loadExportExcel.value) return;
        loadExportExcel.value = true;
        const handExport = configFrom.value.btns?.exportBtns?.handExport;
        const exportFileTitle = i18n.global.t(configFrom.value.btns?.exportBtns?.exportFileTitle || '导出');
        if (!handExport) {
            throw new Error('请传入导出方法');
        }
        if (!exportFileTitle) {
            throw new Error('请传入导出文件名称');
        }
        const isParams = configFrom.value.btns?.exportBtns?.isParams;
        const data = !isParams ? formState.value : {};
        handExport({
            ...data,
        })
            .then((r: any) => {
                console.log('r', r);

                downloadExcel(r, exportFileTitle as string);
            })
            .finally(() => {
                loadExportExcel.value = false;
            });

        emits('handExport');
    };
    // 统计接口
    const queryAmoutTotal = () => {
        isLoading.value = true;

        configFrom.value.statistics
            ?.queryAmoutTotal({
                ...formState.value,
            })
            .then((res) => {
                pleamoutCount.value = res ? res : {};
            })
            .finally(() => {
                isLoading.value = false;
            });
    };
    const handleSizeChange = ({ pageSize, current }: { pageSize: number; current: number }): void => {
        // 切换每页数量
        formState.value.pageSize = pageSize;
        formState.value.pageNo = current;
        handelSubmit();
    };
    return {
        handExport,
        loadExportExcel,
        pleamoutCount,
        queryAmoutTotal,
        handleSizeChange,
    };
};
