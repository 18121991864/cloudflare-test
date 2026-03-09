import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/asset/index';

export default defineStore('country', () => {
    const currencyInfo = ref<PromiseReturnType<typeof api.fetchStoreCoinInfo>>([]);

    const fetchCurrencyInfo = (): void => {
        // 获取币种信息
        api.fetchStoreCoinInfo().then((r) => {
            console.log(10, r);
            currencyInfo.value = r;
        });
    };

    return {
        currencyInfo,
        fetchCurrencyInfo,
    };
});
