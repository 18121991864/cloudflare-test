<template>
    <div v-if="!dataAmountTotal" class="amout-total-box">
        <div class="amout-total">
            <div class="title">{{ titleAmount1 }}:</div>
            <div class="value">{{ $filters.dataThousands(postingAmountTotal) }}</div>
        </div>
        <div v-if="isToShow" class="amout-total">
            <div class="title">{{ titleAmount2 }}:</div>
            <div class="value">{{ $filters.dataThousands(transAmountTotal) }}</div>
        </div>
        <div v-if="AmountTotal" class="amout-total">
            <div class="title">{{ titleAmount3 }}:</div>
            <div class="value">{{ $filters.dataThousands(AmountTotal) }}</div>
        </div>
    </div>
    <div v-else class="amout-total-box">
        <div class="amout-total">
            <div class="title">可用总金额:</div>
            <div class="value">{{ $filters.dataThousands(dataAmountTotal.balance) }} {{ dataAmountTotal.symbol || '' }}</div>
        </div>
        <div class="amout-total">
            <div class="title">业务冻结总金额:</div>
            <div class="value">{{ $filters.dataThousands(dataAmountTotal.frozenBalance) }} {{ dataAmountTotal.symbol || '' }}</div>
        </div>
        <div class="amout-total">
            <div class="title">风控冻结总金额:</div>
            <div class="value">{{ $filters.dataThousands(dataAmountTotal.riskFrozenBalance) }} {{ dataAmountTotal.symbol || '' }}</div>
        </div>
        <div class="amout-total">
            <div class="title">手工冻结总金额:</div>
            <div class="value">{{ $filters.dataThousands(dataAmountTotal.manualFrozenBalance) }} {{ dataAmountTotal.symbol || '' }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { AssetSnapshotAmountTotal } from '@/api/snapshot/types.d';
import type { PropType } from 'vue';

const props = defineProps({
    titleAmount1: {
        type: String,
        default: '清算总金额',
    },
    titleAmount2: {
        type: String,
        default: '授权总金额',
    },
    titleAmount3: {
        type: String,
        default: '总金额',
    },
    postingAmountTotal: {
        type: String,
        default: '0.0',
    },
    transAmountTotal: {
        type: String,
        default: '0.0',
    },
    AmountTotal: {
        type: String,
        default: '',
    },
    isToShow: {
        type: Boolean,
        default: true,
    },

    dataAmountTotal: {
        type: Object as PropType<AssetSnapshotAmountTotal>,
        default: null,
    },
});
</script>

<style lang="scss" scoped>
.amout-total-box {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .amout-total {
        display: flex;
        align-items: center;
        width: fit-content;
        white-space: nowrap;
        color: #000;
        margin-left: 10px;

        .title {
            margin-right: 10px;
            color: #948080;
            font-weight: 400;
        }
    }
}
</style>
