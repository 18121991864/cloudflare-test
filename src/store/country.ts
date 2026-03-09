import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/country/index';

export default defineStore('country', () => {
    const countryArr = ref<PromiseReturnType<typeof api.countryList>>([]);

    const fetchCountryArr = (): void => {
        // 获取国家列表
        api.countryList().then((r) => {
            countryArr.value = r;
        });
    };

    return {
        countryArr,
        fetchCountryArr,
    };
});
