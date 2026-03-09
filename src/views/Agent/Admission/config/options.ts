import api from '@/api/newAgent/index';
import api1 from '@/api/appAdmin/index';
import type { TypeList } from '@/interface/StateType';
interface dataTypes {
    countryList: Ref<
        TypeList[] &
            {
                tel: string;
            }[]
    >;

    agentType: Ref<TypeList[]>;
}

export const getTypeList = ({ countryList, agentType }: dataTypes) => {
    const GetCountryList = () => {
        // 国家和地区接口
        if (countryList.value.length) return false;
        api1.fetchTelAreaSelect().then((res) => {
            res.forEach((item: any) => {
                // @ts-ignore
                countryList.value.push({
                    label: item,
                    value: item,
                    tel: item,
                });
            });
        });
    };
    const getOrderInfoList = () => {
        if (agentType.value.length) return false;
        api.fetchGetOrderInfoList().then((res) => {
            agentType.value.push(...res);
        });
    };

    getOrderInfoList();
    GetCountryList();
};

export const fetchGetOrderInfoList = async () => {
    const data = await api.fetchGetOrderInfoList();

    return data;
};
