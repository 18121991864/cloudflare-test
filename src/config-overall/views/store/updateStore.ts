import { FormInstance } from 'ant-design-vue';

export default defineStore('ConfigOverallUpdateStore', () => {
    const route = useRoute();

    const formReset = ref<FormInstance>();
    const formState = ref<any>({});
    const tabsActiveKey = ref('');

    const updateTabsActiveKey = (val = ''): void => {
        tabsActiveKey.value = val;
    };

    return {
        formReset,
        formState,
        tabsActiveKey,
        updateTabsActiveKey
    };
});
