import api from '@/api/tag/index';
import type { TypeTagList } from '@/api/tag/types.d';

export default defineStore('updateDataTabs', () => {
    const tagList = ref<TypeTagList[]>([]);
    const getTagList = async () => {
        if (tagList.value.length) return false;
        tagList.value = await api.tag({});
    };

    return {
        tagList,
        getTagList,
    };
});
