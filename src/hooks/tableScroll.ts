import type { Ref } from 'vue';
import { ref, onBeforeUnmount, onMounted, nextTick } from 'vue';
export default function useTableScroll(tableRef: Ref<any>, TableDataTotal: any[], tableData: Ref<any[]>) {
    const totalTable = ref(TableDataTotal);
    onMounted(() => {
        nextTick(() => {
            if (tableRef.value) {
                const tableContainer = tableRef.value.$el.querySelector('.ant-table-body');
                tableContainer.addEventListener('scroll', onScrollEvent);
            }
        });
    });
    onBeforeUnmount(() => {
        nextTick(() => {
            if (tableRef.value) {
                const tableContainer = tableRef.value.$el.querySelector('.ant-table-body');
                tableContainer.removeEventListener('scroll', onScrollEvent);
            }
        });
    });
    const onScrollEvent = () => {
        const tableContainer = tableRef.value.$el.querySelector('.ant-table-body');
        const scrollPosition = tableContainer.scrollTop;
        const { scrollHeight } = tableContainer;
        const { clientHeight } = tableContainer;
        const isTop = scrollPosition === 0;
        const isBottom = scrollHeight - scrollPosition === clientHeight;
        const isBottom2 = scrollHeight - Math.floor(scrollPosition) === clientHeight;
        const isBottom3 = scrollHeight - Math.ceil(scrollPosition) === clientHeight;
        if (isBottom || isBottom2 || isBottom3) {
            console.log('触底');
            const table = totalTable.value.slice(tableData.value.length, tableData.value.length + 10);
            tableData.value = [...tableData.value, ...table];
        }
    };
}
