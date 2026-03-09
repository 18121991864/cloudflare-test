import { useRequest } from "vue-request";
import manageApi from '@/api/management';
import api from '@/api/channel';

export default function useDitchOptions() {

    const { data: feeTypes, runAsync: getFeeTypes } = useRequest(async () => {
        const r = await api.listManagementFeeType();
        return r.map(({ name, value }) => ({ label: name, value }));
    }, { manual: true });

    // 减免类型
    const { data: reductionTypes, runAsync: getReductionTypes } = useRequest(async () => {
        const r = await api.listManagementReductionType();
        return r.map(({ name, value }) => ({ label: name, value }));
    }, { manual: true });

    // 渠道卡片下拉
    const { data: ditchArr, runAsync: getDitchArr } = useRequest(async () => {
        const r = await manageApi.ditchChoose();
        return r.map(({ name, id }) => ({ label: name, value: id }));
    }, { manual: true });

    // 渠道卡片下拉
    const { data: cardArr, runAsync: getCardArr } = useRequest(async (ditchId: string) => {
        const r = await manageApi.cardChoose({ ditchId });
        return r.map(({ name, id }) => ({ label: name, value: id }));
    }, { manual: true });

    return {
        cardArr,
        feeTypes,
        ditchArr,
        getCardArr,
        getDitchArr,
        getFeeTypes,
        reductionTypes,
        getReductionTypes,
    }
}
