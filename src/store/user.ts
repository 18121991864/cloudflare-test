import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import api from '@/api/fetchTest/index';
import userApi from '@/api/userAPI';
import useEncryption from '@/store/encryption';
export default defineStore('user', () => {
    const encryptionStore = useEncryption();
    const userInfo = ref<PromiseReturnType<typeof api.userInfo>>(Object.create(null));
    const tagList = ref<PromiseReturnType<typeof userApi.fetchTagList>>([]);

    const fetchUserInfo = (): void => {
        // 获取sidebar 列表路由
        api.userInfo().then((r: PromiseReturnType<typeof api.userInfo>) => {
            userInfo.value = r;
            encryptionStore.userInfo = r;
        });
    };
    const accountId = ref('');

    const fetchTagList = (): void => {
        userApi.fetchTagList().then((r: PromiseReturnType<typeof userApi.fetchTagList>) => {
            tagList.value = r;
        });
    };

    const getTagSelectOptions = computed(() => {
        return (tagList.value || []).map((item) => {
            return { value: item.id, label: item.name, key: item.id };
        });
    });

    return {
        tagList,
        userInfo,
        accountId,
        fetchUserInfo,
        fetchTagList,
        getTagSelectOptions,
    };
});
