<template>
    <div class="table-container">
        <a-form ref="formReset" layout="horizontal" :model="formState" class="form-list">
            <div class="flex-wrap-wrap">
                <a-form-item :label="t('statistical.revenueStatistics.contractId')" class="mr-22 width-250" name="contractId">
                    <SAPI :api="api?.contractIdSelect?.bind(api)" v-model="formState.contractId" />
                </a-form-item>
                <a-form-item :label="t('statistical.revenueStatistics.thirdAccountId')" class="mr-22 width-250" name="thirdAccountId">
                    <a-input v-model:value="formState.thirdAccountId" size="small" :placeholder="t('statistical.revenueStatistics.placeholder')" />
                </a-form-item>
                <a-form-item :label="t('statistical.revenueStatistics.time')" class="mr-22" name="time">
                    <date-range-picker v-model="formState.time" />
                </a-form-item>
            </div>
            <div class="action-btm display-flex flex-justify-content-space-between items-end">
                <div class="flex gap-3 font-bold">
                    <span>{{ t('statistical.revenueStatistics.totalBuyQuantity') }}：{{ totalBuyAmount }}</span>|
                    <span>{{ t('statistical.revenueStatistics.totalSellQuantity') }}：{{ totalSellAmount }}</span>|
                    <span>{{ t('statistical.revenueStatistics.totalBuyCount') }}：{{ totalBuyCount }}</span>|
                    <span>{{ t('statistical.revenueStatistics.totalSellCount') }}：{{ totalSellCount }}</span>
                </div>
                <div class="display-flex">
                    <a-button block type="primary" size="small" class="search-submit-btn" @click.stop="handleSearch">
                        <template #icon>
                            <SearchOutlined />
                        </template>
                        {{ t('statistical.revenueStatistics.search') }}
                    </a-button>
                    <a-button block size="small" class="search-reset-btn" @click.stop="handleResetForm">
                        <template #icon>
                            <RedoOutlined />
                        </template>
                        {{ t('statistical.revenueStatistics.reset') }}
                    </a-button>
                </div>
            </div>
        </a-form>

        <a-table
            class="margin-top-10"
            size="small"
            :pagination="false"
            :loading="loading"
            :columns="tableColumns"
            :row-key="
                ({ contractId }: RevenueStatisticsData) => {
                    return contractId;
                }
            "
            :data-source="tableData"
            :scroll="{ x: 2800 }"
        >
            <template #bodyCell="{ column: { dataIndex }, record: { status, amlFrozen }, record }">
            </template>
        </a-table>
    </div>
</template>

<script lang="ts" setup>
import { computed, ComputedRef, createVNode, onActivated, reactive, ref } from 'vue';
import NProgress from 'nprogress';
import type { TableColumnType } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import api from '@/api/statistical';
import dayjs from 'dayjs';
import type { Dayjs, ManipulateType } from 'dayjs';
import type { RevenueStatisticsData } from '@/api/statistical/types';
import Decimal from 'decimal.js/decimal';

const { t } = useI18n();

const tableColumns: ComputedRef<TableColumnType[]> = computed(() => [
    { title: t('statistical.revenueStatistics.contractId'), dataIndex: 'contractId', width: 120, fixed: 'left' },
    { title: t('statistical.revenueStatistics.contractName'), dataIndex: 'contractName', width: 120, fixed: 'left' },
    { title: t('statistical.revenueStatistics.totalTrades'), dataIndex: 'count', width: 120 },
    { title: t('statistical.revenueStatistics.buyCount'), dataIndex: 'buyCount', width: 120 },
    { title: t('statistical.revenueStatistics.sellCount'), dataIndex: 'sellerCount', width: 120 },
    { title: t('statistical.revenueStatistics.buyProfitCount'), dataIndex: 'buyProfitCount', width: 140 },
    { title: t('statistical.revenueStatistics.buyLossCount'), dataIndex: 'buyLossCount', width: 140 },
    { title: t('statistical.revenueStatistics.sellProfitCount'), dataIndex: 'sellProfitCount', width: 140 },
    { title: t('statistical.revenueStatistics.sellLossCount'), dataIndex: 'sellLossCount', width: 140 },
    { title: t('statistical.revenueStatistics.profitCountPct'), dataIndex: 'profitCountPct', width: 140 },
    { title: t('statistical.revenueStatistics.lossCountPct'), dataIndex: 'lossCountPct', width: 140 },
    { title: t('statistical.revenueStatistics.buyProfitAmount'), dataIndex: 'buyProfitAmount', width: 130 },
    { title: t('statistical.revenueStatistics.buyLossAmount'), dataIndex: 'buyLossAmount', width: 130 },
    { title: t('statistical.revenueStatistics.sellProfitAmount'), dataIndex: 'sellProfitAmount', width: 130 },
    { title: t('statistical.revenueStatistics.sellLossAmount'), dataIndex: 'sellLossAmount', width: 130 },
    { title: t('statistical.revenueStatistics.profitAmountPct'), dataIndex: 'profitAmountPct', width: 150 },
    { title: t('statistical.revenueStatistics.lossAmountPct'), dataIndex: 'lossAmountPct', width: 130 },
    // 总买入数量
    { title: t('statistical.revenueStatistics.totalBuyQuantity'), dataIndex: 'buySumAmount', width: 120 },
    // 总卖出数量
    { title: t('statistical.revenueStatistics.totalSellQuantity'), dataIndex: 'sellSumAmount', width: 120 },
    // 总买入数量
    { title: t('statistical.revenueStatistics.totalBuyVolume'), dataIndex: 'buySumVolume', width: 120 },
    // 总卖出数量
    { title: t('statistical.revenueStatistics.totalSellVolume'), dataIndex: 'sellSumVolume', width: 120 },
]);

const formState = reactive({
    contractId: '',
    thirdAccountId: '',
    time: [dayjs(dayjs().format('YYYY-MM-DD')), dayjs(dayjs().add(1, 'day').format('YYYY-MM-DD'))],
});

const loading = ref(false);
const tableData = ref(Object.create([]));
const handleOnSubmit = async () => {
    loading.value = true;
    NProgress.start();
    const { time, ...rest } = formState;
    const [beginTime, endTime] = time;
    api.featchRevenueStatistics({ ...rest, beginTime: beginTime ? dayjs(beginTime)?.valueOf() : null, endTime: endTime ? dayjs(endTime)?.valueOf() : null })
        .then((data: PromiseReturnType<typeof api.featchRevenueStatistics>) => {
            [tableData.value] = [data];
            console.log(tableData.value);
            console.log(data);
        })
        .finally(() => {
            loading.value = false;
            NProgress.done();
        });
};

const formReset = ref();
const handleResetForm = (): void => {
    formReset.value.resetFields();
    handleOnSubmit();
};

const handleSearch = () => {
    handleOnSubmit();
};

// 总买入额
const totalBuyAmount = computed(() => {
    return tableData.value.reduce((acc: number, curr: RevenueStatisticsData) => new Decimal(acc).add(new Decimal(curr.buySumAmount)).toFixed(6, Decimal.ROUND_DOWN), 0);
});
// 总卖出额
const totalSellAmount = computed(() => {
    return tableData.value.reduce((acc: number, curr: RevenueStatisticsData) => new Decimal(acc).add(new Decimal(curr.sellSumAmount)).toFixed(6, Decimal.ROUND_DOWN), 0);
});
// 总买入笔数
const totalBuyCount = computed(() => {
    return tableData.value.reduce((acc: number, curr: RevenueStatisticsData) => new Decimal(acc).add(new Decimal(curr.buyCount)).toFixed(0, Decimal.ROUND_DOWN), 0);
});
// 总卖出笔数
const totalSellCount = computed(() => {
    return tableData.value.reduce((acc: number, curr: RevenueStatisticsData) => new Decimal(acc).add(new Decimal(curr.sellerCount)).toFixed(0, Decimal.ROUND_DOWN), 0);
});

const route = useRoute();
onActivated(() => {
    if (route.hash === '#no-refresh') return;

    handleResetForm();
});

defineOptions({ name: 'RevenueStatistics' });
</script>
