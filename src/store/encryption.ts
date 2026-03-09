import { defineStore } from 'pinia';
import _ from 'lodash';

export default defineStore('Encryption', () => {
    const userInfo = ref(Object.create(null));
    const deepUserInfo = _.cloneDeep(userInfo.value);
    const ivStr = ref('');
    const cleaerUserInfo = () => {
        userInfo.value = _.cloneDeep(deepUserInfo);
        ivStr.value = '';
    };
    const setIvStr = (iv: string) => {
        ivStr.value = iv;
    };
    return {
        userInfo,
        ivStr,
        setIvStr,
        cleaerUserInfo,
    };
});
