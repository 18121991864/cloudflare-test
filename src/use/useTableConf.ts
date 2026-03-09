import { getCurrentInstance, reactive, ref, watch } from 'vue';
import { throttleFunc } from '@/utils/common';
import type { FormInstance } from 'ant-design-vue';
export const PagingDefaultConf = {
    // paging 默认数据
    size: 'small',
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '30', '40', '50'],
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条记录`,
    total: 0,
    current: 1,
    pageSize: 10,
};

export default function useTableConf(fetchTableDataCallback: () => void) {
    const formReset = ref<FormInstance | null>();
    const isLoading = ref(false);
    const paginationConfig = reactive({ ...PagingDefaultConf }); // 分页信息

    const handleSizeChange = ({ pageSize, current }: { pageSize: number; current: number }): void => {
        // 切换每页数量
        paginationConfig.pageSize = pageSize;
        paginationConfig.current = current;
        fetchTableDataCallback();
    };

    const onSearch = () => {
        paginationConfig.current = 1;
        throttledSearch();
    };

    const updatePagination = (pageNo: number, pageSize: number, totalSize: number) => {
        paginationConfig.current = pageNo;
        paginationConfig.pageSize = pageSize;
        paginationConfig.total = totalSize;
    };

    // 使用截流函数创建一个截流后的搜索函数
    const throttledSearch = throttleFunc(() => {
        if (typeof fetchTableDataCallback === 'function') {
            fetchTableDataCallback();
        }
    }, 800);
    // 重置表单
    const handelRest = () => {
        formReset.value?.resetFields();
        paginationConfig.current = 1;
        paginationConfig.pageSize = 10;
        throttledSearch();
    };
    return {
        onSearch,
        isLoading,
        paginationConfig,
        formReset,
        handleSizeChange,
        updatePagination,
        handelRest,
    };
}
