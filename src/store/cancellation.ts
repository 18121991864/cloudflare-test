import type { CancelCardListResList } from '@/api/cancellation/types.d';
import { defineStore } from 'pinia';
import { ref } from 'vue';
export default defineStore('useCancellation', () => {
    const celLationList = ref<CancelCardListResList[]>([]);
    return {
        celLationList,
    };
});
