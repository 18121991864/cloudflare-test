<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import api from '@/api/poboAPI/poboPayeeAccount';
import country from '@/store/country';

const isLoading = ref(false);
const isVisible = ref(false);
const curState = ref<PromiseReturnType<typeof api.info>>(Object.create(null));

const store = country();
const { countryArr } = storeToRefs(country());

const onShowDialog = (val = false, id: number): void => {
    isVisible.value = val;
    fetchInfo(id);
};

const fetchInfo = (id: number): void => {
    curState.value = Object.create(null);
    store.fetchCountryArr();
    isLoading.value = true;
    api.info({ id })
        .then((r) => {
            curState.value = r;
        })
        .finally(() => {
            isLoading.value = false;
        });
};

const getType = (val: 'POST' | 'PASS' | 'OTHER' | 'IDCARD'): string => {
    const obj = {
        POST: '护照',
        PASS: '通行证',
        OTHER: '其它',
        IDCARD: '身份证',
    };
    return obj[val] || '';
};

const getCountryName = (val: string) => countryArr.value?.find((item: { code: string }) => item.code === val)?.name || '--';

const onOk = (): void => {
    isVisible.value = false;
};

defineExpose({ onShowDialog });
</script>

<template>
    <a-modal v-model:open="isVisible" title="详情" :width="900" @ok="onOk">
        <a-spin :spinning="isLoading">
            <a-descriptions :column="1">
                <a-descriptions-item label="主体"
                    >{{ curState.subject === 1 ? '企业' : curState.subject === 2 ? '个人' : '--' }}
                </a-descriptions-item>
            </a-descriptions>
            <a-descriptions v-if="curState.subject === 1" :column="1">
                <a-descriptions-item label="保险公司名称">{{ curState.enterpriseName }}</a-descriptions-item>
                <a-descriptions-item label="注册国家">{{ curState.registCountry }}</a-descriptions-item>
                <a-descriptions-item label="注册地址">{{ curState.registAddress }}</a-descriptions-item>
                <a-descriptions-item label="运营国家/地区">{{ getCountryName(curState.businessCountry) }} </a-descriptions-item>
                <a-descriptions-item label="运营地址">{{ curState.businessAddress }}</a-descriptions-item>
                <a-descriptions-item label="通讯地址">{{ curState.address }}</a-descriptions-item>
            </a-descriptions>
            <a-descriptions v-if="curState.subject === 2" :column="1">
                <a-descriptions-item label="姓">{{ curState.surname }}</a-descriptions-item>
                <a-descriptions-item label="中间名">{{ curState.middleSurname }}</a-descriptions-item>
                <a-descriptions-item label="名">{{ curState.name }}</a-descriptions-item>
                <a-descriptions-item label="性别">{{ curState.sex === 1 ? '男' : '女' }}</a-descriptions-item>
                <a-descriptions-item label="国籍">{{ getCountryName(curState.nationality) }}</a-descriptions-item>
                <a-descriptions-item label="出生日期"> {{ curState.birthday }}</a-descriptions-item>
                <a-descriptions-item label="证件类型">{{ getType(curState.credentialType) }}</a-descriptions-item>
                <a-descriptions-item label="证件号码">{{ curState.credentialNumber }}</a-descriptions-item>
                <a-descriptions-item label="有效期"
                    >{{ curState.expirationDateBegin }} -
                    {{ curState.expirationDateEnd || '永久' }}
                </a-descriptions-item>
                <a-descriptions-item label="证件签发国家">{{ getCountryName(curState.credentialReleaseCountry) }} </a-descriptions-item>
            </a-descriptions>
            <a-descriptions :column="1">
                <a-descriptions-item label="收款人银行SWIFT/BIC代码">{{ curState.bankSwiftCode }} </a-descriptions-item>
                <a-descriptions-item label="开户行国家">{{ getCountryName(curState.openBankCountry) }} </a-descriptions-item>
                <a-descriptions-item label="收款银行">{{ curState.collectionBank }}</a-descriptions-item>
                <a-descriptions-item label="银行地址">{{ curState.bankAddress }}</a-descriptions-item>
                <a-descriptions-item label="账户持有人姓名">{{ curState.accountName }}</a-descriptions-item>
                <a-descriptions-item label="账户号">{{ curState.accountNumber }}</a-descriptions-item>
                <a-descriptions-item label="中间行">{{ curState.middleBankSwiftCode }}</a-descriptions-item>
                <a-descriptions-item label="国际银行账户号码(IBAN)">{{ curState.iban }}</a-descriptions-item>
                <a-descriptions-item label="开户预留国家">{{ getCountryName(curState.country) }}</a-descriptions-item>
                <a-descriptions-item label="开户预留地址">{{ curState.address }}</a-descriptions-item>
            </a-descriptions>
        </a-spin>
    </a-modal>
</template>

<style scoped lang="scss"></style>
