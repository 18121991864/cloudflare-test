import api from '@/api/vaAccount/index';
import { ref } from 'vue';

// va 模块公用的hooks
export default function useVaCommon() {
    const vaChannelArr = ref<PromiseReturnType<typeof api.channelTypeSel>>([]);
    const vaCoinArr = ref<PromiseReturnType<typeof api.currencySelList>>([]);
    const vaTypeArr = ref<PromiseReturnType<typeof api.freezeTypeList>>([]);

    const fetchVaCoinArr = (): void => {
        api.currencySelList().then((r) => {
            vaCoinArr.value = r;
        });
    };

    const fetchVaTypeArr = (): void => {
        api.freezeTypeList().then((r) => {
            vaTypeArr.value = r;
        });
    };

    const fetchVaChannelArr = (): void => {
        api.channelTypeSel().then((r) => {
            vaChannelArr.value = r;
        });
    };

    return {
        vaCoinArr,
        vaTypeArr,
        vaChannelArr,
        fetchVaCoinArr,
        fetchVaTypeArr,
        fetchVaChannelArr,
    };
}
